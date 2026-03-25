import { createClient, Client } from '@libsql/client'

export interface TokenCostRecord {
  id: string
  date: string
  tavily_eur: number
  claude_eur: number
  gpt_eur: number
  render_eur: number
  other_eur: number
  total_eur: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface TokenCostInput {
  date: string
  tavily_eur?: number
  claude_eur?: number
  gpt_eur?: number
  render_eur?: number
  other_eur?: number
  notes?: string
}

let dbClient: Client | null = null

export function getDatabaseClient(): Client {
  if (!dbClient) {
    const databaseUrl = process.env.TURSO_DATABASE_URL
    const dbAuthToken = process.env.TURSO_AUTH_TOKEN

    if (!databaseUrl || !dbAuthToken) {
      throw new Error('Missing database credentials: TURSO_DATABASE_URL or TURSO_AUTH_TOKEN')
    }

    dbClient = createClient({
      url: databaseUrl,
      authToken: dbAuthToken,
    })
  }
  return dbClient
}

/**
 * Initialize the token_costs table if it doesn't exist
 */
export async function initializeTokenCostsTable(): Promise<void> {
  const client = getDatabaseClient()

  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS token_costs (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL UNIQUE,
        tavily_eur REAL DEFAULT 0,
        claude_eur REAL DEFAULT 0,
        gpt_eur REAL DEFAULT 0,
        render_eur REAL DEFAULT 0,
        other_eur REAL DEFAULT 0,
        total_eur REAL GENERATED ALWAYS AS (tavily_eur + claude_eur + gpt_eur + render_eur + other_eur) STORED,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)
  } catch (error) {
    console.error('Error initializing token_costs table:', error)
    throw error
  }
}

/**
 * Add or replace a token cost record
 */
export async function addTokenCost(data: TokenCostInput): Promise<TokenCostRecord> {
  const client = getDatabaseClient()

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD')
  }

  // Validate date is valid
  const dateObj = new Date(data.date + 'T00:00:00Z')
  if (isNaN(dateObj.getTime())) {
    throw new Error('Invalid date value')
  }

  const id = `token-cost-${data.date}`
  const tavily_eur = data.tavily_eur ?? 0
  const claude_eur = data.claude_eur ?? 0
  const gpt_eur = data.gpt_eur ?? 0
  const render_eur = data.render_eur ?? 0
  const other_eur = data.other_eur ?? 0
  const notes = data.notes ?? null

  try {
    await client.execute({
      sql: `
        INSERT OR REPLACE INTO token_costs (
          id,
          date,
          tavily_eur,
          claude_eur,
          gpt_eur,
          render_eur,
          other_eur,
          notes,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `,
      args: [id, data.date, tavily_eur, claude_eur, gpt_eur, render_eur, other_eur, notes],
    })

    // Fetch the record to get all fields including computed total
    const result = await client.execute({
      sql: 'SELECT * FROM token_costs WHERE date = ?',
      args: [data.date],
    })

    if (result.rows.length === 0) {
      throw new Error('Failed to retrieve inserted record')
    }

    const row = result.rows[0] as Record<string, unknown>
    return {
      id: row.id as string,
      date: row.date as string,
      tavily_eur: row.tavily_eur as number,
      claude_eur: row.claude_eur as number,
      gpt_eur: row.gpt_eur as number,
      render_eur: row.render_eur as number,
      other_eur: row.other_eur as number,
      total_eur: row.total_eur as number,
      notes: row.notes as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }
  } catch (error) {
    console.error('Error adding token cost:', error)
    throw error
  }
}

/**
 * Get token costs for a date range
 */
export async function getTokenCosts(days: number = 30): Promise<TokenCostRecord[]> {
  const client = getDatabaseClient()

  try {
    const result = await client.execute({
      sql: `
        SELECT * FROM token_costs
        WHERE date >= date('now', '-' || ? || ' days')
        ORDER BY date DESC
      `,
      args: [days.toString()],
    })

    return result.rows.map((row: Record<string, unknown>) => ({
      id: row.id as string,
      date: row.date as string,
      tavily_eur: row.tavily_eur as number,
      claude_eur: row.claude_eur as number,
      gpt_eur: row.gpt_eur as number,
      render_eur: row.render_eur as number,
      other_eur: row.other_eur as number,
      total_eur: row.total_eur as number,
      notes: row.notes as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }))
  } catch (error) {
    console.error('Error fetching token costs:', error)
    throw error
  }
}

