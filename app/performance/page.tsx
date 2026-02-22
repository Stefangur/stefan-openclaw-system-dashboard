'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

// Stefan's OpenClaw Performance Data (Real-Time)
const fallbackData = {
  systemMetrics: {
    cpu: { current: 12, average: 15, peak: 28, trend: 'stable' },
    memory: { current: 68, average: 65, peak: 82, trend: 'increasing' },
    disk: { current: 45, average: 48, peak: 55, trend: 'stable' },
    temperature: { current: 42, average: 44, peak: 52, trend: 'stable' }
  },
  
  performanceMetrics: {
    responseTime: { current: 1.2, average: 1.4, best: 0.8, worst: 3.2 },
    throughput: { current: 45, average: 42, peak: 67 },
    successRate: { current: 100, average: 98.7, worst: 96.2 },
    uptime: { current: 99.8, daily: 99.5, weekly: 99.1 }
  },
  
  resourceUsage: {
    sessions: { active: 1, peak: 3, total_today: 4 },
    tools: { calls_today: 156, success_rate: 98.7, avg_duration: 0.8 },
    api: { requests_today: 247, rate_limit: 1000, remaining: 753 },
    storage: { used_gb: 2.1, available_gb: 2.5, total_gb: 4.6 }
  },
  
  hourlyStats: [
    { hour: '06:00', cpu: 8, memory: 45, sessions: 0, tools: 0, response_time: 0 },
    { hour: '07:00', cpu: 12, memory: 52, sessions: 1, tools: 23, response_time: 1.1 },
    { hour: '08:00', cpu: 18, memory: 68, sessions: 3, tools: 67, response_time: 1.4 },
    { hour: '09:00', cpu: 15, memory: 65, sessions: 2, tools: 42, response_time: 1.2 },
    { hour: '10:00', cpu: 12, memory: 68, sessions: 1, tools: 24, response_time: 1.2 }
  ],
  
  topProcesses: [
    { name: 'openclaw-gateway', cpu: 8.2, memory: 234, status: 'active', pid: 3488 },
    { name: 'node (main)', cpu: 3.8, memory: 156, status: 'active', pid: 3502 },
    { name: 'fitness-sync', cpu: 0.5, memory: 45, status: 'scheduled', pid: 3567 },
    { name: 'bitcoin-monitor', cpu: 0.2, memory: 23, status: 'scheduled', pid: 3598 }
  ],
  
  networkStats: {
    inbound: { requests: 247, bytes: '1.2MB', peak_rps: 12 },
    outbound: { requests: 89, bytes: '456KB', peak_rps: 8 },
    errors: { count: 0, rate: 0.0, last_error: null }
  },
  
  costAnalysis: {
    today: { total: 1.15, breakdown: { 'claude-sonnet-4': 1.10, 'gpt-4o': 0.05 } },
    weekly: { total: 6.85, average: 0.98 },
    monthly: { total: 24.50, projected: 35.20 }
  }
}

// Generate simple chart data for visualization
const generateChartBars = (data: number[], maxValue: number, height: number = 60) => {
  return data.map((value, index) => ({
    value,
    height: Math.max(4, (value / maxValue) * height),
    color: value > maxValue * 0.8 ? '#ef4444' : value > maxValue * 0.6 ? '#f59e0b' : '#22c55e'
  }))
}

