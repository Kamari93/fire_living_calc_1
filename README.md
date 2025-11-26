# Cost of Living & FIRE Calculator

Lightweight MERN app to model income, expenses, net worth and estimate a FIRE (financial independence) year. UX computes estimates live in the browser; the server verifies and persists computed audit data.

Status: working MVP. AI integration (assistant/insights) — in progress.

## Live App: [Cost of Living/FIRE Calc App](https://firelivingcalc1client.vercel.app/)

## Key features

- Multi-step scenario form (income, expenses, assets, liabilities, FIRE goal)
- Expenses normalized/stored as annual values
- Live computed totals: expenses (annual/monthly), assets, liabilities, net worth, annual surplus
- Estimated FI year computed from net worth, annual surplus, expected return and target net worth
- Server-authoritative computedFIYear + audit inputs persisted (computedAt, computedInputs)
- Comparison view with charts and tax breakdown popovers

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

## How FI year is calculated (summary)

- Inputs:
  - Current net worth (assets − liabilities)
  - Annual contribution (annualSurplus = netAnnual + additionalIncome − totalAnnualExpenses)
  - Target net worth (user-provided or computed as totalAnnualExpenses / withdrawalRate)
  - Expected annual return (investmentReturnRate)
- Math:
  - Solves for t in: W*(1+r)^t + C*((1+r)^t − 1)/r ≥ target
  - Uses closed-form: t = ln((T + C/r) / (W + C/r)) / ln(1+r)
  - Edge handling: r = 0 (linear), zero/negative contributions → no finite solution shown as N/A
- UX:
  - Client computes an estimatedFIYear for live feedback.
  - Client sends computed metadata on save.
  - Server recomputes and writes authoritative computedFIYear, computedInputs, computedAt.

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

- Store and treat expenses as annual values in the DB. Convert on the client only for display if needed.
- Keep user-entered estimatedFIYear editable and separate from computedFIYear.
- Add unit tests for finance helpers (estimateYearsToTarget edge cases).
- Consider adding a UI to let users "accept computed FI" (copy computedFIYear → estimatedFIYear).
- Provide a clear tooltip/info popover explaining assumptions (no tax/inflation, end-of-year contributions).

---

## AI integration

- Short note: AI-driven insights & assistant integrations are in progress. Plans:
  - Contextual explanations of calculations
  - Natural-language scenario summarization
  - Interactive suggestion of saving targets or reducing expenses
- No production AI features yet; follow security & privacy review before enabling user-facing AI.

---

## Contributing

- Branch from main, open PRs with descriptive titles.
- Include tests for any change to finance logic.
- Run linter and basic unit tests before PR.

---
