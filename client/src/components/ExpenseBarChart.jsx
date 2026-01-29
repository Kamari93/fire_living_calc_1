import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const currencyFormatter = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function ExpenseBarChart({ expenses, compact = false }) {
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
      value: Number(value) || 0,
    })),
    ...(Array.isArray(expenses.customExpenses)
      ? expenses.customExpenses.map((e, idx) => ({
          name: e.label || `Custom ${idx + 1}`,
          value: Number(e.amount) || 0,
        }))
      : []),
  ]
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!normalized.length) return null;

  // Optional: cap number of visible bars
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
        Expense Breakdown
      </h4>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout={layout}
          margin={
            compact
              ? { top: 20, right: 10, left: 10, bottom: 40 }
              : { top: 10, right: 30, left: 20, bottom: 10 }
          }
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
                domain={[0, "dataMax * 12"]}
                tickFormatter={currencyFormatter}
              />
              <YAxis type="category" dataKey="name" width={140} />
            </>
          )}

          <Tooltip formatter={currencyFormatter} />
          <Bar dataKey="value" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
      {/* <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
        >
          <XAxis
            type="number"
            domain={[0, "dataMax"]}
            // padding={{ left: 20, right: 20 }}
            tickFormatter={currencyFormatter}
          />
          <YAxis type="category" dataKey="name" width={140} />
          <Tooltip formatter={currencyFormatter} />
          <Bar
            dataKey="value"
            fill="#6366f1"
            radius={[4, 4, 4, 4]}
            minPointSize={6}
          />
        </BarChart>
      </ResponsiveContainer> */}
    </div>
  );
}

// This component renders a bar chart showing the breakdown of expenses.
// It expects `expenses` to be an object with properties for each expense category.
// If no expenses are provided, it returns null to avoid rendering an empty chart.

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
// export default function ExpenseBarChart({ expenses }) {
//   if (!expenses) return null;

//   const data = [
//     { name: "Rent", value: Number(expenses.rent) || 0 },
//     { name: "Groceries", value: Number(expenses.groceries) || 0 },
//     { name: "Healthcare", value: Number(expenses.healthcare) || 0 },
//     { name: "Childcare", value: Number(expenses.childcare) || 0 },
//     { name: "Transportation", value: Number(expenses.transportation) || 0 },
//     { name: "Utilities", value: Number(expenses.utilities) || 0 },
//     { name: "Discretionary", value: Number(expenses.discretionary) || 0 },

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
//             value: Number(expense.amount),
//           }))
//       : []),
//   ].filter((item) => item.value > 0); // Only show non-zero expenses;

//   const safeData = data.filter(
//     (d) => d && typeof d.name === "string" && Number.isFinite(d.value)
//   );

//   if (!safeData.length) return null;

//   return (
//     <div className="my-8">
//       <h4 className="text-lg font-semibold mb-2 text-center">
//         Expense Breakdown
//       </h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={safeData}>
//           <XAxis dataKey="name" />
//           <YAxis />
//           <Tooltip
//             formatter={(value) =>
//               new Intl.NumberFormat("en-US", {
//                 style: "currency",
//                 currency: "USD",
//                 maximumFractionDigits: 0,
//               }).format(value)
//             }
//           />
//           <Legend />
//           <Bar dataKey="value" stackId="a" fill="#8884d8" />
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
