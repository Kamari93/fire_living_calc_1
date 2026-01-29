import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { monthlyToAnnual } from "../services/financeHelpers";

// const currencyFormatter = (value) =>
//   new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(value);

function currencyFormatter(n) {
  if (n >= 1_000_000) {
    // Number() removes unnecessary trailing zeros (e.g., 2.0 -> 2)
    return `$${Number((n / 1_000_000).toFixed(1))}M`;
  }
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}

export default function ExpenseBarChartAnnual({ expenses, compact = false }) {
  if (!expenses) return null;

  const layout = compact ? "horizontal" : "vertical";
  const baseExpenses = [
    ["Rent", expenses.rent],
    ["Groceries", expenses.groceries],
    ["Healthcare", expenses.healthcare],
    ["Childcare", expenses.childcare],
    ["Transportation", expenses.transportation],
    ["Utilities", expenses.utilities],
    ["Discretionary", expenses.discretionary],
  ];

  const normalized = [
    ...baseExpenses.map(([name, value]) => ({
      name,
      value: monthlyToAnnual(Number(value) || 0),
    })),
    ...(Array.isArray(expenses.customExpenses)
      ? expenses.customExpenses.map((e, idx) => ({
          name: e.label || `Custom ${idx + 1}`,
          value: monthlyToAnnual(Number(e.amount) || 0),
        }))
      : []),
  ]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!normalized.length) return null;

  // Optional cap for readability
  const MAX_ITEMS = 10;
  let data = normalized;

  if (normalized.length > MAX_ITEMS) {
    const top = normalized.slice(0, MAX_ITEMS);
    const rest = normalized.slice(MAX_ITEMS);
    const otherTotal = rest.reduce((sum, d) => sum + d.value, 0);

    data = [...top, { name: "Other", value: otherTotal }];
  }

  const BAR_HEIGHT = 36;
  const chartHeight = Math.max(data.length * BAR_HEIGHT, 250);

  return (
    <div className="my-6 p-4 bg-white rounded-lg shadow">
      <h4 className="text-lg font-semibold mb-4 text-center">
        Annual Expense Breakdown
      </h4>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout={layout}
          // margin={
          //   compact
          //     ? { top: 20, right: 10, left: 10, bottom: 40 }
          //     : { top: 10, right: 30, left: 20, bottom: 10 }
          // }
        >
          {compact ? (
            <>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tickFormatter={currencyFormatter} />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                domain={[0, "dataMax"]}
                tickFormatter={currencyFormatter}
              />
              <YAxis type="category" dataKey="name" width={140} />
            </>
          )}

          <Tooltip formatter={currencyFormatter} />
          <Bar dataKey="value" fill="#0ea5e9" />
        </BarChart>
        {/* <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <XAxis type="number" tickFormatter={currencyFormatter} />
          <YAxis type="category" dataKey="name" width={140} />
          <Tooltip formatter={currencyFormatter} />
          <Bar dataKey="value" fill="#0ea5e9" radius={[4, 4, 4, 4]} />
        </BarChart> */}
      </ResponsiveContainer>
    </div>
  );
}

// import React from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";
// import {
//   //   toNumber,
//   monthlyToAnnual,
//   //   annualToMonthly,
// } from "../services/financeHelpers";

// function formatCurrency(n) {
//   return new Intl.NumberFormat("en-US", {
//     style: "currency",
//     currency: "USD",
//     maximumFractionDigits: 0,
//   }).format(n);
// }

// function formatCurrencyShort(n) {
//   if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
//   if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
//   return `$${n}`;
// }

// export default function ExpenseBarChartAnnual({ expenses }) {
//   if (!expenses) return null;
//   // Convert monthly expenses to annual for the chart
//   const data = [
//     { name: "Rent", value: monthlyToAnnual(expenses.rent ?? 0) },
//     { name: "Groceries", value: monthlyToAnnual(expenses.groceries ?? 0) },
//     { name: "Healthcare", value: monthlyToAnnual(expenses.healthcare ?? 0) },
//     { name: "Childcare", value: monthlyToAnnual(expenses.childcare ?? 0) },
//     {
//       name: "Transportation",
//       value: monthlyToAnnual(expenses.transportation ?? 0),
//     },
//     { name: "Utilities", value: monthlyToAnnual(expenses.utilities ?? 0) },
//     {
//       name: "Discretionary",
//       value: monthlyToAnnual(expenses.discretionary ?? 0),
//     },
//     ...(Array.isArray(expenses.customExpenses)
//       ? expenses.customExpenses
//           .filter(
//             (e) =>
//               e &&
//               typeof e.label === "string" &&
//               Number.isFinite(Number(e.amount))
//           )
//           .map((expense, idx) => ({
//             name: expense.label || `Custom ${idx + 1}`,
//             value: monthlyToAnnual(Number(expense.amount)),
//           }))
//       : []),
//   ].filter((item) => item.value > 0); // Only show non-zero expenses;

//   return (
//     <div className="my-8">
//       <h4 className="text-lg font-semibold mb-2 text-center">
//         Annual Expense Breakdown
//       </h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
//           <XAxis dataKey="name" />
//           <YAxis tickFormatter={formatCurrencyShort} />
//           <Tooltip formatter={(value) => formatCurrency(value)} />
//           <Legend />
//           <Bar dataKey="value" stackId="a" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
