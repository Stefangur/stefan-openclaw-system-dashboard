import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'

export async function GET(request: NextRequest) {
  try {
    const homeDir = os.homedir()
    const logPath = path.join(homeDir, '.trader', 'daemon.log')
    
    let logs: string[] = []
    let status = 'Unknown'

    // Read last 50 lines from daemon.log
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf-8')
      const allLines = content.split('\n').filter(line => line.trim())
      logs = allLines.slice(-50) // Last 50 lines
    }

    // Check if daemon is running (look for PID)
    try {
      const result = execSync('pgrep -f "node.*daemon.js" || echo "not found"', { encoding: 'utf-8' })
      status = result.trim() && result.trim() !== 'not found' ? 'Running' : 'Stopped'
    } catch {
      status = 'Stopped'
    }

    return NextResponse.json({
      logs,
      status,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error reading daemon logs:', error)
    return NextResponse.json(
      {
        logs: [`Fehler beim Lesen der Logs: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`],
        status: 'Error',
        timestamp: new Date().toISOString(),
      },
      { status: 200 } // Still return 200 to prevent UI errors
    )
  }
}

