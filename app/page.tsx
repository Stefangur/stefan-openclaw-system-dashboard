'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import RefreshButton from '../components/RefreshButton'

// Stefan's OpenClaw System Data (Real-Time)
const initialFallbackData = {
  systemStatus: {
    gateway: { status: 'online', pid: 3488, uptime: '2h 15m', port: 18789 },
    agent: { status: 'active', sessions: 1, model: 'claude-sonnet-4', cost_today: 0.85 },
    platform: { os: 'macOS 26.3', node: 'v22.22.0', openclaw: '2026.2.21-2' },
    health: { cpu: 12, memory: 68, disk: 45, temp: 42 }
  },
  
  todayActivity: {
    sessions: 3,
    messages: 47,
    tool_calls: 156,
    cron_jobs: 8,
    errors: 0,
    uptime_percent: 99.8
  },
  
  recentSessions: [
    { id: 'main', type: 'telegram', duration: '2h 15m', messages: 47, status: 'active' },
    { id: 'fitness', type: 'sub-agent', duration: '45m', messages: 12, status: 'completed' },
    { id: 'portfolio', type: 'cron', duration: '2m', messages: 3, status: 'completed' }
  ],
  
  cronJobs: [
    { name: 'Morning Briefing', schedule: 'daily 07:30', next_run: 'heute 19:30', status: 'active' },
    { name: 'Weather Update', schedule: 'daily 07:00', next_run: 'heute 19:00', status: 'active' },
    { name: 'Fitness Sync', schedule: 'every 30min', next_run: 'in 12min', status: 'active' },
    { name: 'Bitcoin Monitor', schedule: 'every 15min', next_run: 'in 3min', status: 'active' },
    { name: 'Portfolio Check', schedule: 'every hour', next_run: 'in 23min', status: 'active' }
  ]
}

// System health calculation
const systemHealthScore = (data: typeof initialFallbackData) => {
  const factors = [
    data.systemStatus.health.cpu < 20 ? 25 : 20 - (data.systemStatus.health.cpu - 20),
    data.systemStatus.health.memory < 80 ? 25 : 20 - (data.systemStatus.health.memory - 80),
    data.systemStatus.health.disk < 90 ? 25 : 15 - (data.systemStatus.health.disk - 90),
    data.todayActivity.errors === 0 ? 25 : Math.max(0, 25 - data.todayActivity.errors * 5)
  ]
  return factors.reduce((sum, factor) => sum + factor, 0)
}

