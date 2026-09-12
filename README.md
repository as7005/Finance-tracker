# Ledger — Personal Finance Tracker

**Live app:** https://finance-tracker-rouge-mu.vercel.app
**Backend API:** https://finance-tracker-vb0h.onrender.com/api/health

A full-stack finance tracker with auth, transaction CRUD, and an analytics
dashboard. Built as a portfolio project to demonstrate frontend (React),
backend (Flask/REST API), database (SQLAlchemy/Postgres), and basic data
analytics (aggregation + charts) in one project.

> Note: the backend is hosted on Render's free tier, which sleeps after
> 15 minutes of inactivity. The first request after a period of inactivity
> can take up to a minute to respond while it wakes up.

## Stack

- **Frontend:** React (Vite), React Router, Recharts — deployed on Vercel
- **Backend:** Flask, Flask-SQLAlchemy, Flask-JWT-Extended — deployed on Render
- **Database:** PostgreSQL, hosted on Neon

## Project structure
finance-tracker/
backend/
app.py # Flask app factory
config.py # Config (DB URI, JWT secret, CORS origin)
models.py # User, Transaction models
routes/
auth.py # /api/auth/signup, /api/auth/login
transactions.py # /api/transactions CRUD + /summary aggregation
run.py # Entry point
requirements.txt
frontend/
src/
pages/ # Login, Signup, Dashboard
components/ # TransactionForm, TransactionList, AnalyticsCharts
context/ # AuthContext (token/user state)
api.js # fetch wrapper for the backend


## Running locally

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate   # venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env       # edit if needed
python run.py
```

The API runs at `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

## What's implemented

- Signup/login with JWT auth, passwords hashed with Werkzeug
- Per-user transactions (income/expense) with category and note
- Add/edit/delete transactions from the UI, all backed by the REST API
- A `/summary` endpoint that aggregates spend by category and by month
- A dashboard with a totals strip, a pie chart (spend by category), and
  a line chart (income vs. expense trend)

## Challenges solved

A few real issues hit while building and deploying this, worth mentioning
in an interview:

- **JWT identity type mismatch:** newer versions of Flask-JWT-Extended
  require the token's `identity` claim to be a string. The initial code
  passed the user's integer ID directly, which caused every authenticated
  request to fail with a `422` after login succeeded. Fixed by casting
  to `str()` when creating the token and back to `int()` when reading it.
- **npm 12's new script policy:** npm changed its default security posture
  to block dependencies' install scripts (like esbuild's, which Vite
  depends on) unless explicitly approved. This broke the Vercel build with
  a `Permission denied` error on the `vite` binary. Fixed by adding an
  `allowScripts` entry to `package.json`.
- **CORS + moving preview URLs:** Vercel generates a new preview URL on
  every deployment, which kept breaking the backend's CORS allowlist.
  Fixed by pointing the backend's `FRONTEND_ORIGIN` at Vercel's stable
  production domain instead of a per-deploy preview link.
- **Postgres connection string formatting:** the `DATABASE_URL` needs to
  be a single raw connection string with no surrounding quotes or
  multi-line `.env` formatting — easy to get wrong when copying from a
  provider's dashboard snippet.

## Suggested next steps (for you to build as you learn more)

1. Add a month filter/picker to the dashboard.
2. Add budget goals per category with a progress indicator.
3. Add tests (pytest for the backend, React Testing Library for the frontend).

## Notes on the design

The UI intentionally avoids the generic "SaaS dashboard with rounded cards"
look. Instead it borrows from real accounting ledgers — ruled rows, serif
numerals, a paper-like background — since that's a more honest fit for a
finance app and gives you something to point to as a deliberate design
choice in an interview.