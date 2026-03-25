import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL_PORTFOLIO,
  authToken: process.env.TURSO_AUTH_TOKEN_PORTFOLIO,
})

try {
  console.log('Creating token_usage table...')
  
  await client.execute(`
    CREATE TABLE IF NOT EXISTS token_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE UNIQUE NOT NULL,
      total_tokens INTEGER NOT NULL,
      input_tokens INTEGER DEFAULT 0,
      output_tokens INTEGER DEFAULT 0,
      cost_usd DECIMAL(10,6) DEFAULT 0,
      model TEXT,
      subagent_count INTEGER DEFAULT 0,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
  
  console.log('✅ Table created successfully')
  
  // Verify table exists
  const result = await client.execute(
    "SELECT sql FROM sqlite_master WHERE type='table' AND name='token_usage'"
  )
  
  if (result.rows.length > 0) {
    console.log('✅ Table verified in database')
  } else {
    console.log('❌ Table not found after creation')
  }
  
  process.exit(0)
} catch (error) {
  console.error('❌ Error:', error.message)
  process.exit(1)
}
