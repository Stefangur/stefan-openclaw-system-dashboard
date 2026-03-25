import { NextRequest, NextResponse } from 'next/server'
import { updateTokenCost, initializeTokenCostsTable } from '@/lib/token-costs-db'

export async function POST(request: NextRequest) {
  // Verify auth header
  const authToken = request.headers.get('X-Butler-Token')
  if (!authToken || authToken !== 'butler-stefan-2026') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()

    // Validate required date field
    if (!body.date) {
      return NextResponse.json(
        { error: 'Missing required field: date (YYYY-MM-DD)' },
        { status: 400 }
      )
    }

    // Validate date format
    if (!/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
      return NextResponse.json(
        { error: 'Invalid date format. Use YYYY-MM-DD' },
        { status: 400 }
      )
    }

    // Validate all currency fields are non-negative numbers if provided
    const currencyFields = ['tavily_eur', 'claude_eur', 'gpt_eur', 'render_eur', 'other_eur']
    for (const field of currencyFields) {
      if (body[field] !== undefined && (typeof body[field] !== 'number' || body[field] < 0)) {
        return NextResponse.json(
          { error: `${field} must be a non-negative number` },
          { status: 400 }
        )
      }
    }

    // Initialize table if needed
    await initializeTokenCostsTable()

    // Update the token cost record
    const result = await updateTokenCost(body.date, {
      tavily_eur: body.tavily_eur,
      claude_eur: body.claude_eur,
      gpt_eur: body.gpt_eur,
      render_eur: body.render_eur,
      other_eur: body.other_eur,
      notes: body.notes,
    })

    return NextResponse.json(
      {
        success: true,
        id: result.id,
        date: result.date,
        tavily_eur: result.tavily_eur,
        claude_eur: result.claude_eur,
        gpt_eur: result.gpt_eur,
        render_eur: result.render_eur,
        other_eur: result.other_eur,
        total_eur: result.total_eur,
        notes: result.notes,
        created_at: result.created_at,
        updated_at: result.updated_at,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating token cost:', error)
    return NextResponse.json(
      { error: 'Failed to update token cost data', details: String(error) },
      { status: 500 }
    )
  }
}
