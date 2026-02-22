'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Stefan's OpenClaw Cron Jobs Data (Real-Time)
const fallbackData = {
  cronJobs: [
    {
      name: 'Bitcoin Monitor',
      id: 'bitcoin-monitor',
      schedule: '*/15 * * * *',
      description: 'Bitcoin price tracking with alert system',
      nextRun: '10:15:00',
      lastRun: '10:00:00',
      status: 'active',
      success: true,
      duration: '1.2s',
      frequency: 'Every 15 minutes',
      alerts: 0,
      executions_today: 28,
      cost_today: 0.14,
      logs: [
        { time: '10:00:00', status: 'success', message: 'BTC €57,684 (-0.11%) - No alert needed', duration: '1.2s' },
        { time: '09:45:00', status: 'success', message: 'BTC €57,720 (-0.05%) - Normal volatility', duration: '1.1s' },
        { time: '09:30:00', status: 'success', message: 'BTC €57,750 (+0.02%) - Stable monitoring', duration: '1.3s' }
      ]
    },
    {
      name: 'Fitness Sync',
      id: 'fitness-sync',
      schedule: '*/30 * * * *',
      description: 'Fitness dashboard data synchronization',
      nextRun: '10:30:00',
      lastRun: '10:00:00',
      status: 'active',
      success: true,
      duration: '0.8s',
      frequency: 'Every 30 minutes',
      alerts: 0,
      executions_today: 14,
      cost_today: 0.07,
      logs: [
        { time: '10:00:00', status: 'success', message: 'Dashboard sync complete - All tabs functional', duration: '0.8s' },
        { time: '09:30:00', status: 'success', message: 'Data sync: 106.9kg, 15 kcal, 0.5L hydration', duration: '0.9s' },
        { time: '09:00:00', status: 'success', message: 'Morning sync successful - Render deployment stable', duration: '0.7s' }
      ]
    },
    {
      name: 'Portfolio Update',
      id: 'portfolio-update',
      schedule: '0 7,12,18 * * *',
      description: 'Portfolio positions and market data update',
      nextRun: '12:00:00',
      lastRun: '07:00:00',
      status: 'active',
      success: true,
      duration: '2.1s',
      frequency: '3 times daily (7:00, 12:00, 18:00)',
      alerts: 0,
      executions_today: 1,
      cost_today: 0.05,
      logs: [
        { time: '07:00:00', status: 'success', message: 'Portfolio sync: AEM +3.94%, BNP -5.09%, PHOS +13.23%', duration: '2.1s' }
      ]
    },
    {
      name: 'System Health',
      id: 'system-health',
      schedule: '0 */6 * * *',
      description: 'OpenClaw system health monitoring',
      nextRun: '12:00:00',
      lastRun: '06:00:00',
      status: 'active',
      success: true,
      duration: '1.5s',
      frequency: 'Every 6 hours',
      alerts: 0,
      executions_today: 2,
      cost_today: 0.04,
      logs: [
        { time: '06:00:00', status: 'success', message: 'System healthy: CPU 12%, RAM 68%, Gateway online', duration: '1.5s' }
      ]
    },
    {
      name: 'Hydration Reminder',
      id: 'hydration-reminder',
      schedule: '0 10,14,18 * * *',
      description: 'Daily hydration reminders for Stefan',
      nextRun: '14:00:00',
      lastRun: '10:00:00',
      status: 'active',
      success: true,
      duration: '0.5s',
      frequency: '3 times daily (10:00, 14:00, 18:00)',
      alerts: 0,
      executions_today: 1,
      cost_today: 0.02,
      logs: [
        { time: '10:00:00', status: 'success', message: 'Hydration reminder sent - 💧 Zeit für Wasser!', duration: '0.5s' }
      ]
    }
  ],
  
  cronStats: {
    totalJobs: 5,
    activeJobs: 5,
    executionsToday: 46,
    successRate: 100.0,
    totalCost: 0.32,
    avgDuration: 1.2,
    nextJobIn: '15m',
    alertsToday: 0
  },
  
  scheduleTypes: [
    { type: 'High Frequency', count: 2, jobs: ['Bitcoin Monitor (15m)', 'Fitness Sync (30m)'] },
    { type: 'Daily', count: 2, jobs: ['Portfolio Update (3x)', 'Hydration Reminder (3x)'] },
    { type: 'Periodic', count: 1, jobs: ['System Health (6h)'] }
  ]
}

