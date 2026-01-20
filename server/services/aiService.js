const client = require("./aiClient");
// const getAIClient = require("./aiClient");
const { generateMockInsights } = require("./aiMockService");
const { generateMockInsightsComparison } = require("./aiMockServiceCompare");

async function generateScenarioInsights(scenario) {
  try {
    // 🧪 Dev mode or missing client → mock
    // const client = getAIClient();
    if (!client) {
      return generateMockInsights();
    }

    const prompt = `
You are a financial assistant helping users understand their FIRE scenario clearly and conservatively.

Here is a user's financial scenario (JSON):

${JSON.stringify(scenario, null, 2)}

Provide:
1. A short summary
2. One strength
3. One risk
4. One actionable suggestion

Keep it concise and non-judgmental.
`;

    const response = await client.responses.create({
      model: process.env.AI_MODEL,
      input: prompt,
      // max_output_tokens: 250,
      max_output_tokens: 600,
      temperature: 0.4,
    });
    console.log(JSON.stringify(response.output, null, 2));

    // ✅ Preferred helper (when present)
    if (response.output_text) {
      return response.output_text;
    }

    // ✅ Fallback: manual extraction
    const text = response.output
      ?.flatMap((item) => item.content || [])
      ?.filter((c) => c.type === "output_text")
      ?.map((c) => c.text)
      ?.join("\n\n");

    // 🟡 Final fallback → mock instead of failure
    return text || generateMockInsights();
  } catch (err) {
    console.error("❌ AI SERVICE ERROR:", err);
    // 🔥 Never break the app because of AI
    return generateMockInsights();
  }
}

/**
 * Scenario comparison insight
 */
async function generateScenarioComparisonInsights(comparison) {
  try {
    // const client = getAIClient();
    if (!client) {
      return generateMockInsightsComparison();
    }

    const prompt = `
You are a conservative financial assistant helping a user compare 2 snapshots of scenarios.

Here are the scenarios being compared (JSON):

${JSON.stringify(comparison.snapshots, null, 2)}

Provide:
1. Most advantageous scenario (1 to 4 sentences) based on the scenario data

Keep it concise and non-judgmental.
`;

    const response = await client.responses.create({
      model: process.env.AI_MODEL,
      input: prompt,
      max_output_tokens: 600,
      temperature: 0.3,
    });

    console.log(
      "🧠 COMPARISON AI RAW OUTPUT:",
      JSON.stringify(response.output, null, 2)
    );

    if (response.output_text) return response.output_text;

    // const text = response.output
    //   ?.flatMap((item) => item.content || [])
    //   ?.filter((c) => c.type === "output_text")
    //   ?.map((c) => c.text)
    //   ?.join("\n\n");
    const text = response.output
      ?.flatMap((item) => item.content || [])
      ?.filter((c) => c.type === "output_text" || c.type === "reasoning_text")
      ?.map((c) => c.text)
      ?.join("\n\n");

    return text || generateMockInsightsComparison();
  } catch (err) {
    console.error("❌ COMPARISON AI ERROR:", err);
    return generateMockInsightsComparison();
  }
}

module.exports = {
  generateScenarioInsights,
  generateScenarioComparisonInsights,
};

// This file defines functions for generating insights from a financial scenario using AI.
// It uses the AI client initialized in aiClient.js and falls back to mock responses in development or on errors.
