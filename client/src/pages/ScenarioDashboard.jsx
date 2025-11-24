import React, { useState, useRef, useContext } from "react"; //useRef is used to access child component methods
import ScenarioForm from "../components/ScenarioForm";
import ScenarioFormAlt from "../components/ScenarioFormAlt";
import ScenarioList from "../components/ScenarioList";
import ScenarioCharts from "../components/ScenarioCharts";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function ScenarioDashboard() {
  const [editingScenario, setEditingScenario] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const listRef = useRef(); // Reference to the ScenarioList component
  const navigate = useNavigate(); // For navigation if needed
  const { user } = useContext(AuthContext);

  // Called when user clicks "Edit"
  const handleEdit = (scenario) => {
    setEditingScenario(scenario);
    window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: scroll to form
  };

  // Called after create or update
  const handleScenarioSaved = () => {
    setEditingScenario(null); // Reset editing state
    setShowSuccess(true); // Show success message (optional)
    // Refresh the list by calling a method on ScenarioList via ref
    if (listRef.current) {
      listRef.current.fetchScenarios();
    }
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="max-w-4xl w-full mx-auto min-h-screen  py-8 px-4">
      {/* Welcome Banner */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-blue-200 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-blue-800 mb-1">
            Welcome{user?.name ? `, ${user.name}` : ""}!
          </h1>
          <p className="text-gray-700">
            Manage and compare your financial scenarios below.
          </p>
        </div>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded mt-4 md:mt-0"
          onClick={() => navigate("/compare")}
        >
          Compare Scenarios
        </button>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="mb-4 p-2 bg-green-100 text-green-800 rounded shadow text-center font-semibold">
          Scenario saved successfully!
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Scenario Form Card */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            {editingScenario ? "Edit Scenario" : "Create New Scenario"}
          </h2>
          <ScenarioFormAlt
            scenario={editingScenario}
            onScenarioSaved={handleScenarioSaved}
          />
        </div>

        {/* Charts Card */}
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">
            Scenario Visualizations
          </h2>
          <ScenarioCharts scenario={editingScenario} />
        </div>
      </div>

      {/* Scenario List Card */}
      <div className="mt-8 bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4 text-blue-700">
          Your Scenarios
        </h2>

        <ScenarioList
          ref={listRef}
          onEdit={handleEdit}
          editingScenario={editingScenario}
        />
      </div>
    </div>
  );
}

// This component serves as the main dashboard for managing financial scenarios.
// It includes a form for creating or editing scenarios and a list to display existing scenarios.
// The `handleEdit` function sets the scenario to be edited and scrolls to the form.
// The `handleScenarioSaved` function is called after a scenario is created or updated, resetting the editing state and refreshing the scenario list.
// The `listRef` is used to call the `fetchScenarios` method on the `ScenarioList` component, allowing dynamic updates without needing to re-render the entire component.

// return (
//     <div className="max-w-2xl mx-auto py-8">
//       <h1 className="text-3xl font-bold mb-6 text-center">
//         Scenario Dashboard
//       </h1>
//       <button
//         className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
//         onClick={() => navigate("/compare")}
//       >
//         Compare Scenarios
//       </button>
//       {/* <ScenarioForm
//         scenario={editingScenario} // Pass the scenario to be edited
//         onScenarioSaved={handleScenarioSaved} // Callback after create/update
//       /> */}
//       <ScenarioFormAlt
//         scenario={editingScenario} // Pass the scenario to be edited
//         onScenarioSaved={handleScenarioSaved} // Callback after create/update
//       />
//       {/* Display chart for the
//       current scenario */}
//       <ScenarioCharts scenario={editingScenario} />
//       {/* List of scenarios with edit option...Pass the ref */}
//       <ScenarioList ref={listRef} onEdit={handleEdit} />{" "}
//       {/* Pass onEdit prop */}
//     </div>
//   );
// }

// This component serves as the main dashboard for managing financial scenarios.
// It includes a form for creating or editing scenarios and a list to display existing scenarios.
// The `handleEdit` function sets the scenario to be edited and scrolls to the form.
// The `handleScenarioSaved` function is called after a scenario is created or updated, resetting the editing state and refreshing the scenario list.
// The `listRef` is used to call the `fetchScenarios` method on the `ScenarioList` component, allowing dynamic updates without needing to re-render the entire component.
