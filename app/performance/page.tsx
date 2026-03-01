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

const TABS = [
  { key: 'overview', label: '🤖 Übersicht', href: '/' },
  { key: 'performance', label: '📈 Performance', href: '/performance' },
]

function NavTabs({ active }: { active: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
      {TABS.map(tab => (
        <Link key={tab.key} href={tab.href} style={{
          padding: '0.6rem 1.2rem',
          borderRadius: '10px',
          border: '1px solid rgba(255,255,255,0.15)',
          background: active === tab.key ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)',
          color: active === tab.key ? '#fff' : 'rgba(255,255,255,0.6)',
          textDecoration: 'none',
          fontSize: '0.9rem',
          fontWeight: active === tab.key ? 700 : 400,
          transition: 'all 0.2s',
        }}>
          {tab.label}
        </Link>
      ))}
    </div>
  )
}

interface HostMetrics {
  cpu_percent: number
  ram_percent: number
  disk_percent: number
  uptime_days: number
}

interface ApiMetrics {
  requests_24h: number
  avg_response_ms: number
  errors_24h: number
  error_rate_percent: number
}

interface OpenClawStats {
  sessions: number
  tokens_used: string
  total_runtime: string
  status: string
}

function GaugeBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '999px', height: '8px', overflow: 'hidden' }}>
      <div style={{
        width: `${Math.min(value, 100)}%`, height: '100%',
        background: color, borderRadius: '999px', transition: 'width 0.5s ease',
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
  const [host, setHost] = useState<HostMetrics | null>(null)
  const [api, setApi] = useState<ApiMetrics | null>(null)
  const [openclaw, setOpenClaw] = useState<OpenClawStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState('')

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/system-metrics', { cache: 'no-store' })
      const data = await res.json()
      console.log('✅ API Response received:', { status: res.status, hasHost: !!data.host, hasApi: !!data.api, hasOpenClaw: !!data.openclaw })
      
      if (!res.ok) {
        setError(`API Error (${res.status}): ${data.error || 'Unbekannt'}`)
      } else if (data.host && data.api && data.openclaw) {
        setHost(data.host)
        setApi(data.api)
        setOpenClaw(data.openclaw)
        setLastRefresh(new Date().toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna' }))
      } else {
        console.error('❌ Invalid response structure:', data)
        setError('Ungültige API-Antwort: fehlende Felder (host/api/openclaw)')
      }
    } catch (e: any) {
      console.error('❌ Fetch error:', e)
      setError(`Fehler: ${e.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

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

        {/* Back Button */}
        <Link href="/" style={{ color: '#60a5fa', textDecoration: 'none', fontSize: '0.9rem', display: 'inline-block', marginBottom: '1rem' }}>
          ← Zurück zur Übersicht
        </Link>

        {/* Header */}
        <div style={{ ...CARD, marginBottom: '1.5rem' }}>
          <h1 style={{ margin: '0 0 0.25rem 0', fontSize: '1.8rem', fontWeight: 700 }}>🤖 OpenClaw System</h1>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            System Performance • {lastRefresh ? `Stand: ${lastRefresh}` : 'Lädt…'}
          </p>
        </div>

        {/* Nav Tabs */}
        <NavTabs active="performance" />

        {loading && (
          <div style={{ ...CARD, textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>⏳ Lade Metriken…</div>
        )}

        {error && (
          <div style={{ ...CARD, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
            <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>❌ {error}</div>
          </div>
        )}

        {host && (
          <>
            {/* Live Gauges */}
            <div style={CARD}>
              <h2 style={{ margin: '0 0 1.25rem 0', fontSize: '1rem', color: '#60a5fa' }}>⚡ Host Ressourcen</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>CPU</span>
                    <span style={{ fontWeight: 700, color: statusColor(host.cpu_percent) }}>{host.cpu_percent}%</span>
                  </div>
                  <GaugeBar value={host.cpu_percent} color={statusColor(host.cpu_percent)} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>RAM</span>
                    <span style={{ fontWeight: 700, color: statusColor(host.ram_percent) }}>{host.ram_percent}%</span>
                  </div>
                  <GaugeBar value={host.ram_percent} color={statusColor(host.ram_percent)} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>Disk</span>
                    <span style={{ fontWeight: 700, color: statusColor(host.disk_percent) }}>{host.disk_percent}%</span>
                  </div>
                  <GaugeBar value={host.disk_percent} color={statusColor(host.disk_percent)} />
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={LABEL}>Uptime</span>
                    <span style={{ fontWeight: 700, color: '#60a5fa' }}>{host.uptime_days.toFixed(1)} d</span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Tage aktiv</div>
                </div>
              </div>
            </div>

            {/* API Performance */}
            {api && (
              <div style={CARD}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>📡 API Performance (24h)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={LABEL}>Requests</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{api.requests_24h}</div>
                  </div>
                  <div>
                    <span style={LABEL}>Ø Response</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{api.avg_response_ms}ms</div>
                  </div>
                  <div>
                    <span style={LABEL}>Errors</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: api.errors_24h > 0 ? '#ef4444' : '#4ade80' }}>
                      {api.errors_24h}
                    </div>
                  </div>
                  <div>
                    <span style={LABEL}>Error Rate</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: statusColor(api.error_rate_percent) }}>
                      {api.error_rate_percent}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* OpenClaw Stats */}
            {openclaw && (
              <div style={CARD}>
                <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>🔧 OpenClaw Status</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <span style={LABEL}>Status</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: openclaw.status === 'available' ? '#4ade80' : '#fbbf24' }}>
                      {openclaw.status}
                    </div>
                  </div>
                  <div>
                    <span style={LABEL}>Sessions</span>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{openclaw.sessions}</div>
                  </div>
                  <div>
                    <span style={LABEL}>Tokens Used</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{openclaw.tokens_used}</div>
                  </div>
                  <div>
                    <span style={LABEL}>Runtime</span>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{openclaw.total_runtime}</div>
                  </div>
                </div>
              </div>
            )}
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
