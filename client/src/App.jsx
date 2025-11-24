import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ScenarioDashboard from "./pages/ScenarioDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import MainLayout from "./components/MainLayout";
import ScenarioComparison from "./pages/ScenarioComparison";
import ProfileSettings from "./pages/ProfileSettings";
import ViewScenario from "./pages/ViewScenario";
import ScenarioComparisonDetails from "./pages/ScenarioComparisonDetails";
// import axios from "axios";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ScenarioDashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          {/* Add more routes here */}
          <Route path="/compare" element={<ScenarioComparison />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/scenarios/:id/view" element={<ViewScenario />} />
          <Route
            path="/comparison/:id"
            element={<ScenarioComparisonDetails />}
          />
          {/* <Route
            path="/dashboard"
            element={
              <MainLayout>
                <ScenarioDashboard />
              </MainLayout>
            }
          /> */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// function App() {
//   return <div>Cost of Living and FI Project</div>;
// }

// export default App;
