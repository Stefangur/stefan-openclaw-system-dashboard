export default function PerformancePage() {
  const data = {
    openclaw: { sessions: 5, tokens_used: "1.2M", total_runtime: "48h", status: "healthy" },
    host: { cpu_percent: 34.5, ram_percent: 62.1, disk_percent: 41.3, uptime_days: 12 },
    api: { requests_24h: 1250, avg_response_ms: 245, errors_24h: 3, error_rate_percent: 0.24 }
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🤖 OpenClaw Performance</h1>
      
      <h2>OpenClaw Status</h2>
      <p>Sessions: {data.openclaw.sessions}</p>
      <p>Tokens Used: {data.openclaw.tokens_used}</p>
      <p>Total Runtime: {data.openclaw.total_runtime}</p>
      <p>Status: {data.openclaw.status}</p>

      <h2>Host Resources</h2>
      <p>CPU: {data.host.cpu_percent}%</p>
      <p>RAM: {data.host.ram_percent}%</p>
      <p>Disk: {data.host.disk_percent}%</p>
      <p>Uptime: {data.host.uptime_days} days</p>

      <h2>API Performance</h2>
      <p>Requests (24h): {data.api.requests_24h}</p>
      <p>Avg Response: {data.api.avg_response_ms}ms</p>
      <p>Errors (24h): {data.api.errors_24h}</p>
      <p>Error Rate: {data.api.error_rate_percent}%</p>
    </div>
  )
}
