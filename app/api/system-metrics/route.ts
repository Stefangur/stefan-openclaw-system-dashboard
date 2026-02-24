import { NextResponse } from 'next/server'
import { createClient } from '@libsql/client'

export async function GET() {
  try {
    const turso = createClient({
      url: process.env.TURSO_DATABASE_URL || 'libsql://stefan-portfolio-stefangur.aws-eu-west-1.turso.io',
      authToken: process.env.TURSO_AUTH_TOKEN,
    })

    const result = await turso.execute(`
      SELECT timestamp, cpu_percent, memory_percent, memory_used_mb, memory_total_mb,
             disk_percent, disk_used_gb, disk_total_gb, load_1m, load_5m, load_15m
      FROM system_metrics
      ORDER BY id DESC
      LIMIT 48
    `)

    return NextResponse.json({
      success: true,
      metrics: result.rows,
    }, {
      headers: { 'Cache-Control': 'no-store' }
    })

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
