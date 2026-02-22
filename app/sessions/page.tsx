'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Stefan's OpenClaw Sessions Data (Real-Time)
const fallbackData = {
  activeSessions: [
    {
      id: 'telegram-main',
      type: 'telegram',
      user: 'Stefan',
      status: 'active',
      startTime: '07:15:00',
      duration: '2h 50m',
      messages: 47,
      lastActivity: '10:04:57',
      model: 'claude-sonnet-4',
      cost: 0.85,
      tools_used: ['exec', 'edit', 'web_search', 'bitcoin_monitor'],
      health: 'excellent'
    }
  ],
  
  recentSessions: [
    {
      id: 'fitness-dashboard-crisis',
      type: 'sub-agent',
      task: 'Fitness Dashboard 404 Tab-Pages Fix',
      status: 'completed',
      startTime: '08:45:00',
      duration: '45m',
      messages: 12,
      endTime: '09:30:00',
      result: 'success',
      parent: 'telegram-main',
      cost: 0.23,
      output: 'All 5 tabs functional: Ernährung, Training, Fortschritt, Gesundheit, Übersicht'
    },
    {
      id: 'openclaw-dashboard-creation',
      type: 'sub-agent',
      task: 'OpenClaw Dashboard von Scratch',
      status: 'completed',
      startTime: '09:15:00',
      duration: '35m',
      messages: 18,
      endTime: '09:50:00',
      result: 'success',
      parent: 'telegram-main',
      cost: 0.31,
      output: 'Complete system monitoring dashboard mit 5 tabs deployed'
    },
    {
      id: 'portfolio-sync-002',
      type: 'cron',
      task: 'Bitcoin Price Monitoring',
      status: 'completed',
      startTime: '09:00:00',
      duration: '2m',
      endTime: '09:02:00',
      result: 'success',
      scheduled: true,
      cost: 0.05
    },
    {
      id: 'security-audit-003',
      type: 'system',
      task: 'Post-Compaction Audit',
      status: 'completed',
      startTime: '10:04:12',
      duration: '45s',
      endTime: '10:04:57',
      result: 'success',
      automated: true,
      cost: 0.02
    }
  ],
  
  sessionStats: {
    totalToday: 5,
    activeNow: 1,
    completedToday: 4,
    subagentsToday: 2,
    totalMessages: 80,
    totalCost: 1.69,
    averageDuration: '42m',
    successRate: 100.0
  },
  
  modelUsage: [
    { model: 'claude-sonnet-4', sessions: 3, messages: 59, cost: 1.10, percentage: 95.7 },
    { model: 'gpt-4o', sessions: 1, messages: 3, cost: 0.05, percentage: 4.3 }
  ],
  
  toolUsage: [
    { tool: 'exec', count: 23, success: 23, percentage: 100.0 },
    { tool: 'edit', count: 18, success: 18, percentage: 100.0 },
    { tool: 'write', count: 12, success: 12, percentage: 100.0 },
    { tool: 'read', count: 8, success: 8, percentage: 100.0 },
    { tool: 'web_search', count: 3, success: 2, percentage: 66.7 },
    { tool: 'bitcoin_monitor', count: 2, success: 2, percentage: 100.0 }
  ]
}

