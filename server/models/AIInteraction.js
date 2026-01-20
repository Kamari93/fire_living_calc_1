const mongoose = require("mongoose");

// const AIInteractionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
//   query: String,
//   aiResponse: String,
//   functionCalls: [
//     {
//       name: String,
//       parameters: Object,
//     },
//   ],
//   timestamp: { type: Date, default: Date.now },
// });
const AIInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
  // promptType: { type: String, default: "insights" }, // insights | budget | savings | compare | cityCompare
  promptType: String, // "scenario_insight" | "scenario_comparison_insight"
  query: String, // short prompt summary / inputs
  aiResponse: String,
  tokensUsed: {
    input: { type: Number, default: 0 },
    output: { type: Number, default: 0 },
    total: { type: Number, default: 0 },
  },
  costUSD: { type: Number, default: 0 },
  cached: { type: Boolean, default: false }, // true if served from cache
  functionCalls: [
    {
      name: String,
      parameters: Object,
    },
  ],
  comparisonId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ScenarioComparison",
  },
  createdAt: { type: Date, default: Date.now },
});

// TTL: auto-delete interactions after 90 days to limit storage
AIInteractionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 90 * 24 * 60 * 60 }
);
module.exports = mongoose.model("AIInteraction", AIInteractionSchema);
// This model defines the structure of AI interactions in MongoDB.
// It includes fields for user ID, scenario ID, query, AI response, function calls,
// and a timestamp for when the interaction occurred.
// The userId and scenarioId fields reference the User and Scenario models, respectively,
// allowing us to associate AI interactions with specific users and scenarios.
// This is useful for tracking user interactions with AI features in the application,
// enabling features like logging, analytics, and personalized responses based on user scenarios.
// The functionCalls array allows for storing details about any function calls made during the interaction,
// which can be useful for debugging or enhancing AI capabilities in the future.
// The timestamp field automatically records when the interaction was created, providing a historical context for each interaction
