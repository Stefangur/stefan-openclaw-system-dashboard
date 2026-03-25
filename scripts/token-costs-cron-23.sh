#!/bin/bash

# Token Costs Daily Cron Job
# Runs daily at 23:00 Vienna time
# Fetches cost data from logs/APIs and posts to /api/token-costs-add

set -e

# Configuration
DASHBOARD_URL="${DASHBOARD_URL:-https://stefan-openclaw-system-dashboard.onrender.com}"
BUTLER_TOKEN="${BUTLER_TOKEN:-butler-stefan-2026}"
TODAY=$(date -u +%Y-%m-%d)

# Log file
LOG_DIR="${HOME}/.openclaw/logs"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/heartbeat-log.md"

# Function to log messages
log_message() {
  local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
  echo "[$timestamp] [TOKEN-COSTS-CRON] $1" | tee -a "$LOG_FILE"
}

log_message "Starting token costs daily job for $TODAY"

# For now, create a placeholder entry if no data is available
# In production, this would fetch actual costs from logs/APIs

TAVILY_EUR=0
CLAUDE_EUR=0
GPT_EUR=0
RENDER_EUR=0
OTHER_EUR=0
NOTES="Daily snapshot - ${TODAY}"

# Make the API call
log_message "Posting token costs to $DASHBOARD_URL/api/token-costs-add"

RESPONSE=$(curl -s -X POST "$DASHBOARD_URL/api/token-costs-add" \
  -H "Content-Type: application/json" \
  -H "X-Butler-Token: $BUTLER_TOKEN" \
  -d "{
    \"date\": \"$TODAY\",
    \"tavily_eur\": $TAVILY_EUR,
    \"claude_eur\": $CLAUDE_EUR,
    \"gpt_eur\": $GPT_EUR,
    \"render_eur\": $RENDER_EUR,
    \"other_eur\": $OTHER_EUR,
    \"notes\": \"$NOTES\"
  }")

# Check response
if echo "$RESPONSE" | grep -q '"success":true'; then
  log_message "✅ Token costs for $TODAY successfully added"
  TOTAL=$(echo "$RESPONSE" | grep -o '"total_eur":[0-9.]*' | cut -d: -f2)
  log_message "Total cost for $TODAY: €${TOTAL}"
else
  log_message "❌ Error posting token costs: $RESPONSE"
  exit 1
fi

log_message "Token costs daily job completed successfully"
