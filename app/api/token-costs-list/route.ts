import { NextRequest, NextResponse } from 'next/server'
import { getTokenCosts, initializeTokenCostsTable } from '@/lib/token-costs-db'

export async function GET(request: NextRequest) {
  // Verify auth header
  const authToken = request.headers.get('X-Butler-Token')
  if (!authToken || authToken !== 'butler-stefan-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get days parameter from query
    const searchParams = request.nextUrl.searchParams
    const daysParam = searchParams.get('days')
    const days = daysParam ? parseInt(daysParam, 10) : 30

    // Validate days parameter
    if (isNaN(days) || days < 1) {
      return NextResponse.json({ error: 'Invalid days parameter. Must be >= 1' }, { status: 400 })
    }

    // Initialize table if needed
    await initializeTokenCostsTable()

    // Fetch token costs
    const costs = await getTokenCosts(days)

    return NextResponse.json(
      {
        success: true,
        days,
        count: costs.length,
        data: costs.map((record) => ({
          date: record.date,
          tavily_eur: record.tavily_eur,
          claude_eur: record.claude_eur,
          gpt_eur: record.gpt_eur,
          render_eur: record.render_eur,
          other_eur: record.other_eur,
          total_eur: record.total_eur,
          notes: record.notes,
          created_at: record.created_at,
          updated_at: record.updated_at,
        })),
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching token costs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch token cost data', details: String(error) },
      { status: 500 }
    )
  }
}
