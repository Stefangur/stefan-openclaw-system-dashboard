import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

interface BotStatus {
  name: string;
  emoji: string;
  status: 'active' | 'idle' | 'error';
  lastUpdated: string;
  details: Record<string, string | number | boolean>;
}

interface CronJob {
  name: string;
  status: 'enabled' | 'disabled' | 'error';
  lastRun: string;
  nextRun: string;
  schedule: string;
}

interface BotsResponse {
  bots: BotStatus[];
  cronJobs: CronJob[];
  lastUpdated: string;
}

// Helper: Parse heartbeat log for render-ping status
function getLastRenderPingStatus(): { time: string; allOk: boolean } {
  try {
    const heartbeatPath = path.join(process.cwd(), '../../.openclaw/workspace/HEARTBEAT.md');
    if (!fs.existsSync(heartbeatPath)) {
      return { time: 'N/A', allOk: false };
    }
    
    const content = fs.readFileSync(heartbeatPath, 'utf-8');
    const lines = content.split('\n').reverse();
    
    for (const line of lines) {
      if (line.includes('render-ping') && line.includes('200 OK')) {
        const timeMatch = line.match(/\[(.*?)\]/);
        const time = timeMatch ? timeMatch[1] : 'N/A';
        return { time, allOk: true };
      }
    }
    return { time: 'N/A', allOk: false };
  } catch {
    return { time: 'N/A', allOk: false };
  }
}

// Helper: Parse memory files for last trainer/trader reports
function getLastTrainerReport(): { date: string; time: string; metricsUpdated: boolean } {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    const memoryPath = path.join(process.cwd(), '../../.openclaw/workspace/memory', `${today}.md`);
    
    if (!fs.existsSync(memoryPath)) {
      return { date: 'N/A', time: 'N/A', metricsUpdated: false };
    }

    const content = fs.readFileSync(memoryPath, 'utf-8');
    if (content.includes('Hydration') || content.includes('Meals') || content.includes('Weight')) {
      const now = new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' });
      const [date, time] = now.split(', ');
      return { date, time, metricsUpdated: true };
    }
    return { date: today, time: 'N/A', metricsUpdated: false };
  } catch {
    return { date: 'N/A', time: 'N/A', metricsUpdated: false };
  }
}

function getLastTraderReport(): { time: string; symbol: string; nextScheduled: string } {
  try {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '-');
    const memoryPath = path.join(process.cwd(), '../../.openclaw/workspace/memory', `${today}.md`);
    
    if (!fs.existsSync(memoryPath)) {
      return { time: 'N/A', symbol: 'N/A', nextScheduled: '08:00 Vienna' };
    }

    const content = fs.readFileSync(memoryPath, 'utf-8');
    const tradeMatch = content.match(/Trade Report.*?(\d{2}:\d{2})/);
    const symbolMatch = content.match(/Symbol[:\s]*(\w+)/);
    
    return {
      time: tradeMatch ? tradeMatch[1] : 'N/A',
      symbol: symbolMatch ? symbolMatch[1] : 'N/A',
      nextScheduled: '08:00, 12:00, 16:00, 20:00 Vienna',
    };
  } catch {
    return { time: 'N/A', symbol: 'N/A', nextScheduled: '08:00, 12:00, 16:00, 20:00 Vienna' };
  }
}

function getLastCommit(): { repo: string; message: string; timestamp: string } {
  try {
    // This would ideally use GitHub API, but for MVP we'll just show a placeholder
    // In production, call GitHub API with a token
    return {
      repo: 'stefan-openclaw-system-dashboard',
      message: 'Fix: Close missing containerStyle div in performance/page.tsx',
      timestamp: new Date().toISOString().split('T')[0],
    };
  } catch {
    return { repo: 'N/A', message: 'N/A', timestamp: 'N/A' };
  }
}

export async function GET(request: NextRequest): Promise<NextResponse<BotsResponse>> {
  try {
    const renderPing = getLastRenderPingStatus();
    const trainerReport = getLastTrainerReport();
    const traderReport = getLastTraderReport();
    const lastCommit = getLastCommit();

    const bots: BotStatus[] = [
      {
        name: 'Developer Agent',
        emoji: '👨‍💻',
        status: renderPing.allOk ? 'active' : 'idle',
        lastUpdated: lastCommit.timestamp,
        details: {
          'Last Commit': lastCommit.message,
          'Repository': lastCommit.repo,
          'Deployed': renderPing.allOk ? 'yes' : 'checking',
        },
      },
      {
        name: 'Trainer Agent',
        emoji: '🏋️',
        status: trainerReport.metricsUpdated ? 'active' : 'idle',
        lastUpdated: trainerReport.time,
        details: {
          'Last Report': trainerReport.date,
          'Report Time': trainerReport.time,
          'Metrics Updated': trainerReport.metricsUpdated ? 'yes' : 'no',
        },
      },
      {
        name: 'Trader Agent',
        emoji: '📈',
        status: 'idle',
        lastUpdated: traderReport.time,
        details: {
          'Last Report': traderReport.time,
          'Last Symbol': traderReport.symbol,
          'Next Scheduled': traderReport.nextScheduled,
        },
      },
    ];

    const cronJobs: CronJob[] = [
      {
        name: 'healthcheck:security-audit',
        status: 'enabled',
        lastRun: '2026-03-02 08:00 Vienna',
        nextRun: new Date(Date.now() + 86400000).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }),
        schedule: 'Daily 08:00 Vienna',
      },
      {
        name: 'monitoring:render-ping',
        status: 'enabled',
        lastRun: renderPing.time,
        nextRun: new Date(Date.now() + 300000).toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }),
        schedule: 'Every 5 minutes',
      },
    ];

    return NextResponse.json({
      bots,
      cronJobs,
      lastUpdated: new Date().toLocaleString('de-AT', { timeZone: 'Europe/Vienna' }),
    });
  } catch (error) {
    console.error('Error fetching bots status:', error);
    return NextResponse.json(
      { bots: [], cronJobs: [], lastUpdated: 'Error' },
      { status: 500 }
    );
  }
}
