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
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const VALUE: React.CSSProperties = {
  fontWeight: 700,
  fontSize: '1.1rem',
}

const BADGE_GREEN: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(34,197,94,0.2)',
  color: '#4ade80',
  borderRadius: '999px',
  padding: '0.2rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
}

const STATIC = {
  platform: 'macOS 26.3 (arm64)',
  node: 'v22.22.0',
  openclaw: '2026.2.22-2',
  model: 'claude-haiku-4.5',
  channel: 'Telegram (@SGUButler_bot)',
  cronJobs: [
    { name: 'Security Audit', schedule: 'täglich 06:00 Vienna', id: '8e10f87f' },
    { name: 'Memory Consolidation', schedule: 'Sonntags 09:00 Vienna', id: 'b36f62df' },
    { name: 'System Metrics Push', schedule: 'alle 10 Minuten', id: 'cfc8b0d3' },
  ],
  dashboards: [
    { name: '💪 Fitness', url: 'https://stefan-fitness-dashboard-v2.onrender.com' },
    { name: '📊 Portfolio', url: 'https://stefan-portfolio-dashboard-v2.onrender.com' },
    { name: '✅ Tasks', url: 'https://stefan-tasks-dashboard-v2.onrender.com' },
  ],
}

const TABS = [
  { key: 'overview', label: '🤖 Übersicht', href: '/' },
  { key: 'performance', label: '📈 Performance', href: '/performance' },
]

function NavTabs({ active }: { active: string }) {
  return (
    <div style={{
      display: 'flex', gap: '0.5rem', flexWrap: 'wrap',
      marginBottom: '1.5rem',
    }}>
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

export default function OpenClawDashboard() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }))
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      padding: '2rem',
      paddingBottom: '6rem',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ ...CARD, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>🤖 OpenClaw System</h1>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{time}</p>
            </div>
            <span style={BADGE_GREEN}>● Online</span>
          </div>
        </div>

        {/* Nav Tabs */}
        <NavTabs active="overview" />

        {/* System Info */}
        <div style={CARD}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>⚙️ System</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            {[
              { label: 'Platform', val: STATIC.platform },
              { label: 'Node', val: STATIC.node },
              { label: 'OpenClaw', val: STATIC.openclaw },
              { label: 'Modell', val: STATIC.model },
              { label: 'Channel', val: STATIC.channel },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={LABEL}>{label}</div>
                <div style={VALUE}>{val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cron Jobs */}
        <div style={CARD}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>⏱️ Cron Jobs</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STATIC.cronJobs.map(job => (
              <div key={job.id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                flexWrap: 'wrap', gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{job.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>{job.schedule}</div>
                </div>
                <span style={BADGE_GREEN}>aktiv</span>
              </div>
            ))}
          </div>
        </div>

        {/* Dashboards */}
        <div style={CARD}>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#60a5fa' }}>🔗 Dashboards</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {STATIC.dashboards.map(d => (
              <a key={d.url} href={d.url} target="_blank" rel="noopener noreferrer" style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9', textDecoration: 'none',
              }}>
                <span style={{ fontWeight: 600 }}>{d.name}</span>
                <span style={{ color: '#60a5fa', fontSize: '0.85rem' }}>{d.url.replace('https://', '')} ↗</span>
              </a>
            ))}
          </div>
        </div>

        {/* Info */}
        <div style={{ ...CARD, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <p style={{ margin: 0, color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>
            ℹ️ Live-Metriken via <strong>📈 Performance</strong> Tab. Für direkten Kontakt → Telegram <strong>@SGUButler_bot</strong>
          </p>
        </div>

      </div>
    </div>
  )
}
