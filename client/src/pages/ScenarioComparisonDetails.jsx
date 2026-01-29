import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";
import api from "../api/axios";
import ExpensePieChart from "../components/ExpensePieChart";
import IncomeVsExpensesPieChart from "../components/IncomeVsExpensesPieChart";
import ComparisonTable from "../components/ComparisonTable";
import ExpenseBarChart from "../components/ExpenseBarChart";
import ExpenseBarChartAnnual from "../components/ExpenseBarChartAnnual";
import NetWorthLineChart from "../components/NetWorthLineChart";
import LiabilitiesPieChart from "../components/LiabilitiesPieChart";
import IncomeVsLiabilitiesPieChart from "../components/IncomeVsLiabilitiesPieChart";
import TaxBreakdownInfo from "../components/TaxBreakDownPopOver";
import { buildNetWorthProjectionsFromScenario } from "../services/netWorthUtils";

function formatNumber(value) {
  if (value === "" || value === undefined || value === null) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
}

// Get latest net worth snapshot from scenario
function getLatestNetWorthSnapshot(snap) {
  if (!Array.isArray(snap?.netWorthHistory)) return null;
  if (snap.netWorthHistory.length === 0) return null;
  return snap.netWorthHistory.at(-1);
}

const chartOptions = [
  {
    key: "expensePie",
    label: "Expenses (Pie)",
    render: (snap) => <ExpensePieChart expenses={snap.expenses} />,
  },
  {
    key: "expenseBar",
    label: "Expenses (Bar)",
    render: (snap) => <ExpenseBarChart expenses={snap.expenses} compact />,
  },
  {
    key: "expenseBarAnnual",
    label: "Expenses (Bar Annual)",
    render: (snap) => <ExpenseBarChartAnnual expenses={snap.expenses} />,
  },
  {
    key: "incomeVsExpenses",
    label: "Income vs Expenses (Pie)",
    render: (snap) => <IncomeVsExpensesPieChart scenario={snap} />,
  },
  {
    key: "liabilitiesPie",
    label: "Liabilities (Pie)",
    render: (snap) => <LiabilitiesPieChart liabilities={snap.liabilities} />,
  },
  {
    key: "incomeVsLiabilities",
    label: "Income vs Liabilities (Pie)",
    render: (snap) => (
      <IncomeVsLiabilitiesPieChart
        income={snap.income}
        liabilities={snap.liabilities}
      />
    ),
  },
  {
    key: "netWorth",
    label: "Net Worth Over Time",
    render: (snap) => {
      const { historical, estimated, realistic } =
        buildNetWorthProjectionsFromScenario(snap);

      return (
        <NetWorthLineChart
          historical={historical}
          estimated={estimated}
          realistic={realistic}
        />
      );
    },
  },
];