/**
 * Get a single token cost record by date
 */
export async function getTokenCostByDate(date: string): Promise<TokenCostRecord | null> {
  const client = getDatabaseClient()

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM token_costs WHERE date = ?',
      args: [date],
    })

    if (result.rows.length === 0) {
      return null
    }

    const row = result.rows[0] as Record<string, unknown>
    return {
      id: row.id as string,
      date: row.date as string,
      tavily_eur: row.tavily_eur as number,
      claude_eur: row.claude_eur as number,
      gpt_eur: row.gpt_eur as number,
      render_eur: row.render_eur as number,
      other_eur: row.other_eur as number,
      total_eur: row.total_eur as number,
      notes: row.notes as string | undefined,
      created_at: row.created_at as string,
      updated_at: row.updated_at as string,
    }
  } catch (error) {
    console.error('Error fetching token cost by date:', error)
    throw error
  }
}

/**
 * Update a token cost record
 */
export async function updateTokenCost(
  date: string,
  data: Partial<TokenCostInput>
): Promise<TokenCostRecord> {
  const client = getDatabaseClient()

  // Get current record
  const current = await getTokenCostByDate(date)
  if (!current) {
    throw new Error(`No token cost record found for date ${date}`)
  }

  // Merge with existing data
  const merged: TokenCostInput = {
    date,
    tavily_eur: data.tavily_eur ?? current.tavily_eur,
    claude_eur: data.claude_eur ?? current.claude_eur,
    gpt_eur: data.gpt_eur ?? current.gpt_eur,
    render_eur: data.render_eur ?? current.render_eur,
    other_eur: data.other_eur ?? current.other_eur,
    notes: data.notes ?? current.notes,
  }

  return addTokenCost(merged)
}

/**
 * Delete a token cost record
 */
export async function deleteTokenCost(date: string): Promise<boolean> {
  const client = getDatabaseClient()

  try {
    const result = await client.execute({
      sql: 'DELETE FROM token_costs WHERE date = ?',
      args: [date],
    })

    return (result.rowsAffected || 0) > 0
  } catch (error) {
    console.error('Error deleting token cost:', error)
    throw error
  }
}

/**
 * Get aggregated statistics
 */
export async function getTokenCostStats(days: number = 30): Promise<{
  totalCost: number
  averageDailyCost: number
  averageWeeklyCost: number
  breakdown: {
    tavily: number
    claude: number
    gpt: number
    render: number
    other: number
  }
  recordCount: number
}> {
  const costs = await getTokenCosts(days)

  if (costs.length === 0) {
    return {
      totalCost: 0,
      averageDailyCost: 0,
      averageWeeklyCost: 0,
      breakdown: {
        tavily: 0,
        claude: 0,
        gpt: 0,
        render: 0,
        other: 0,
      },
      recordCount: 0,
    }
  }

  const totalCost = costs.reduce((sum, record) => sum + record.total_eur, 0)
  const averageDailyCost = costs.length > 0 ? totalCost / costs.length : 0
  const averageWeeklyCost = averageDailyCost * 7

  const breakdown = {
    tavily: costs.reduce((sum, record) => sum + record.tavily_eur, 0),
    claude: costs.reduce((sum, record) => sum + record.claude_eur, 0),
    gpt: costs.reduce((sum, record) => sum + record.gpt_eur, 0),
    render: costs.reduce((sum, record) => sum + record.render_eur, 0),
    other: costs.reduce((sum, record) => sum + record.other_eur, 0),
  }

  return {
    totalCost,
    averageDailyCost,
    averageWeeklyCost,
    breakdown,
    recordCount: costs.length,
  }
}
