# OpenClaw System Dashboard — Setup

## Environment Variables (Render)

The Performance tab requires Turso database credentials. Set these in **Render Dashboard** → Stefan OpenClaw System Dashboard → Environment:

```
TURSO_DATABASE_URL=libsql://stefan-portfolio-stefangur.aws-eu-west-1.turso.io
TURSO_AUTH_TOKEN=<your-turso-auth-token>
```

### Where to find:
1. **Turso Dashboard:** https://turso.tech/app/databases
2. Copy the database URL and auth token
3. Paste into Render environment

### Test:
```bash
curl https://stefan-openclaw-system-dashboard.onrender.com/api/system-metrics
```

Should return `{"success": true, "metrics": [...]}`, not `{"error": "..."}`.

---

## Cron Job Setup

The `system_metrics` table is populated by a cron job that runs every 10 minutes.
Configure it in OpenClaw Cron (monitor:render-ping or similar).
