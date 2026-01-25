// import React from "react";
// import { monthlyToAnnual, formatNumber } from "../services/financeHelpers";

// //helper function to display with commmas and dollar sign
// // function formatNumber(num) {
// //   return `$${num.toLocaleString()}`;
// // }

// // Helper function to sum all expenses (including custom expenses)
// function sumExpenses(expenses) {
//   if (!expenses) return 0;
//   let total =
//     (expenses.rent ?? 0) +
//     (expenses.groceries ?? 0) +
//     (expenses.healthcare ?? 0) +
//     (expenses.childcare ?? 0) +
//     (expenses.transportation ?? 0) +
//     (expenses.utilities ?? 0) +
//     (expenses.discretionary ?? 0);

//   // if (expenses.taxes) {
//   //   total +=
//   //     (expenses.taxes.federal ?? 0) +
//   //     (expenses.taxes.state ?? 0) +
//   //     (expenses.taxes.local ?? 0);
//   // }
//   if (Array.isArray(expenses.customExpenses)) {
//     total += expenses.customExpenses.reduce(
//       (sum, exp) => sum + (exp.amount ?? 0),
//       0
//     );
//   }
//   return total;
// }

// // Helper to get nested value from object using dot notation
// function getValue(obj, path) {
//   return path.split(".").reduce((acc, part) => acc && acc[part], obj);
// }

// export default function ComparisonTable({ snapshots }) {
//   if (!snapshots || snapshots.length < 2) return null;

//   // Define metrics to compare
//   const metrics = [
//     { label: "Name", key: "name" },
//     { label: "City", key: "location.city" },
//     { label: "Gross Income", key: "income.grossAnnual" },
//     { label: "Monthly Expenses", fn: (snap) => sumExpenses(snap.expenses) },
//     {
//       label: "Annual Expenses",
//       fn: (snap) => monthlyToAnnual(sumExpenses(snap.expenses)),
//     },
//     { label: "Net Worth Goal", key: "fireGoal.targetNetWorth" },
//     { label: "Desired FI Year", key: "fireGoal.estimatedFIYear" },
//     { label: "Realistic FI Year", key: "fireGoal.realisticFIYear" },
//     // { label: "Return Rate", key: "fireGoal.investmentReturnRate" },
//     // { label: "Withdrawal Rate", key: "fireGoal.withdrawalRate" },
//   ];

//   // Find best/worst values for highlighting
//   const expensesArr = snapshots.map((snap) => sumExpenses(snap.expenses));
//   const minExpense = Math.min(...expensesArr);
//   const maxExpense = Math.max(...expensesArr);

//   const annualExpensesArr = snapshots.map((snap) =>
//     monthlyToAnnual(sumExpenses(snap.expenses))
//   );
//   const minAnnualExpense = Math.min(...annualExpensesArr);
//   const maxAnnualExpense = Math.max(...annualExpensesArr);

//   const fiYearsArr = snapshots.map(
//     (snap) => getValue(snap, "fireGoal.estimatedFIYear") ?? Infinity
//   );
//   const minFIYear = Math.min(...fiYearsArr);
//   const maxFIYear = Math.max(...fiYearsArr);

//   const realisticFIYearsArr = snapshots.map(
//     (snap) => getValue(snap, "fireGoal.realisticFIYear") ?? Infinity
//   );
//   const minRealisticFIYear = Math.min(...realisticFIYearsArr);
//   const maxRealisticFIYear = Math.max(...realisticFIYearsArr);

//   const grosAnnualArr = snapshots.map(
//     (snap) => getValue(snap, "income.grossAnnual") ?? 0
//   );
//   const maxGrossAnnual = Math.max(...grosAnnualArr);
//   const minGrossAnnual = Math.min(...grosAnnualArr);

//   const netWorthArr = snapshots.map(
//     (snap) => getValue(snap, "fireGoal.targetNetWorth") ?? 0
//   );
//   const maxNetWorth = Math.max(...netWorthArr);
//   const minNetWorth = Math.min(...netWorthArr);

//   return (
//     <div className="overflow-x-auto">
//       <table className="w-full border mt-6 bg-white rounded shadow">
//         <thead>
//           <tr>
//             <th className="border px-2 py-2 bg-gray-100">Metric</th>
//             {snapshots.map((snap, idx) => (
//               <th key={idx} className="border px-2 py-2 bg-gray-100">
//                 {snap.name}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {metrics.map((m) => (
//             <tr key={m.label}>
//               <td className="border px-2 py-2 font-semibold">{m.label}</td>
//               {snapshots.map((snap, idx) => {
//                 let cellValue;
//                 if (m.fn) {
//                   cellValue = m.fn(snap);
//                 } else {
//                   cellValue = getValue(snap, m.key);
//                 }

