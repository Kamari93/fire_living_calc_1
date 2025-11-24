import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#e53e3e", "#f59e42", "#38bdf8", "#6366f1", "#10b981"];

export default function LiabilitiesPieChart({ liabilities }) {
  if (!liabilities) return <div>No liabilities data.</div>;

  // Prepare data for the chart
  const data = [
    { name: "Student Loans", value: liabilities.studentLoans || 0 },
    { name: "Mortgage", value: liabilities.mortgage || 0 },
    { name: "Car Loan", value: liabilities.carLoan || 0 },
    { name: "Credit Card", value: liabilities.creditCardDebt || 0 },
    { name: "Other Debts", value: liabilities.otherDebts || 0 },
  ].filter((item) => item.value > 0); // Only show non-zero liabilities

  if (data.length === 0) return <div>No liabilities to display.</div>;

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {data.map((entry, idx) => (
            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) =>
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(value)
          }
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
