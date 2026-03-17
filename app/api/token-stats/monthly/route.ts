import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function GET(request: NextRequest) {
  // Verify auth header
  const authToken = request.headers.get('X-Butler-Token')
  if (!authToken || authToken !== 'butler-stefan-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const databaseUrl = process.env.TURSO_DATABASE_URL_PORTFOLIO
    const authToken = process.env.TURSO_AUTH_TOKEN_PORTFOLIO

    if (!databaseUrl || !authToken) {
      console.error('Missing portfolio database credentials')
      return NextResponse.json(
        { error: 'Database credentials not configured' },
        { status: 500 }
      )
    }

    const client = createClient({
      url: databaseUrl,
      authToken: authToken,
    })

    // Get current year/month range
    const now = new Date()
    const currentYear = now.getFullYear()
    const currentMonth = now.getMonth() + 1

    // Get monthly stats (last 12 months)
    const monthlyStats = await client.execute({
      sql: `
        SELECT
          DATE_TRUNC('month', date) as month,
          SUM(total_tokens) as total_tokens,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(cost_usd) as cost_usd,
          COUNT(DISTINCT date) as days_tracked,
          ROUND(AVG(total_tokens), 0) as avg_daily_tokens,
          MAX(total_tokens) as peak_day_tokens,
          COUNT(*) as entries
        FROM token_usage
        WHERE date >= date('now', '-12 months')
        GROUP BY DATE_TRUNC('month', date)
        ORDER BY month DESC
      `,
    })

    // Get current month-to-date stats
    const mtdStats = await client.execute({
      sql: `
        SELECT
          SUM(total_tokens) as total_tokens,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(cost_usd) as cost_usd,
          COUNT(DISTINCT date) as days_tracked,
          COUNT(DISTINCT model) as models_used,
          MAX(subagent_count) as peak_subagent_count,
          ROUND(AVG(total_tokens), 0) as avg_daily_tokens
        FROM token_usage
        WHERE strftime('%Y-%m', date) = ?
      `,
      args: [`${currentYear}-${String(currentMonth).padStart(2, '0')}`],
    })

    // Get overall stats
    const overallStats = await client.execute({
      sql: `
        SELECT
          SUM(total_tokens) as total_tokens,
          SUM(input_tokens) as input_tokens,
          SUM(output_tokens) as output_tokens,
          SUM(cost_usd) as total_cost_usd,
          COUNT(DISTINCT date) as total_days,
          ROUND(AVG(total_tokens), 0) as avg_daily_tokens,
          MIN(date) as first_tracked_date,
          MAX(date) as last_tracked_date,
          COUNT(DISTINCT model) as unique_models,
          MAX(subagent_count) as max_subagents_in_day
        FROM token_usage
      `,
    })

    // Format response
    const monthlyData = monthlyStats.rows.map((row: any) => ({
      month: row.month || `${currentYear}-${String(currentMonth).padStart(2, '0')}`,
      totalTokens: parseInt(row.total_tokens || '0'),
      inputTokens: parseInt(row.input_tokens || '0'),
      outputTokens: parseInt(row.output_tokens || '0'),
      costUsd: parseFloat(row.cost_usd || '0').toFixed(2),
      daysTracked: parseInt(row.days_tracked || '0'),
      avgDailyTokens: parseInt(row.avg_daily_tokens || '0'),
      peakDayTokens: parseInt(row.peak_day_tokens || '0'),
      entries: parseInt(row.entries || '0'),
    }))

    const mtdData = mtdStats.rows[0] || {}
    const overallData = overallStats.rows[0] || {}

    return NextResponse.json({
      monthly: monthlyData,
      monthToDate: {
        totalTokens: parseInt(mtdData.total_tokens || '0'),
        inputTokens: parseInt(mtdData.input_tokens || '0'),
        outputTokens: parseInt(mtdData.output_tokens || '0'),
        costUsd: parseFloat(mtdData.cost_usd || '0').toFixed(2),
        daysTracked: parseInt(mtdData.days_tracked || '0'),
        modelsUsed: parseInt(mtdData.models_used || '0'),
        peakSubagentCount: parseInt(mtdData.peak_subagent_count || '0'),
        avgDailyTokens: parseInt(mtdData.avg_daily_tokens || '0'),
      },
      overall: {
        totalTokens: parseInt(overallData.total_tokens || '0'),
        inputTokens: parseInt(overallData.input_tokens || '0'),
        outputTokens: parseInt(overallData.output_tokens || '0'),
        totalCostUsd: parseFloat(overallData.total_cost_usd || '0').toFixed(2),
        totalDaysTracked: parseInt(overallData.total_days || '0'),
        avgDailyTokens: parseInt(overallData.avg_daily_tokens || '0'),
        firstTrackedDate: overallData.first_tracked_date || null,
        lastTrackedDate: overallData.last_tracked_date || null,
        uniqueModels: parseInt(overallData.unique_models || '0'),
        maxSubagentsInDay: parseInt(overallData.max_subagents_in_day || '0'),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching token stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token statistics', details: String(error) },
      { status: 500 }
    )
  }
}