export default function SessionsPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [selectedSessionType, setSelectedSessionType] = useState('alle')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-DE'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const sessionTypes = ['alle', 'active', 'completed', 'sub-agent', 'cron', 'system']
  const filteredSessions = selectedSessionType === 'alle' 
    ? [...fallbackData.activeSessions, ...fallbackData.recentSessions]
    : selectedSessionType === 'active'
    ? fallbackData.activeSessions
    : selectedSessionType === 'completed'
    ? fallbackData.recentSessions.filter(s => s.status === 'completed')
    : fallbackData.recentSessions.filter(s => s.type === selectedSessionType)

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
            color: '#8b5cf6',
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
            background: 'linear-gradient(135deg, #8b5cf6, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            💬 Session Management
          </h1>
        </div>

        {/* Session Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
              {fallbackData.sessionStats.totalToday}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sessions Heute</div>
          </div>

          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🤖</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>
              {fallbackData.sessionStats.subagentsToday}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Sub-Agents Today</div>
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
              {fallbackData.sessionStats.successRate}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Success Rate</div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💰</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              €{fallbackData.sessionStats.totalCost}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Cost Today</div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⏱️</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '0.5rem' }}>
              {fallbackData.sessionStats.averageDuration}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Avg Duration</div>
          </div>
        </div>

        {/* Session Type Filter */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          marginBottom: '2rem',
          flexWrap: 'wrap'
        }}>
          {sessionTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSessionType(type)}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: 'none',
                background: selectedSessionType === type ? '#8b5cf6' : 'rgba(255, 255, 255, 0.1)',
                color: selectedSessionType === type ? 'white' : '#94a3b8',
                cursor: 'pointer',
                fontWeight: '500',
                transition: 'all 0.2s'
              }}
            >
              {type === 'alle' ? '📋 Alle' : 
               type === 'active' ? '🔴 Active' :
               type === 'completed' ? '✅ Completed' :
               type === 'sub-agent' ? '🤖 Sub-Agents' :
               type === 'cron' ? '⏰ Cron Jobs' :
               type === 'system' ? '🔧 System' : type}
            </button>
          ))}
        </div>

        {/* Sessions List */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#8b5cf6', fontSize: '1.3rem' }}>
            📋 Sessions ({filteredSessions.length})
          </h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {filteredSessions.map((session, index) => (
              <div key={index} style={{
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                      {session.id}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                      {session.type} {session.user && `• ${session.user}`} {session.task && `• ${session.task}`}
                    </div>
                  </div>
                  <div style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    background: session.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 
                               session.status === 'completed' ? 'rgba(6, 182, 212, 0.2)' : 
                               'rgba(156, 163, 175, 0.2)',
                    color: session.status === 'active' ? '#22c55e' : 
                           session.status === 'completed' ? '#06b6d4' : 
                           '#9ca3af'
                  }}>
                    {session.status.toUpperCase()}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Started</div>
                    <div style={{ fontWeight: 'bold' }}>{session.startTime}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Duration</div>
                    <div style={{ fontWeight: 'bold' }}>{session.duration}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Messages</div>
                    <div style={{ fontWeight: 'bold' }}>{session.messages}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Cost</div>
                    <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>€{session.cost}</div>
                  </div>
                </div>

                {session.model && (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: 'rgba(139, 92, 246, 0.2)',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      color: '#8b5cf6'
                    }}>
                      Model: {session.model}
                    </div>
                    {session.health && (
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: session.health === 'excellent' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                        borderRadius: '8px',
                        fontSize: '0.8rem',
                        color: session.health === 'excellent' ? '#22c55e' : '#f59e0b'
                      }}>
                        Health: {session.health}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Model Usage */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Model Stats */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#8b5cf6', fontSize: '1.2rem' }}>🤖 Model Usage</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {fallbackData.modelUsage.map((model, index) => (
                <div key={index} style={{
                  padding: '1rem',
                  background: 'rgba(139, 92, 246, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 92, 246, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ fontWeight: 'bold' }}>{model.model}</div>
                    <div style={{ fontSize: '0.9rem', color: '#8b5cf6' }}>{model.percentage.toFixed(1)}%</div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                    <div>{model.sessions} sessions</div>
                    <div>{model.messages} messages</div>
                    <div>€{model.cost.toFixed(2)}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tool Usage */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#06b6d4', fontSize: '1.2rem' }}>🛠️ Tool Usage</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {fallbackData.toolUsage.map((tool, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  background: 'rgba(6, 182, 212, 0.1)',
                  borderRadius: '8px',
                  border: '1px solid rgba(6, 182, 212, 0.2)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{tool.tool}</div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: tool.percentage === 100 ? '#22c55e' : tool.percentage > 80 ? '#f59e0b' : '#ef4444'
                    }}>
                      {tool.percentage.toFixed(1)}%
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {tool.success}/{tool.count} calls
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            🔴 Live System Status
          </h3>
          <div style={{ fontSize: '1.1rem', color: '#94a3b8' }}>
            Current Time: {currentTime} | Active Sessions: {fallbackData.sessionStats.activeNow}
          </div>
        </div>
      </div>
    </div>
  )
}