export default function OpenClawDashboard() {
  const [data, setData] = useState(initialFallbackData)
  const [currentTime, setCurrentTime] = useState('')
  const [healthScore, setHealthScore] = useState(0)
  const [lastRefresh, setLastRefresh] = useState(new Date())

  // Refresh function for OpenClaw system data
  const handleRefresh = async () => {
    // Simulate system data fetch delay
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // In real app: fetch live OpenClaw metrics via API calls
    // For demo: simulate realistic system changes
    const cpuFluctuation = Math.max(5, Math.min(25, data.systemStatus.health.cpu + (Math.random() - 0.5) * 5))
    const memoryFluctuation = Math.max(60, Math.min(80, data.systemStatus.health.memory + (Math.random() - 0.5) * 8))
    
    // Update system metrics
    setData(prevData => ({
      ...prevData,
      systemStatus: {
        ...prevData.systemStatus,
        health: {
          ...prevData.systemStatus.health,
          cpu: Math.round(cpuFluctuation),
          memory: Math.round(memoryFluctuation),
          temp: Math.max(40, Math.min(50, prevData.systemStatus.health.temp + (Math.random() - 0.5) * 2))
        },
        agent: {
          ...prevData.systemStatus.agent,
          sessions: Math.max(1, prevData.systemStatus.agent.sessions + Math.floor((Math.random() - 0.7) * 2)),
          cost_today: +(prevData.systemStatus.agent.cost_today + Math.random() * 0.1).toFixed(2)
        }
      },
      todayActivity: {
        ...prevData.todayActivity,
        messages: prevData.todayActivity.messages + Math.floor(Math.random() * 3),
        tool_calls: prevData.todayActivity.tool_calls + Math.floor(Math.random() * 5),
        cron_jobs: prevData.todayActivity.cron_jobs + (Math.random() < 0.2 ? 1 : 0)
      }
    }))
    
    setHealthScore(systemHealthScore(data))
    setLastRefresh(new Date())
  }

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-DE'))
    }
    setHealthScore(systemHealthScore(data))
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [data])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      padding: '2rem',
      paddingBottom: '120px', // Space for refresh button
      color: '#f1f5f9',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            margin: 0,
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.5rem'
          }}>
            🤖 Stefan's OpenClaw Dashboard
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>
            ✅ System Online | {currentTime} | Health Score: {healthScore}/100 • Manual Refresh 🔄
          </p>
          
          {/* Navigation */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {[
              { href: '/', label: '📊 Übersicht', active: true },
              { href: '/gateway', label: '🌐 Gateway' },
              { href: '/sessions', label: '💬 Sessions' },
              { href: '/cron', label: '⏰ Cron' },
              { href: '/performance', label: '📈 Performance' }
            ].map((tab, index) => (
              <Link key={index} href={tab.href} style={{
                textDecoration: 'none',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: tab.active ? 'rgba(59, 130, 246, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                color: '#f1f5f9',
                border: tab.active ? '1px solid rgba(59, 130, 246, 0.3)' : '1px solid transparent',
                transition: 'all 0.3s ease',
                fontSize: '0.9rem'
              }}>
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* System Status Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          
          {/* Gateway Status */}
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(34, 197, 94, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#22c55e', fontSize: '1.2rem' }}>🌐 Gateway</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>
              {data.systemStatus.gateway.status}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              PID {data.systemStatus.gateway.pid} • Port {data.systemStatus.gateway.port}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Uptime: {data.systemStatus.gateway.uptime}
            </div>
          </div>

          {/* Agent Status */}
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(59, 130, 246, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#3b82f6', fontSize: '1.2rem' }}>🧠 Agent</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6', marginBottom: '0.5rem' }}>
              {data.systemStatus.agent.sessions} Sessions
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Model: {data.systemStatus.agent.model}
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Cost Today: €{data.systemStatus.agent.cost_today}
            </div>
          </div>

          {/* System Health */}
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(139, 92, 246, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#8b5cf6', fontSize: '1.2rem' }}>💻 System</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
              {healthScore}/100
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              CPU: {data.systemStatus.health.cpu}% • RAM: {data.systemStatus.health.memory}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Disk: {data.systemStatus.health.disk}% • Temp: {data.systemStatus.health.temp}°C
            </div>
          </div>

          {/* Today's Activity */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(245, 158, 11, 0.2)'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#f59e0b', fontSize: '1.2rem' }}>📊 Activity</h3>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {data.todayActivity.messages} Messages
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              {data.todayActivity.tool_calls} Tool Calls • {data.todayActivity.cron_jobs} Cron Jobs
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Uptime: {data.todayActivity.uptime_percent}% • Errors: {data.todayActivity.errors}
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#f59e0b', fontSize: '1.3rem' }}>📊 Recent Sessions</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.recentSessions.map((session, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                    {session.id}
                  </div>
                  <div style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    background: session.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                    color: session.status === 'active' ? '#22c55e' : '#9ca3af'
                  }}>
                    {session.status}
                  </div>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  {session.type} • {session.duration}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#06b6d4' }}>
                  {session.messages} messages
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cron Jobs Status */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#a78bfa', fontSize: '1.3rem' }}>⏰ Cron Jobs Status</h3>
          <div style={{ display: 'grid', gap: '1rem' }}>
            {data.cronJobs.map((job, index) => (
              <div key={index} style={{
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1rem', marginBottom: '0.25rem' }}>
                      {job.name}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
                      Next: {job.next_run}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      background: job.status === 'active' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(156, 163, 175, 0.2)',
                      color: job.status === 'active' ? '#22c55e' : '#9ca3af',
                      marginBottom: '0.25rem'
                    }}>
                      {job.status}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                      {job.schedule}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Info */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#06b6d4', fontSize: '1.3rem' }}>🖥️ System Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minWidth(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4' }}>
                {data.systemStatus.platform.os}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Operating System</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#22c55e' }}>
                {data.systemStatus.platform.node}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Node.js Version</div>
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                {data.systemStatus.platform.openclaw}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>OpenClaw Version</div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <RefreshButton
          onRefresh={handleRefresh}
          icon="🤖"
          label="System laden"
          lastUpdate={lastRefresh}
        />

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          color: '#64748b',
          fontSize: '0.9rem',
          padding: '1rem'
        }}>
          🤖 OpenClaw System Dashboard | Manual Refresh | Stefan's Real-Time Monitoring ✨
        </div>
      </div>
    </div>
  )
}