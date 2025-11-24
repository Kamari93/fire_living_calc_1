const express = require("express");
const Scenario = require("../models/Scenario");
const jwt = require("jsonwebtoken");
const router = express.Router(); //router for defining routes

// Simple JWT auth middleware
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.user._id = decoded._id || decoded.id || decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Create a scenario
router.post("/", auth, async (req, res) => {
  try {
    const scenario = new Scenario({ ...req.body, user: req.user._id });
    await scenario.save();
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all scenarios for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const scenarios = await Scenario.find({ user: req.user._id });
    res.json(scenarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single scenario by ID for the logged-in user
router.get("/:id", auth, async (req, res) => {
  try {
    const scenario = await Scenario.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!scenario)
      return res.status(404).json({ message: "Scenario not found" });
    res.json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update a scenario
router.put("/:id", auth, async (req, res) => {
  try {
    const scenario = await Scenario.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );
    if (!scenario) return res.status(404).json({ message: "Not found" });
    res.json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a scenario
router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await Scenario.deleteOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Not found" });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Duplicate a scenario
router.post("/:id/duplicate", auth, async (req, res) => {
  try {
    const original = await Scenario.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!original) return res.status(404).json({ message: "Not found" });

    // Remove _id and timestamps, set a new name/title
    const copy = original.toObject();
    delete copy._id;
    copy.name = copy.name + " (Copy)";
    copy.createdAt = new Date();
    copy.updatedAt = new Date();

    const newScenario = new Scenario({ ...copy, user: req.user.userId });
    await newScenario.save();
    res.status(201).json(newScenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// This file defines the API routes for managing financial scenarios.
