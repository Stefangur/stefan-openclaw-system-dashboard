'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import BackButton from '../../components/BackButton'

interface BotStatus {
  name: string;
  emoji: string;
  status: 'active' | 'idle' | 'error';
  lastUpdated: string;
  details: Record<string, string | number | boolean>;
}

interface CronJob {
  name: string;
  status: 'enabled' | 'disabled' | 'error';
  lastRun: string;
  nextRun: string;
  schedule: string;
}

interface BotsData {
  bots: BotStatus[];
  cronJobs: CronJob[];
  lastUpdated: string;
}

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

const BADGE_ACTIVE: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(34,197,94,0.2)',
  color: '#4ade80',
  borderRadius: '999px',
  padding: '0.2rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
}

const BADGE_IDLE: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(234,179,8,0.2)',
  color: '#eab308',
  borderRadius: '999px',
  padding: '0.2rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
}

const BADGE_ERROR: React.CSSProperties = {
  display: 'inline-block',
  background: 'rgba(239,68,68,0.2)',
  color: '#ef4444',
  borderRadius: '999px',
  padding: '0.2rem 0.75rem',
  fontSize: '0.8rem',
  fontWeight: 600,
}

const getStatusBadge = (status: 'active' | 'idle' | 'error') => {
  const icon = status === 'active' ? '🟢' : status === 'idle' ? '🟡' : '🔴'
  const label = status === 'active' ? 'Active' : status === 'idle' ? 'Idle' : 'Error'
  const style = status === 'active' ? BADGE_ACTIVE : status === 'idle' ? BADGE_IDLE : BADGE_ERROR
  return { icon, label, style }
}

const TABS = [
  { key: 'overview', label: '🤖 Übersicht', href: '/' },
  { key: 'performance', label: '📈 Performance', href: '/performance' },
  { key: 'bots', label: '🤖 Bots', href: '/bots' },
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

export default function BotsPage() {
  const [data, setData] = useState<BotsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }))
    update()
    const iv = setInterval(update, 1000)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/bots')
        if (!response.ok) throw new Error('Failed to fetch bots status')
        const json = await response.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
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

        <BackButton />

        <div style={{ ...CARD, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>🤖 Bot Status</h1>
              <p style={{ margin: '0.25rem 0 0 0', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{time}</p>
            </div>
            <span style={BADGE_ACTIVE}>● Online</span>
          </div>
        </div>

        <NavTabs active="bots" />

        {loading ? (
          <div style={{ ...CARD, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Lade Bot-Status...</p>
          </div>
        ) : error ? (
          <div style={{ ...CARD, textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>Fehler: {error}</p>
          </div>
        ) : data ? (
          <>
            <div style={CARD}>
              <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#60a5fa' }}>🤖 Agents</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.bots.map((bot, idx) => {
                  const { icon, label, style } = getStatusBadge(bot.status)
                  return (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '12px',
                      padding: '1.25rem',
                    }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        flexWrap: 'wrap',
                        gap: '1rem',
                        marginBottom: '1rem',
                      }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1rem', fontWeight: 700 }}>
                            {bot.emoji} {bot.name}
                          </h3>
                          <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
                            Last updated: {bot.lastUpdated}
                          </p>
                        </div>
                        <span style={style}>{icon} {label}</span>
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                      }}>
                        {Object.entries(bot.details).map(([key, value]) => (
                          <div key={key}>
                            <div style={LABEL}>{key}</div>
                            <div style={VALUE}>{String(value)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={CARD}>
              <h2 style={{ margin: '0 0 1.5rem 0', fontSize: '1.1rem', color: '#60a5fa' }}>⏱️ Cron Jobs</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {data.cronJobs.map((job, idx) => (
                  <div key={idx} style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    background: 'rgba(255,255,255,0.04)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}>
                    <div>
                      <div style={LABEL}>Job Name</div>
                      <div style={VALUE}>{job.name}</div>
                    </div>
                    <div>
                      <div style={LABEL}>Schedule</div>
                      <div style={VALUE}>{job.schedule}</div>
                    </div>
                    <div>
                      <div style={LABEL}>Status</div>
                      <div style={{
                        ...VALUE,
                        color: job.status === 'enabled' ? '#4ade80' : job.status === 'disabled' ? '#eab308' : '#ef4444',
                      }}>
                        {job.status === 'enabled' ? '🟢' : job.status === 'disabled' ? '🟡' : '🔴'} {job.status}
                      </div>
                    </div>
                    <div>
                      <div style={LABEL}>Last Run</div>
                      <div style={VALUE}>{job.lastRun}</div>
                    </div>
                    <div>
                      <div style={LABEL}>Next Run</div>
                      <div style={VALUE}>{job.nextRun}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              textAlign: 'center',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              fontSize: '0.8rem',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Dashboard aktualisiert: {data.lastUpdated}
            </div>
          </>
        ) : null}

      </div>
    </div>
  )
}
