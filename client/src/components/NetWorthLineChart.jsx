import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

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

function formatCurrencyShort(n) {
  if (n >= 1_000_000) {
    // Number() removes unnecessary trailing zeros (e.g., 2.0 -> 2)
    return `$${Number((n / 1_000_000).toFixed(1))}M`;
  }
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}k`;
  return `$${n}`;
}
export default function NetWorthLineChart({
  historical = [],
  estimated = [],
  realistic = [],
  fiTarget,
}) {
  const dataByYear = {};

  historical.forEach(({ year, netWorth }) => {
    dataByYear[year] = { year, historical: netWorth };
  });

  estimated.forEach(({ year, netWorth }) => {
    dataByYear[year] = {
      ...(dataByYear[year] || { year }),
      estimated: netWorth,
    };
  });

  realistic.forEach(({ year, netWorth }) => {
    dataByYear[year] = {
      ...(dataByYear[year] || { year }),
      realistic: netWorth,
    };
  });

  const combinedData = Object.values(dataByYear).sort(
    (a, b) => a.year - b.year
  );

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={combinedData}>
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatCurrencyShort} />
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
        {fiTarget && (
          <ReferenceLine
            y={fiTarget}
            stroke="#40473cff"
            strokeDasharray="4 4"
            label={{
              value: `FI Target (${formatCurrencyShort(fiTarget)})`,
              position: "top",
              fill: "#40473cff",
              fontSize: 15,
              fontWeight: "bold",
            }}
          />
        )}

        {/* <Line dataKey="historical" stroke="#00fed8" />
        <Line dataKey="estimated" stroke="#8884d8" strokeDasharray="5 5" />
        <Line dataKey="realistic" stroke="#82ca9d" strokeDasharray="3 3" /> */}
        {historical.length > 0 && (
          <Line dataKey="historical" stroke="#00fed8" />
        )}
        {estimated.length > 0 && (
          <Line dataKey="estimated" stroke="#8884d8" strokeDasharray="5 5" />
        )}
        {realistic.length > 0 && (
          <Line dataKey="realistic" stroke="#82ca9d" strokeDasharray="3 3" />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// export default function NetWorthLineChart({ netWorthHistory }) {
//   if (!netWorthHistory || netWorthHistory.length === 0) return null;

//   // netWorthHistory = [{ year: 2022, netWorth: 50000 }, ...]
//   return (
//     <div className="my-8">
//       <h4 className="text-lg font-semibold mb-2 text-center">
//         Net Worth Over Time
//       </h4>
//       <ResponsiveContainer width="100%" height={250}>
//         <LineChart data={netWorthHistory}>
//           <XAxis dataKey="year" />
//           <YAxis />
//           <Tooltip />
//           <Legend />
//           <Line type="monotone" dataKey="netWorth" stroke="#00fed8" />
//         </LineChart>
//       </ResponsiveContainer>
//     </div>
//   );
// }
// This component renders a line chart showing the net worth history over time.
// It expects `netWorthHistory` to be an array of objects with `year` and `netWorth` properties.
// If no data is provided, it returns null to avoid rendering an empty chart.
