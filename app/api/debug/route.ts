import { NextRequest, NextResponse } from 'next/server'

// Debug API for Render troubleshooting
export async function GET(request: NextRequest) {
  console.log('🔍 Debug API called on Render');
  
  const debugInfo = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    platform: process.platform,
    cwd: process.cwd(),
    renderEnv: !!process.env.RENDER,
    availableEnvVars: Object.keys(process.env).filter(k => !k.includes('SECRET')),
    memoryUsage: process.memoryUsage(),
    uptime: process.uptime()
  }

  return NextResponse.json({
    success: true,
    message: "Debug endpoint active",
    debug: debugInfo,
    renderOptimized: true
  })
}