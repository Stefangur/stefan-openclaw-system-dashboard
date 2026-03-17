# Token Usage Table Creation - TASK 1

## Portfolio Database SQL

Execute this SQL command in the **TURSO_DATABASE_URL_PORTFOLIO** database:

```sql
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
);
```

## How to Execute

### Option 1: Using Turso CLI (Recommended)

```bash
# Login to Turso (if not already logged in)
turso auth login

# Connect to the portfolio database
turso db shell [database-name]

# Paste and run the CREATE TABLE statement above
```

### Option 2: Using LibSQL Node Client (In Code)

```javascript
import { createClient } from '@libsql/client'

const client = createClient({
  url: process.env.TURSO_DATABASE_URL_PORTFOLIO,
  authToken: process.env.TURSO_AUTH_TOKEN_PORTFOLIO,
})

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

console.log('✅ token_usage table created')
```

## Table Schema

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique record identifier |
| `date` | DATE | UNIQUE, NOT NULL | Token usage date (YYYY-MM-DD) |
| `total_tokens` | INTEGER | NOT NULL | Total tokens used on that date |
| `input_tokens` | INTEGER | DEFAULT 0 | Tokens from input prompts |
| `output_tokens` | INTEGER | DEFAULT 0 | Tokens from responses |
| `cost_usd` | DECIMAL(10,6) | DEFAULT 0 | Cost in USD for that day |
| `model` | TEXT | NULLABLE | Model used (e.g., 'claude-opus', 'gpt-4') |
| `subagent_count` | INTEGER | DEFAULT 0 | Number of subagents spawned |
| `notes` | TEXT | NULLABLE | Additional notes/context |
| `created_at` | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

## Verification

After creating the table, verify with:

```sql
SELECT sql FROM sqlite_master WHERE type='table' AND name='token_usage';
```

You should see the CREATE TABLE statement returned.

## API Endpoints Using This Table

### 1. POST /api/token-usage-add
Adds or updates token usage for a specific date.

**Request:**
```bash
curl -X POST "https://[domain]/api/token-usage-add" \
  -H "X-Butler-Token: butler-stefan-2026" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-03-17",
    "total_tokens": 125000,
    "input_tokens": 45000,
    "output_tokens": 80000,
    "cost_usd": 0.75,
    "model": "claude-opus",
    "subagent_count": 3,
    "notes": "System dashboard refresh + report generation"
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "Token usage data for 2026-03-17 saved successfully",
  "data": {
    "id": 1,
    "date": "2026-03-17",
    "totalTokens": 125000,
    "inputTokens": 45000,
    "outputTokens": 80000,
    "costUsd": "0.75",
    "model": "claude-opus",
    "subagentCount": 3,
    "notes": "System dashboard refresh + report generation",
    "createdAt": "2026-03-17T21:42:00.000Z"
  }
}
```

### 2. GET /api/token-stats/monthly
Fetches monthly and overall token usage statistics.

**Request:**
```bash
curl -X GET "https://[domain]/api/token-stats/monthly" \
  -H "X-Butler-Token: butler-stefan-2026"
```

**Response:**
```json
{
  "monthly": [
    {
      "month": "2026-03-01",
      "totalTokens": 3750000,
      "inputTokens": 1350000,
      "outputTokens": 2400000,
      "costUsd": "22.50",
      "daysTracked": 30,
      "avgDailyTokens": 125000,
      "peakDayTokens": 250000,
      "entries": 30
    }
  ],
  "monthToDate": {
    "totalTokens": 1250000,
    "inputTokens": 450000,
    "outputTokens": 800000,
    "costUsd": "7.50",
    "daysTracked": 10,
    "modelsUsed": 2,
    "peakSubagentCount": 5,
    "avgDailyTokens": 125000
  },
  "overall": {
    "totalTokens": 3750000,
    "inputTokens": 1350000,
    "outputTokens": 2400000,
    "totalCostUsd": "22.50",
    "totalDaysTracked": 30,
    "avgDailyTokens": 125000,
    "firstTrackedDate": "2026-02-15",
    "lastTrackedDate": "2026-03-17",
    "uniqueModels": 3,
    "maxSubagentsInDay": 5
  },
  "timestamp": "2026-03-17T21:42:00.000Z"
}
```

---

**Status:** ✅ Table schema defined and ready for creation
**Implementation Date:** 2026-03-17
**Created for:** stefan-openclaw-system-dashboard
