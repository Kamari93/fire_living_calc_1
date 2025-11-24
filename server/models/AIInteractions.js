const mongoose = require("mongoose");

const AIInteractionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  scenarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Scenario" },
  query: String,
  aiResponse: String,
  functionCalls: [
    {
      name: String,
      parameters: Object,
    },
  ],
  timestamp: { type: Date, default: Date.now },
});

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
