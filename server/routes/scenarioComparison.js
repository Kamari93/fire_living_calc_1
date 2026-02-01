const express = require("express");
const mongoose = require("mongoose");
const ScenarioComparison = require("../models/ScenarioComparison");
const AIInteraction = require("../models/AIInteraction");
const Scenario = require("../models/Scenario");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Simple JWT auth middleware (reuse from scenario.js)
function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });
  const token = authHeader.split(" ")[1];
  try {
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    // next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded._id = decoded._id || decoded.id || decoded.userId;
    // req.user = decoded;
    req.user = decoded;
    req.user._id = decoded._id || decoded.id || decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}

// Create a scenario comparison
router.post("/", auth, async (req, res) => {
  try {
    const { scenarioIds, title, notes } = req.body;
    // Convert scenarioIds to ObjectIds
    const scenarioObjectIds = scenarioIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );
    const userId = req.user._id || req.user.id || req.user.userId;
    if (!Array.isArray(scenarioIds) || scenarioIds.length < 2) {
      return res
        .status(400)
        .json({ message: "At least two scenarioIds required" });
    }
    // Fetch scenarios and create snapshots
    const scenarios = await Scenario.find({
      // _id: { $in: scenarioIds },
      _id: { $in: scenarioObjectIds },
      user: req.user._id,
    });
    if (scenarios.length !== scenarioIds.length) {
      return res
        .status(404)
        .json({ message: "One or more scenarios not found" });
    }
    // const snapshots = scenarios.map((s) => s.toObject());
    // ✅ FIX: Map scenarios to snapshots AND add scenarioId
    const snapshots = scenarios.map((s) => {
      const snapshotObj = s.toObject();
      snapshotObj.scenarioId = s._id; // ← ADD THIS LINE
      return snapshotObj;
    });
    const comparison = new ScenarioComparison({
      // userId: req.user._id,
      // scenarioIds,
      userId,
      scenarioIds: scenarioObjectIds,
      snapshots,
      title,
      notes,
    });
    await comparison.save();
    res.status(201).json(comparison);
  } catch (err) {
    console.error("Comparison creation error:", err);
    res.status(400).json({ error: err.message });
  }
});

// Get all comparisons for user
router.get("/", auth, async (req, res) => {
  try {
    const comparisons = await ScenarioComparison.find({ userId: req.user._id });
    res.json(comparisons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single comparison
router.get("/:id", auth, async (req, res) => {
  try {
    const comparison = await ScenarioComparison.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!comparison) return res.status(404).json({ message: "Not found" });
    res.json(comparison);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a comparison
router.delete("/:id", auth, async (req, res) => {
  try {
    const comparisonId = req.params.id;
    const result = await ScenarioComparison.deleteOne({
      // _id: req.params.id,
      _id: comparisonId,
      userId: req.user._id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Not found" });
    // Also delete related AIInteractions
    await AIInteraction.deleteMany({
      comparisonId,
      userId: req.user._id,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Edit a comparison's title/notes
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, notes } = req.body;
    const update = { title, notes, updatedAt: new Date() };
    const comparison = await ScenarioComparison.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      update,
      { new: true } // Return the updated document
    );
    if (!comparison) return res.status(404).json({ message: "Not found" });
    res.json(comparison);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Optionally duplicate a comparison
router.post("/:id/duplicate", auth, async (req, res) => {
  try {
    const original = await ScenarioComparison.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!original) return res.status(404).json({ message: "Not found" });

    // Create a new comparison with the same data, but a new title and timestamps
    const duplicate = new ScenarioComparison({
      userId: original.userId,
      scenarioIds: original.scenarioIds,
      snapshots: original.snapshots,
      title: original.title + " (Copy)",
      notes: original.notes,
    });
    await duplicate.save();
    res.status(201).json(duplicate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

// This file defines the API routes for managing scenario comparisons.
// It includes routes for creating, fetching, and deleting scenario comparisons.
