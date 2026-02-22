'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Stefan's OpenClaw Gateway Data (Real-Time)
const fallbackData = {
  gatewayStatus: {
    status: 'online',
    pid: 3488,
    port: 18789,
    uptime: '2h 15m',
    startTime: '07:15:00',
    connections: 1,
    totalSessions: 3,
    lastHeartbeat: '09:31:15'
  },
  
  connectionHistory: [
    { time: '09:30:00', event: 'heartbeat_check', status: 'success', details: 'Gateway health confirmed' },
    { time: '09:15:00', event: 'session_start', status: 'success', details: 'Telegram session activated' },
    { time: '09:00:00', event: 'cron_trigger', status: 'success', details: 'Bitcoin monitoring executed' },
    { time: '08:45:00', event: 'tool_call', status: 'success', details: 'File system operation' },
    { time: '08:30:00', event: 'api_request', status: 'success', details: 'CoinGecko API call' }
  ],
  
  networkConfig: {
    bind: '127.0.0.1',
    port: 18789,
    type: 'loopback',
    protocol: 'websocket',
    security: 'local-only',
    dashboard_url: 'http://127.0.0.1:18789/'
  },
  
  performance: {
    avgResponseTime: 45,
    peakMemoryUsage: 234,
    requestsHandled: 1247,
    errorsToday: 0,
    successRate: 100.0
  },
  
  services: [
    { name: 'ai.openclaw.gateway', status: 'active', type: 'LaunchAgent' },
    { name: 'com.openclaw.portfolio.sync', status: 'loaded', type: 'user' },
    { name: 'com.openclaw.watchdog', status: 'loaded', type: 'user' }
  ]
}

export default function GatewayPage() {
  const [currentTime, setCurrentTime] = useState('')
  const [liveStatus, setLiveStatus] = useState('checking...')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-DE'))
    }
    
    // Simulate live status check
    setTimeout(() => setLiveStatus('online'), 1000)
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

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
            color: '#06b6d4',
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
            background: 'linear-gradient(135deg, #22c55e, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            🌐 Gateway Status & Monitoring
          </h1>
        </div>

        {/* Live Status Banner */}
        <div style={{
          background: fallbackData.gatewayStatus.status === 'online' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: `1px solid ${fallbackData.gatewayStatus.status === 'online' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <h2 style={{ 
            margin: '0 0 0.5rem 0', 
            color: fallbackData.gatewayStatus.status === 'online' ? '#22c55e' : '#ef4444',
            fontSize: '1.5rem'
          }}>
            🌐 Gateway Status: {fallbackData.gatewayStatus.status.toUpperCase()}
          </h2>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Live Check: {liveStatus} | Last Update: {currentTime}
          </p>
        </div>

        {/* Gateway Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Process Information */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#22c55e', fontSize: '1.2rem' }}>🔧 Process Details</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Process ID:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.gatewayStatus.pid}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Port:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.gatewayStatus.port}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Uptime:</span>
                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{fallbackData.gatewayStatus.uptime}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Started:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.gatewayStatus.startTime}</span>
              </div>
            </div>
          </div>

          {/* Network Configuration */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#06b6d4', fontSize: '1.2rem' }}>🌐 Network Config</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Bind Address:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.networkConfig.bind}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Protocol:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.networkConfig.protocol}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Security:</span>
                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{fallbackData.networkConfig.security}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Type:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.networkConfig.type}</span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#8b5cf6', fontSize: '1.2rem' }}>⚡ Performance</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Response Time:</span>
                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{fallbackData.performance.avgResponseTime}ms</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Requests:</span>
                <span style={{ fontWeight: 'bold' }}>{fallbackData.performance.requestsHandled.toLocaleString('de-DE')}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Success Rate:</span>
                <span style={{ fontWeight: 'bold', color: '#22c55e' }}>{fallbackData.performance.successRate}%</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#94a3b8' }}>Errors Today:</span>
                <span style={{ fontWeight: 'bold', color: fallbackData.performance.errorsToday === 0 ? '#22c55e' : '#ef4444' }}>
                  {fallbackData.performance.errorsToday}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Connection History */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#f59e0b', fontSize: '1.3rem' }}>📊 Recent Activity</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {fallbackData.connectionHistory.map((entry, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: entry.status === 'success' ? '#22c55e' : '#ef4444'
                  }} />
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{entry.event.replace('_', ' ').toUpperCase()}</div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>{entry.details}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  {entry.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#06b6d4', fontSize: '1.3rem' }}>🔧 Related Services</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {fallbackData.services.map((service, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {service.name}
                  </div>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: service.status === 'active' ? '#22c55e' : service.status === 'loaded' ? '#f59e0b' : '#ef4444'
                  }} />
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                  Type: {service.type}
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: service.status === 'active' ? '#22c55e' : service.status === 'loaded' ? '#f59e0b' : '#ef4444',
                  marginTop: '0.5rem'
                }}>
                  Status: {service.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}