//                 // Highlight logic
//                 let highlightClass = "";
//                 if (m.label === "Gross Income") {
//                   if (cellValue === maxGrossAnnual) {
//                     //display the value with commas and dollar
//                     cellValue = formatNumber(cellValue);
//                     highlightClass = "bg-green-100 font-bold"; // Best (highest)
//                   } else if (cellValue === minGrossAnnual) {
//                     cellValue = formatNumber(cellValue);
//                     highlightClass = "bg-red-100 font-bold"; // Worst (lowest)
//                   }
//                 }
//                 if (m.label === "Monthly Expenses") {
//                   if (cellValue === minExpense) {
//                     highlightClass = "bg-green-100 font-bold"; // Best (lowest)
//                   } else if (cellValue === maxExpense) {
//                     highlightClass = "bg-red-100 font-bold"; // Worst (highest)
//                   }
//                 }
//                 if (m.label === "Annual Expenses") {
//                   if (cellValue === minAnnualExpense) {
//                     highlightClass = "bg-green-100 font-bold"; // Best (lowest)
//                   } else if (cellValue === maxAnnualExpense) {
//                     highlightClass = "bg-red-100 font-bold"; // Worst (highest)
//                   }
//                 }
//                 if (m.label === "Net Worth Goal") {
//                   if (cellValue === maxNetWorth) {
//                     cellValue = formatNumber(cellValue);
//                     highlightClass = "bg-green-100 font-bold"; // Best (highest)
//                   } else if (cellValue === minNetWorth) {
//                     cellValue = formatNumber(cellValue);
//                     highlightClass = "bg-red-100 font-bold"; // Worst (lowest)
//                   }
//                 }
//                 if (m.label === "Desired FI Year") {
//                   if (cellValue === minFIYear) {
//                     highlightClass = "bg-green-100 font-bold"; // Best (earliest)
//                   } else if (cellValue === maxFIYear) {
//                     highlightClass = "bg-red-100 font-bold"; // Worst (latest)
//                   }
//                 }

//                 if (m.label === "Realistic FI Year") {
//                   if (cellValue === minRealisticFIYear) {
//                     highlightClass = "bg-green-100 font-bold"; // Best (earliest)
//                   } else if (cellValue === maxRealisticFIYear) {
//                     highlightClass = "bg-red-100 font-bold"; // Worst (latest)
//                   }
//                 }

//                 return (
//                   <td
//                     key={idx}
//                     className={`border px-2 py-2 ${highlightClass}`}
//                   >
//                     {m.label === "Monthly Expenses" ||
//                     (m.label === "Annual Expenses" && cellValue !== undefined)
//                       ? formatNumber(cellValue)
//                       : cellValue ?? "N/A"}
//                   </td>
//                 );
//               })}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React from "react";

/**
 * Format numbers as dollars
 */
function formatNumber(n) {
  if (n == null || isNaN(n)) return "—";
  return `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

/**
 * Scale values to 0–100 range
 */
function getScaledValue(value, min, max, better) {
  if (!Number.isFinite(value) || min === max) return 0;

  const raw = (value - min) / (max - min);
  return better === "lower" ? (1 - raw) * 100 : raw * 100;
}

/**
 * Rank values (1 = best)
 */
function getRanks(values, better) {
  const sorted = [...values]
    .map((v, i) => ({ v, i }))
    .sort((a, b) => (better === "lower" ? a.v - b.v : b.v - a.v));

  const ranks = Array(values.length);
  sorted.forEach((item, idx) => {
    ranks[item.i] = idx + 1;
  });

  return ranks;
}

export default function ComparisonTable({ snapshots = [] }) {
  if (snapshots.length < 2) return null;

  const metrics = [
    {
      label: "Gross Income",
      value: (s) => s.income?.grossAnnual ?? 0,
      format: formatNumber,
      better: "higher",
    },
    {
      label: "Take Home Pay",
      value: (s) => s.income?.takeHome ?? 0,
      format: formatNumber,
      better: "higher",
    },
    {
      label: "Annual Expenses",
      value: (s) => s.netWorthHistory?.at(-1)?.annualExpenses ?? 0,
      format: formatNumber,
      better: "lower",
    },
    {
      label: "Monthly Expenses",
      value: (s) => (s.netWorthHistory?.at(-1)?.annualExpenses ?? 0) / 12,
      format: formatNumber,
      better: "lower",
    },
    {
      label: "Annual Surplus",
      value: (s) => s.netWorthHistory?.at(-1)?.annualSurplus ?? 0,
      format: formatNumber,
      better: "higher",
    },
    {
      label: "FI Target",
      value: (s) => s.fireGoal?.targetNetWorth,
      format: formatNumber,
      better: "lower",
    },
    {
      label: "Estimated FI Year",
      value: (s) => s.fireGoal?.estimatedFIYear,
      better: "lower",
    },
    {
      label: "Realistic FI Year",
      value: (s) => s.fireGoal?.realisticFIYear,
      better: "lower",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse text-sm rounded-md shadow-md">
        <thead>
          <tr>
            <th className="border px-3 py-2 text-left bg-gray-100">Metric</th>
            {snapshots.map((snap, idx) => (
              <th
                key={snap._id || idx}
                className="border px-3 py-2 text-center font-semibold bg-gray-50"
              >
                {snap.name}
                <br />
                {snap.location?.city ? `${snap.location.city}` : ""}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {metrics.map((metric) => {
            const values = snapshots.map((s) => metric.value(s));
            const clean = values.filter(Number.isFinite);
            const min = Math.min(...clean);
            const max = Math.max(...clean);
            const ranks = getRanks(values, metric.better);

            return (
              <tr key={metric.label}>
                <td className="border px-3 py-2 font-medium bg-gray-50">
                  {metric.label}
                </td>

                {snapshots.map((snap, idx) => {
                  const value = metric.value(snap);
                  const scaled = getScaledValue(value, min, max, metric.better);
                  const display = metric.format
                    ? metric.format(value)
                    : value ?? "—";

                  return (
                    <td
                      key={idx}
                      className="border px-3 py-2 text-center align-middle"
                    >
                      <div className="space-y-1">
                        {/* Rank */}
                        <div className="text-xs text-gray-500">
                          Rank {ranks[idx]}
                        </div>

                        {/* Bar */}
                        <div className="h-2 bg-gray-200 rounded">
                          <div
                            className="h-2 bg-green-700 rounded"
                            style={{ width: `${scaled}%` }}
                          />
                        </div>

                        {/* Value */}
                        <div className="text-sm">{display}</div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
