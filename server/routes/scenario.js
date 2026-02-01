const express = require("express");
const Scenario = require("../models/Scenario");
const AIInteraction = require("../models/AIInteraction");
const ScenarioComparison = require("../models/ScenarioComparison");
const jwt = require("jsonwebtoken");
const router = express.Router(); //router for defining routes
const { buildScenarioSnapshot } = require("../utils/scenarioSnapshot");
const {
  calculateScenarioOutcome,
} = require("../services/scenarioCalculationService");

const {
  computeNetAnnual,
  computeAnnualSurplus,
  computeAnnualExpenses,
  computeSavingsRate,
  sumIncomeSources,
  computeNetWorth,
} = require("../utils/financeHelpers");

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
    const calculation = calculateScenarioOutcome(req.body);

    const currentNetWorth = computeNetWorth(
      req.body.assets,
      req.body.liabilities
    );
    // const incomeSourcesTotal = sumIncomeSources(req.body.income?.incomeSources);
    const additionalIncomeTotal = Array.isArray(req.body.income?.incomeSources)
      ? sumIncomeSources(req.body.income.incomeSources)
      : toNumber(req.body.income?.additionalIncome);

    const netAnnual = computeNetAnnual(
      req.body.income?.takeHome,
      additionalIncomeTotal
      // incomeSourcesTotal
      // req.body.income?.additionalIncome
    );
    const annualExpenses = computeAnnualExpenses(req.body.expenses);
    const annualSurplus = computeAnnualSurplus(netAnnual, annualExpenses);
    const savingsRate = computeSavingsRate({
      netAnnual,
      annualExpenses,
    });

    const scenario = new Scenario({
      ...req.body,
      user: req.user._id,
      savingsRate,
      fireGoal: {
        ...req.body.fireGoal,
        estimatedFIYear: calculation.estimatedFIYear,
        realisticFIYear: calculation.realisticFIYear,
      },
      netWorthHistory: [
        {
          year: new Date().getFullYear(),
          netWorth: currentNetWorth,
          annualExpenses,
          annualSurplus,
        },
      ],
    });

    await scenario.save();
    res.status(201).json(scenario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// router.post("/", auth, async (req, res) => {
//   try {
//     const scenario = new Scenario({ ...req.body, user: req.user._id });
//     await scenario.save();
//     res.status(201).json(scenario);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// });

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
    const existing = await Scenario.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!existing) {
      return res.status(404).json({ message: "Not found" });
    }

    // Delete related AIInteractions on update
    // await AIInteraction.deleteMany({
    //   scenarioId: req.params.id,
    //   userId: req.user._id,
    // });

    // Merge existing + incoming changes
    const merged = {
      ...existing.toObject(),
      ...req.body,
    };

    const calculation = calculateScenarioOutcome(merged);

    merged.fireGoal = {
      ...merged.fireGoal,
      estimatedFIYear: calculation.estimatedFIYear,
      realisticFIYear: calculation.realisticFIYear,
    };

    // merged.income.additionalIncome = incomeSourcesTotal;

    // --- Append historical snapshot ---
    merged.netWorthHistory = merged.netWorthHistory || [];
    const currentNetWorth = computeNetWorth(merged.assets, merged.liabilities);
    // const incomeSourcesTotal = sumIncomeSources(merged.income?.incomeSources);
    const additionalIncomeTotal = Array.isArray(merged.income?.incomeSources)
      ? sumIncomeSources(merged.income.incomeSources)
      : toNumber(merged.income?.additionalIncome);

    const netAnnual = computeNetAnnual(
      merged.income?.takeHome,
      additionalIncomeTotal
      // incomeSourcesTotal
      // merged.income?.additionalIncome
    );
    const annualExpenses = computeAnnualExpenses(merged.expenses);
    const annualSurplus = computeAnnualSurplus(netAnnual, annualExpenses);
    const savingsRate = computeSavingsRate({
      netAnnual,
      annualExpenses,
    });
    merged.savingsRate = savingsRate;
    merged.netWorthHistory.push({
      year: new Date().getFullYear(),
      netWorth: currentNetWorth,
      annualSurplus,
      annualExpenses,
    });

    const updated = await Scenario.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      merged,
      { new: true }
    );

    const updatedSnapshot = buildScenarioSnapshot(updated);

    // Update snapshots in any comparisons that include this scenario
    await ScenarioComparison.updateMany(
      {
        userId: req.user._id,
        // scenarioIds: updated._id,
        "snapshots.scenarioId": updated._id, // Find comparisons with this scenario
      },
      {
        $set: {
          // "snapshots.$[snap]": buildScenarioSnapshot(updated), // rebuild snapshot
          "snapshots.$[snap]": updatedSnapshot, // Replace entire snapshot
          updatedAt: new Date(),
        },
      },
      {
        arrayFilters: [{ "snap.scenarioId": updated._id }], // only update matching snapshot
      }
    );
    const matchedComparisons = await ScenarioComparison.find({
      userId: req.user._id,
      "snapshots.scenarioId": updated._id,
    });
    // console.log("📍 Found comparisons to update:", matchedComparisons.length);
    // console.log(updated._id, typeof updated._id);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a scenario
router.delete("/:id", auth, async (req, res) => {
  try {
    const scenarioId = req.params.id;
    const result = await Scenario.deleteOne({
      // _id: req.params.id,
      _id: scenarioId,
      user: req.user._id,
    });
    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Not found" });
    // Also delete related AIInteractions
    await AIInteraction.deleteMany({
      scenarioId,
      userId: req.user._id,
    });
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
