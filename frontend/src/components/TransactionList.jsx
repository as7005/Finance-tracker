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

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}

function EditRow({ txn, onSave, onCancel }) {
  const [type, setType] = useState(txn.type);
  const [amount, setAmount] = useState(txn.amount);
  const [category, setCategory] = useState(txn.category);
  const [note, setNote] = useState(txn.note || "");
  const [date, setDate] = useState(txn.date);

  function handleSubmit(e) {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onSave({ type, amount: Number(amount), category, note, date });
  }

  return (
    <form className="txn-row txn-row-edit" onSubmit={handleSubmit}>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="edit-input"
      />
      <span style={{ display: "flex", gap: 8 }}>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="edit-input"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="edit-input"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </span>
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        className="edit-input"
      />
      <input
        type="number"
        step="0.01"
        min="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="edit-input amount-input"
      />
      <span style={{ display: "flex", gap: 6 }}>
        <button type="submit" className="save-btn" title="Save">
          ✓
        </button>
        <button type="button" className="cancel-btn" onClick={onCancel} title="Cancel">
          ×
        </button>
      </span>
    </form>
  );
}

export default function TransactionList({ transactions, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);

  if (transactions.length === 0) {
    return <div className="empty-state">No entries yet. Add your first one above.</div>;
  }

  return (
    <div>
      {transactions.map((t) =>
        editingId === t.id ? (
          <EditRow
            key={t.id}
            txn={t}
            onCancel={() => setEditingId(null)}
            onSave={async (updated) => {
              await onUpdate(t.id, updated);
              setEditingId(null);
            }}
          />
        ) : (
          <div className="txn-row" key={t.id}>
            <span className="date">{formatDate(t.date)}</span>
            <span onClick={() => setEditingId(t.id)} style={{ cursor: "pointer" }}>
              <span className="category">{t.category}</span>
              {t.note && <span className="note">{t.note}</span>}
            </span>
            <span></span>
            <span className={`amount num ${t.type}`}>
              {t.type === "expense" ? "−" : "+"}₹{t.amount.toFixed(2)}
            </span>
            <span style={{ display: "flex", gap: 4 }}>
              <button
                className="delete-btn"
                onClick={() => setEditingId(t.id)}
                aria-label="Edit entry"
                title="Edit entry"
              >
                ✎
              </button>
              <button
                className="delete-btn"
                onClick={() => onDelete(t.id)}
                aria-label="Delete entry"
                title="Delete entry"
              >
                ×
              </button>
            </span>
          </div>
        )
      )}
    </div>
  );
}