export default function ScenarioComparisonDetails() {
  const { id } = useParams();
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [selectedChart, setSelectedChart] = useState(chartOptions[0].key);
  //AI Insights state
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  //End of AI Insights state
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchComparison = async () => {
      // const token = localStorage.getItem("token");
      // try {
      //   const res = await axios.get(
      //     `https://firelivingcalc1server.vercel.app/api/scenario-comparisons/${id}`,
      //     {
      //       withCredentials: true,
      //       headers: { Authorization: `Bearer ${token}` },
      //     }
      //   );
      //   setComparison(res.data);
      // } catch (err) {
      //   console.error(err);
      // } finally {
      //   setLoading(false);
      // }
      try {
        const res = await api.get(`scenario-comparisons/${id}`);
        setComparison(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComparison();
  }, [id]);

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await api.post("/ai/comparison-insights", {
        comparisonId: comparison._id,
      });
      // setAiInsights(res.data);
      setAiInsights(res.data.content);
    } catch (err) {
      setAiError("Unable to generate insights", err);
      console.error("AI Insights error:", err);
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!comparison) return <div>Comparison not found.</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <button
        className="mb-4 bg-gray-300 text-black px-4 py-2 rounded"
        onClick={() => navigate("/compare")}
      >
        Back to Comparisons
      </button>
      {editing ? (
        <div className="bg-white rounded shadow p-6 mb-6">
          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="border px-2 py-1 rounded w-full mb-2"
          />
          <textarea
            value={editNotes}
            onChange={(e) => setEditNotes(e.target.value)}
            className="border px-2 py-1 rounded w-full"
            rows={2}
          />
          <button
            className="bg-green-500 text-white px-3 py-1 rounded mr-2"
            onClick={async () => {
              // const token = localStorage.getItem("token");
              // const res = await axios.put(
              //   `https://firelivingcalc1server.vercel.app/api/scenario-comparisons/${comparison._id}`,
              //   { title: editTitle, notes: editNotes },
              //   {
              //     withCredentials: true,
              //     headers: { Authorization: `Bearer ${token}` },
              //   }
              // );
              const res = await api.put(
                `scenario-comparisons/${comparison._id}`,
                { title: editTitle, notes: editNotes }
              );
              setComparison(res.data);
              setEditing(false);
            }}
          >
            Save
          </button>
          <button
            className="bg-gray-400 text-white px-3 py-1 rounded"
            onClick={() => setEditing(false)}
          >
            Cancel
          </button>
        </div>
      ) : (
        <div className="bg-white rounded shadow p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2 text-blue-700">
              {comparison.title}
            </h1>
            <div className="text-gray-700 mb-2 text-base">
              {comparison.notes}
            </div>
            <div className="text-xs text-gray-400">
              Saved: {new Date(comparison.createdAt).toLocaleString()}
              {comparison.updatedAt &&
                comparison.updatedAt !== comparison.createdAt && (
                  <span>
                    {" "}
                    | Last updated:{" "}
                    {new Date(comparison.updatedAt).toLocaleString()}
                  </span>
                )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 md:ml-4 flex-shrink-0">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded shadow transition"
              onClick={() => {
                setEditTitle(comparison.title);
                setEditNotes(comparison.notes);
                setEditing(true);
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
      <ComparisonTable snapshots={comparison.snapshots} />

      {/* Chart Selection Dropdown */}
      <div className="bg-white rounded shadow p-6 mt-8 ">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:space-x-4">
          <label className="font-semibold mb-2 md:mb-0" htmlFor="chart-select">
            Select Chart to Compare:
          </label>
          <select
            id="chart-select"
            value={selectedChart}
            onChange={(e) => setSelectedChart(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-auto"
          >
            {chartOptions.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Comparison Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comparison.snapshots.map((snap, idx) => {
            const scenarioId =
              comparison.scenarioIds?.[idx] || snap.scenarioId || snap._id;
            const chart = chartOptions.find((opt) => opt.key === selectedChart);
            const latestHistory = getLatestNetWorthSnapshot(snap);
            return (
              <div
                key={idx}
                className="p-6 bg-gray-50 rounded shadow overflow-visible"
              >
                <h3 className="text-md font-bold mb-2 text-center">
                  {snap.name}
                </h3>
                <h4 className="text-md font-bold mb-2 text-center">
                  {snap.location?.city}, {snap.location?.state}
                </h4>
                <div className="flex justify-center items-center w-[400px] h-[400px] max-w-full">
                  {chart.render(snap)}
                </div>

                {/* Snapshot summary: total tax, take-home, net annual */}
                <div className="mt-3 text-sm text-gray-700 space-y-1">
                  <div className="flex items-center space-x-1">
                    <strong>Total Income Tax:</strong>{" "}
                    {snap.income?.totalIncomeTax != null
                      ? `$${formatNumber(snap.income.totalIncomeTax)}`
                      : snap.expenses?.taxes
                      ? "Use tax breakdown or enter total tax"
                      : "---"}
                    {/* Optional legacy tax breakdown */}
                    <div>
                      <TaxBreakdownInfo taxes={snap.expenses?.taxes} />
                    </div>
                  </div>

                  <div>
                    <strong>Take-home:</strong>{" "}
                    {snap.income?.takeHome != null
                      ? `$${formatNumber(snap.income.takeHome)}`
                      : "---"}
                  </div>

                  <div>
                    <strong>Net Annual:</strong>{" "}
                    {snap.income?.netAnnual != null
                      ? `$${formatNumber(snap.income.netAnnual)}`
                      : "---"}
                  </div>
                  <div>
                    <strong>Annual Surplus:</strong>{" "}
                    {latestHistory?.annualSurplus != null
                      ? `$${formatNumber(latestHistory.annualSurplus)}`
                      : "---"}
                  </div>
                </div>

                <div className="flex justify-center mt-4 space-x-2">
                  {scenarioId ? (
                    <button
                      className="bg-yellow-600 text-white px-3 py-1 rounded"
                      onClick={() =>
                        navigate(`/scenarios/${scenarioId}/view`, {
                          state: {
                            from: "comparison",
                            comparisonId: comparison._id,
                          },
                        })
                      }
                    >
                      View Scenario
                    </button>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* AI Insights Section */}
      <div className="bg-white rounded shadow p-4 my-4">
        <h3 className="font-semibold mb-2">Financial Comparison Insights</h3>

        {!aiInsights && (
          <button
            onClick={fetchAiInsights}
            disabled={aiLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {aiLoading ? "Analyzing..." : "Generate Insights"}
          </button>
        )}

        {aiError && <p className="text-red-500 mt-2">{aiError}</p>}

        {aiInsights && (
          <div className="mt-4 text-sm whitespace-pre-line">{aiInsights}</div>
        )}
      </div>
    </div>
  );
}

{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {comparison.snapshots.map((snap, idx) => {
            const scenarioId = comparison.scenarioIds[idx]; // Get scenarioId from comparison
            const chart = chartOptions.find((opt) => opt.key === selectedChart);
            return (
              <div key={idx} className="p-4 bg-gray-50 rounded shadow">
                <h3 className="text-md font-bold mb-2 text-center">
                  {snap.name}
                </h3>
                <div className="flex justify-center items-center w-[400px] h-[400px] max-w-full ">
                  {chart.render(snap)}
                </div>
                <button
                  className="mt-4 bg-yellow-500 text-white px-3 py-1 rounded items-center justify-center flex mx-auto"
                  onClick={() =>
                    // navigate(`/dashboard?edit=${snap.scenarioId || snap._id}`)
                    navigate(`/scenarios/${scenarioId}/view`, {
                      state: {
                        from: "comparison",
                        comparisonId: comparison._id,
                      },
                    })
                  }
                >
                  View Scenario
                </button>
              </div>
            );
          })}
        </div> */
}
