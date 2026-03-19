'use client'

import { useEffect, useState } from 'react'

interface WeatherData {
  location: string
  temperature: number
  condition: string
  icon: string
}

export default function WeatherDisplay() {
  const [weather, setWeather] = useState<WeatherData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // Fetch weather for 2 locations: Maishofen & Wien
        const response = await fetch('/api/weather')
        const data = await response.json()
        setWeather(data.locations || [])
      } catch (error) {
        console.error('Error fetching weather:', error)
        setWeather([])
      } finally {
        setLoading(false)
      }
    }

    fetchWeather()
    // Refresh every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (loading || weather.length === 0) {
    return null
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1rem',
      marginBottom: '1.5rem',
    }}>
      {weather.map((loc, idx) => (
        <div
          key={idx}
          style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <div style={{
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            🌍 {loc.location}
          </div>
          
          {/* TEMPERATURE - HIGH CONTRAST */}
          <div style={{
            fontSize: '2.8rem',
            fontWeight: 900,
            color: '#ffffff',
            marginBottom: '0.5rem',
            textShadow: '0 2px 8px rgba(0,0,0,0.6), 0 4px 16px rgba(0,0,0,0.4)',
            letterSpacing: '-0.02em',
          }}>
            {loc.temperature}°C
          </div>

          <div style={{
            fontSize: '1.1rem',
            color: '#ffffff',
            fontWeight: 800,
            opacity: 1,
            textShadow: '0 2px 6px rgba(0,0,0,0.5)',
          }}>
            {loc.condition}
          </div>
        </div>
      ))}
    </div>
  )
}
