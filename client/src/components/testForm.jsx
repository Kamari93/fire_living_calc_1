import React, { useState, useEffect } from "react";
// import ReactTooltip from "react-tooltip";
import { Tooltip as ReactTooltip } from "react-tooltip";
import axios from "axios";
import InfoPopover from "./InfoPopover";
import {
  sumExpenses,
  sumAssets,
  sumLiabilities,
  computeNetWorth,
  computeAnnualSurplus,
  monthlyToAnnual,
  annualToMonthly,
} from "../services/financeHelpers";

// Helper for nested field updates
function updateNestedForm(form, name, value) {
  const keys = name.split(".");
  if (keys.length === 1) {
    return { ...form, [name]: value };
  } else if (keys.length === 2) {
    return {
      ...form,
      [keys[0]]: {
        ...form[keys[0]],
        [keys[1]]: value,
      },
    };
  } else if (keys.length === 3) {
    return {
      ...form,
      [keys[0]]: {
        ...form[keys[0]],
        [keys[1]]: {
          ...form[keys[0]][keys[1]],
          [keys[2]]: value,
        },
      },
    };
  }
  return form;
}

// Format number with commas for display
function formatNumber(value) {
  if (value === "" || value === undefined || value === null) return "";
  const num = parseFloat(value.toString().replace(/,/g, ""));
  if (isNaN(num)) return value;
  return num.toLocaleString("en-US");
}

// Remove commas for storing in state
function unformatNumber(value) {
  return value.toString().replace(/,/g, "");
}

