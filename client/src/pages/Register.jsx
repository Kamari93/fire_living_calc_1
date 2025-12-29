import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
import api from "../api/axios";

// const API = "http://localhost:5000/api/auth/register";
const API = "https://firelivingcalc1server.vercel.app/api/auth/register";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   try {
  //     await axios.post(
  //       API,
  //       // { withCredentials: true },
  //       { name, email, password }
  //     );
  //     navigate("/login");
  //   } catch (err) {
  //     setError("Registration failed");
  //     console.error(err);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full px-3 py-2 border rounded"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          className="w-full px-3 py-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full px-3 py-2 border rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          Register
        </button>
      </form>
      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
      <p className="mt-4 text-center">
        Back to the home page.{" "}
        <Link to="/" className="text-blue-600 hover:underline">
          Home
        </Link>
      </p>
    </div>
  );
}
