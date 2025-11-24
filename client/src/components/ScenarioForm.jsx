import React, { useState, useEffect } from "react";
import axios from "axios";

export default function ScenarioForm({ scenario, onScenarioSaved }) {
  // Add onScenarioCreated prop to handle scenario creation callback

  const [form, setForm] = useState({
    name: "",
    income: "",
    expenses: "",
    // location: "",
    location: { city: "", state: "", zip: "" },
    fireGoal: "",
    investmentReturn: 0.07, // Default values for assumptions
    inflation: 0.02, // Default values for assumptions
    withdrawalRate: 0.04, // Default values for assumptions
  });

  // Pre-fill form when editing
  useEffect(() => {
    if (scenario) {
      setForm({
        name: scenario.name || "",
        income: scenario.income || "",
        expenses: scenario.expenses || "",
        // location: scenario.location || "",
        location: scenario.location || { city: "", state: "", zip: "" },
        fireGoal: scenario.fireGoal || "",
        investmentReturn: scenario.assumptions?.investmentReturn ?? 0.07,
        inflation: scenario.assumptions?.inflation ?? 0.02,
        withdrawalRate: scenario.assumptions?.withdrawalRate ?? 0.04,
      });
    } else {
      setForm({
        name: "",
        income: "",
        expenses: "",
        // location: "",
        location: { city: "", state: "", zip: "" },
        fireGoal: "",
        investmentReturn: 0.07,
        inflation: 0.02,
        withdrawalRate: 0.04,
      });
    }
  }, [scenario]); // Update form when scenario changes

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value }); // Update form state with input values
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      if (scenario && scenario._id) {
        // Edit existing scenario
        await axios.put(
          `http://localhost:5000/api/scenario/${scenario._id}`,
          {
            ...form,
            income: Number(form.income),
            expenses: Number(form.expenses),
            location: {
              city: form.location.city,
              state: form.location.state,
              zip: form.location.zip,
            },
            fireGoal: Number(form.fireGoal),
            assumptions: {
              investmentReturn: Number(form.investmentReturn),
              inflation: Number(form.inflation),
              withdrawalRate: Number(form.withdrawalRate),
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // Create new scenario
        await axios.post(
          "http://localhost:5000/api/scenario",
          {
            ...form,
            income: Number(form.income),
            expenses: Number(form.expenses),
            location: {
              city: form.location.city,
              state: form.location.state,
              zip: form.location.zip,
            },
            fireGoal: Number(form.fireGoal),
            // Convert assumptions to numbers...assumptions are default values
            assumptions: {
              investmentReturn: Number(form.investmentReturn),
              inflation: Number(form.inflation),
              withdrawalRate: Number(form.withdrawalRate),
            },
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      onScenarioSaved();
      // Reset form after successful creation
      setForm({
        name: "",
        income: "",
        expenses: "",
        // location: "",
        location: { city: "", state: "", zip: "" },
        fireGoal: "",
        investmentReturn: 0.07,
        inflation: 0.02,
        withdrawalRate: 0.04,
      });
    } catch (err) {
      alert("Error saving scenario");
      console.error(err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded shadow"
    >
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Scenario Name"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        name="income"
        value={form.income}
        onChange={handleChange}
        placeholder="Income"
        type="number"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        name="expenses"
        value={form.expenses}
        onChange={handleChange}
        placeholder="Expenses"
        type="number"
        className="w-full px-3 py-2 border rounded"
        required
      />
      {/* <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="w-full px-3 py-2 border rounded"
        required
      /> */}
      <input
        name="location.city"
        value={form.location.city}
        onChange={(e) =>
          setForm({
            ...form,
            location: { ...form.location, city: e.target.value },
          })
        }
        placeholder="City"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        name="location.state"
        value={form.location.state}
        onChange={(e) =>
          setForm({
            ...form,
            location: { ...form.location, state: e.target.value },
          })
        }
        placeholder="State"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <input
        name="location.zip"
        value={form.location.zip}
        onChange={(e) =>
          setForm({
            ...form,
            location: { ...form.location, zip: e.target.value },
          })
        }
        placeholder="ZIP"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <label htmlFor="fireGoal">FIRE Goal</label>
      <input
        name="fireGoal"
        value={form.fireGoal}
        onChange={handleChange}
        placeholder="FIRE Goal"
        type="number"
        className="w-full px-3 py-2 border rounded"
        required
      />
      <label htmlFor="investmentReturn">Investment Return (%)</label>
      <input
        name="investmentReturn"
        value={form.investmentReturn}
        onChange={handleChange}
        placeholder="Investment Return (%)"
        type="number"
        step="0.01" // Allow decimal values
        className="w-full px-3 py-2 border rounded"
      />
      <label htmlFor="inflation">Inflation (%)</label>
      <input
        name="inflation"
        value={form.inflation}
        onChange={handleChange}
        placeholder="Inflation (%)"
        type="number"
        step="0.01" // Allow decimal values
        className="w-full px-3 py-2 border rounded"
      />
      <label htmlFor="withdrawalRate">Withdrawal Rate (%)</label>
      <input
        name="withdrawalRate"
        value={form.withdrawalRate}
        onChange={handleChange}
        placeholder="Withdrawal Rate (%)"
        type="number"
        step="0.01" // Allow decimal values
        className="w-full px-3 py-2 border rounded"
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        {scenario ? "Update Scenario" : "Create Scenario"}
      </button>
    </form>
  );
}

// This component provides a form for creating a financial scenario.
// It includes fields for scenario name, income, expenses, location, FIRE goal,
// and assumptions like investment return, inflation, and withdrawal rate.
// The form submits the data to the server and resets the form state upon successful creation.

// The `useEffect` hook is used to pre-fill the form when editing an existing scenario.
// The `handleChange` function updates the form state as the user types.
// The `handleSubmit` function sends the form data to the server, either creating a new scenario or updating an existing one.
// The form also handles errors by displaying an alert if the submission fails.
// The component expects a `scenario` prop for editing and an `onScenarioSaved` callback
// to notify the parent component when a scenario is created or updated.
