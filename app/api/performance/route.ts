import { exec } from 'child_process';
import { promisify } from 'util';
import { promises as fs } from 'fs';
import os from 'os';

const execAsync = promisify(exec);

interface PerformanceMetrics {
  sessions: number;
  tokens_used: number;
  total_runtime_hours: number;
  cpu_percent: number;
  ram_percent: number;
  disk_percent: number;
  uptime_days: number;
  last_updated: string;
  api_requests_24h: number;
  api_avg_response_ms: number;
  api_errors_24h: number;
  api_error_rate_percent: number;
}

async function getOpenClawStatus(): Promise<{
  sessions: number;
  tokens_used: number;
  total_runtime_hours: number;
}> {
  try {
    const { stdout } = await execAsync('openclaw status');
    
    // Parse OpenClaw status output
    // Looking for: "Sessions" and "Agents" lines
    const sessionsMatch = stdout.match(/(\d+)\s+active/);
    const sessions = sessionsMatch ? parseInt(sessionsMatch[1]) : 0;
    
    // For now, we'll use mock data for tokens and runtime
    // In production, this would come from openclaw cost tracking
    const tokens_used = 1200000; // 1.2M
    const total_runtime_hours = 48;
    
    return { sessions, tokens_used, total_runtime_hours };
  } catch (error) {
    console.error('Error fetching OpenClaw status:', error);
    return { sessions: 0, tokens_used: 0, total_runtime_hours: 0 };
  }
}

async function getHostMetrics(): Promise<{
  cpu_percent: number;
  ram_percent: number;
  disk_percent: number;
  uptime_days: number;
}> {
  try {
    // CPU usage
    const { stdout: topOutput } = await execAsync('top -l 1 | grep "CPU usage"');
    const cpuMatch = topOutput.match(/(\d+\.\d+)%\s+user/);
    const cpu_percent = cpuMatch ? parseFloat(cpuMatch[1]) : 0;

    // RAM usage (macOS)
    const { stdout: memOutput } = await execAsync('vm_stat');
    const memLines = memOutput.split('\n');
    let totalMem = 0;
    let usedMem = 0;

    // Parse vm_stat output
    const freePagesMatch = memOutput.match(/Pages free:\s+(\d+)/);
    const freePages = freePagesMatch ? parseInt(freePagesMatch[1]) : 0;
    
    // Total physical memory in macOS
    const { stdout: memSizeOutput } = await execAsync('sysctl -n hw.memsize');
    const totalMemBytes = parseInt(memSizeOutput.trim());
    
    // Calculate memory percentage
    const pageSize = 4096; // 4KB pages on macOS
    const freeBytes = freePages * pageSize;
    const usedBytes = totalMemBytes - freeBytes;
    const ram_percent = (usedBytes / totalMemBytes) * 100;

    // Disk usage (root partition)
    const { stdout: dfOutput } = await execAsync('df -h / | tail -1');
    const diskMatch = dfOutput.match(/(\d+)%/);
    const disk_percent = diskMatch ? parseInt(diskMatch[1]) : 0;

    // Uptime
    const { stdout: uptimeOutput } = await execAsync('uptime');
    const daysMatch = uptimeOutput.match(/(\d+)\s+day/);
    const uptime_days = daysMatch ? parseInt(daysMatch[1]) : 0;

    return {
      cpu_percent: Math.round(cpu_percent * 10) / 10,
      ram_percent: Math.round(ram_percent * 10) / 10,
      disk_percent,
      uptime_days,
    };
  } catch (error) {
    console.error('Error fetching host metrics:', error);
    return {
      cpu_percent: 0,
      ram_percent: 0,
      disk_percent: 0,
      uptime_days: 0,
    };
  }
}

async function getAPIMetrics(): Promise<{
  requests_24h: number;
  avg_response_ms: number;
  errors_24h: number;
  error_rate_percent: number;
}> {
  // In production, this would come from actual API logs
  // For now, return mock data based on real patterns
  return {
    requests_24h: 1250,
    avg_response_ms: 245,
    errors_24h: 3,
    error_rate_percent: 0.24,
  };
}

export async function GET(request: Request) {
  try {
    // Verify auth token
    const authHeader = request.headers.get('x-butler-token');
    if (authHeader !== 'butler-stefan-2026') {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Fetch all metrics in parallel
    const [openclaw, host, api] = await Promise.all([
      getOpenClawStatus(),
      getHostMetrics(),
      getAPIMetrics(),
    ]);

    const metrics: PerformanceMetrics = {
      sessions: openclaw.sessions,
      tokens_used: openclaw.tokens_used,
      total_runtime_hours: openclaw.total_runtime_hours,
      cpu_percent: host.cpu_percent,
      ram_percent: host.ram_percent,
      disk_percent: host.disk_percent,
      uptime_days: host.uptime_days,
      api_requests_24h: api.requests_24h,
      api_avg_response_ms: api.avg_response_ms,
      api_errors_24h: api.errors_24h,
      api_error_rate_percent: api.error_rate_percent,
      last_updated: new Date().toISOString(),
    };

    return new Response(JSON.stringify(metrics), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Performance API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch performance metrics' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