export default function ScenarioForm({ scenario, onScenarioSaved }) {
  // Initial state matches your current Scenario model
  const [form, setForm] = useState({
    name: "",
    title: "",
    location: { city: "", state: "", zip: "" },
    income: {
      grossAnnual: "",
      filingStatus: "", // e.g., "single", "married", "headOfHousehold"
      dependents: "", // number of dependents
      netAnnual: "",
      totalIncomeTax: "", // ensure present
      takeHome: "", // ensure present
      additionalIncome: "",
      incomeSources: [],
    },
    expenses: {
      rent: "",
      groceries: "",
      healthcare: "",
      childcare: "",
      transportation: "",
      utilities: "",
      discretionary: "",
      taxes: { federal: "", state: "", local: "" },
      customExpenses: [],
    },
    assets: {
      cash: "",
      investments: "",
      realEstate: "",
      otherAssets: "",
    },
    liabilities: {
      studentLoans: "",
      mortgage: "",
      carLoan: "",
      creditCardDebt: "",
      otherDebts: "",
    },
    savingsRate: "",
    fireGoal: {
      targetNetWorth: "",
      estimatedFIYear: "",
      investmentReturnRate: 0.07,
      withdrawalRate: 0.04,
    },
  });

  const [totals, setTotals] = useState({
    expenses: 0,
    assets: 0,
    liabilities: 0,
    netWorth: 0,
    annualSurplus: 0,
    comprehensive: 0,
  });

  // add expenses input mode state (monthly | annual)
  const [expensesMode, setExpensesMode] = useState("monthly");

  // compute totals whenever form sections change
  useEffect(() => {
    const convertExpensesToAnnual = (expenses) => {
      if (!expenses) return {};
      const out = { ...expenses };
      const keysToConvert = [
        "rent",
        "groceries",
        "healthcare",
        "childcare",
        "transportation",
        "utilities",
        "discretionary",
      ];
      keysToConvert.forEach((k) => {
        if (
          expenses[k] !== undefined &&
          expenses[k] !== null &&
          expenses[k] !== ""
        ) {
          out[k] = monthlyToAnnual(expenses[k]);
        }
      });
      if (Array.isArray(expenses.customExpenses)) {
        out.customExpenses = expenses.customExpenses.map((c) => ({
          ...c,
          amount: c?.amount ? monthlyToAnnual(c.amount) : c.amount,
        }));
      }
      return out;
    };

    const expensesForCalc =
      expensesMode === "monthly"
        ? convertExpensesToAnnual(form.expenses)
        : form.expenses || {};

    const exp = sumExpenses(expensesForCalc);
    const ast = sumAssets(form.assets);
    const liab = sumLiabilities(form.liabilities);
    const nw = computeNetWorth(form.assets, form.liabilities);

    const annualSurplus = computeAnnualSurplus(
      form.income?.netAnnual,
      form.income?.additionalIncome,
      expensesForCalc
    );
    const comprehensive = nw + annualSurplus;
    setTotals({
      expenses: exp,
      assets: ast,
      liabilities: liab,
      netWorth: nw,
      annualSurplus,
      comprehensive,
    });
  }, [
    form.expenses,
    form.assets,
    form.liabilities,
    form.income?.netAnnual,
    form.income?.additionalIncome,
    expensesMode,
  ]);

  // compute totals whenever form sections change
  // useEffect(() => {
  //   const multiplier = expensesMode === "monthly" ? 12 : 1;
  //   const exp = sumExpenses(form.expenses);
  //   const ast = sumAssets(form.assets);
  //   const liab = sumLiabilities(form.liabilities);
  //   const nw = computeNetWorth(form.assets, form.liabilities);

  //   // new derived metrics
  //   const annualSurplus = computeAnnualSurplus(
  //     form.income?.netAnnual,
  //     form.income?.additionalIncome,
  //     // form.expenses
  //      // pass annual expenses to surplus helper
  //     expensesMode === "monthly" ? { ...form.expenses } /* we multiply total below */ : form.expenses
  //   );
  //   const comprehensive = nw + annualSurplus; // using helper is also fine
  //   setTotals({
  //     expenses: exp,
  //     assets: ast,
  //     liabilities: liab,
  //     netWorth: nw,
  //     annualSurplus,
  //     comprehensive,
  //   });
  // }, [
  //   form.expenses,
  //   form.assets,
  //   form.liabilities,
  //   form.income?.netAnnual,
  //   form.income?.additionalIncome,
  //   expensesMode,
  //   // if your updateNestedForm returns new objects, this dependency is fine
  // ]);

  // Pre-fill form when editing
  useEffect(() => {
    if (scenario) {
      setForm({
        name: scenario.name || "",
        title: scenario.title || "",
        location: scenario.location || { city: "", state: "", zip: "" },
        income: {
          grossAnnual: scenario.income?.grossAnnual ?? "",
          filingStatus: scenario.income?.filingStatus ?? "",
          dependents: scenario.income?.dependents ?? "",
          netAnnual: scenario.income?.netAnnual ?? "",
          totalIncomeTax: scenario.income?.totalIncomeTax ?? "",
          takeHome: scenario.income?.takeHome ?? "",
          additionalIncome: scenario.income?.additionalIncome ?? "",
          incomeSources: scenario.income?.incomeSources ?? [],
        },
        expenses: scenario.expenses || {
          rent: "",
          groceries: "",
          healthcare: "",
          childcare: "",
          transportation: "",
          utilities: "",
          discretionary: "",
          taxes: { federal: "", state: "", local: "" },
          customExpenses: [],
        },
        assets: scenario.assets || {
          cash: "",
          investments: "",
          realEstate: "",
          otherAssets: "",
        },
        liabilities: scenario.liabilities || {
          studentLoans: "",
          mortgage: "",
          carLoan: "",
          creditCardDebt: "",
          otherDebts: "",
        },
        savingsRate: scenario.savingsRate || "",
        fireGoal: scenario.fireGoal || {
          targetNetWorth: "",
          estimatedFIYear: "",
          investmentReturnRate: 0.07,
          withdrawalRate: 0.04,
        },
      });
    } else {
      setForm({
        name: "",
        title: "",
        location: { city: "", state: "", zip: "" },
        income: {
          grossAnnual: "",
          netAnnual: "",
          additionalIncome: "",
          incomeSources: [],
        },
        expenses: {
          rent: "",
          groceries: "",
          healthcare: "",
          childcare: "",
          transportation: "",
          utilities: "",
          discretionary: "",
          taxes: { federal: "", state: "", local: "" },
          customExpenses: [],
        },
        assets: {
          cash: "",
          investments: "",
          realEstate: "",
          otherAssets: "",
        },
        liabilities: {
          studentLoans: "",
          mortgage: "",
          carLoan: "",
          creditCardDebt: "",
          otherDebts: "",
        },
        savingsRate: "",
        fireGoal: {
          targetNetWorth: "",
          estimatedFIYear: "",
          investmentReturnRate: 0.07,
          withdrawalRate: 0.04,
        },
      });
    }
  }, [scenario]);

  // Auto-calculate netAnnual from gross and taxes
  useEffect(() => {
    const gross = Number(form.income.grossAnnual) || 0;
    const federal = Number(form.expenses.taxes.federal) || 0;
    const state = Number(form.expenses.taxes.state) || 0;
    const local = Number(form.expenses.taxes.local) || 0;
    const autoNet = gross - federal - state - local;
    if (
      gross &&
      (form.income.netAnnual === "" || form.income.netAnnual === autoNet)
    ) {
      setForm((prev) => ({
        ...prev,
        income: { ...prev.income, netAnnual: autoNet },
      }));
    }
  }, [
    form.income.grossAnnual,
    form.expenses.taxes.federal,
    form.expenses.taxes.state,
    form.expenses.taxes.local,
    form.income.netAnnual,
  ]);

  useEffect(() => {
    const gross = Number(unformatNumber(form.income.grossAnnual || "0")) || 0;
    const totalTax =
      Number(unformatNumber(form.income.totalIncomeTax || "0")) || 0;
    const additional =
      Number(unformatNumber(form.income.additionalIncome || "0")) || 0;

    const computedTakeHome = gross - totalTax;
    const computedNet = computedTakeHome + additional;

    const currentTakeHome =
      Number(unformatNumber(String(form.income.takeHome || "0"))) || 0;
    const currentNet =
      Number(unformatNumber(String(form.income.netAnnual || "0"))) || 0;

    if (currentTakeHome !== computedTakeHome || currentNet !== computedNet) {
      setForm((prev) => ({
        ...prev,
        income: {
          ...prev.income,
          takeHome: computedTakeHome,
          netAnnual: computedNet,
        },
      }));
    }
  }, [
    form.income.grossAnnual,
    form.income.totalIncomeTax,
    form.income.additionalIncome,
    form.income.takeHome,
    form.income.netAnnual,
  ]);

  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const validate = () => {
    const newErrors = {};
    if (step === 1) {
      if (!form.name) newErrors.name = "Scenario name is required";
      if (!form.location.city) newErrors.city = "City is required";
    }
    if (step === 2) {
      if (!form.income.grossAnnual)
        newErrors.grossAnnual = "Gross income required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanValue = unformatNumber(value);
    setForm(updateNestedForm(form, name, cleanValue));
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    const segments = name.split(".");
    let target = form;
    for (let i = 0; i < segments.length - 1; i++) target = target[segments[i]];
    const key = segments[segments.length - 1];
    if (target[key] === null || target[key] === undefined) {
      setForm((prev) => updateNestedForm(prev, name, ""));
    }
  };

  const handleArrayChange = (fieldPath, idx, key, value) => {
    const keys = fieldPath.split(".");
    let updatedForm = { ...form };

    let arr = updatedForm;
    for (let i = 0; i < keys.length - 1; i++) {
      arr = arr[keys[i]];
    }
    const arrayKey = keys[keys.length - 1];
    const updatedArray = [...arr[arrayKey]];
    updatedArray[idx] = { ...updatedArray[idx], [key]: value };
    arr[arrayKey] = updatedArray;

    setForm(updatedForm);
  };

  // const addIncomeSource = () => {
  //   setForm({
  //     ...form,
  //     income: {
  //       ...form.income,
  //       incomeSources: [
  //         ...(form.income.incomeSources || []),
  //         { type: "", amount: "" },
  //       ],
  //     },
  //   });
  // };

  const addCustomExpense = () => {
    setForm({
      ...form,
      expenses: {
        ...form.expenses,
        customExpenses: [
          ...form.expenses.customExpenses,
          { label: "", amount: "" },
        ],
      },
    });
  };

  function cleanFormData(form) {
    if (typeof form !== "object" || form === null) return form;
    if (Array.isArray(form)) return form.map(cleanFormData);
    const cleaned = {};
    for (const key in form) {
      if (form[key] === "") cleaned[key] = undefined;
      else if (typeof form[key] === "object")
        cleaned[key] = cleanFormData(form[key]);
      else cleaned[key] = form[key];
    }
    return cleaned;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const cleaned = cleanFormData(form);

    if (expensesMode === "monthly" && cleaned.expenses) {
      const keys = [
        "rent",
        "groceries",
        "healthcare",
        "childcare",
        "transportation",
        "utilities",
        "discretionary",
      ];
      keys.forEach((k) => {
        if (cleaned.expenses[k] != null) {
          cleaned.expenses[k] = Number(cleaned.expenses[k]) * 12;
        }
      });
      if (Array.isArray(cleaned.expenses.customExpenses)) {
        cleaned.expenses.customExpenses = cleaned.expenses.customExpenses.map(
          (c) => ({
            ...c,
            amount: c.amount != null ? Number(c.amount) * 12 : c.amount,
          })
        );
      }
    }

    if (
      (cleaned.income?.totalIncomeTax === undefined ||
        cleaned.income.totalIncomeTax === null) &&
      cleaned.expenses?.taxes
    ) {
      const t =
        Number(cleaned.expenses.taxes.federal || 0) +
        Number(cleaned.expenses.taxes.state || 0) +
        Number(cleaned.expenses.taxes.local || 0);
      cleaned.income = cleaned.income || {};
      cleaned.income.totalIncomeTax = t;
      cleaned.income.takeHome = Number(cleaned.income.grossAnnual || 0) - t;
      cleaned.income.netAnnual =
        Number(cleaned.income.takeHome || 0) +
        Number(cleaned.income.additionalIncome || 0);
    }

    console.log("Cleaned form data:", cleaned);
    try {
      if (scenario && scenario._id) {
        await axios.put(
          `http://localhost:5000/api/scenarios/${scenario._id}`,
          cleaned,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post("http://localhost:5000/api/scenarios", cleaned, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onScenarioSaved();
      setForm({
        name: "",
        title: "",
        location: { city: "", state: "", zip: "" },
        income: {
          grossAnnual: "",
          filingStatus: "",
          dependents: "",
          netAnnual: "",
          totalIncomeTax: "",
          takeHome: "",
          additionalIncome: "",
          incomeSources: [],
        },
        expenses: {
          rent: "",
          groceries: "",
          healthcare: "",
          childcare: "",
          transportation: "",
          utilities: "",
          discretionary: "",
          taxes: { federal: "", state: "", local: "" },
          customExpenses: [],
        },
        assets: {
          cash: "",
          investments: "",
          realEstate: "",
          otherAssets: "",
        },
        liabilities: {
          studentLoans: "",
          mortgage: "",
          carLoan: "",
          creditCardDebt: "",
          otherDebts: "",
        },
        savingsRate: "",
        fireGoal: {
          targetNetWorth: "",
          estimatedFIYear: "",
          investmentReturnRate: 0.07,
          withdrawalRate: 0.04,
        },
      });
      setStep(1);
    } catch (err) {
      alert(
        "Error saving scenario: " + (err.response?.data?.error || err.message)
      );
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="h-[400px] overflow-y-auto space-y-4 p-4 bg-white rounded shadow"
    >
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded h-2 mb-4">
        <div
          className="bg-blue-500 h-2 rounded"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-4 h-[300px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Basic Info</h2>
          <label htmlFor="name" className="flex items-center">
            Scenario Name
            <span
              data-tooltip-id="info"
              data-tooltip-content="A unique name to identify your scenario"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Scenario Name"
            className="w-full px-3 py-2 border rounded"
            required
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
          <label htmlFor="title">
            Scenario Title
            <span
              data-tooltip-id="info"
              data-tooltip-content="A descriptive title for your scenario"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Scenario Title"
            className="w-full px-3 py-2 border rounded"
          />
          <label htmlFor="location.city">
            Location
            <span
              data-tooltip-id="info"
              data-tooltip-content="Where you live or plan to live."
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <div className="flex space-x-2">
            <input
              name="location.city"
              value={form.location.city}
              onChange={handleChange}
              placeholder="City"
              className="w-full px-3 py-2 border rounded"
            />
            {errors.city && <span className="text-red-500">{errors.city}</span>}
            <input
              name="location.state"
              value={form.location.state}
              onChange={handleChange}
              placeholder="State"
              className="w-full px-3 py-2 border rounded"
            />
            <input
              name="location.zip"
              value={form.location.zip}
              onChange={handleChange}
              placeholder="Zip"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      )}

      {/* Step 2: Income */}
      {step === 2 && (
        <div className="space-y-4 h-[300px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">Income</h2>
          <label htmlFor="income.grossAnnual" className="flex items-center">
            Gross Annual Income
            <span
              data-tooltip-id="info"
              data-tooltip-content="Total income before taxes and deductions"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="income.grossAnnual"
            value={formatNumber(form.income.grossAnnual ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Gross Annual Income"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />
          {errors.grossAnnual && (
            <span className="text-red-500">{errors.grossAnnual}</span>
          )}
          <label htmlFor="filingStatus" className="flex items-center">
            Filing Status
            <span
              data-tooltip-id="info"
              data-tooltip-content="Your IRS filing status (Single, Married, etc.)"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <select
            name="filingStatus"
            value={form.filingStatus}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          >
            <option value="">Select status</option>
            <option value="single">Single</option>
            <option value="married">Married Filing Jointly</option>
            <option value="headOfHousehold">Head of Household</option>
          </select>

          <label htmlFor="dependents" className="flex items-center">
            Number of Dependents
            <span
              data-tooltip-id="info"
              data-tooltip-content="Children or other dependents claimed for tax purposes"
              data-tooltip-place="top"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="dependents"
            value={form.dependents}
            onChange={handleChange}
            type="number"
            min={0}
            className="w-1/4 px-3 py-2 border rounded"
          />

          <div className="grid gap-2">
            <label
              htmlFor="income.totalIncomeTax"
              data-tooltip-id="info"
              data-tooltip-content="Total of federal, state, FICA, and local income taxes, click for helpful link to calculate total income tax."
              data-tooltip-place="top"
              className="flex items-center"
            >
              Total Income Tax
              <InfoPopover label="Taxes">
                <div className="mb-1 font-medium">Helpful Resources:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <a
                      href="https://smartasset.com/taxes/income-taxes"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      State Income Tax Calculators
                    </a>
                  </li>
                </ul>
              </InfoPopover>
            </label>
            <input
              name="income.totalIncomeTax"
              value={formatNumber(form.income.totalIncomeTax ?? "")}
              onChange={handleChange}
              onBlur={handleBlur}
              type="text"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          {errors.taxes && <span className="text-red-500">{errors.taxes}</span>}

          <label
            htmlFor="income.additionalIncome"
            className="flex items-center"
          >
            Additional Income
            <span
              data-tooltip-id="info"
              data-tooltip-content="Additional sources of income"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="income.additionalIncome"
            value={formatNumber(form.income.additionalIncome ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Additional Income"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-medium text-sm text-gray-700 flex items-center">
                Take-home Pay
                <InfoPopover label="Take-home Pay">
                  <p className="text-gray-700 text-sm leading-snug">
                    Gross income minus total taxes (federal, state, local).
                  </p>
                </InfoPopover>
              </label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-gray-900 text-sm">
                ${formatNumber(form.income.takeHome ?? 0)}
              </div>
            </div>

            <div>
              <label className="font-medium text-sm text-gray-700 flex items-center">
                Net Annual
                <InfoPopover label="Net Annual">
                  <p className="text-gray-700 text-sm leading-snug">
                    Combined total of take-home pay and additional income.
                  </p>
                </InfoPopover>
              </label>
              <div className="mt-1 p-2 bg-gray-50 border border-gray-200 rounded text-gray-900 text-sm">
                ${formatNumber(form.income.netAnnual ?? 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Expenses */}
      {step === 3 && (
        <div className="space-y-4 h-[300px] overflow-y-auto">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold mb-4">Expenses</h2>
            <div className="flex items-center space-x-2">
              <label className="text-sm">Inputs:</label>
              <select
                value={expensesMode}
                onChange={(e) => setExpensesMode(e.target.value)}
                className="border px-2 py-1 rounded text-sm"
                title="Choose whether you are entering monthly or annual expense values"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
              </select>
              <InfoPopover label="Expenses" id="expenses-info">
                <div className="mb-1 font-medium">Helpful Resources:</div>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <a
                      href="https://www.payscale.com/cost-of-living-calculator/Texas-Missouri-City"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      Paycale for expenses lookup
                    </a>
                  </li>
                </ul>
              </InfoPopover>
            </div>
          </div>

          <label htmlFor="expenses.rent" className="flex items-center">
            Rent
            <span
              data-tooltip-id="info"
              data-tooltip-content="Monthly or annual rent payment"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="expenses.rent"
            value={formatNumber(form.expenses.rent ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Rent"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />
          <label htmlFor="expenses.groceries" className="flex items-center">
            Groceries
            <span
              data-tooltip-id="info"
              data-tooltip-content="Monthly or annual grocery expenses"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="expenses.groceries"
            value={formatNumber(form.expenses.groceries ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Groceries"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />

          <div>
            <h4 className="font-semibold">
              Custom Expenses
              <span
                data-tooltip-id="info"
                data-tooltip-content="Add any other expenses not listed above"
                className="ml-1 cursor-pointer text-blue-500"
              >
                ⓘ
              </span>
            </h4>
            {Array.isArray(form.expenses.customExpenses) &&
              form.expenses.customExpenses.map((exp, idx) => (
                <div
                  key={idx}
                  className="flex flex-col md:flex-row md:space-x-2 mb-2"
                >
                  <input
                    value={exp.label || ""}
                    onChange={(e) =>
                      handleArrayChange(
                        "expenses.customExpenses",
                        idx,
                        "label",
                        e.target.value
                      )
                    }
                    placeholder="Label"
                    className="w-full px-2 py-1 border rounded mb-2 md:mb-0"
                  />
                  <input
                    value={formatNumber(exp.amount || "")}
                    onChange={(e) =>
                      handleArrayChange(
                        "expenses.customExpenses",
                        idx,
                        "amount",
                        e.target.value
                      )
                    }
                    onBlur={handleBlur}
                    placeholder="Amount"
                    type="text"
                    className="w-full px-2 py-1 border rounded"
                  />
                </div>
              ))}
            <button
              type="button"
              onClick={addCustomExpense}
              className="bg-blue-200 px-2 py-1 rounded mt-2"
            >
              Add Custom Expense
            </button>
          </div>

          <div className="mt-4">
            <label className="font-medium">Total Expenses (annual)</label>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gray-50 border rounded">
                ${formatNumber(totals.expenses)}
              </div>
              <div className="text-xs text-gray-500">
                {expensesMode === "monthly"
                  ? `(~$${formatNumber(totals.expenses / 12)}/mo)`
                  : `(~$${formatNumber(totals.expenses / 12)}/mo)`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Assets, Liabilities, FIRE Goal */}
      {step === 4 && (
        <div className="space-y-4 h-[300px] overflow-y-auto">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Assets, Liabilities & FIRE Goal
          </h2>
          <label htmlFor="assets.cash" className="flex items-center">
            Cash
            <span
              data-tooltip-id="info"
              data-tooltip-content="Current cash balance"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="assets.cash"
            value={formatNumber(form.assets.cash ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Cash"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />

          <label
            htmlFor="liabilities.studentLoans"
            className="flex items-center"
          >
            Student Loans
            <span
              data-tooltip-id="info"
              data-tooltip-content="Total student loan debt"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="liabilities.studentLoans"
            value={formatNumber(form.liabilities.studentLoans ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Student Loans"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />

          <div className="mt-4 space-y-3">
            {[
              {
                label: "Total Assets",
                value: totals.assets,
                tooltip: "Sum of all your cash, investments, and other assets.",
              },
              {
                label: "Total Liabilities",
                value: totals.liabilities,
                tooltip:
                  "Sum of debts, loans, and other financial obligations.",
              },
              {
                label: "Net Worth",
                value: totals.netWorth,
                tooltip: "Total Assets minus Total Liabilities.",
              },
              {
                label: "Annual Surplus",
                value: totals.annualSurplus,
                tooltip:
                  "The remaining income after all expenses are paid annually.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center px-3 py-2 bg-gray-50 border rounded text-sm"
              >
                <div className="flex items-center space-x-1">
                  <span className="font-medium text-gray-700">
                    {item.label}
                  </span>
                  <InfoPopover label={item.label}>{item.tooltip}</InfoPopover>
                </div>
                <span className="font-semibold text-gray-900">
                  ${formatNumber(item.value)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-3 px-3 py-2 bg-blue-50 border border-blue-200 rounded text-sm flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium text-blue-800">
                Comprehensive Position
              </span>
              <InfoPopover label="Comprehensive Position">
                <p className="text-gray-700 text-sm leading-snug">
                  This value combines your <strong>Net Worth</strong> and your{" "}
                  <strong>Annual Surplus</strong> to show your overall financial
                  position.
                </p>
              </InfoPopover>
            </div>
            <span className="font-semibold text-blue-900">
              ${formatNumber(totals.comprehensive)}
            </span>
          </div>

          <label
            htmlFor="fireGoal.targetNetWorth"
            className="flex items-center"
          >
            Target Net Worth
            <span
              data-tooltip-id="info"
              data-tooltip-content="Desired net worth at retirement"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="fireGoal.targetNetWorth"
            value={formatNumber(form.fireGoal.targetNetWorth ?? "")}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Target Net Worth"
            type="text"
            className="w-full px-3 py-2 border rounded"
          />
          <label
            htmlFor="fireGoal.estimatedFIYear"
            className="flex items-center"
          >
            Estimated FI Year
            <span
              data-tooltip-id="info"
              data-tooltip-content="Year you expect to achieve financial independence"
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="fireGoal.estimatedFIYear"
            value={form.fireGoal.estimatedFIYear}
            onChange={handleChange}
            placeholder="Estimated FI Year"
            type="number"
            className="w-full px-3 py-2 border rounded"
          />
          <label
            htmlFor="fireGoal.investmentReturnRate"
            className="flex items-center"
          >
            Investment Return Rate
            <span
              data-tooltip-id="info"
              data-tooltip-content="Expected annual return on investments."
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="fireGoal.investmentReturnRate"
            value={form.fireGoal.investmentReturnRate}
            onChange={handleChange}
            placeholder="Investment Return Rate"
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border rounded"
          />
          <label
            htmlFor="fireGoal.withdrawalRate"
            className="flex items-center"
          >
            Withdrawal Rate
            <span
              data-tooltip-id="info"
              data-tooltip-content="Safe withdrawal percentage."
              className="ml-1 cursor-pointer text-blue-500"
            >
              ⓘ
            </span>
          </label>
          <input
            name="fireGoal.withdrawalRate"
            value={form.fireGoal.withdrawalRate}
            onChange={handleChange}
            placeholder="Withdrawal Rate"
            type="number"
            step="0.01"
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-4">
        {step > 1 && (
          <button
            type="button"
            onClick={prevStep}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Back
          </button>
        )}
        {step < totalSteps && (
          <button
            type="button"
            onClick={() => {
              if (validate()) nextStep();
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
        {step === totalSteps && (
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {scenario ? "Update Scenario" : "Create Scenario"}
          </button>
        )}
      </div>
      <ReactTooltip id="info" effect="solid" place="right" />
    </form>
  );
}
