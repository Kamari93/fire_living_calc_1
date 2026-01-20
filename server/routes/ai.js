const express = require("express");
const router = express.Router();

const auth = require("../middleware/jwtAuth");
const aiLimiter = require("../middleware/rateLimit");

const Scenario = require("../models/Scenario");
const ScenarioComparison = require("../models/ScenarioComparison");
const AIInteraction = require("../models/AIInteraction");

const {
  generateScenarioInsights,
  generateScenarioComparisonInsights,
} = require("../services/aiService");

router.post("/insights", auth, aiLimiter, async (req, res) => {
  const { scenarioId } = req.body;

  if (!scenarioId) {
    return res.status(400).json({ message: "scenarioId is required" });
  }

  try {
    // 1️⃣ Debug safety check
    console.log("AI model loaded:", AIInteraction.modelName);

    // 2️⃣ Cache lookup
    const cached = await AIInteraction.findOne({
      userId: req.user._id,
      scenarioId,
    });

    if (cached) {
      return res.json({
        content: cached.aiResponse,
        cached: true,
      });
    }

    // 3️⃣ Load scenario (ownership enforced)
    const scenario = await Scenario.findOne({
      _id: scenarioId,
      user: req.user._id,
    });

    if (!scenario) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    // 4️⃣ Generate AI response (service guarantees a string)
    const content = await generateScenarioInsights(scenario);

    // 5️⃣ Save interaction
    await AIInteraction.create({
      userId: req.user._id,
      scenarioId,
      promptType: "scenario_insight",
      aiResponse: content,
    });

    // 6️⃣ Return response
    res.json({
      content,
      cached: false,
    });
  } catch (err) {
    console.error("❌ AI INSIGHTS ROUTE ERROR:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
});

router.post("/comparison-insights", auth, aiLimiter, async (req, res) => {
  const { comparisonId } = req.body;

  if (!comparisonId) {
    return res.status(400).json({ message: "comparisonId is required" });
  }

  try {
    // 1️⃣ Debug safety check
    console.log("AI model loaded:", AIInteraction.modelName);

    // 2️⃣ Cache lookup
    const cached = await AIInteraction.findOne({
      userId: req.user._id,
      comparisonId,
    });

    if (cached) {
      return res.json({
        content: cached.aiResponse,
        cached: true,
      });
    }

    // 3️⃣ Load scenario (ownership enforced)
    const comparison = await ScenarioComparison.findOne({
      _id: comparisonId,
      userId: req.user._id,
    });

    if (!comparison) {
      return res.status(404).json({ message: "Scenario not found" });
    }

    // 4️⃣ Generate AI response (service guarantees a string)
    const content = await generateScenarioComparisonInsights(comparison);

    // 5️⃣ Save interaction
    await AIInteraction.create({
      userId: req.user._id,
      comparisonId,
      promptType: "comparison_insight",
      aiResponse: content,
    });

    // 6️⃣ Return response
    res.json({
      content,
      cached: false,
    });
  } catch (err) {
    console.error("❌ AI INSIGHTS ROUTE ERROR:", err);
    res.status(500).json({ message: "AI generation failed" });
  }
});

module.exports = router;

// // 1️⃣ Verify model loaded (temporary safety check)
// // 2️⃣ Cache lookup
// // 3️⃣ Load scenario (ownership enforced)
// // 4️⃣ Generate AI response
// // 5️⃣ Save interaction
// // 6️⃣ Return response

// This file defines an Express router for AI-related endpoints.
// It includes a route for generating insights on financial scenarios, with caching and error handling.
// The route uses authentication and rate limiting middleware to protect access.
