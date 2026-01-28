import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import {
  monthlyToAnnual,
  formatNumber,
  sumExpenses,
} from "../services/financeHelpers";

const COLORS = ["#0088FE", "#FF8042"];

export default function IncomeVsExpensesPieChart({ scenario }) {
  if (!scenario) return null;

  // const income = scenario.income?.grossAnnual ?? 0;
  const netAnnual = scenario.income?.netAnnual ?? 0;

  const expenses = sumExpenses(scenario.expenses || {}); // Ensure expenses is defined
  const annualExpenses = monthlyToAnnual(expenses);

  const data = [
    { name: "Net Income", value: netAnnual },
    { name: "Expenses", value: annualExpenses },
    // { name: "Expenses", value: expenses },
  ];

  return (
    <div className="my-8" width="100%">
      <h4 className="text-lg font-semibold mb-2 text-center">
        Net Annual Income vs. Annual Expenses
      </h4>
      <PieChart width={300} height={200}>
        <Pie
          data={data}
          cx={150}
          cy={100}
          innerRadius={40}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          // label
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
        <Legend wrapperStyle={{ marginBottom: -10 }} />
      </PieChart>
      <div className="text-center mt-2">
        <span className="font-semibold">
          {/* Savings: ${income - annualExpenses} */}
          {/* Residuals: {formatNumber(income - annualExpenses)} */}
          Annual Surplus: {formatNumber(netAnnual - annualExpenses)}
        </span>
      </div>
    </div>
  );
}

// This component renders a pie chart comparing income and total expenses.
// It expects `scenario` to contain income and expenses data.
// The `sumExpenses` function calculates the total expenses, including taxes and custom expenses.
// If no scenario is provided, it returns null to avoid rendering an empty chart.
// The chart displays the income and expenses as slices of the pie, with a tooltip and legend.
// It also shows the calculated savings below the chart.
