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
//     { name: "Rent", value: expenses.rent ?? 0 },
//     { name: "Groceries", value: expenses.groceries ?? 0 },
//     { name: "Healthcare", value: expenses.healthcare ?? 0 },
//     { name: "Childcare", value: expenses.childcare ?? 0 },
//     { name: "Transportation", value: expenses.transportation ?? 0 },
//     { name: "Utilities", value: expenses.utilities ?? 0 },
//     { name: "Discretionary", value: expenses.discretionary ?? 0 },
//     // Add custom expenses if needed
//   ].filter((item) => item.value > 0); // Only show non-zero expenses;;

//   return (
//     <div className="my-8">
//       <h4 className="text-lg font-semibold mb-2 text-center">
//         Expense Breakdown
//       </h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <BarChart data={data}>
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
export default function ExpenseBarChart({ expenses }) {
  if (!expenses) return null;

  const data = [
    { name: "Rent", value: Number(expenses.rent) || 0 },
    { name: "Groceries", value: Number(expenses.groceries) || 0 },
    { name: "Healthcare", value: Number(expenses.healthcare) || 0 },
    { name: "Childcare", value: Number(expenses.childcare) || 0 },
    { name: "Transportation", value: Number(expenses.transportation) || 0 },
    { name: "Utilities", value: Number(expenses.utilities) || 0 },
    { name: "Discretionary", value: Number(expenses.discretionary) || 0 },

    ...(Array.isArray(expenses.customExpenses)
      ? expenses.customExpenses
          .filter(
            (e) =>
              e &&
              typeof e.name === "string" &&
              Number.isFinite(Number(e.amount))
          )
          .map((expense, idx) => ({
            name: expense.label || `Custom ${idx + 1}`,
            value: Number(expense.amount),
          }))
      : []),
  ].filter((item) => item.value > 0); // Only show non-zero expenses;

  const safeData = data.filter(
    (d) => d && typeof d.name === "string" && Number.isFinite(d.value)
  );

  if (!safeData.length) return null;

  return (
    <div className="my-8">
      <h4 className="text-lg font-semibold mb-2 text-center">
        Expense Breakdown
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={safeData}>
          <XAxis dataKey="name" />
          <YAxis />
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
          <Bar dataKey="value" stackId="a" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// This component renders a bar chart showing the breakdown of expenses.
// It expects `expenses` to be an object with properties for each expense category.
// If no expenses are provided, it returns null to avoid rendering an empty chart.
