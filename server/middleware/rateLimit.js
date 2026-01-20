const rateLimit = require("express-rate-limit");

const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 AI calls per user per hour
  message: { message: "AI request limit reached. Try again later." },
});

module.exports = aiLimiter;

// This file defines rate limiting middleware for AI-related API endpoints. To protect free tier usage.
