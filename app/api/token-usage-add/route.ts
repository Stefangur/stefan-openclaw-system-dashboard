import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function POST(request: NextRequest) {
  // Verify auth header
  const authToken = request.headers.get('X-Butler-Token')
  if (!authToken || authToken !== 'butler-stefan-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    
    // Validate required fields
    const { date, total_tokens } = body
    if (!date || total_tokens === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: date and total_tokens' },
        { status: 400 }
      )
    }

    // Validate date format (YYYY-MM-DD)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Validate total_tokens is a positive integer
    if (!Number.isInteger(total_tokens) || total_tokens < 0) {
      return NextResponse.json(
        { error: 'total_tokens must be a non-negative integer' },
        { status: 400 }
      )
    }

    const databaseUrl = process.env.TURSO_DATABASE_URL_PORTFOLIO
    const dbAuthToken = process.env.TURSO_AUTH_TOKEN_PORTFOLIO

    if (!databaseUrl || !dbAuthToken) {
      console.error('Missing portfolio database credentials')
      return NextResponse.json(
        { error: 'Database credentials not configured' },
        { status: 500 }
      )
    }

    const client = createClient({
      url: databaseUrl,
      authToken: dbAuthToken,
    })

    // Extract optional fields with defaults
    const {
      input_tokens = null,
      output_tokens = null,
      cost_usd = null,
      model = null,
      subagent_count = null,
      notes = null,
    } = body

    // Validate optional numeric fields
    if (input_tokens !== null && (!Number.isInteger(input_tokens) || input_tokens < 0)) {
      return NextResponse.json(
        { error: 'input_tokens must be a non-negative integer' },
        { status: 400 }
      )
    }

    if (output_tokens !== null && (!Number.isInteger(output_tokens) || output_tokens < 0)) {
      return NextResponse.json(
        { error: 'output_tokens must be a non-negative integer' },
        { status: 400 }
      )
    }

    if (cost_usd !== null && (typeof cost_usd !== 'number' || cost_usd < 0)) {
      return NextResponse.json(
        { error: 'cost_usd must be a non-negative number' },
        { status: 400 }
      )
    }

    if (subagent_count !== null && (!Number.isInteger(subagent_count) || subagent_count < 0)) {
      return NextResponse.json(
        { error: 'subagent_count must be a non-negative integer' },
        { status: 400 }
      )
    }

    // INSERT OR REPLACE into token_usage
    const result = await client.execute({
      sql: `
        INSERT OR REPLACE INTO token_usage (
          date,
          total_tokens,
          input_tokens,
          output_tokens,
          cost_usd,
          model,
          subagent_count,
          notes,
          created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [
        date,
        total_tokens,
        input_tokens,
        output_tokens,
        cost_usd,
        model,
        subagent_count,
        notes,
      ],
    })

    // Fetch the inserted/updated record to confirm
    const confirmResult = await client.execute({
      sql: `
        SELECT * FROM token_usage WHERE date = ?
      `,
      args: [date],
    })

    const insertedRecord = confirmResult.rows[0] || {}

    return NextResponse.json(
      {
        success: true,
        message: `Token usage data for ${date} saved successfully`,
        data: {
          id: insertedRecord.id,
          date: insertedRecord.date,
          totalTokens: insertedRecord.total_tokens,
          inputTokens: insertedRecord.input_tokens,
          outputTokens: insertedRecord.output_tokens,
          costUsd: insertedRecord.cost_usd,
          model: insertedRecord.model,
          subagentCount: insertedRecord.subagent_count,
          notes: insertedRecord.notes,
          createdAt: insertedRecord.created_at,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error adding token usage:', error)
    return NextResponse.json(
      { error: 'Failed to add token usage data', details: String(error) },
      { status: 500 }
    )
  }
}
