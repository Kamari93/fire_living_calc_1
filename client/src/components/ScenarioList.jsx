import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  sumExpenses,
  monthlyToAnnual,
  formatNumberShortNoDecimals,
} from "../services/financeHelpers";

import axios from "axios";
import { useNavigate } from "react-router-dom";

// export default function ScenarioList({ onEdit }) {
//   const [scenarios, setScenarios] = useState([]);

const ScenarioList = forwardRef(function ScenarioList({ onEdit }, ref) {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch scenarios
  useEffect(() => {
    fetchScenarios();
  }, []);

  // Expose fetchScenarios to parent via ref
  useImperativeHandle(ref, () => ({
    fetchScenarios,
  }));

  // const fetchScenarios = async () => {
  //   const token = localStorage.getItem("token");
  //   const res = await axios.get("http://localhost:5000/api/scenario", {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setScenarios(res.data); // Store scenarios in state
  // };

  const fetchScenarios = async () => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/scenarios", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScenarios(res.data); // Store scenarios in state
    } catch (err) {
      setError("Failed to load scenarios.");
      console.error("Error fetching scenarios:", err);
      // navigate("/login"); // Redirect to login on error
    } finally {
      // finally block to ensure loading state is reset
      setLoading(false);
    }
  };

  const defaultScenarioShape = {
    name: "",
    location: { city: "", state: "", zip: "" },
    income: {
      grossAnnual: "",
      netAnnual: "",
      totalIncomeTax: "",
      filingStatus: "",
      takeHome: "",
      dependents: 0,
      additionalIncome: "",
      incomeSources: [],
    },
    expenses: {
      rent: "",
      groceries: "",
      healthcare: "",
      transportation: "",
      utilities: "",
      discretionary: "",
      taxes: {
        federal: "",
        state: "",
        local: "",
      },
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
      realisticFIYear: "",
      investmentReturnRate: 0.07,
      withdrawalRate: 0.04,
    },
  };

  const normalizeScenario = (data) => ({
    ...defaultScenarioShape,
    ...data,
    location: { ...defaultScenarioShape.location, ...data.location },
    income: { ...defaultScenarioShape.income, ...data.income },
    expenses: {
      ...defaultScenarioShape.expenses,
      ...data.expenses,
      taxes: {
        ...defaultScenarioShape.expenses.taxes,
        ...(data.expenses?.taxes || {}),
      },
    },
    assets: { ...defaultScenarioShape.assets, ...data.assets },
    liabilities: { ...defaultScenarioShape.liabilities, ...data.liabilities },
    fireGoal: { ...defaultScenarioShape.fireGoal, ...data.fireGoal },
  });

  // Delete handler
  // const handleDelete = async (id) => {
  //   const token = localStorage.getItem("token");
  //   await axios.delete(`http://localhost:5000/api/scenario/${id}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //   });
  //   setScenarios(scenarios.filter((s) => s._id !== id));
  // };

  // Delete handler
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this scenario?"))
      return;
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/scenarios/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setScenarios((prev) => prev.filter((s) => s._id !== id));
      setSuccess("Scenario deleted.");
    } catch (err) {
      setError("Failed to delete scenario.");
      console.error("Error deleting scenario:", err);
    } finally {
      // finally block to ensure loading state is reset
      setLoading(false);
    }
  };

  // Duplicate handler
  const handleDuplicate = async (id) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:5000/api/scenarios/${id}/duplicate`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      await fetchScenarios(); // Refresh list to show new copy
      setSuccess("Scenario duplicated.");
    } catch (err) {
      setError("Failed to duplicate scenario.");
      console.error("Error duplicating scenario:", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to display scenario details safely
  const renderScenarioDetails = (s) => (
    <div>
      <strong>{s.name}</strong>
      <div className="text-sm text-gray-700">
        Gross Income: {formatNumberShortNoDecimals(s.income?.grossAnnual) ?? 0}{" "}
        | Expenses:
        {formatNumberShortNoDecimals(
          monthlyToAnnual(sumExpenses(s.expenses))
        )}{" "}
        | Location: {s.location?.city ?? "N/A"}
      </div>
    </div>
  );
  // Render loading, error, or success messages

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold mb-4">Your Scenarios</h3>
      {loading && <div className="text-blue-600 mb-2">Loading...</div>}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      {scenarios.length === 0 && !loading ? (
        <div className="text-gray-500">
          No scenarios yet. Create your first scenario!
        </div>
      ) : (
        <ul className="space-y-4 h-96 overflow-y-auto pr-2">
          {scenarios.map((s) => (
            <li
              key={s._id}
              className="mb-2 p-4 bg-gray-50 rounded shadow flex justify-between items-center"
            >
              {renderScenarioDetails(s)}
              <div className="space-x-2">
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  // onClick={() => navigate(`/scenarios/${s._id}/view`)}
                  // if session expired or no token, redirect to login
                  onClick={() => {
                    const token = localStorage.getItem("token");
                    if (!token) {
                      navigate("/login");
                    } else {
                      navigate(`/scenarios/${s._id}/view`);
                    }
                  }}
                  aria-label={`View scenario ${s.name}`}
                >
                  View
                </button>
                <button
                  className="bg-yellow-500 text-white px-2 py-1 rounded"
                  // onClick={() => onEdit(s)}
                  onClick={() => onEdit(normalizeScenario(s))}
                  aria-label={`Edit scenario ${s.name}`}
                >
                  Edit
                </button>
                <button
                  className="bg-red-600 text-white px-2 py-1 rounded"
                  onClick={() => handleDelete(s._id)}
                  aria-label={`Delete scenario ${s.name}`}
                >
                  Delete
                </button>
                <button
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDuplicate(s._id)}
                  aria-label={`Duplicate scenario ${s.name}`}
                >
                  Duplicate
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

export default ScenarioList;

// This component fetches and displays a list of scenarios for the logged-in user.
// It uses the `useEffect` hook to fetch scenarios from the server when the component mounts
// and stores them in the `scenarios` state variable.
// Each scenario is displayed in a list with its name, income, expenses, and location.
// The component assumes that the user is authenticated and has a valid token stored in localStorage.

// The `onEdit` prop is a callback function that allows the parent component to handle editing a scenario.
// The `handleDelete` function sends a delete request to the server and updates the state to remove the deleted scenario from the list.
// The component also uses `forwardRef` to allow parent components to call the `fetchScenarios` method directly, enabling dynamic updates without needing to re-render the entire component.

// return (
//   <div className="mt-6">
//     <h3 className="text-xl font-bold mb-4">Your Scenarios</h3>
//     <ul>
//       {scenarios.map((s) => (
//         <li
//           key={s._id}
//           className="mb-2 p-4 bg-gray-50 rounded shadow flex justify-between items-center"
//         >
//           <div>
//             <strong>{s.name}</strong> — Income: ${s.income}, Expenses: $
//             {s.expenses}, Location: {s.location}
//           </div>
//           <div className="space-x-2">
//             <button
//               className="bg-yellow-500 text-white px-2 py-1 rounded"
//               onClick={() => onEdit(s)}
//             >
//               Edit
//             </button>
//             <button
//               className="bg-red-600 text-white px-2 py-1 rounded"
//               onClick={() => handleDelete(s._id)}
//             >
//               Delete
//             </button>
//           </div>
//         </li>
//       ))}
//     </ul>
//   </div>
// );
