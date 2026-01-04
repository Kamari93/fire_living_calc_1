import React, { useState, useEffect } from "react";
// import axios from "axios";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function ScenarioComparison() {
  const [scenarios, setScenarios] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparison, setComparison] = useState(null); // For immediate feedback after creation
  const [loading, setLoading] = useState(false);
  const [comparisonTitle, setComparisonTitle] = useState("");
  const [comparisonNotes, setComparisonNotes] = useState("");
  const [saveSuccess, setSaveSuccess] = useState("");
  const [savedComparisons, setSavedComparisons] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;

  // Sort and filter comparisons
  const sortedComparisons = [...savedComparisons].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  const filteredComparisons = sortedComparisons.filter((comp) => {
    const dateString = new Date(comp.createdAt).toLocaleString();
    return (
      comp.title.toLowerCase().includes(filterText.toLowerCase()) ||
      comp.notes.toLowerCase().includes(filterText.toLowerCase()) ||
      dateString.toLowerCase().includes(filterText.toLowerCase())
    );
  });

  // Fetch scenarios
  useEffect(() => {
    const fetchScenarios = async () => {
      setLoading(true);
      // try {
      //   // const token = localStorage.getItem("token");
      //   // const res = await axios.get(
      //   //   "https://firelivingcalc1server.vercel.app/api/scenarios",
      //   //   {
      //   //     withCredentials: true,
      //   //     headers: { Authorization: `Bearer ${token}` },
      //   //   }
      //   // );
      //   const res = await api.get("/scenarios");
      //   setScenarios(res.data);
      // } catch (err) {
      //   setError("Failed to load scenarios.");
      //   console.error("Error fetching scenarios:", err);
      // } finally {
      //   setLoading(false);
      // }
      try {
        const res = await api.get("/scenarios");
        setScenarios(res.data);
      } catch (err) {
        setError("Failed to load scenarios.");
        console.error("Error fetching scenarios:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchScenarios();
  }, []);

  // Fetch saved comparisons
  const fetchSavedComparisons = async () => {
    // try {
    //   const token = localStorage.getItem("token");
    //   const res = await axios.get(
    //     "https://firelivingcalc1server.vercel.app/api/scenario-comparisons",
    //     {
    //       withCredentials: true,
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   setSavedComparisons(res.data);
    // } catch (err) {
    //   setError("Failed to load saved comparisons.");
    //   console.error("Error fetching saved comparisons:", err);
    // }
    try {
      const res = await api.get("/scenario-comparisons");
      setSavedComparisons(res.data);
    } catch (err) {
      setError("Failed to load saved comparisons.");
      console.error("Error fetching saved comparisons:", err);
    }
  };

  // Initial fetch of saved comparisons
  useEffect(() => {
    fetchSavedComparisons();
  }, []);

  // Handle selection
  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  // Create a new comparison
  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      setError("Select at least two scenarios to compare.");
      return;
    }
    setLoading(true);
    setError("");
    setSaveSuccess("");
    // try {
    //   const token = localStorage.getItem("token");
    //   const res = await axios.post(
    //     "https://firelivingcalc1server.vercel.app/api/scenario-comparisons",
    //     {
    //       scenarioIds: selectedIds.map(String),
    //       title: comparisonTitle,
    //       notes: comparisonNotes,
    //     },
    //     {
    //       withCredentials: true,
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );
    //   setComparison(res.data); // Show immediate feedback
    //   setSaveSuccess("Comparison saved!");
    //   setSelectedIds([]);
    //   setComparisonTitle("");
    //   setComparisonNotes("");
    //   await fetchSavedComparisons(); // Refresh saved comparisons
    // } catch (err) {
    //   setError("Failed to create comparison.");
    //   console.error("Error creating comparison:", err);
    // } finally {
    //   setLoading(false);
    // }
    try {
      const res = await api.post("/scenario-comparisons", {
        scenarioIds: selectedIds.map(String),
        title: comparisonTitle,
        notes: comparisonNotes,
      });
      setComparison(res.data); // Show immediate feedback
      setSaveSuccess("Comparison saved!");
      setSelectedIds([]);
      setComparisonTitle("");
      setComparisonNotes("");
      await fetchSavedComparisons(); // Refresh saved comparisons
    } catch (err) {
      setError("Failed to create comparison.");
      console.error("Error creating comparison:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-1/2 mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Compare Scenarios</h1>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <button
        className="bg-gray-300 text-black px-4 py-2 rounded mb-4"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
      <input
        type="text"
        placeholder="Search by title, date, or notes"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
        className="border px-2 py-1 rounded w-full mb-4"
      />
      {/* Saved Comparisons */}
      <div className="mb-6  bg-white rounded shadow p-6">
        <h2 className="text-lg font-semibold mb-2">Saved Comparisons</h2>
        <div className="h-80 overflow-y-scroll space-y-4 bg-gray-50">
          {filteredComparisons.length === 0 ? (
            <div className="text-gray-500">No saved comparisons yet.</div>
          ) : (
            filteredComparisons.map((comp) => (
              <div
                key={comp._id}
                className="mb-2 p-3 bg-white rounded shadow flex flex-col md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <strong className="text-blue-700">{comp.title}</strong>
                  <div className="text-sm text-gray-600">{comp.notes}</div>
                  <div className="text-xs text-gray-400">
                    Saved: {new Date(comp.createdAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex space-x-2 mt-2 md:mt-0">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                    onClick={() => navigate(`/comparison/${comp._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={async () => {
                      // if (window.confirm("Delete this comparison?")) {
                      //   const token = localStorage.getItem("token");
                      //   await axios.delete(
                      //     `https://firelivingcalc1server.vercel.app/api/scenario-comparisons/${comp._id}`,
                      //     {
                      //       withCredentials: true,
                      //       headers: { Authorization: `Bearer ${token}` },
                      //     }
                      //   );
                      //   await fetchSavedComparisons();
                      // }
                      if (window.confirm("Delete this comparison?")) {
                        await api.delete(`/scenario-comparisons/${comp._id}`);
                        await fetchSavedComparisons();
                      }
                    }}
                  >
                    Delete
                  </button>
                  {/* Optionally add delete or duplicate buttons here */}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Create Comparison */}
      <div className="mb-4 bg-white rounded shadow p-6 py-4">
        <h2 className="text-lg font-semibold mb-2">Select Scenarios:</h2>
        <div className="mb-2 h-30 overflow-y-scroll space-y-2 p-2 rounded bg-gray-50 shadow">
          {scenarios.map((s) => (
            <label key={s._id} className="block mb-1">
              <input
                type="checkbox"
                checked={selectedIds.includes(s._id)}
                onChange={() => handleSelect(s._id)}
                className="mr-2"
              />
              {s.name} ({s.location?.city ?? "N/A"})
            </label>
          ))}
        </div>
        <div className="mb-2">
          <input
            type="text"
            placeholder="Comparison Title"
            value={comparisonTitle}
            onChange={(e) => setComparisonTitle(e.target.value)}
            className=" px-2 py-1 rounded w-full mb-2 bg-white border-2 border-gray-400 shadow"
          />
          <textarea
            placeholder="Notes (optional)"
            value={comparisonNotes}
            onChange={(e) => setComparisonNotes(e.target.value)}
            className=" px-2 py-1 rounded w-full bg-white border-2 border-gray-400 shadow"
            rows={2}
          />
        </div>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleCompare}
          disabled={loading}
        >
          Compare Selected
        </button>
        {saveSuccess && (
          <div className="text-green-600 mb-2">{saveSuccess}</div>
        )}
      </div>
      {loading && <div>Loading...</div>}
      {/* Optional: Show immediate feedback for newly created comparison */}
      {/* Remove this block if you want all details only on the details page */}
      {comparison && (
        <div className="mt-8 bg-white rounded shadow p-6">
          <h2 className="text-lg font-semibold mb-4 text-center">
            Comparison Created: {comparison.title}
          </h2>
          <div className="mb-2 text-gray-700">{comparison.notes}</div>
          <div className="mb-2 text-xs text-gray-400">
            Saved: {new Date(comparison.createdAt).toLocaleString()}
          </div>
          <button
            className="bg-blue-500 text-white px-3 py-1 rounded mb-4"
            onClick={() => navigate(`/comparison/${comparison._id}`)}
          >
            View Full Details
          </button>
        </div>
      )}
    </div>
  );
}
