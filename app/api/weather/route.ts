import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Fetch from wttr.in for both locations
    const locations = ['Maishofen,Austria', 'Wien,Austria']
    const weatherData = []

    for (const loc of locations) {
      try {
        const response = await fetch(
          `https://wttr.in/${encodeURIComponent(loc)}?format=j1`,
          { next: { revalidate: 1800 } } // Cache for 30 minutes
        )
        
        if (!response.ok) throw new Error('wttr.in unavailable')

        const data = await response.json()
        const current = data.current_condition?.[0] || {}
        
        if (current.temp_C !== null && current.temp_C !== undefined) {
          weatherData.push({
            location: loc.split(',')[0],
            temperature: current.temp_C || 0,
            condition: current.weatherDesc?.[0]?.value || 'Unbekannt',
            icon: current.weatherCode || '999',
          })
        }
      } catch (e) {
        // Skip location if fetch fails
        continue
      }
    }

    // Fallback mock data if external API fails
    if (weatherData.length === 0) {
      weatherData.push(
        {
          location: 'Maishofen',
          temperature: 8,
          condition: 'Teilweise bewölkt',
          icon: '003',
        },
        {
          location: 'Wien',
          temperature: 12,
          condition: 'Bewölkt',
          icon: '004',
        }
      )
    }

    return NextResponse.json({ locations: weatherData })
  } catch (error) {
    console.error('Weather API error:', error)
    // Return fallback data even on error
    return NextResponse.json({ 
      locations: [
        {
          location: 'Maishofen',
          temperature: 8,
          condition: 'Teilweise bewölkt',
          icon: '003',
        },
        {
          location: 'Wien',
          temperature: 12,
          condition: 'Bewölkt',
          icon: '004',
        }
      ]
    }, { status: 200 })
  }
}
