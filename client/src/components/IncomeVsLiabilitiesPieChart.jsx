import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FolderMinus } from "lucide-react";

const COLORS = [
  "#10b981",
  "#e53e3e",
  "#f59e42",
  "#38bdf8",
  "#6366f1",
  "#f43f5e",
];

export default function IncomeVsLiabilitiesPieChart({ income, liabilities }) {
  if (!income || !liabilities) return <div>No data available.</div>;

  const netIncome = income.netAnnual || 0;
  const totalLiabilities =
    (liabilities.studentLoans || 0) +
    (liabilities.mortgage || 0) +
    (liabilities.carLoan || 0) +
    (liabilities.creditCardDebt || 0) +
    (liabilities.otherDebts || 0);

  const incomeRemaining = Math.max(netIncome - totalLiabilities, 0);

  const data = [
    { name: "Income Remaining", value: incomeRemaining },
    { name: "Student Loans", value: liabilities.studentLoans || 0 },
    { name: "Mortgage", value: liabilities.mortgage || 0 },
    { name: "Car Loan", value: liabilities.carLoan || 0 },
    { name: "Credit Card", value: liabilities.creditCardDebt || 0 },
    { name: "Other Debts", value: liabilities.otherDebts || 0 },
  ].filter((item) => item.value > 0);

  if (data.length === 0) return <div>No income or liabilities to display.</div>;

  return (
    <ResponsiveContainer height={250} width="100%">
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
