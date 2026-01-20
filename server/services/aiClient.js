const OpenAI = require("openai");
require("dotenv").config();

function createAIClient() {
  // 🧪 Development mode → no real AI calls
  if (process.env.NODE_ENV !== "production") {
    console.log("🧪 AI running in MOCK mode");
    return null;
  }

  // 🚀 Production → real AI
  if (process.env.AI_PROVIDER === "groq") {
    return new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });
  }

  if (process.env.AI_PROVIDER === "openai") {
    return new OpenAI({
      apiKey: process.env.AI_API_KEY,
    });
  }

  throw new Error("Unsupported AI provider");
}

module.exports = createAIClient();

// This file initializes and exports an AI client based on environment settings. It supports different providers (Groq, OpenAI) and falls back to a mock mode in development to avoid real API calls.
// The AI client is used for generating insights for scenarios.

// const OpenAI = require("openai");
// require("dotenv").config();

// let client = null;

// function getAIClient() {
//   if (client) return client;

//   if (process.env.NODE_ENV !== "production") {
//     console.log("🧪 AI running in MOCK mode");
//     return null;
//   }

//   if (!process.env.AI_API_KEY) {
//     console.error("❌ Missing AI_API_KEY");
//     return null;
//   }

//   if (process.env.AI_PROVIDER === "groq") {
//     client = new OpenAI({
//       apiKey: process.env.AI_API_KEY,
//       baseURL: "https://api.groq.com/openai/v1",
//     });
//     console.log("✅ Groq AI client initialized");
//     return client;
//   }

//   if (process.env.AI_PROVIDER === "openai") {
//     client = new OpenAI({
//       apiKey: process.env.AI_API_KEY,
//     });
//     console.log("✅ OpenAI client initialized");
//     return client;
//   }

//   console.error("❌ Unsupported AI_PROVIDER:", process.env.AI_PROVIDER);
//   return null;
// }

// module.exports = getAIClient();
