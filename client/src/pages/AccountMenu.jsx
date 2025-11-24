import React, { useContext } from "react";
import AuthContext from "../context/AuthContext"; // <-- default import
import { useNavigate } from "react-router-dom";

export default function AccountMenu() {
  const { logout, user } = useContext(AuthContext); // <-- use context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null; // Hide menu if not logged in

  // Helper for initials
  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";

  return (
    <div className="flex flex-col space-y-4 p-6 bg-white rounded shadow w-72 mt-4">
      {/* Avatar and Info */}
      <div className="flex items-center space-x-3 mb-2">
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
          {getInitials(user.name)}
        </div>
        <div>
          <div className="font-bold text-gray-800">{user.name || "User"}</div>
          <div className="text-gray-700 text-sm">{user.email}</div>
          <div className="text-xs text-gray-500">
            Last login:{" "}
            {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
          </div>
        </div>
      </div>
      {/* Menu Buttons */}
      <button
        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 font-medium"
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>
      <button
        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 font-medium"
        onClick={() => navigate("/compare")}
      >
        Compare Scenarios
      </button>
      <button
        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 font-medium"
        onClick={() => navigate("/profile")}
      >
        Profile & Settings
      </button>
      <button
        className="w-full text-left px-4 py-2 rounded hover:bg-blue-50 font-medium"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
      <button
        onClick={handleLogout}
        className="w-full bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 font-semibold mt-2"
      >
        Logout
      </button>
    </div>
  );
}

// return (
//   <div className="flex flex-col space-y-2 p-4 bg-gray-100 rounded shadow">
//     <div className="flex flex-col items-start space-y-1 mb-2">
//       <span className="font-bold text-gray-800">
//         {user.name ? user.name : "User"}
//       </span>
//       <span className="text-gray-700 text-sm">{user.email}</span>
//       <span className="text-xs text-gray-500">
//         Last login:{" "}
//         {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : "N/A"}
//       </span>
//       <button
//         className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//         onClick={() => navigate("/profile")}
//       >
//         Profile & Settings
//       </button>
//     </div>
//     <button
//       className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//       onClick={() => navigate("/compare")}
//     >
//       Compare Scenarios
//     </button>
//     <button
//       className="block w-full text-left px-4 py-2 hover:bg-gray-200"
//       onClick={() => navigate("/profile")}
//     >
//       Profile & Settings
//     </button>
//     <button
//       onClick={handleLogout}
//       className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 mt-2"
//     >
//       Logout
//     </button>
//   </div>
// );
