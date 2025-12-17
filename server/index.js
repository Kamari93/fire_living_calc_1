// filepath: server/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express(); // Initialize Express app

app.use(
  cors({
    origin: "https://firelivingcalc1client.vercel.app", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); // Enable CORS for all routes to allow cross-origin requests

// app.options("*", cors()); // Enable pre-flight across-the-board
app.use(express.json()); // Parse JSON request bodies

// Define routes for different API endpoints
// app.use("/api/users", require("./routes/user"));
app.use("/api/scenarios", require("./routes/scenario"));
app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
app.use("/api/user", require("./routes/user"));

app.use("/api/auth", require("./routes/auth"));

mongoose.connect(process.env.MONGO_URI);

module.exports = app;

// This file sets up the Express application, connects to MongoDB, and defines the API routes.

// we use /api prefix for all routes to namespace them as API endpoints.
// CORS is enabled to allow requests from different origins (e.g., frontend app).
