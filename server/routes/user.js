const express = require("express");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Auth middleware (reuse from other routes)
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Get user profile
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Update profile info (name, email, settings)
router.put("/me", auth, async (req, res) => {
  const { name, defaultInvestmentReturn } = req.body;
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { name, defaultInvestmentReturn },
    { new: true }
  ).select("-password");
  res.json(user);
});

// Change password
router.put("/me/password", auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) return res.status(400).json({ message: "Incorrect password" });
  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();
  res.json({ success: true });
});

module.exports = router;

// This file defines the API routes for managing user profiles.
// It includes routes for fetching and updating profile info, and changing passwords.
