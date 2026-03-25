'use client'

import { useState, useEffect } from 'react'
import BackButton from '../../components/BackButton'
import type React from 'react'

interface BotStatus {
  name: string
  emoji: string
  status: 'active' | 'idle' | 'error'
  lastUpdated: string
  details: Record<string, string | number | boolean>
}

interface CronJob {
  name: string
  status: 'enabled' | 'disabled' | 'error'
  lastRun: string
  nextRun: string
  schedule: string
}

interface BotCard {
  emoji: string
  name: string
  status: 'active' | 'idle' | 'error'
  lastUpdated: string
  details: {
    label: string
    value: string
  }[]
}

const STATUS_ICON = {
  active: { emoji: '🟢', label: 'Active', color: '#22c55e' },
  idle: { emoji: '🟡', label: 'Idle', color: '#eab308' },
  error: { emoji: '🔴', label: 'Error', color: '#ef4444' },
}

export default function BotsPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [bots, setBots] = useState<BotCard[]>([])
  const [lastFetch, setLastFetch] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch bot status from API
  const fetchBots = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch('/api/bots')
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Transform API data to BotCard format
      const transformedBots: BotCard[] = data.bots.map((bot: BotStatus) => ({
        emoji: bot.emoji,
        name: bot.name,
        status: bot.status,
        lastUpdated: bot.lastUpdated,
        details: Object.entries(bot.details).map(([label, value]) => ({
          label,
          value: String(value),
        })),
      }))
      
      setBots(transformedBots)
      setLastFetch(new Date().toLocaleTimeString('de-AT', { timeZone: 'Europe/Vienna' }))
    } catch (err) {
      console.error('Failed to fetch bots:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsLoading(false)
    }
  }

  // Update time every second
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  // Fetch bots on mount
  useEffect(() => {
    fetchBots()
  }, [])

  // Auto-refresh bots every 5 seconds
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchBots()
    }, 5000)
    
    return () => clearInterval(refreshInterval)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
          <div style={{ flex: 1 }}>
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
          <button
            onClick={fetchBots}
            disabled={isLoading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              background: isLoading ? 'rgba(255, 255, 255, 0.2)' : 'rgba(34, 197, 94, 0.3)',
              color: '#4ade80',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '0.85rem',
              fontWeight: '600',
              transition: 'all 0.3s ease',
              opacity: isLoading ? 0.6 : 1,
            }}
          >
            {isLoading ? '🔄 Refreshing...' : '🔄 Refresh'}
          </button>
        </div>

        {/* Current Time & Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>Current Time (Vienna)</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#06b6d4' }}>{currentTime}</div>
          </div>
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            flexWrap: 'wrap',
            justifyContent: 'flex-end'
          }}>
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
            <div style={{
              fontSize: '0.75rem',
              color: '#94a3b8',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '0.4rem 0.8rem',
              borderRadius: '6px'
            }}>
              Last fetch: {lastFetch || 'Loading...'}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '2rem',
            color: '#fca5a5'
          }}>
            ⚠️ Error loading bot status: {error}
          </div>
        )}

        {/* Bots Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))',
          gap: '1.5rem'
        }}>
          {bots.length > 0 ? (
            bots.map((bot, index) => {
              const statusInfo = STATUS_ICON[bot.status]
              return (
                <div key={index} style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  transition: 'all 0.3s ease',
                  opacity: isLoading ? 0.7 : 1,
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
                      background: bot.status === 'active' 
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
            })
          ) : (
            <div style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '2rem',
              color: '#94a3b8'
            }}>
              {isLoading ? '⏳ Loading bot status...' : '📭 No bots found'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
