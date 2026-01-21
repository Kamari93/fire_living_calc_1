# Financial Independence Assistant

A MERN app to model income, expenses, and estimate your path to financial independence (FIRE). Build scenarios, compare them with charts, and get AI-powered insights.

## Live App: [Financial Independence Assistant](https://firelivingcalc1client.vercel.app/)

## Key features

## Features

- **Scenario Builder** — Add income, expenses, assets, liabilities, and FIRE goals
- **Live Calculations** — See net worth, annual surplus, and estimated FI year in real-time
- **Comparisons** — Compare multiple scenarios side-by-side with charts and tax breakdowns
- **AI Insights** — Get AI-powered analysis and suggestions for your scenarios
- **Server-Verified** — All calculations verified and persisted on the backend

---

## Repo layout

- client/ — React app (ScenarioFormAlt.jsx, charts, pages)
- server/ — Express + Mongoose API (models/Scenario.js, utils/financeHelpers)
- server/utils — server-side finance helpers
- server/scripts — one-off migration/backfill scripts
- README.md — this file

---

## Quick start (macOS)

1. Set env variables (example)

   - MONGO_URL — MongoDB connection string
   - PORT — server port (default 4000)
   - REACT_APP_API_URL — client API base (http://localhost:4000)

2. Install

   - Server
     cd server
     npm install
   - Client
     cd ../client
     npm install

3. Run (each in its own terminal)
   - Server
     cd server
     npm start
   - Client
     cd client
     npm start

(Adjust scripts if you use a monorepo dev command or pm2/concurrently.)

---

## Important maintenance / data safety

- Backup DB before running any migration:
  mongodump --uri="$MONGO_URL" --archive=~/scenario-backup-$(date +%Y%m%d).gz --gzip

- If a prior bug inflated expense values (monthly ↔ annual conversion), use the safe migration script:
  node server/scripts/fix-inflated-expenses.js
  The script is heuristic — inspect logs and backup before applying.

- Backfill computed FI metadata for existing scenarios:
  node server/scripts/backfill-computed-fi.js

---

## Inputs

- Current net worth (assets − liabilities)
- Annual surplus (income − expenses)
- Target net worth
- Expected annual return rate

---

## How it works

- Client computes live estimate for instant feedback
- Server recomputes and stores authoritative value when scenario is saved
- Audit trail includes computed inputs and timestamp

---

## API notes (server)

- Create/update scenario endpoints will:
  - Validate and normalize numeric inputs
  - Recompute canonical netWorth, annualSurplus and computedFIYear
  - Persist:
    - fireGoal.estimatedFIYear (user override)
    - fireGoal.computedFIYear (server-authoritative)
    - fireGoal.computedInputs and computedAt (audit trail)

---

## Developer notes & suggestions

- All expenses stored as annual values in the database
- Estimated FI year (user input) vs computed FI year (server-calculated) kept separate for audit trail
- AI features require valid OPENAI_API_KEY in environment
- Rate limiting applied to AI endpoints
- User-entered FI estimates are editable and separate from server-computed values

---

## Contributing

- Branch from main, open PRs with descriptive titles.
- Include tests for any change to finance logic.
- Run linter and basic unit tests before PR.

---
