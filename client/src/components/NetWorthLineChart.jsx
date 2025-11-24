import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function NetWorthLineChart({ netWorthHistory }) {
  if (!netWorthHistory || netWorthHistory.length === 0) return null;

  // netWorthHistory = [{ year: 2022, netWorth: 50000 }, ...]
  return (
    <div className="my-8">
      <h4 className="text-lg font-semibold mb-2 text-center">
        Net Worth Over Time
      </h4>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={netWorthHistory}>
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="netWorth" stroke="#00fed8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
// This component renders a line chart showing the net worth history over time.
// It expects `netWorthHistory` to be an array of objects with `year` and `netWorth` properties.
// If no data is provided, it returns null to avoid rendering an empty chart.
