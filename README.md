# Ledger — Personal Finance Tracker

A full-stack finance tracker with auth, transaction CRUD, and an analytics
dashboard. Built as a portfolio project to demonstrate frontend (React),
backend (Flask/REST API), database (SQLAlchemy/Postgres), and basic data
analytics (aggregation + charts) in one project.

## Stack

- **Frontend:** React (Vite), React Router, Recharts
- **Backend:** Flask, Flask-SQLAlchemy, Flask-JWT-Extended
- **Database:** SQLite for local dev, swap to Postgres for deployment

## Project structure

```
finance-tracker/
  backend/
    app.py            # Flask app factory
    config.py         # Config (DB URI, JWT secret, CORS origin)
    models.py         # User, Transaction models
    routes/
      auth.py         # /api/auth/signup, /api/auth/login
      transactions.py # /api/transactions CRUD + /summary aggregation
    run.py            # Entry point
    requirements.txt
  frontend/
    src/
      pages/          # Login, Signup, Dashboard
      components/     # TransactionForm, TransactionList, AnalyticsCharts
      context/         # AuthContext (token/user state)
      api.js          # fetch wrapper for the backend
```

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
- Add/delete transactions from the UI (edit endpoint exists in the API,
  not yet wired to the frontend — good next step)
- A `/summary` endpoint that aggregates spend by category and by month
- A dashboard with a totals strip, a pie chart (spend by category), and
  a line chart (income vs. expense trend)

## Suggested next steps (for you to build as you learn more)

1. Wire up the "edit transaction" flow in the UI (backend route already exists).
2. Add a month filter/picker to the dashboard.
3. Add budget goals per category with a progress indicator.
4. Deploy: backend to Render/Railway, frontend to Vercel/Netlify, swap
   SQLite for Postgres via the `DATABASE_URL` env var.
5. Add tests (pytest for the backend, React Testing Library for the frontend).

## Notes on the design

The UI intentionally avoids the generic "SaaS dashboard with rounded cards"
look. Instead it borrows from real accounting ledgers — ruled rows, serif
numerals, a paper-like background — since that's a more honest fit for a
finance app and gives you something to point to as a deliberate design
choice in an interview.
