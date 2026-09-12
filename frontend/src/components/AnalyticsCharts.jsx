import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const SLICE_COLORS = [
  "#a8842f",
  "#4f7a5e",
  "#b0553b",
  "#5b6673",
  "#8a6d3b",
  "#3f6a52",
  "#8f4433",
  "#22303f",
];

export default function AnalyticsCharts({ byCategory, byMonth }) {
  return (
    <div className="charts-grid">
      <div>
        <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--ink-soft)" }}>
          Spend by category
        </h3>
        {byCategory.length === 0 ? (
          <p className="empty-state">Nothing to show yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={byCategory}
                dataKey="total"
                nameKey="category"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
              >
                {byCategory.map((entry, i) => (
                  <Cell
                    key={entry.category}
                    fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [`₹${value.toFixed(2)}`, name]}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div>
        <h3 style={{ fontSize: 14, marginBottom: 8, color: "var(--ink-soft)" }}>
          Income vs expense by month
        </h3>
        {byMonth.length === 0 ? (
          <p className="empty-state">Nothing to show yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={byMonth}>
              <CartesianGrid stroke="#d8d0be" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip formatter={(value) => `₹${value.toFixed(2)}`} />
              <Line type="monotone" dataKey="income" stroke="#4f7a5e" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="expense" stroke="#b0553b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
