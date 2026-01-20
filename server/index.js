// const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(express.json());

// 🔥 TEST ROUTE
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

// Routes
app.use("/api/auth", require("./routes/auth"));

mongoose.connect(process.env.MONGO_URI);

module.exports = app;
