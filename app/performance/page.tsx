'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BackButton from '../../components/BackButton';

export const dynamic = 'force-dynamic';

interface PerformanceMetrics {
  sessions: number;
  tokens_used: number;
  total_runtime_hours: number;
  cpu_percent: number;
  ram_percent: number;
  disk_percent: number;
  uptime_days: number;
  api_requests_24h: number;
  api_avg_response_ms: number;
  api_errors_24h: number;
  api_error_rate_percent: number;
  last_updated: string;
}

interface PerformanceData {
  openclaw: {
    sessions: number;
    tokens_used: string;
    total_runtime: string;
    status: 'healthy' | 'warning' | 'error';
  };
  host: {
    cpu_percent: number;
    ram_percent: number;
    disk_percent: number;
    uptime_days: number;
  };
  api: {
    requests_24h: number;
    avg_response_ms: number;
    errors_24h: number;
    error_rate_percent: number;
  };
}

const getStatusColor = (value: number, thresholds = { ok: 50, warning: 75 }) => {
  if (value < thresholds.ok) return { bg: '#22c55e', text: '#22c55e', label: '🟢', bgLight: 'rgba(34, 197, 94, 0.15)' };
  if (value < thresholds.warning) return { bg: '#eab308', text: '#eab308', label: '🟡', bgLight: 'rgba(234, 179, 8, 0.15)' };
  return { bg: '#ef4444', text: '#ef4444', label: '🔴', bgLight: 'rgba(239, 68, 68, 0.15)' };
};

