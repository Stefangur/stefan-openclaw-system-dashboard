import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

// Request metrics (in-memory store, cleared on restart)
let apiMetrics = {
  requests_24h: 0,
  response_times: [] as number[],
  errors_24h: 0,
  last_reset: Date.now(),
}

// Helper: Track API performance
export function trackRequest(responseMs: number, isError: boolean) {
  apiMetrics.requests_24h++
  apiMetrics.response_times.push(responseMs)
  if (isError) apiMetrics.errors_24h++

  // Keep only last 10000 response times to prevent memory bloat
  if (apiMetrics.response_times.length > 10000) {
    apiMetrics.response_times = apiMetrics.response_times.slice(-10000)
  }
}

// Helper: Get OpenClaw stats via CLI
async function getOpenClawStats() {
  try {
    const output = execSync('openclaw status --json 2>/dev/null || echo "{}"', {
      encoding: 'utf8',
      timeout: 5000,
    })
    const data = JSON.parse(output)
    return {
      sessions: data.sessions || 0,
      tokens_used: data.tokens_used || '0B',
      total_runtime: data.total_runtime || '0h',
      status: data.status || 'unknown',
    }
  } catch (e) {
    return {
      sessions: 0,
      tokens_used: '0B',
      total_runtime: '0h',
      status: 'unavailable',
    }
  }
}

// Helper: Get host metrics (macOS/Linux)
async function getHostMetrics() {
  try {
    // CPU and Memory from 'top'
    const topOutput = execSync('top -l 1 -b 2>/dev/null | grep -E "CPU|Mem" || echo ""', {
      encoding: 'utf8',
      timeout: 5000,
    })

    let cpuPercent = 0
    let memPercent = 0

    const cpuMatch = topOutput.match(/CPU usage: (\d+\.?\d*)%/)
    if (cpuMatch) cpuPercent = parseFloat(cpuMatch[1])

    // Parse memory: "PhysMem: 8192M used, 4096M unused"
    const memUsedMatch = topOutput.match(/(\d+)[MG] used/)
    const memUnusedMatch = topOutput.match(/(\d+)[MG] unused/)
    if (memUsedMatch && memUnusedMatch) {
      const used = parseInt(memUsedMatch[1])
      const unused = parseInt(memUnusedMatch[1])
      const total = used + unused
      memPercent = parseFloat(((used / total) * 100).toFixed(1))
    }

    // Disk usage (last filesystem line)
    const dfOutput = execSync(
      "df -h 2>/dev/null | tail -1 | awk '{print $5}' || echo '0%'",
      { encoding: 'utf8', timeout: 5000 }
    ).trim()
    const diskPercent = parseFloat(dfOutput.replace('%', ''))

    // Uptime in days
    const uptimeOutput = execSync(
      "uptime 2>/dev/null | awk '{print $(NF-2)}' | sed 's/,//' || echo '0'",
      { encoding: 'utf8', timeout: 5000 }
    ).trim()
    const uptimeDays = parseFloat(uptimeOutput)

    return {
      cpu_percent: parseFloat(cpuPercent.toFixed(1)),
      ram_percent: parseFloat(memPercent.toFixed(1)),
      disk_percent: isNaN(diskPercent) ? 0 : parseFloat(diskPercent.toFixed(1)),
      uptime_days: isNaN(uptimeDays) ? 0 : parseFloat(uptimeDays.toFixed(1)),
    }
  } catch (e) {
    return {
      cpu_percent: 0,
      ram_percent: 0,
      disk_percent: 0,
      uptime_days: 0,
    }
  }
}

// Helper: Get API performance metrics from in-memory store
function getApiMetrics() {
  const errorRate =
    apiMetrics.requests_24h > 0
      ? (apiMetrics.errors_24h / apiMetrics.requests_24h) * 100
      : 0

  const avgResponseMs =
    apiMetrics.response_times.length > 0
      ? Math.round(
          apiMetrics.response_times.reduce((a, b) => a + b, 0) /
            apiMetrics.response_times.length
        )
      : 0

  return {
    requests_24h: apiMetrics.requests_24h,
    avg_response_ms: avgResponseMs,
    errors_24h: apiMetrics.errors_24h,
    error_rate_percent: parseFloat(errorRate.toFixed(2)),
  }
}

export async function GET() {
  const startTime = Date.now()

  try {
    // Fetch all 3 data sources in parallel
    const [openclawStats, hostMetrics] = await Promise.allSettled([
      getOpenClawStats(),
      getHostMetrics(),
    ])

    // Extract results (with fallback on rejection)
    const openclaw =
      openclawStats.status === 'fulfilled'
        ? openclawStats.value
        : {
            sessions: 0,
            tokens_used: '0B',
            total_runtime: '0h',
            status: 'unavailable',
          }

    const host =
      hostMetrics.status === 'fulfilled'
        ? hostMetrics.value
        : {
            cpu_percent: 0,
            ram_percent: 0,
            disk_percent: 0,
            uptime_days: 0,
          }

    const api = getApiMetrics()

    const responseTime = Date.now() - startTime
    trackRequest(responseTime, false)

    return NextResponse.json(
      {
        openclaw,
        host,
        api,
      },
      {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
      }
    )
  } catch (error: any) {
    const responseTime = Date.now() - startTime
    trackRequest(responseTime, true)

    return NextResponse.json(
      {
        openclaw: {
          sessions: 0,
          tokens_used: '0B',
          total_runtime: '0h',
          status: 'error',
        },
        host: {
          cpu_percent: 0,
          ram_percent: 0,
          disk_percent: 0,
          uptime_days: 0,
        },
        api: {
          requests_24h: 0,
          avg_response_ms: 0,
          errors_24h: 0,
          error_rate_percent: 0,
        },
        error: error.message,
      },
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    )
  }
}
