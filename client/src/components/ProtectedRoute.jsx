import React from "react";
import { Navigate } from "react-router-dom";
// import jwt_decode from "jwt-decode";
import { jwtDecode } from "jwt-decode"; // <-- FIXED IMPORT

// Function to check if the token is valid
function isTokenValid(token) {
  if (!token) return false;
  try {
    // const { exp } = jwt_decode(token);
    const { exp } = jwtDecode(token); // <-- FIXED USAGE
    if (!exp) return false; // if no expiration, consider it invalid
    // exp is in seconds, Date.now() is ms
    return Date.now() < exp * 1000; // check if current time is before expiration time to make sure the token is still valid
  } catch {
    return false;
  }
}

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const valid = isTokenValid(token);

  if (!valid) {
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  return children;
}

// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem("token");
//   // Optionally, add more robust token validation here
//   return token ? children : <Navigate to="/login" replace />;
// }
// This component checks if the user is authenticated by verifying the presence of a token in localStorage.
// If the token exists, it renders the children components; otherwise, it redirects to the login page.
// This is useful for protecting routes that require authentication in a React application.