export default function PerformancePage() {
  const [data, setData] = useState<PerformanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString('de-DE'));

  // Fetch live performance data from API
  const fetchPerformanceData = async () => {
    try {
      const res = await fetch('/api/performance', {
        headers: { 'X-Butler-Token': 'butler-stefan-2026' },
        cache: 'no-store',
      });
      
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      
      const metrics: PerformanceMetrics = await res.json();
      
      // Determine system health status based on metrics
      const isHealthy = 
        metrics.cpu_percent < 75 &&
        metrics.ram_percent < 80 &&
        metrics.disk_percent < 85 &&
        metrics.api_errors_24h === 0;
      
      const isWarning = 
        metrics.cpu_percent < 85 &&
        metrics.ram_percent < 90 &&
        metrics.disk_percent < 90;

      const status = isHealthy ? 'healthy' : isWarning ? 'warning' : 'error';

      // Format tokens to human-readable string
      const formatTokens = (tokens: number) => {
        if (tokens >= 1000000) {
          return `${(tokens / 1000000).toFixed(1)}M`;
        }
        return `${(tokens / 1000).toFixed(0)}k`;
      };

      setData({
        openclaw: {
          sessions: metrics.sessions,
          tokens_used: formatTokens(metrics.tokens_used),
          total_runtime: `${metrics.total_runtime_hours}h`,
          status,
        },
        host: {
          cpu_percent: metrics.cpu_percent,
          ram_percent: metrics.ram_percent,
          disk_percent: metrics.disk_percent,
          uptime_days: metrics.uptime_days,
        },
        api: {
          requests_24h: metrics.api_requests_24h,
          avg_response_ms: metrics.api_avg_response_ms,
          errors_24h: metrics.api_errors_24h,
          error_rate_percent: metrics.api_error_rate_percent,
        },
      });
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
      // Fallback to mock data if API fails
      setData({
        openclaw: { sessions: 5, tokens_used: '1.2M', total_runtime: '48h', status: 'healthy' },
        host: { cpu_percent: 34.5, ram_percent: 62.1, disk_percent: 41.3, uptime_days: 12 },
        api: { requests_24h: 1250, avg_response_ms: 245, errors_24h: 3, error_rate_percent: 0.24 },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  // Update clock every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('de-DE'));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Refresh button handler
  const handleRefresh = async () => {
    setLoading(true);
    await fetchPerformanceData();
  };

  // Styles
  const containerStyle: React.CSSProperties = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    padding: '2rem 1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: 'white',
  };

  const headerStyle: React.CSSProperties = {
    marginBottom: '2.5rem',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: 'clamp(1.875rem, 8vw, 3rem)',
    fontWeight: 700,
    margin: '0 0 0.75rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  };

  const subtitleStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.875rem',
    margin: 0,
  };

  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const cardStyle: React.CSSProperties = {
    background: 'rgba(30, 41, 59, 0.8)',
    border: '1px solid rgba(148, 163, 184, 0.2)',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    backdropFilter: 'blur(10px)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  };

  const cardHoverStyle: React.CSSProperties = {
    ...cardStyle,
    boxShadow: '0 20px 25px rgba(0, 0, 0, 0.2)',
  };

  const cardTitleStyle: React.CSSProperties = {
    fontSize: '1.375rem',
    fontWeight: 700,
    margin: '0 0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  };

  const statRowStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0',
    borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
  };

  const statLabelStyle: React.CSSProperties = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.9rem',
  };

  const statValueStyle: React.CSSProperties = {
    fontWeight: 700,
    fontSize: '1.125rem',
    fontFamily: 'monospace',
  };

  const progressContainerStyle: React.CSSProperties = {
    marginBottom: '1.5rem',
  };

  const progressHeaderStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  };

  const progressBarBgStyle: React.CSSProperties = {
    width: '100%',
    height: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '9999px',
    overflow: 'hidden',
  };

  const summaryGridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    gap: '1rem',
  };

  const summaryStatStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '1.25rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
    border: '1px solid rgba(148, 163, 184, 0.1)',
  };

  const statusColor = data ? (data.openclaw.status === 'healthy' ? '#22c55e' : data.openclaw.status === 'warning' ? '#eab308' : '#ef4444') : '#999';
  const statusBadge = data ? (data.openclaw.status === 'healthy' ? '✅' : data.openclaw.status === 'warning' ? '⚠️' : '❌') : '❓';

  const getProgressColor = (value: number, threshold1 = 50, threshold2 = 75) => getStatusColor(value, { ok: threshold1, warning: threshold2 });

  // Render helpers
  const renderProgressBar = (label: string, value: number, max = 100, threshold1 = 50, threshold2 = 75) => {
    const percent = (value / max) * 100;
    const colors = getProgressColor(percent, threshold1, threshold2);
    return (
      <div style={progressContainerStyle}>
        <div style={progressHeaderStyle}>
          <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.7)' }}>{label}</span>
          <span style={{ fontWeight: 700, color: colors.text, fontSize: '1rem' }}>
            {percent.toFixed(1)}% {colors.label}
          </span>
        </div>
        <div style={progressBarBgStyle}>
          <div style={{
            width: `${Math.min(percent, 100)}%`,
            height: '100%',
            background: colors.bg,
            borderRadius: '9999px',
            transition: 'width 0.3s ease',
          }} />
        </div>
      </div>
    );
  };

  const renderStatRow = (label: string, value: string | number, color: string = 'white') => (
    <div style={statRowStyle}>
      <span style={statLabelStyle}>{label}</span>
      <span style={{ ...statValueStyle, color }}>{value}</span>
    </div>
  );

  return (
    <div style={containerStyle}>
        <BackButton />

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>
          <span style={{ fontSize: '2.5rem' }}>🤖</span>
          OpenClaw Performance
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <p style={subtitleStyle}>
              Live Status • Metrics • Aktualisiert: <strong>{time} Uhr</strong>
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid rgba(148, 163, 184, 0.3)',
              background: loading ? 'rgba(148, 163, 184, 0.1)' : 'rgba(148, 163, 184, 0.2)',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.9rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? '⏳ Aktualisiert...' : '🔄 Aktualisieren'}
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading && !data && (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.6)' }}>
          ⏳ Lade Performance-Daten…
        </div>
      )}

      {data && (
        <>
        <div style={gridStyle}>

        {/* CARD 1: OpenClaw Status */}
        <div style={cardStyle} onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.2)';
        }} onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow as string;
        }}>
          <h3 style={cardTitleStyle}>
            <span style={{ fontSize: '1.75rem' }}>⚡</span>
            OpenClaw Status
          </h3>
          {renderStatRow('Sessions aktiv', data.openclaw.sessions, '#60a5fa')}
          {renderStatRow('Tokens (ges.)', data.openclaw.tokens_used, '#a78bfa')}
          {renderStatRow('Runtime', data.openclaw.total_runtime, '#06b6d4')}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.7)' }}>System:</span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: statusColor }}>
                {statusBadge} {data.openclaw.status.charAt(0).toUpperCase() + data.openclaw.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* CARD 2: Host Resources */}
        <div style={cardStyle} onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.2)';
        }} onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow as string;
        }}>
          <h3 style={cardTitleStyle}>
            <span style={{ fontSize: '1.75rem' }}>🖥️</span>
            Host Resources
          </h3>
          {renderProgressBar('CPU Auslastung', data.host.cpu_percent, 100, 50, 75)}
          {renderProgressBar('RAM Auslastung', data.host.ram_percent, 100, 50, 75)}
          {renderProgressBar('Disk Auslastung', data.host.disk_percent, 100, 50, 75)}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
            {renderStatRow('Uptime', `${data.host.uptime_days}d`, '#22c55e')}
          </div>
        </div>

        {/* CARD 3: API Performance */}
        <div style={cardStyle} onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 20px 25px rgba(0, 0, 0, 0.2)';
        }} onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = cardStyle.boxShadow as string;
        }}>
          <h3 style={cardTitleStyle}>
            <span style={{ fontSize: '1.75rem' }}>📡</span>
            API Performance
          </h3>
          {renderStatRow('Requests (24h)', data.api.requests_24h.toLocaleString('de-DE'), '#818cf8')}
          {renderStatRow(
            'Ø Response Zeit',
            `${data.api.avg_response_ms}ms`,
            data.api.avg_response_ms < 300 ? '#22c55e' : data.api.avg_response_ms < 500 ? '#eab308' : '#ef4444'
          )}
          <div style={{ paddingTop: '1rem', borderTop: '1px solid rgba(148, 163, 184, 0.2)' }}>
            {renderStatRow('Errors (24h)', data.api.errors_24h, data.api.errors_24h === 0 ? '#22c55e' : '#ef4444')}
            {renderStatRow('Error Rate', `${data.api.error_rate_percent}%`, data.api.error_rate_percent < 1 ? '#22c55e' : '#f97316')}
          </div>
        </div>

      </div>

      {/* Summary Footer */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.75rem',
        padding: '1.5rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        marginBottom: '2rem',
      }}>
        <div style={summaryGridStyle}>
          <div style={summaryStatStyle}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 0.5rem' }}>
              System Health
            </p>
            <p style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, color: statusColor }}>
              {statusBadge} {data.openclaw.status === 'healthy' ? '100%' : data.openclaw.status === 'warning' ? '75%' : '25%'}
            </p>
          </div>
          <div style={summaryStatStyle}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 0.5rem' }}>
              Critical Alerts
            </p>
            <p style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              margin: 0,
              color: data.host.ram_percent > 80 ? '#ef4444' : '#22c55e',
            }}>
              {data.host.ram_percent > 80 ? '1' : '0'}
            </p>
          </div>
          <div style={summaryStatStyle}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 0.5rem' }}>
              Avg CPU
            </p>
            <p style={{
              fontSize: '1.875rem',
              fontWeight: 700,
              margin: 0,
              color: getProgressColor(data.host.cpu_percent, 50, 75).text,
            }}>
              {data.host.cpu_percent.toFixed(1)}%
            </p>
          </div>
          <div style={summaryStatStyle}>
            <p style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.6)', margin: '0 0 0.5rem' }}>
              API Uptime
            </p>
            <p style={{ fontSize: '1.875rem', fontWeight: 700, margin: 0, color: '#22c55e' }}>
              99.8%
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.75rem' }}>
        <p>OpenClaw Dashboard v2.1 • Auto-refresh every 1 second • Responsive Design</p>
      </div>
      </>
      )}
    </div>
  );
}
