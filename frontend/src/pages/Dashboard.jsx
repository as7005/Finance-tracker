import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api.js";
import { useAuth } from "../context/AuthContext.jsx";
import TransactionForm from "../components/TransactionForm.jsx";
import TransactionList from "../components/TransactionList.jsx";
import AnalyticsCharts from "../components/AnalyticsCharts.jsx";

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ by_category: [], by_month: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [txns, summaryData] = await Promise.all([
        api.listTransactions(token),
        api.summary(token),
      ]);
      setTransactions(txns);
      setSummary(summaryData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleAdd(txn) {
    await api.createTransaction(token, txn);
    load();
  }

  async function handleDelete(id) {
    await api.deleteTransaction(token, id);
    load();
  }

  async function handleUpdate(id, updated) {
    await api.updateTransaction(token, id, updated);
    load();
  }

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <div className="app-shell">
      <div className="ledger-header">
        <div>
          <h1>Ledger</h1>
          <p className="subtitle">{user?.email}</p>
        </div>
        <button className="signout-link" onClick={logout}>
          Sign out
        </button>
      </div>

      {error && <div className="form-error" style={{ marginTop: 16 }}>{error}</div>}

      <div className="summary-strip">
        <div className="summary-cell">
          <div className="label">Income</div>
          <div className="value income num">₹{totalIncome.toFixed(2)}</div>
        </div>
        <div className="summary-cell">
          <div className="label">Expenses</div>
          <div className="value expense num">₹{totalExpense.toFixed(2)}</div>
        </div>
        <div className="summary-cell">
          <div className="label">Balance</div>
          <div className="value num">₹{balance.toFixed(2)}</div>
        </div>
      </div>

      <TransactionForm onAdd={handleAdd} />

      <div className="section-heading">
        <h2>Recent entries</h2>
      </div>
      {loading ? (
        <p className="empty-state">Loading…</p>
      ) : (
        <TransactionList
          transactions={transactions}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      <div className="section-heading">
        <h2>Analytics</h2>
      </div>
      <AnalyticsCharts byCategory={summary.by_category} byMonth={summary.by_month} />
    </div>
  );
}