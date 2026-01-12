// filepath: server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express(); // Initialize Express app
const vercelClientURL = "https://firelivingcalc1client.vercel.app";
const localClientURL = "http://localhost:5173";

// app.use(
//   cors({
//     origin: "https://firelivingcalc1client.vercel.app", // Allow requests from this origin
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   })
// ); // Enable CORS for all routes to allow cross-origin requests

// const corsOptions = {
//   origin: "https://firelivingcalc1client.vercel.app",
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// create a list of allowed origins for local development and production
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://firelivingcalc1client.vercel.app",
// ];

// const allowedOrigins = [process.env.CLIENT_URL].filter(Boolean);

// const corsOptions = {
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true); // Postman, curl
//     if (allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//       // callback(new Error(`CORS blocked: ${origin}`));
//     }
//     // return callback(null, false);
//   },
//   credentials: true,
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"],
// };

// app.use(cors(corsOptions));

const allowedOrigins = [
  "http://localhost:5173",
  "https://firelivingcalc1client.vercel.app",
];
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow non-browser requests (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // ❗ IMPORTANT: do NOT throw an error on Vercel
      return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Explicitly handle OPTIONS
app.options("*", cors());
// app.options("*", cors(corsOptions));

app.use(express.json()); // Parse JSON request bodies

// Define routes for different API endpoints
// app.use("/api/users", require("./routes/user"));
app.use("/api/scenarios", require("./routes/scenario"));
app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
app.use("/api/user", require("./routes/user"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/ai", require("./routes/ai"));

mongoose.connect(process.env.MONGO_URI);

module.exports = app;

// This file sets up the Express application, connects to MongoDB, and defines the API routes.

// we use /api prefix for all routes to namespace them as API endpoints.
// CORS is enabled to allow requests from different origins (e.g., frontend app).
