'use client'

import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton'
import type React from 'react'

interface BotCard {
  emoji: string
  name: string
  status: 'online' | 'idle' | 'error'
  lastUpdated: string
  details: {
    label: string
    value: string
  }[]
}

const BOTS_DATA: BotCard[] = [
  {
    emoji: '🔧',
    name: 'Butler',
    status: 'online',
    lastUpdated: '2 minutes ago',
    details: [
      { label: 'Last Action', value: 'Dashboard update' },
      { label: 'Status', value: 'Running' },
    ]
  },
  {
    emoji: '👨‍💻',
    name: 'Developer',
    status: 'online',
    lastUpdated: '5 minutes ago',
    details: [
      { label: 'Last Commit', value: 'Update cron page' },
      { label: 'Repository', value: 'stefan-openclaw-system-dashboard' },
      { label: 'Deployed', value: '✅ Live' },
    ]
  },
  {
    emoji: '🧪',
    name: 'Tester',
    status: 'idle',
    lastUpdated: 'Today, 11:45 AM',
    details: [
      { label: 'Last Test', value: 'Fitness Dashboard' },
      { label: 'Results', value: '✅ Passed (24/24)' },
      { label: 'Status', value: 'Ready' },
    ]
  },
  {
    emoji: '📈',
    name: 'Trader',
    status: 'online',
    lastUpdated: '12 minutes ago',
    details: [
      { label: 'Last Report', value: 'Morning briefing' },
      { label: 'Next Scheduled', value: '12:00 Vienna' },
      { label: 'Symbol', value: 'BTC, AEM, BNP' },
    ]
  },
  {
    emoji: '🏋️',
    name: 'Trainer',
    status: 'idle',
    lastUpdated: 'Today, 10:30 AM',
    details: [
      { label: 'Last Report', value: 'Fitness metrics' },
      { label: 'Metrics Updated', value: '2 hours ago' },
      { label: 'Status', value: 'Synced' },
    ]
  },
]

const STATUS_ICON = {
  online: { emoji: '🟢', label: 'Online', color: '#22c55e' },
  idle: { emoji: '🟡', label: 'Idle', color: '#eab308' },
  error: { emoji: '🔴', label: 'Error', color: '#ef4444' },
}

export default function BotsPage() {
  const [currentTime, setCurrentTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
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
              🤖 Bots
            </h1>
            <p style={{ margin: '0.5rem 0 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
              Stefan's AI Agent Network
            </p>
          </div>
        </div>

        {/* Current Time */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Current Time (Vienna)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#06b6d4' }}>{currentTime}</div>
          </div>
          <div style={{
            padding: '0.35rem 0.75rem',
            borderRadius: '999px',
            fontSize: '0.8rem',
            fontWeight: '600',
            background: 'rgba(34, 197, 94, 0.2)',
            color: '#4ade80'
          }}>
            🟢 System Online
          </div>
        </div>

        {/* Bots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '1.5rem'
        }}>
          {BOTS_DATA.map((bot, index) => {
            const statusInfo = STATUS_ICON[bot.status]
            return (
              <div key={index} style={{
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem'
              }}>
                {/* Bot Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem'
                }}>
                  <div>
                    <div style={{
                      fontSize: '1.4rem',
                      marginBottom: '0.5rem'
                    }}>
                      {bot.emoji}
                    </div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.3rem',
                      fontWeight: 'bold',
                      color: '#f1f5f9'
                    }}>
                      {bot.name}
                    </h2>
                    <p style={{
                      margin: '0.5rem 0 0 0',
                      fontSize: '0.8rem',
                      color: '#94a3b8'
                    }}>
                      Last: {bot.lastUpdated}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <span style={{
                    display: 'inline-block',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '999px',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    background: bot.status === 'online' 
                      ? 'rgba(34, 197, 94, 0.2)' 
                      : bot.status === 'idle'
                      ? 'rgba(234, 179, 8, 0.2)'
                      : 'rgba(239, 68, 68, 0.2)',
                    color: statusInfo.color,
                    whiteSpace: 'nowrap'
                  }}>
                    {statusInfo.emoji} {statusInfo.label}
                  </span>
                </div>

                {/* Details */}
                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1rem',
                  display: 'grid',
                  gap: '0.75rem'
                }}>
                  {bot.details.map((detail, detailIndex) => (
                    <div key={detailIndex}>
                      <div style={{
                        fontSize: '0.7rem',
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        marginBottom: '0.25rem'
                      }}>
                        {detail.label}
                      </div>
                      <div style={{
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#f1f5f9'
                      }}>
                        {detail.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
