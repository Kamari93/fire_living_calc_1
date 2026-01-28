import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { formatNumber, sumExpenses } from "../services/financeHelpers";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
  "#a4de6c",
];

export default function ExpensePieChart({ expenses }) {
  if (!expenses) return null;
  const totalExpenses = sumExpenses(expenses || {}); // Ensure expenses is defined

  const data = [
    { name: "Rent", value: expenses.rent ?? 0 },
    { name: "Groceries", value: expenses.groceries ?? 0 },
    { name: "Healthcare", value: expenses.healthcare ?? 0 },
    { name: "Childcare", value: expenses.childcare ?? 0 },
    { name: "Transportation", value: expenses.transportation ?? 0 },
    { name: "Utilities", value: expenses.utilities ?? 0 },
    { name: "Discretionary", value: expenses.discretionary ?? 0 },
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
            value: Number(expense.amount),
          }))
      : []),
  ].filter((item) => item.value > 0); // Only show non-zero expenses;

  return (
    <div className="my-8" width="100%">
      <h4 className="text-lg font-semibold mb-2 text-center">
        Expense Proportions
      </h4>
      <PieChart width={300} height={250}>
        <Pie
          data={data}
          cx={150}
          cy={125}
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
        {/* <Legend /> */}
      </PieChart>
      <div className="text-center mt-2">
        <span className="font-semibold">
          Total Monthly Expenses: {formatNumber(totalExpenses)}
        </span>
      </div>
    </div>
  );
}

// This component renders a pie chart showing the breakdown of expenses.
// It expects `expenses` to be an object with properties for each expense category.
// If no expenses are provided, it returns null to avoid rendering an empty chart.