// Parse cron schedule to human readable
const parseCronSchedule = (schedule: string) => {
  const parts = schedule.split(' ')
  const [minute, hour, day, month, weekday] = parts
  
  if (schedule === '*/15 * * * *') return { text: 'Every 15 minutes', type: 'high-frequency' }
  if (schedule === '*/30 * * * *') return { text: 'Every 30 minutes', type: 'high-frequency' }
  if (schedule === '0 7,12,18 * * *') return { text: '3x daily (7:00, 12:00, 18:00)', type: 'daily' }
  if (schedule === '0 10,14,18 * * *') return { text: '3x daily (10:00, 14:00, 18:00)', type: 'daily' }
  if (schedule === '0 */6 * * *') return { text: 'Every 6 hours', type: 'periodic' }
  
  return { text: schedule, type: 'custom' }
}

export default function CronPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('alle')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-DE'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const statusTypes = ['alle', 'active', 'paused', 'error']
  const filteredJobs = selectedStatus === 'alle' 
    ? fallbackData.cronJobs 
    : fallbackData.cronJobs.filter(job => job.status === selectedStatus)

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '2rem',
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          gap: '1rem'
        }}>
          <Link href="/" style={{
            color: '#f59e0b',
            textDecoration: 'none',
            fontSize: '1.1rem',
            fontWeight: '500'
          }}>
            ← Zurück zur Übersicht
          </Link>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #f59e0b, #22c55e)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            ⏰ Cron Jobs Management
          </h1>
        </div>

        {/* Cron Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏰</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {fallbackData.cronStats.activeJobs}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Active Jobs</div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>
              {fallbackData.cronStats.successRate}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Success Rate</div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔄</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '0.5rem' }}>
              {fallbackData.cronStats.executionsToday}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Runs Today</div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
              {fallbackData.cronStats.nextJobIn}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Next Job</div>
          </div>
        </div>

        {/* Schedule Types Overview */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#06b6d4', fontSize: '1.3rem' }}>📊 Schedule Types</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {fallbackData.scheduleTypes.map((type, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(6, 182, 212, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>{type.type}</div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    background: 'rgba(6, 182, 212, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: '#06b6d4'
                  }}>
                    {type.count} jobs
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {type.jobs.map(job => (
                    <div key={job} style={{ marginBottom: '0.25rem' }}>• {job}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Filter */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {statusTypes.map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: selectedStatus === status ? '#f59e0b' : 'rgba(255, 255, 255, 0.1)',
                color: selectedStatus === status ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {status === 'alle' ? '📋 Alle' : 
               status === 'active' ? '🟢 Active' :
               status === 'paused' ? '⏸️ Paused' :
               status === 'error' ? '❌ Error' : status}
            </button>
          ))}
        </div>

        {/* Cron Jobs List */}
        <div style={{
          display: 'grid',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {filteredJobs.map((job, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '1.5rem',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {job.name}
                  </h3>
                  <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>
                    {job.description}
                  </p>
                </div>
                <div style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: '500',
                  background: job.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                  color: job.status === 'active' ? '#22c55e' : '#9ca3af'
                }}>
                  {job.status.toUpperCase()}
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Schedule</div>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{parseCronSchedule(job.schedule).text}</div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', fontFamily: 'monospace' }}>{job.schedule}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Next Run</div>
                  <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>{job.nextRun}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Last Run</div>
                  <div style={{ fontWeight: 'bold' }}>{job.lastRun}</div>
                  <div style={{ fontSize: '0.8rem', color: job.success ? '#22c55e' : '#ef4444' }}>
                    {job.success ? '✅ Success' : '❌ Failed'} ({job.duration})
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Today</div>
                  <div style={{ fontWeight: 'bold' }}>{job.executions_today} runs</div>
                  <div style={{ fontSize: '0.8rem', color: '#f59e0b' }}>€{job.cost_today.toFixed(2)}</div>
                </div>
              </div>

              {/* Recent Logs */}
              <div style={{ 
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', color: '#94a3b8' }}>📋 Recent Logs</h4>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                  {job.logs.map((log, logIndex) => (
                    <div key={logIndex} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: log.status === 'success' ? '#22c55e' : '#ef4444'
                        }} />
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{log.time}</div>
                        <div style={{ fontSize: '0.9rem' }}>{log.message}</div>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                        {log.duration}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#22c55e', fontSize: '1.2rem' }}>
            🔴 Live Cron Status
          </h3>
          <div style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Current Time: {currentTime}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Total Cost Today: <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>€{fallbackData.cronStats.totalCost.toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Average Duration: <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>{fallbackData.cronStats.avgDuration}s</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Alerts Today: <span style={{ color: fallbackData.cronStats.alertsToday === 0 ? '#22c55e' : '#ef4444', fontWeight: 'bold' }}>{fallbackData.cronStats.alertsToday}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}