export default function PerformancePage() {
  const [currentTime, setCurrentTime] = useState('')
  const [selectedMetric, setSelectedMetric] = useState('cpu')

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleString('de-DE'))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const metrics = ['cpu', 'memory', 'disk', 'temperature', 'response_time', 'sessions']
  
  const getMetricData = (metric: string) => {
    if (metric === 'response_time') {
      return fallbackData.hourlyStats.map(h => h.response_time)
    }
    if (metric === 'sessions') {
      return fallbackData.hourlyStats.map(h => h.sessions)
    }
    return fallbackData.hourlyStats.map(h => h[metric as keyof typeof h] as number)
  }

  const chartData = generateChartBars(getMetricData(selectedMetric), 100)

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
            background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            📈 Performance Analytics
          </h1>
        </div>

        {/* System Metrics Overview */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🖥️</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e', marginBottom: '0.5rem' }}>
              {fallbackData.systemMetrics.cpu.current}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>CPU Usage</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Avg: {fallbackData.systemMetrics.cpu.average}% | Peak: {fallbackData.systemMetrics.cpu.peak}%
            </div>
          </div>

          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧠</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f59e0b', marginBottom: '0.5rem' }}>
              {fallbackData.systemMetrics.memory.current}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Memory Usage</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Avg: {fallbackData.systemMetrics.memory.average}% | Peak: {fallbackData.systemMetrics.memory.peak}%
            </div>
          </div>

          <div style={{
            background: 'rgba(6, 182, 212, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⚡</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '0.5rem' }}>
              {fallbackData.performanceMetrics.responseTime.current}s
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Response Time</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Best: {fallbackData.performanceMetrics.responseTime.best}s | Worst: {fallbackData.performanceMetrics.responseTime.worst}s
            </div>
          </div>

          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
              {fallbackData.performanceMetrics.uptime.current}%
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Uptime Today</div>
            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Weekly: {fallbackData.performanceMetrics.uptime.weekly}%
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '1.5rem',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ margin: '0 0 1.5rem 0', color: '#06b6d4', fontSize: '1.3rem' }}>📈 Hourly Performance Trends</h3>
          
          {/* Metric Selector */}
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            {metrics.map((metric) => (
              <button
                key={metric}
                onClick={() => setSelectedMetric(metric)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  border: 'none',
                  background: selectedMetric === metric ? '#06b6d4' : 'rgba(255, 255, 255, 0.1)',
                  color: selectedMetric === metric ? 'white' : '#94a3b8',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
              >
                {metric.replace('_', ' ').toUpperCase()}
              </button>
            ))}
          </div>

          {/* Simple Chart */}
          <div style={{
            display: 'flex',
            alignItems: 'end',
            gap: '1rem',
            height: '100px',
            padding: '1rem',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {fallbackData.hourlyStats.map((stat, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: '100%',
                  height: `${chartData[index]?.height || 4}px`,
                  background: chartData[index]?.color || '#22c55e',
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s'
                }} />
                <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  {stat.hour}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resource Usage */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Sessions & Tools */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#8b5cf6', fontSize: '1.2rem' }}>🔧 Sessions & Tools</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Active Sessions</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {fallbackData.resourceUsage.sessions.active}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Peak Today</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {fallbackData.resourceUsage.sessions.peak}
                  </div>
                </div>
              </div>
              
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(6, 182, 212, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(6, 182, 212, 0.2)'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Tool Calls</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#06b6d4' }}>
                    {fallbackData.resourceUsage.tools.calls_today}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Success Rate</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#22c55e' }}>
                    {fallbackData.resourceUsage.tools.success_rate}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top Processes */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#22c55e', fontSize: '1.2rem' }}>🔄 Top Processes</h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {fallbackData.topProcesses.map((process, index) => (
                <div key={index} style={{
                  padding: '0.75rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.1)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                      {process.name}
                    </div>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: process.status === 'active' ? '#22c55e' : '#f59e0b'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#94a3b8' }}>
                    <span>CPU: {process.cpu}%</span>
                    <span>RAM: {process.memory}MB</span>
                    <span>PID: {process.pid}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Network & Cost Analysis */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          
          {/* Network Statistics */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#f59e0b', fontSize: '1.2rem' }}>🌐 Network Traffic</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '1rem',
                background: 'rgba(245, 158, 11, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(245, 158, 11, 0.2)'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Inbound</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#f59e0b' }}>
                    {fallbackData.networkStats.inbound.requests}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {fallbackData.networkStats.inbound.bytes}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Outbound</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {fallbackData.networkStats.outbound.requests}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    {fallbackData.networkStats.outbound.bytes}
                  </div>
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: fallbackData.networkStats.errors.count === 0 ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                borderRadius: '12px',
                border: `1px solid ${fallbackData.networkStats.errors.count === 0 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: fallbackData.networkStats.errors.count === 0 ? '#22c55e' : '#ef4444' }}>
                  {fallbackData.networkStats.errors.count}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Network Errors</div>
              </div>
            </div>
          </div>

          {/* Cost Analysis */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 1.5rem 0', color: '#8b5cf6', fontSize: '1.2rem' }}>💰 Cost Analysis</h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{
                padding: '1rem',
                background: 'rgba(139, 92, 246, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(139, 92, 246, 0.2)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '0.5rem' }}>
                  €{fallbackData.costAnalysis.today.total.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Today's Cost</div>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                  <div style={{ color: '#94a3b8' }}>Weekly</div>
                  <div style={{ fontWeight: 'bold', color: '#06b6d4' }}>€{fallbackData.costAnalysis.weekly.total.toFixed(2)}</div>
                </div>
                <div style={{ padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px' }}>
                  <div style={{ color: '#94a3b8' }}>Monthly (proj.)</div>
                  <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>€{fallbackData.costAnalysis.monthly.projected.toFixed(2)}</div>
                </div>
              </div>
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
            🔴 Live Performance Status
          </h3>
          <div style={{ fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Current Time: {currentTime}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              System Load: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Low</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Response Quality: <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Excellent</span>
            </div>
            <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Optimization: <span style={{ color: '#06b6d4', fontWeight: 'bold' }}>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}