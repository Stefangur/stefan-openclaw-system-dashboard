'use client';

import { useState, useEffect } from 'react';

interface MonthlyData {
  month: string;
  totalTokens: number;
  costUsd: string | number;
  daysTracked: number;
}

interface TokenStatsResponse {
  monthly: MonthlyData[];
  monthToDate?: {
    totalTokens: number;
    costUsd: string | number;
  };
  overall?: {
    totalTokens: number;
    totalCostUsd: string | number;
  };
}

export default function TokenUsageChart() {
  const [data, setData] = useState<MonthlyData[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<{
    totalTokens: number;
    avgPerMonth: number;
    totalCost: number;
  } | null>(null);

  useEffect(() => {
    const fetchTokenStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const res = await fetch('/api/token-stats/monthly', {
          headers: {
            'X-Butler-Token': 'butler-stefan-2026',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const response: TokenStatsResponse = await res.json();
        
        if (!response.monthly || response.monthly.length === 0) {
          setError('No token usage data available');
          setData([]);
          return;
        }

        // Sort by month ascending (oldest to newest) for chart display
        const sortedData = [...response.monthly].reverse();
        setData(sortedData);

        // Calculate summary stats
        const totalTokens = response.overall?.totalTokens || 
          sortedData.reduce((sum, m) => sum + m.totalTokens, 0);
        const totalCostUsd = response.overall?.totalCostUsd || 0;
        const totalCost = typeof totalCostUsd === 'string' 
          ? parseFloat(totalCostUsd) 
          : totalCostUsd;
        const avgPerMonth = totalTokens / sortedData.length;

        setSummary({
          totalTokens,
          avgPerMonth: Math.round(avgPerMonth),
          totalCost,
        });
      } catch (err) {
        console.error('Failed to fetch token stats:', err);
        setError('Data not available');
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTokenStats();
  }, []);

  // Helper to format large numbers
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}k`;
    }
    return num.toString();
  };

  // Helper to format month string
  const formatMonth = (monthStr: string): string => {
    try {
      const [year, month] = monthStr.split('-');
      const date = new Date(`${year}-${month}-01`);
      return date.toLocaleDateString('de-DE', { month: 'short', year: '2-digit' });
    } catch {
      return monthStr;
    }
  };

  if (loading) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.75rem',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
      }}>
        ⏳ Laden von Token-Daten…
      </div>
    );
  }

  if (error || !data || data.length === 0) {
    return (
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(148, 163, 184, 0.2)',
        borderRadius: '0.75rem',
        padding: '2rem',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        marginBottom: '2rem',
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.6)',
      }}>
        📊 {error || 'Data not available'}
      </div>
    );
  }

  // Find max value for scaling
  const maxTokens = Math.max(...data.map(d => d.totalTokens));
  const chartHeight = 300;
  const barWidth = Math.max(20, 600 / data.length / 1.5);
  const chartPadding = 60;
  const totalWidth = Math.max(600, data.length * barWidth * 1.8 + chartPadding * 2);

  return (
    <div style={{
      background: 'rgba(30, 41, 59, 0.8)',
      border: '1px solid rgba(148, 163, 184, 0.2)',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
      marginBottom: '2rem',
      overflowX: 'auto',
    }}>
      {/* Title */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.375rem',
          fontWeight: 700,
          margin: '0 0 0.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: 'white',
        }}>
          <span style={{ fontSize: '1.75rem' }}>📊</span>
          Token Usage (Monthly)
        </h3>
        <p style={{
          color: 'rgba(255, 255, 255, 0.6)',
          fontSize: '0.875rem',
          margin: 0,
        }}>
          Token verbrauch und Kosten nach Monat
        </p>
      </div>

      {/* Chart Container */}
      <div style={{
        overflowX: 'auto',
        marginBottom: '1.5rem',
        borderBottom: '1px solid rgba(148, 163, 184, 0.2)',
        paddingBottom: '1rem',
      }}>
        <svg
          width={totalWidth}
          height={chartHeight + 80}
          style={{
            minWidth: '100%',
            height: 'auto',
          }}
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((i) => {
            const y = chartHeight - i * chartHeight;
            const value = i * maxTokens;
            return (
              <g key={`grid-${i}`}>
                <line
                  x1={chartPadding}
                  y1={y + 20}
                  x2={totalWidth - chartPadding / 2}
                  y2={y + 20}
                  stroke="rgba(148, 163, 184, 0.1)"
                  strokeDasharray="4"
                />
                <text
                  x={chartPadding - 10}
                  y={y + 25}
                  textAnchor="end"
                  fontSize="12"
                  fill="rgba(255, 255, 255, 0.5)"
                >
                  {value > 0 ? formatNumber(Math.round(value)) : '0'}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((month, idx) => {
            const barHeight = (month.totalTokens / maxTokens) * chartHeight;
            const x = chartPadding + idx * (barWidth * 1.8);
            const y = chartHeight - barHeight + 20;
            const cost = parseFloat(String(month.costUsd)) || 0;
            
            // Color gradient based on token usage
            const percent = month.totalTokens / maxTokens;
            let barColor = '#60a5fa'; // Blue
            if (percent > 0.8) barColor = '#ef4444'; // Red
            else if (percent > 0.6) barColor = '#f97316'; // Orange
            else if (percent > 0.4) barColor = '#eab308'; // Yellow

            return (
              <g key={`bar-${idx}`}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={barColor}
                  rx="4"
                  opacity="0.9"
                >
                  <title>
                    {month.month}: {formatNumber(month.totalTokens)} tokens, ${cost.toFixed(2)}
                  </title>
                </rect>
                
                {/* Cost indicator (small dot on top) */}
                {cost > 0 && (
                  <circle
                    cx={x + barWidth / 2}
                    cy={y - 5}
                    r="3"
                    fill="#a78bfa"
                    opacity="0.7"
                  >
                    <title>${cost.toFixed(2)}</title>
                  </circle>
                )}

                {/* Month label */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 40}
                  textAnchor="middle"
                  fontSize="12"
                  fill="rgba(255, 255, 255, 0.7)"
                  transform={`rotate(45 ${x + barWidth / 2} ${chartHeight + 40})`}
                >
                  {formatMonth(month.month)}
                </text>
              </g>
            );
          })}

          {/* Y-axis */}
          <line
            x1={chartPadding}
            y1="20"
            x2={chartPadding}
            y2={chartHeight + 20}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
          />

          {/* X-axis */}
          <line
            x1={chartPadding}
            y1={chartHeight + 20}
            x2={totalWidth - chartPadding / 2}
            y2={chartHeight + 20}
            stroke="rgba(255, 255, 255, 0.3)"
            strokeWidth="2"
          />
        </svg>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0 0 0.5rem',
              textTransform: 'uppercase',
            }}>
              Gesamt Tokens
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              color: '#60a5fa',
              fontFamily: 'monospace',
            }}>
              {formatNumber(summary.totalTokens)}
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0 0 0.5rem',
              textTransform: 'uppercase',
            }}>
              Ø pro Monat
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              color: '#818cf8',
              fontFamily: 'monospace',
            }}>
              {formatNumber(summary.avgPerMonth)}
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0 0 0.5rem',
              textTransform: 'uppercase',
            }}>
              Gesamt Kosten
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              color: '#a78bfa',
              fontFamily: 'monospace',
            }}>
              ${summary.totalCost.toFixed(2)}
            </p>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(148, 163, 184, 0.1)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center',
          }}>
            <p style={{
              fontSize: '0.75rem',
              color: 'rgba(255, 255, 255, 0.6)',
              margin: '0 0 0.5rem',
              textTransform: 'uppercase',
            }}>
              Daten
            </p>
            <p style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              margin: 0,
              color: '#06b6d4',
              fontFamily: 'monospace',
            }}>
              {data.length}mo
            </p>
          </div>
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginTop: '1.5rem',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        color: 'rgba(255, 255, 255, 0.5)',
        display: 'flex',
        gap: '1.5rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#60a5fa',
            borderRadius: '2px',
          }} />
          <span>Token Count (Y-axis)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '6px',
            height: '6px',
            backgroundColor: '#a78bfa',
            borderRadius: '50%',
          }} />
          <span>Cost per Month (marker)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{
            width: '12px',
            height: '12px',
            backgroundColor: '#ef4444',
            borderRadius: '2px',
          }} />
          <span>High usage (&gt;80%)</span>
        </div>
      </div>
    </div>
  );
}
