'use client'

import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton'

// Stefan's OpenClaw CONSOLIDATED CRON JOBS (Single Source of Truth)
const CRON_JOBS = [
  {
    name: 'healthcheck:security-audit',
    schedule: '0 8 * * *',
    timezone: 'Europe/Vienna',
    status: 'enabled',
    description: 'Daily security audit and hardening check',
    lastRun: 'Today, 08:00',
  },
  {
    name: 'monitoring:render-ping',
    schedule: '*/5 * * * *',
    timezone: 'Europe/Vienna',
    status: 'enabled',
    description: 'Health check for Render deployments',
    lastRun: 'Today, 12:00',
  },
  {
    name: 'trader:briefing-morning',
    schedule: '0 8 * * *',
    timezone: 'Europe/Vienna',
    status: 'enabled',
    description: 'Morning portfolio briefing at 08:00',
    lastRun: 'Today, 08:00',
  },
  {
    name: 'trader:briefing-midday',
    schedule: '0 12 * * *',
    timezone: 'Europe/Vienna',
    status: 'enabled',
    description: 'Midday portfolio briefing at 12:00',
    lastRun: 'Today, 12:00',
  },
  {
    name: 'trader:briefing-evening',
    schedule: '0 18 * * *',
    timezone: 'Europe/Vienna',
    status: 'enabled',
    description: 'Evening portfolio briefing at 18:00',
    lastRun: 'Today, 18:00',
  },
]

// Parse cron schedule to human readable
const parseCronSchedule = (schedule: string) => {
  if (schedule === '0 8 * * *') return 'Daily 08:00 Vienna'
  if (schedule === '*/5 * * * *') return 'Every 5 minutes'
  if (schedule === '0 12 * * *') return 'Daily 12:00 Vienna'
  if (schedule === '0 18 * * *') return 'Daily 18:00 Vienna'
  return schedule
}

export default function CronPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [filter, setFilter] = useState<'all' | 'enabled' | 'disabled'>('all')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const filteredJobs = filter === 'all' 
    ? CRON_JOBS 
    : CRON_JOBS.filter(job => job.status === (filter === 'enabled' ? 'enabled' : 'disabled'))

  const enabledCount = CRON_JOBS.filter(j => j.status === 'enabled').length

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <BackButton />
          <div>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              margin: 0,
              color: '#f1f5f9'
            }}>
              ⏰ Cron Jobs
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Consolidated job scheduler for Stefan's OpenClaw infrastructure
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Total Jobs</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{CRON_JOBS.length}</div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Active</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>{enabledCount}</div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '12px',
            padding: '1.5rem',
            border: '1px solid rgba(6, 182, 212, 0.2)'
          }}>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Current Time</div>
            <div style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#06b6d4' }}>{currentTime}</div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {(['all', 'enabled', 'disabled'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: filter === status ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                color: filter === status ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                fontSize: '0.9rem',
                transition: 'all 0.2s'
              }}
            >
              {status === 'all' ? '📋 All' : status === 'enabled' ? '🟢 Enabled' : '⏸️ Disabled'}
            </button>
          ))}
        </div>

        {/* Cron Jobs Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem'
        }}>
          {filteredJobs.map((job, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              {/* Job Header */}
              <div>
                <h3 style={{
                  margin: '0 0 0.5rem 0',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  color: '#f1f5f9',
                  fontFamily: 'monospace'
                }}>
                  {job.name}
                </h3>
                <p style={{
                  margin: 0,
                  color: '#94a3b8',
                  fontSize: '0.85rem'
                }}>
                  {job.description}
                </p>
              </div>

              {/* Status Badge */}
              <div>
                <span style={{
                  display: 'inline-block',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  background: job.status === 'enabled' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: job.status === 'enabled' ? '#4ade80' : '#9ca3af'
                }}>
                  {job.status === 'enabled' ? '🟢' : '🟡'} {job.status === 'enabled' ? 'Enabled' : 'Disabled'}
                </span>
              </div>

              {/* Job Details */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                padding: '1rem',
                display: 'grid',
                gap: '0.75rem'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Schedule</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#f59e0b' }}>
                    {parseCronSchedule(job.schedule)}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontFamily: 'monospace', marginTop: '0.25rem' }}>
                    {job.schedule}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last Run</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                    {job.lastRun}
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timezone</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '600' }}>
                    {job.timezone}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#94a3b8'
          }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>No jobs found</p>
          </div>
        )}
      </div>
    </div>
  )
}
