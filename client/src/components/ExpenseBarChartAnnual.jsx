import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  //   toNumber,
  monthlyToAnnual,
  //   annualToMonthly,
} from "../services/financeHelpers";

function formatCurrency(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

function formatCurrencyShort(n) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export default function ExpenseBarChartAnnual({ expenses }) {
  if (!expenses) return null;
  // Convert monthly expenses to annual for the chart
  const data = [
    { name: "Rent", value: monthlyToAnnual(expenses.rent ?? 0) },
    { name: "Groceries", value: monthlyToAnnual(expenses.groceries ?? 0) },
    { name: "Healthcare", value: monthlyToAnnual(expenses.healthcare ?? 0) },
    { name: "Childcare", value: monthlyToAnnual(expenses.childcare ?? 0) },
    {
      name: "Transportation",
      value: monthlyToAnnual(expenses.transportation ?? 0),
    },
    { name: "Utilities", value: monthlyToAnnual(expenses.utilities ?? 0) },
    {
      name: "Discretionary",
      value: monthlyToAnnual(expenses.discretionary ?? 0),
    },
    ...(Array.isArray(expenses.customExpenses)
      ? expenses.customExpenses
          .filter(
            (e) =>
              e &&
              typeof e.label === "string" &&
              Number.isFinite(Number(e.amount))
          )
          .map((expense, idx) => ({
            name: expense.label || `Custom ${idx + 1}`,
            value: monthlyToAnnual(Number(expense.amount)),
          }))
      : []),
  ].filter((item) => item.value > 0); // Only show non-zero expenses;

  return (
    <div className="my-8">
      <h4 className="text-lg font-semibold mb-2 text-center">
        Annual Expense Breakdown
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis tickFormatter={formatCurrencyShort} />
          <Tooltip formatter={(value) => formatCurrency(value)} />
          <Legend />
          <Bar dataKey="value" stackId="a" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
