import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Generate 30 days of mock token costs data
    const entries = []
    let tavilyTotal = 0
    let claudeTotal = 0
    let gptTotal = 0
    let renderTotal = 0

    // Generate 30 days starting from today, going backwards
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      // Generate realistic daily costs with some variation
      const tavily = Math.random() * 1.5 // €0-1.50
      const claude = 1 + Math.random() * 4 // €1-5
      const gpt = 0.5 + Math.random() * 1.5 // €0.50-2
      const render = 1.2 + Math.random() * 0.8 // €1-2 (fixed infrastructure)

      const dayTotal = Number((tavily + claude + gpt + render).toFixed(2))

      tavilyTotal += tavily
      claudeTotal += claude
      gptTotal += gpt
      renderTotal += render

      entries.push({
        date: dateStr,
        tavily: Number(tavily.toFixed(2)),
        claude: Number(claude.toFixed(2)),
        gpt: Number(gpt.toFixed(2)),
        render: Number(render.toFixed(2)),
        total: dayTotal,
      })
    }

    // Reverse to have chronological order (oldest to newest)
    entries.reverse()

    const response = {
      tavily: Number(tavilyTotal.toFixed(2)),
      claude: Number(claudeTotal.toFixed(2)),
      gpt: Number(gptTotal.toFixed(2)),
      render: Number(renderTotal.toFixed(2)),
      total: Number((tavilyTotal + claudeTotal + gptTotal + renderTotal).toFixed(2)),
      entries,
      generatedAt: new Date().toISOString(),
      period: '30 days',
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error generating token stats:', error)
    return NextResponse.json(
      { error: 'Failed to generate token statistics', details: String(error) },
      { status: 500 }
    )
  }
}
