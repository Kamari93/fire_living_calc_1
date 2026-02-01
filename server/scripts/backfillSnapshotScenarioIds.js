// scripts/backfillSnapshotScenarioIds.js
require("dotenv").config();
const mongoose = require("mongoose");
const ScenarioComparison = require("../models/ScenarioComparison");

async function backfill() {
  await mongoose.connect(process.env.MONGO_URI);

  const comparisons = await ScenarioComparison.find({
    "snapshots.scenarioId": { $exists: false },
  });

  console.log(`Found ${comparisons.length} comparisons to fix`);

  for (const comparison of comparisons) {
    let changed = false;

    comparison.snapshots = comparison.snapshots.map((snap, index) => {
      if (!snap.scenarioId && comparison.scenarioIds[index]) {
        changed = true;
        return {
          ...(snap.toObject?.() ?? snap),
          scenarioId: comparison.scenarioIds[index],
        };
      }
      return snap;
    });

    if (changed) {
      await comparison.save();
      console.log(`✔ Fixed comparison ${comparison._id}`);
    }
  }

  console.log("🎉 Backfill complete");
  process.exit(0);
}

backfill().catch((err) => {
  console.error("❌ Backfill failed:", err);
  process.exit(1);
});
