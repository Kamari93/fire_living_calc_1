import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Home = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  console.log("User in Home:", user);

  // get user state from context to determine if logged in
  useEffect(() => {
    // if (user) {
    //   navigate("/dashboard");
    // }
  }, [user]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="max-w-xl w-full p-8 bg-white rounded shadow text-center">
        <h1 className="text-3xl font-bold mb-2 text-blue-700">
          Financial Independence Assistant
        </h1>
        <p className="text-lg text-gray-700 mb-6">
          Plan, compare, and visualize your path to Financial Independence.
          Analyze living costs, create scenarios, and make smarter decisions for
          your future.
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
          {!user ? (
            <>
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
                onClick={() => navigate("/login")}
              >
                Log In
              </button>
              <button
                className="bg-green-500 text-white px-6 py-2 rounded font-semibold hover:bg-green-600"
                onClick={() => navigate("/register")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              className="bg-blue-600 text-white px-6 py-2 rounded font-semibold hover:bg-blue-700"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          <div>
            <h2 className="font-bold text-blue-600 mb-1">Scenario Planning</h2>
            <p className="text-gray-600 text-sm">
              Create and manage multiple financial scenarios for different
              cities, jobs, or life plans.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-blue-600 mb-1">
              Side-by-Side Comparison
            </h2>
            <p className="text-gray-600 text-sm">
              Compare scenarios to see differences in expenses, income, and time
              to FI.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-blue-600 mb-1">Visual Insights</h2>
            <p className="text-gray-600 text-sm">
              Interactive charts and tables help you understand your financial
              path.
            </p>
          </div>
          <div>
            <h2 className="font-bold text-blue-600 mb-1">
              Personalized Settings
            </h2>
            <p className="text-gray-600 text-sm">
              Customize your profile, set default assumptions, and manage your
              account securely.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// // create default home page for the app
// import React from "react";

// const Home = () => {
//   return <div>Cost of Living and FI Project</div>;
// };

// export default Home;
// // This is a simple home page component that can be expanded later with more features or content.
