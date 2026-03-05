'use client'

import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton'
import type React from 'react'

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

const TAB_BUTTON: React.CSSProperties = {
  flex: 1,
  padding: '1rem',
  border: 'none',
  background: 'transparent',
  color: 'rgba(255,255,255,0.5)',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  borderBottom: '2px solid transparent',
  transition: 'all 0.3s ease',
}

const TAB_BUTTON_ACTIVE: React.CSSProperties = {
  ...TAB_BUTTON,
  color: '#60a5fa',
  borderBottomColor: '#60a5fa',
}

const TAB_CONTAINER: React.CSSProperties = {
  display: 'flex',
  gap: '0',
  borderBottom: '1px solid rgba(255,255,255,0.1)',
  marginBottom: '2rem',
}



export default function BotsPage() {
  const [data, setData] = useState<BotsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [time, setTime] = useState('')
  const [tab, setTab] = useState<'developer' | 'tester'>('developer')

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

        {/* Tab Navigation */}
        <div style={TAB_CONTAINER}>
          <button
            onClick={() => setTab('developer')}
            style={tab === 'developer' ? TAB_BUTTON_ACTIVE : TAB_BUTTON}
            onMouseEnter={(e) => {
              if (tab !== 'developer') {
                (e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== 'developer') {
                (e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'
              }
            }}
          >
            👨‍💻 Developer
          </button>
          <button
            onClick={() => setTab('tester')}
            style={tab === 'tester' ? TAB_BUTTON_ACTIVE : TAB_BUTTON}
            onMouseEnter={(e) => {
              if (tab !== 'tester') {
                (e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)'
              }
            }}
            onMouseLeave={(e) => {
              if (tab !== 'tester') {
                (e.target as HTMLButtonElement).style.color = 'rgba(255,255,255,0.5)'
              }
            }}
          >
            🧪 Tester
          </button>
        </div>

        {loading ? (
          <div style={{ ...CARD, textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Lade Bot-Status...</p>
          </div>
        ) : error ? (
          <div style={{ ...CARD, textAlign: 'center' }}>
            <p style={{ color: '#ef4444' }}>Fehler: {error}</p>
          </div>
        ) : (
          <>
            {/* Developer Tab Content */}
            {tab === 'developer' && data && (
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
            )}

            {/* Tester Tab Content */}
            {tab === 'tester' && (
              <>
                <div style={CARD}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ margin: 0, fontSize: '1.1rem', color: '#60a5fa' }}>🧪 Tester Bot</h2>
                    <span style={BADGE_ACTIVE}>● Active</span>
                  </div>
                  <p style={{ margin: '0 0 1.5rem 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                    Runs automated tests for Fitness, Portfolio, Dashboard apps
                  </p>
                </div>

                <div style={CARD}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: '#60a5fa' }}>📊 Test Status</h3>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1.5rem',
                    marginBottom: '2rem',
                  }}>
                    <div>
                      <div style={LABEL}>Total Tests</div>
                      <div style={VALUE}>24</div>
                    </div>
                    <div>
                      <div style={LABEL}>Last Run</div>
                      <div style={VALUE}>Today, 11:45 AM</div>
                    </div>
                    <div>
                      <div style={LABEL}>Pass Rate</div>
                      <div style={{ ...VALUE, color: '#4ade80' }}>100%</div>
                    </div>
                    <div>
                      <div style={LABEL}>Avg Duration</div>
                      <div style={VALUE}>2.3s</div>
                    </div>
                  </div>
                </div>

                <div style={CARD}>
                  <h3 style={{ margin: '0 0 1.5rem 0', fontSize: '1rem', color: '#60a5fa' }}>📝 Recent Test Runs</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {[
                      { date: 'Today, 11:45 AM', app: 'Fitness Dashboard', result: '✅ Passed', duration: '2.1s' },
                      { date: 'Today, 10:30 AM', app: 'Portfolio Dashboard', result: '✅ Passed', duration: '2.4s' },
                      { date: 'Today, 09:15 AM', app: 'OpenClaw Dashboard', result: '✅ Passed', duration: '2.5s' },
                      { date: 'Yesterday, 15:20 PM', app: 'Fitness Dashboard', result: '✅ Passed', duration: '2.2s' },
                      { date: 'Yesterday, 14:05 PM', app: 'Portfolio Dashboard', result: '✅ Passed', duration: '2.3s' },
                    ].map((test, idx) => (
                      <div key={idx} style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                        gap: '1rem',
                        background: 'rgba(255,255,255,0.04)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                        border: '1px solid rgba(255,255,255,0.08)',
                        alignItems: 'center',
                      }}>
                        <div>
                          <div style={LABEL}>Date</div>
                          <div style={VALUE}>{test.date}</div>
                        </div>
                        <div>
                          <div style={LABEL}>App</div>
                          <div style={VALUE}>{test.app}</div>
                        </div>
                        <div>
                          <div style={LABEL}>Result</div>
                          <div style={{ ...VALUE, color: '#4ade80' }}>{test.result}</div>
                        </div>
                        <div>
                          <div style={LABEL}>Duration</div>
                          <div style={VALUE}>{test.duration}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}

      </div>
    </div>
  )
}
