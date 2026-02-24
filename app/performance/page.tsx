'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const CARD: React.CSSProperties = {
  background: 'rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  borderRadius: '16px',
  padding: '1.5rem',
  border: '1px solid rgba(255,255,255,0.12)',
  marginBottom: '1rem',
}

const LABEL: React.CSSProperties = {
  color: 'rgba(255,255,255,0.5)',
  fontSize: '0.8rem',
  marginBottom: '0.25rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
}

interface Metric {
  timestamp: string
  cpu_percent: number
  memory_percent: number
  memory_used_mb: number
  memory_total_mb: number
  disk_percent: number
  disk_used_gb: number
  disk_total_gb: number
  load_1m: number
  load_5m: number
  load_15m: number
}

function GaugeBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
      <div style={{
        width: `${pct}%`,
        height: '100%',
        background: color,
        borderRadius: '999px',
        transition: 'width 0.5s ease',
      }} />
    </div>
  )
}

function statusColor(pct: number) {
  if (pct < 60) return '#4ade80'
  if (pct < 80) return '#fbbf24'
  return '#ef4444'
}

export default function PerformancePage() {
  const [metrics, setMetrics] = useState<Metric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/system-metrics', { cache: 'no-store' })
      const data = await res.json()
      if (data.success) {
        setMetrics(data.metrics)
        setLastRefresh(new Date().toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna' }))
      } else {
        setError(data.error || 'Fehler beim Laden')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const latest = metrics[0]

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem',
      paddingBottom: '5rem',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Back + Header */}
        <div style={{ ...CARD, marginBottom: '1.5rem' }}>
          <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '1.1rem', fontWeight: 500 }}>
            ← Zurück zur Übersicht
          </Link>
          <h1 style={{ margin: '0.75rem 0 0.25rem 0', fontSize: '1.8rem', fontWeight: 700 }}>📈 Performance</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            VM Metriken • alle 10 Min aktualisiert{lastRefresh ? ` • Stand: ${lastRefresh}` : ''}
          </p>
        </div>

        {loading && (
          <div style={{ ...CARD, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>Lade Metriken…</div>
        )}

        {error && (
          <div style={{ ...CARD, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            ❌ {error}
          </div>
        )}

        {latest && (
          <>
            {/* Live Gauges */}
            <div style={{ ...CARD }}>
              <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#60a5fa' }}>⚡ Aktuell</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {/* CPU */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>CPU</span>
                    <span style={{ fontWeight: 700, color: statusColor(latest.cpu_percent) }}>{latest.cpu_percent}%</span>
                  </div>
                  <GaugeBar value={latest.cpu_percent} color={statusColor(latest.cpu_percent)} />
                  <div style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    Load: {latest.load_1m} / {latest.load_5m} / {latest.load_15m}
                  </div>
                </div>
                {/* Memory */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>Memory</span>
                    <span style={{ fontWeight: 700, color: statusColor(latest.memory_percent) }}>{latest.memory_percent}%</span>
                  </div>
                  <GaugeBar value={latest.memory_percent} color={statusColor(latest.memory_percent)} />
                  <div style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    {latest.memory_used_mb} MB / {latest.memory_total_mb} MB
                  </div>
                </div>
                {/* Disk */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>Disk</span>
                    <span style={{ fontWeight: 700, color: statusColor(latest.disk_percent) }}>{latest.disk_percent}%</span>
                  </div>
                  <GaugeBar value={latest.disk_percent} color={statusColor(latest.disk_percent)} />
                  <div style={{ marginTop: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>
                    {latest.disk_used_gb} GB / {latest.disk_total_gb} GB
                  </div>
                </div>
              </div>
            </div>

            {/* History */}
            <div style={{ ...CARD }}>
              <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>📊 Verlauf (letzte {metrics.length} Messwerte)</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                  <thead>
                    <tr style={{ color: 'rgba(255,255,255,0.4)', textAlign: 'left' }}>
                      {['Zeit', 'CPU %', 'RAM %', 'RAM MB', 'Disk %', 'Load 1m'].map(h => (
                        <th key={h} style={{ padding: '0.4rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {metrics.slice(0, 20).map((m, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '0.4rem 0.75rem', color: 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap' }}>
                          {new Date(m.timestamp).toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna', hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td style={{ padding: '0.4rem 0.75rem', color: statusColor(m.cpu_percent), fontWeight: 600 }}>{m.cpu_percent}%</td>
                        <td style={{ padding: '0.4rem 0.75rem', color: statusColor(m.memory_percent), fontWeight: 600 }}>{m.memory_percent}%</td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>{m.memory_used_mb}</td>
                        <td style={{ padding: '0.4rem 0.75rem', color: statusColor(m.disk_percent) }}>{m.disk_percent}%</td>
                        <td style={{ padding: '0.4rem 0.75rem' }}>{m.load_1m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Refresh */}
        <button onClick={load} style={{
          position: 'fixed', bottom: '2rem', right: '2rem',
          width: '64px', height: '64px', borderRadius: '50%',
          background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
          color: 'white', border: 'none', fontSize: '1.5rem',
          cursor: 'pointer', boxShadow: '0 4px 20px rgba(59,130,246,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>🔄</button>
      </div>
    </div>
  )
}
