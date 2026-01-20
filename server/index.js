// server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// ✅ CORS allowlist (local + prod)
const allowedOrigins = [
  "http://localhost:5173",
  "https://firelivingcalc1client.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman, curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// const allowedOrigins = [process.env.CLIENT_URL];

// CORS configuration with dynamic origin checking local + prod from .env
// const corsOptions = {
//   origin: function (origin, callback) {
//     // Allow non-browser tools
//     if (!origin) return callback(null, true);

//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error(`CORS blocked: ${origin}`));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/scenarios", require("./routes/scenario"));
app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
app.use("/api/ai", require("./routes/ai"));

// DB
mongoose.connect(process.env.MONGO_URI);

module.exports = app;
// This file sets up the Express server with CORS configuration, connects to MongoDB, and includes API routes.
