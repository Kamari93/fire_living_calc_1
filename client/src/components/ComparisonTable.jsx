import React from "react";
import { monthlyToAnnual, formatNumber } from "../services/financeHelpers";

//helper function to display with commmas and dollar sign
// function formatNumber(num) {
//   return `$${num.toLocaleString()}`;
// }

// Helper function to sum all expenses (including custom expenses)
function sumExpenses(expenses) {
  if (!expenses) return 0;
  let total =
    (expenses.rent ?? 0) +
    (expenses.groceries ?? 0) +
    (expenses.healthcare ?? 0) +
    (expenses.childcare ?? 0) +
    (expenses.transportation ?? 0) +
    (expenses.utilities ?? 0) +
    (expenses.discretionary ?? 0);

  // if (expenses.taxes) {
  //   total +=
  //     (expenses.taxes.federal ?? 0) +
  //     (expenses.taxes.state ?? 0) +
  //     (expenses.taxes.local ?? 0);
  // }
  if (Array.isArray(expenses.customExpenses)) {
    total += expenses.customExpenses.reduce(
      (sum, exp) => sum + (exp.amount ?? 0),
      0
    );
  }
  return total;
}

// Helper to get nested value from object using dot notation
function getValue(obj, path) {
  return path.split(".").reduce((acc, part) => acc && acc[part], obj);
}

export default function ComparisonTable({ snapshots }) {
  if (!snapshots || snapshots.length < 2) return null;

  // Define metrics to compare
  const metrics = [
    { label: "Name", key: "name" },
    { label: "City", key: "location.city" },
    { label: "Gross Income", key: "income.grossAnnual" },
    { label: "Monthly Expenses", fn: (snap) => sumExpenses(snap.expenses) },
    {
      label: "Annual Expenses",
      fn: (snap) => monthlyToAnnual(sumExpenses(snap.expenses)),
    },
    { label: "Net Worth Goal", key: "fireGoal.targetNetWorth" },
    { label: "Desired FI Year", key: "fireGoal.estimatedFIYear" },
    { label: "Realistic FI Year", key: "fireGoal.realisticFIYear" },
    // { label: "Return Rate", key: "fireGoal.investmentReturnRate" },
    // { label: "Withdrawal Rate", key: "fireGoal.withdrawalRate" },
  ];

  // Find best/worst values for highlighting
  const expensesArr = snapshots.map((snap) => sumExpenses(snap.expenses));
  const minExpense = Math.min(...expensesArr);
  const maxExpense = Math.max(...expensesArr);

  const annualExpensesArr = snapshots.map((snap) =>
    monthlyToAnnual(sumExpenses(snap.expenses))
  );
  const minAnnualExpense = Math.min(...annualExpensesArr);
  const maxAnnualExpense = Math.max(...annualExpensesArr);

  const fiYearsArr = snapshots.map(
    (snap) => getValue(snap, "fireGoal.estimatedFIYear") ?? Infinity
  );
  const minFIYear = Math.min(...fiYearsArr);
  const maxFIYear = Math.max(...fiYearsArr);

  const realisticFIYearsArr = snapshots.map(
    (snap) => getValue(snap, "fireGoal.realisticFIYear") ?? Infinity
  );
  const minRealisticFIYear = Math.min(...realisticFIYearsArr);
  const maxRealisticFIYear = Math.max(...realisticFIYearsArr);

  const grosAnnualArr = snapshots.map(
    (snap) => getValue(snap, "income.grossAnnual") ?? 0
  );
  const maxGrossAnnual = Math.max(...grosAnnualArr);
  const minGrossAnnual = Math.min(...grosAnnualArr);

  const netWorthArr = snapshots.map(
    (snap) => getValue(snap, "fireGoal.targetNetWorth") ?? 0
  );
  const maxNetWorth = Math.max(...netWorthArr);
  const minNetWorth = Math.min(...netWorthArr);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border mt-6 bg-white rounded shadow">
        <thead>
          <tr>
            <th className="border px-2 py-2 bg-gray-100">Metric</th>
            {snapshots.map((snap, idx) => (
              <th key={idx} className="border px-2 py-2 bg-gray-100">
                {snap.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {metrics.map((m) => (
            <tr key={m.label}>
              <td className="border px-2 py-2 font-semibold">{m.label}</td>
              {snapshots.map((snap, idx) => {
                let cellValue;
                if (m.fn) {
                  cellValue = m.fn(snap);
                } else {
                  cellValue = getValue(snap, m.key);
                }

                // Highlight logic
                let highlightClass = "";
                if (m.label === "Gross Income") {
                  if (cellValue === maxGrossAnnual) {
                    //display the value with commas and dollar
                    cellValue = formatNumber(cellValue);
                    highlightClass = "bg-green-100 font-bold"; // Best (highest)
                  } else if (cellValue === minGrossAnnual) {
                    cellValue = formatNumber(cellValue);
                    highlightClass = "bg-red-100 font-bold"; // Worst (lowest)
                  }
                }
                if (m.label === "Monthly Expenses") {
                  if (cellValue === minExpense) {
                    highlightClass = "bg-green-100 font-bold"; // Best (lowest)
                  } else if (cellValue === maxExpense) {
                    highlightClass = "bg-red-100 font-bold"; // Worst (highest)
                  }
                }
                if (m.label === "Annual Expenses") {
                  if (cellValue === minAnnualExpense) {
                    highlightClass = "bg-green-100 font-bold"; // Best (lowest)
                  } else if (cellValue === maxAnnualExpense) {
                    highlightClass = "bg-red-100 font-bold"; // Worst (highest)
                  }
                }
                if (m.label === "Net Worth Goal") {
                  if (cellValue === maxNetWorth) {
                    cellValue = formatNumber(cellValue);
                    highlightClass = "bg-green-100 font-bold"; // Best (highest)
                  } else if (cellValue === minNetWorth) {
                    cellValue = formatNumber(cellValue);
                    highlightClass = "bg-red-100 font-bold"; // Worst (lowest)
                  }
                }
                if (m.label === "Desired FI Year") {
                  if (cellValue === minFIYear) {
                    highlightClass = "bg-green-100 font-bold"; // Best (earliest)
                  } else if (cellValue === maxFIYear) {
                    highlightClass = "bg-red-100 font-bold"; // Worst (latest)
                  }
                }

                if (m.label === "Realistic FI Year") {
                  if (cellValue === minRealisticFIYear) {
                    highlightClass = "bg-green-100 font-bold"; // Best (earliest)
                  } else if (cellValue === maxRealisticFIYear) {
                    highlightClass = "bg-red-100 font-bold"; // Worst (latest)
                  }
                }

                return (
                  <td
                    key={idx}
                    className={`border px-2 py-2 ${highlightClass}`}
                  >
                    {m.label === "Monthly Expenses" ||
                    (m.label === "Annual Expenses" && cellValue !== undefined)
                      ? formatNumber(cellValue)
                      : cellValue ?? "N/A"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
