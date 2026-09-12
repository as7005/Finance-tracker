import React, { useState } from "react";

const CATEGORIES = [
  "Food",
  "Transport",
  "Rent",
  "Utilities",
  "Shopping",
  "Health",
  "Entertainment",
  "Salary",
  "Other",
];

const today = () => new Date().toISOString().slice(0, 10);

export default function TransactionForm({ onAdd }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(today());

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;

    onAdd({ type, amount: Number(amount), category, note, date });

    setAmount("");
    setNote("");
  }

  return (
    <form className="txn-form" onSubmit={handleSubmit}>
      <div className="field">
        <label>Type</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <div className="field">
        <label>Category</label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label>Amount</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          required
        />
      </div>

      <div className="field">
        <label>Note (optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. groceries at market"
        />
      </div>

      <button className="btn-add" type="submit">
        Add entry
      </button>
    </form>
  );
}
