import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";
import api from "../api/axios";
import { Tooltip as ReactTooltip } from "react-tooltip";
import ScenarioCharts from "../components/ScenarioCharts";
import {
  sumExpenses,
  sumAssets,
  sumLiabilities,
  computeNetWorth,
  // computeAnnualSurplus,
  computeAnnualSurplusViewCard,
  computeComprehensivePosition,
  computeRequestedMetric,
  monthlyToAnnual,
} from "../services/financeHelpers";

// Format number with commas for display
function formatNumber(value) {
  if (value === "" || value === undefined || value === null) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
}

export default function ViewScenario() {
  const { id } = useParams();
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  //AI Insights state
  const [aiInsights, setAiInsights] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  //End of AI Insights state
  const navigate = useNavigate();
  const location = useLocation();
  const fromComparison = location.state?.from === "comparison";
  const comparisonId = location.state?.comparisonId;
  // axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchScenario = async () => {
      try {
        const res = await api.get(`/scenarios/${id}`);
        setScenario(res.data);
      } catch (err) {
        // Optionally handle error
        console.error("Error fetching scenario:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScenario();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!scenario) return <div>Scenario not found.</div>;

  // compute totals for display
  const expenseTotal = sumExpenses(scenario.expenses || {});
  const AnnualExpense = monthlyToAnnual(expenseTotal || {});
  const assetTotal = sumAssets(scenario.assets || {});
  const liabilitiesTotal = sumLiabilities(scenario.liabilities || {});
  const netWorth = computeNetWorth(
    scenario.assets || {},
    scenario.liabilities || {}
  );

  // derived metrics using finance helpers
  const annualSurplus = computeAnnualSurplusViewCard(
    scenario.income?.netAnnual,
    scenario.income?.additionalIncome,
    scenario.expenses
    // monthlyToAnnual(scenario.expenses || {})
  );
  // const {
  //   // netWorth: compNetWorth,
  //   // annualSurplus: compAnnualSurplus,
  //   comprehensive,
  // } = computeComprehensivePosition(
  //   scenario.assets || {},
  //   scenario.liabilities || {},
  //   scenario.income?.netAnnual,
  //   scenario.income?.additionalIncome,
  //   scenario.expenses || {}
  // );
  const requestedMetric = computeRequestedMetric(
    scenario.income?.netAnnual,
    scenario.income?.additionalIncome,
    scenario.liabilities || {},
    scenario.expenses || {}
  );

  const comprehensive = computeComprehensivePosition(netWorth, annualSurplus);

  // 🔑 Group fields by category (mirroring ScenarioForm)
  const steps = [
    {
      title: "Basic Info",
      fields: [
        { label: "Scenario Name", value: scenario.name },
        {
          label: "Location",
          value: `${scenario.location?.city}, ${scenario.location?.state}`,
        },
      ],
    },
    {
      title: "Income",
      fields: [
        {
          label: "Gross Annual Income",
          // value: `$${scenario.income?.grossAnnual}`,
          value: `$${formatNumber(scenario.income?.grossAnnual)}`,
        },
        {
          label: "Filing Status",
          value: scenario.income?.filingStatus || "---",
        },
        {
          label: "Dependents",
          value: scenario.income?.dependents || "---",
        },
        {
          label: "Total Income Tax",
          // value: `$${scenario.income?.totalIncomeTax}`,
          // value: `$${formatNumber(scenario.income?.totalIncomeTax)}`,
          value:
            scenario.income?.totalIncomeTax != null
              ? `$${formatNumber(scenario.income.totalIncomeTax)}`
              : scenario.expenses?.taxes
              ? "See tax breakdown below or enter total tax"
              : "---",
        },
        {
          label: "Take Home",
          // value: `$${scenario.income?.takeHome}`,
          // value: `$${formatNumber(scenario.income?.takeHome)}`,
          value:
            scenario.income?.takeHome != null
              ? `$${formatNumber(scenario.income.takeHome)}`
              : "---",
        },
        {
          label: "Net Annual Income",
          // value: `$${formatNumber(scenario.income?.netAnnual) || "---"}`,
          value:
            scenario.income?.netAnnual != null
              ? `$${formatNumber(scenario.income.netAnnual)}`
              : "---",
        },
        {
          label: "Other Income",
          // value: `$${scenario.income?.additionalIncome ?? "---"}`,
          value: `$${formatNumber(scenario.income?.additionalIncome) || "---"}`,
        },
        {
          label: "Income Sources",
          value:
            Array.isArray(scenario.income?.incomeSources) &&
            scenario.income.incomeSources.length > 0 ? (
              <ul className="list-disc ml-6">
                {scenario.income.incomeSources.map((src, idx) =>
                  src ? (
                    <li key={idx}>
                      {/* {src.type}: ${src.amount} */}
                      {src.type}: ${formatNumber(src.amount)}
                    </li>
                  ) : null
                )}
              </ul>
            ) : (
              "---"
            ),
        },
      ],
    },
    {
      title: "Expenses",
      fields: [
        { label: "Rent", value: `$${scenario.expenses?.rent}` },
        { label: "Groceries", value: `$${scenario.expenses?.groceries}` },
        {
          label: "Utilities",
          // value: `$${scenario.expenses?.utilities ?? "---"}`,
          value: `$${formatNumber(scenario.expenses?.utilities) || "---"}`,
        },
        {
          label: "Transportation",
          // value: `$${scenario.expenses?.transportation ?? "---"}`,
          value: `$${formatNumber(scenario.expenses?.transportation) || "---"}`,
        },
        {
          label: "Healthcare",
          // value: `$${scenario.expenses?.healthcare ?? "---"}`,
          value: `$${formatNumber(scenario.expenses?.healthcare) || "---"}`,
        },
        {
          label: "Custom Expenses",
          // value: `$${scenario.expenses?.customExpenses.reduce(
          //   (total, expense) => total + expense.amount,
          //   0
          // )}`,
          value: `$${
            formatNumber(
              scenario.expenses?.customExpenses.reduce(
                (total, expense) => total + (expense.amount || 0),
                0
              )
            ) || "---"
          }`,
        },
        {
          label: "Custom Expenses",
          value:
            Array.isArray(scenario.expenses?.customExpenses) &&
            scenario.expenses.customExpenses.length > 0 ? (
              <ul className="list-disc ml-6">
                {scenario.expenses.customExpenses.map((exp, idx) =>
                  exp ? (
                    <li key={idx}>
                      {/* {exp.label}: ${exp.amount} */}
                      {exp.label}: ${formatNumber(exp.amount)}
                    </li>
                  ) : null
                )}
              </ul>
            ) : (
              "---"
            ),
        },
      ],
    },
    {
      title: "Assets",
      fields: [
        {
          label: "Cash",
          value: `$${
            formatNumber(scenario.assets?.cash) || scenario.assets?.cash
          }`,
        },
        {
          label: "Other Assets",
          // value: `$${scenario.assets?.otherAssets ?? "---"}`,
          value: `$${formatNumber(scenario.assets?.otherAssets) || "---"}`,
        },
        { label: "Investments", value: `$${scenario.investments ?? "---"}` },
      ],
    },
    {
      title: "Liabilities",
      fields: [
        {
          label: "Student Loans",
          // value: `$${scenario.liabilities?.studentLoans}`,
          value: `$${
            formatNumber(scenario.liabilities?.studentLoans) || "---"
          }`,
        },
        {
          label: "Credit Card Debt",
          // value: `$${scenario.liabilities?.creditCardDebt ?? "---"}`,
          value: `$${
            formatNumber(scenario.liabilities?.creditCardDebt) || "---"
          }`,
        },
        {
          label: "Mortgage",
          // value: `$${scenario.liabilities?.mortgage ?? "---"}`,
          value: `$${formatNumber(scenario.liabilities?.mortgage) || "---"}`,
        },
        {
          label: "Car Loans",
          // value: `$${scenario.liabilities?.carLoan ?? "---"}`,
          value: `$${formatNumber(scenario.liabilities?.carLoan) || "---"}`,
        },
        {
          label: "Other Debts",
          // value: `$${scenario.liabilities?.otherDebts ?? "---"}`,
          value: `$${formatNumber(scenario.liabilities?.otherDebts) || "---"}`,
        },
      ],
    },
    {
      title: "Savings Rate",
      fields: [
        {
          label: "Savings Rate",
          value: `${scenario.savingsRate ?? "---"}%`,
        },
      ],
    },
    {
      title: "Fire Goals",
      fields: [
        {
          label: "Target Net Worth",
          // value: `$${scenario.fireGoal?.targetNetWorth}`,
          value: `$${formatNumber(scenario.fireGoal?.targetNetWorth) || "---"}`,
        },
        {
          label: "Desired FI Year",
          value: `${scenario.fireGoal?.estimatedFIYear}`,
        },
        {
          label: "Realistic FI Year",
          value: `${scenario.fireGoal?.realisticFIYear}`,
        },
        {
          label: "Investement Return Rate",
          value: `${scenario.fireGoal?.investmentReturnRate}%`,
        },
        {
          label: "Withdrawal Rate",
          value: `${scenario.fireGoal?.withdrawalRate}%`,
        },
      ],
    },
  ];

  const currentStep = steps[step];
  // Fetch AI Insights
  const fetchAiInsights = async () => {
    setAiLoading(true);
    setAiError(null);

    try {
      const res = await api.post("/ai/insights", {
        scenarioId: scenario._id,
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

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* Scenario Details Card */}
      <div className="bg-white rounded shadow p-6">
        <h1 className="text-2xl font-bold mb-6 text-blue-700">
          {scenario.name}
        </h1>

        {/* 🔹 Stepper UI (progress dots/indicators) */}
        <div className="flex justify-center items-center mb-6 space-x-4">
          {steps.map((s, index) => (
            <div key={index} className="flex flex-col items-center">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 
                ${
                  index === step
                    ? "bg-blue-600 text-white border-blue-600"
                    : index < step
                    ? "bg-blue-100 text-blue-600 border-blue-600"
                    : "bg-gray-100 text-gray-400 border-gray-300"
                }`}
              >
                {index + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  index === step
                    ? "text-blue-600 font-semibold"
                    : "text-gray-500"
                }`}
              >
                {s.title}
              </span>
            </div>
          ))}
        </div>

        {/* Category Title */}
        <h2 className="text-xl font-semibold mb-4 text-blue-600">
          {currentStep.title}
        </h2>

        {/* Render all fields in this category */}
        <div className="space-y-2">
          <div className="space-y-4 h-[200px] overflow-y-auto p-4 pr-2 bg-gray-50 rounded-lg">
            {currentStep.fields.map(
              (field, idx) =>
                field.value && (
                  <div
                    key={idx}
                    className="py-1 border-b border-gray-200 last:border-b-0"
                  >
                    <strong className="font-medium text-gray-700">
                      {field.label}:
                    </strong>{" "}
                    {typeof field.value === "string"
                      ? field.value
                      : field.value}
                  </div>
                )
            )}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6">
          <button
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setStep(step - 1)}
            disabled={step === 0}
          >
            Back
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            onClick={() => setStep(step + 1)}
            disabled={step === steps.length - 1}
          >
            Next
          </button>
        </div>

        {/* Exit button */}
        {/* <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => navigate(-1)}
        >
          Back to Scenarios
        </button> */}
        {/* Exit button */}
        <button
          className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            if (fromComparison && comparisonId) {
              navigate(`/comparison/${comparisonId}`);
            } else {
              navigate("/dashboard");
            }
          }}
        >
          {fromComparison ? "Back to Comparison" : "Back to Dashboard"}
        </button>
      </div>
      {/* Summary totals card (new) */}
      <div className="bg-white rounded shadow p-4 my-4">
        <h3 className="font-semibold mb-2">Summary Totals</h3>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center">
            Annual Expenses:&nbsp;
            <strong>${formatNumber(AnnualExpense)}</strong>
            <button
              type="button"
              aria-label="Annual Expenses info"
              data-tooltip-id="annualSurplusTip"
              data-tooltip-content={`Total monthly expenses: $${formatNumber(
                expenseTotal
              )}/mo.`}
              className="ml-2 text-xs text-blue-500"
              place="right"
            >
              ⓘ
            </button>
          </div>
          <div className="flex items-center">
            Net Annual Income:&nbsp;
            <strong>
              {scenario.income?.netAnnual != null
                ? `$${formatNumber(scenario.income.netAnnual)}`
                : "---"}
            </strong>
            <button
              type="button"
              aria-label="Net Annual Income info"
              data-tooltip-id="annualSurplusTip"
              data-tooltip-content="Net Annual is your income after taxes (take home pay) + any additional income."
              className="ml-2 text-xs text-blue-500"
              place="right"
            >
              ⓘ
            </button>
          </div>

          <div>
            Total Liabilities:{" "}
            <strong>${formatNumber(liabilitiesTotal)}</strong>
          </div>
          {/* <div>
            Net Worth: <strong>${formatNumber(netWorth)}</strong>
          </div> */}
          {/* --- Tooltip for Net Worth --- */}
          <div className="flex items-center">
            <span>Net Worth:</span>
            <div className="ml-1">
              <strong>${formatNumber(netWorth)}</strong>
            </div>
            <button
              type="button"
              aria-label="Net Worth info"
              data-tooltip-id="netWorthTip"
              data-tooltip-content="Net Worth = Total Assets - Total Liabilities"
              className="ml-2 text-xs text-blue-500"
              place="right"
            >
              ⓘ
            </button>
          </div>
          <div>
            Total Assets: <strong>${formatNumber(assetTotal)}</strong>
          </div>

          {/* --- Tooltip Examples --- */}
          <div>
            <div className="flex items-center">
              <span>Annual Surplus</span>
              <button
                type="button"
                aria-label="Annual Surplus info"
                data-tooltip-id="annualSurplusTip"
                data-tooltip-content="Annual Surplus = Net Annual Income - Annual Expenses"
                className="ml-2 text-xs text-blue-500"
                place="right"
              >
                ⓘ
              </button>
            </div>
            <div>
              <strong>${formatNumber(annualSurplus)}</strong>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <span>Comprehensive Position</span>
              <button
                type="button"
                aria-label="Comprehensive Position info"
                data-tooltip-id="comprehensiveTip"
                data-tooltip-content="Comprehensive Position = Net Worth + Annual Surplus"
                className="ml-2 text-xs text-blue-500"
                place="right"
              >
                ⓘ
              </button>
            </div>
            <div>
              <strong>${formatNumber(comprehensive)}</strong>
            </div>
          </div>

          <div>
            <div className="flex items-center">
              <span>Custom 'Total Current Net'</span>
              <button
                type="button"
                aria-label="Custom Total Current Net info"
                data-tooltip-id="customNetTip"
                data-tooltip-content="Calculated as: netAnnual + additionalIncome - total liabilities - total expenses"
                className="ml-2 text-xs text-blue-500"
                place="right"
              >
                ⓘ
              </button>
            </div>
            <div className="mt-1 font-medium">
              <strong>${formatNumber(requestedMetric)}</strong>
            </div>
          </div>
        </div>

        {/* Define tooltips */}
        <ReactTooltip id="annualSurplusTip" place="right" />
        <ReactTooltip id="netWorthTip" place="right" />
        <ReactTooltip id="comprehensiveTip" place="right" />
        <ReactTooltip id="customNetTip" place="right" />
      </div>
      {/* End of Summary Section */}

      {/* AI Insights Section */}
      <div className="bg-white rounded shadow p-4 my-4">
        <h3 className="font-semibold mb-2">Financial Insights Assistant</h3>

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

      {/* Charts Section */}
      <div className="mt-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          Scenario Visualizations
        </h2>
        <ScenarioCharts scenario={scenario} />
      </div>
    </div>
  );
}
