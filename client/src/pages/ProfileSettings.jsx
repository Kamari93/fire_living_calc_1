import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProfileSettings() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [defaultInvestmentReturn, setDefaultInvestmentReturn] = useState(0.07);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/user/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
      setName(res.data.name || "");
      setDefaultInvestmentReturn(res.data.defaultInvestmentReturn || 0.07);
    };
    fetchUser();
  }, []);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await axios.put(
        "/api/user/me",
        { name, defaultInvestmentReturn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Profile updated!");
      setUser(res.data);
    } catch {
      setMessage("Error updating profile.");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        "/api/user/me/password",
        { oldPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("Password changed!");
      setOldPassword("");
      setNewPassword("");
    } catch {
      setMessage("Error changing password.");
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-md mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Profile & Settings
      </h1>
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <form onSubmit={handleProfileUpdate} className="mb-6">
        <label className="block mb-2 font-semibold">Name</label>
        <input
          className="border px-2 py-1 rounded w-full mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label className="block mb-2 font-semibold">
          Default Investment Return (%)
        </label>
        <input
          type="number"
          step="0.01"
          className="border px-2 py-1 rounded w-full mb-4"
          value={defaultInvestmentReturn}
          onChange={(e) => setDefaultInvestmentReturn(Number(e.target.value))}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          Update Profile
        </button>
      </form>
      <form onSubmit={handleChangePassword}>
        <label className="block mb-2 font-semibold">Change Password</label>
        <input
          type="password"
          placeholder="Old Password"
          className="border px-2 py-1 rounded w-full mb-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="New Password"
          className="border px-2 py-1 rounded w-full mb-4"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          className="bg-yellow-500 text-white px-4 py-2 rounded"
          type="submit"
        >
          Change Password
        </button>
      </form>
      <button
        className="mt-6 bg-gray-300 text-black px-4 py-2 rounded w-full"
        onClick={() => navigate("/dashboard")}
      >
        Back to Dashboard
      </button>
    </div>
  );
}

// This component allows users to view and update their profile information,
// including their name, default investment return, and password.
