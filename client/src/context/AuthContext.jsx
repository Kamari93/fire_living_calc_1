import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // <-- FIXED IMPORT
import api from "../api/axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token); // <-- FIXED USAGE
  //       setUser(decoded);
  //     } catch {
  //       setUser(null);
  //     }
  //   } else {
  //     setUser(null);
  //   }
  // }, [token]);

  // Load user from API when token exists
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const res = await api.get("/user/me");
        setUser(res.data);
      } catch {
        logout();
      }
    };

    loadUser();
  }, [token]);

  // const login = (newToken) => {
  //   localStorage.setItem("token", newToken);
  //   setToken(newToken);
  //   const decoded = jwtDecode(newToken); // <-- FIXED USAGE
  //   setUser(decoded.name);
  //   console.log("User logged in:", decoded);
  //   console.log("last login:", decoded.lastLogin);
  // };

  const login = async (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);

    const res = await api.get("/user/me");
    setUser(res.data);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const isAuthenticated = () => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token); // <-- FIXED USAGE
      return Date.now() < exp * 1000;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, user, setUser, login, logout, isAuthenticated }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;

// This AuthContext provides authentication state and methods for login, logout, and checking if the user is authenticated.
// It uses JWT for token management and stores the token in localStorage.
// The `AuthProvider` wraps the application to provide authentication context to all components.

// go into more detail about this file and its purpose in the project
