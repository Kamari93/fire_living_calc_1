// // server/index.js
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();

// // ✅ CORS allowlist (local + prod)
// // const allowedOrigins = [
// //   "http://localhost:5173",
// //   "https://firelivingcalc1client.vercel.app",
// // ];

// // const corsOptions = {
// //   origin: function (origin, callback) {
// //     if (!origin) return callback(null, true); // Postman, curl
// //     if (allowedOrigins.includes(origin)) {
// //       callback(null, true);
// //     } else {
// //       callback(new Error("Not allowed by CORS"));
// //     }
// //   },
// //   credentials: true,
// //   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
// //   allowedHeaders: ["Content-Type", "Authorization"],
// // };

// const allowedOrigins = [process.env.CLIENT_URL];

// // CORS configuration with dynamic origin checking local + prod from .env
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
// app.use(cors(corsOptions));
// // app.options("*", cors(corsOptions)); // Enable pre-flight for all routes
// app.use(express.json());

// // Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/user", require("./routes/user"));
// app.use("/api/scenarios", require("./routes/scenario"));
// app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
// app.use("/api/ai", require("./routes/ai"));

// // DB
// mongoose.connect(process.env.MONGO_URI);

// module.exports = app;
// This file sets up the Express server with CORS configuration, connects to MongoDB, and includes API routes.

// server/index.js

//test I
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// require("dotenv").config();

// const app = express();

// /**
//  * ✅ Explicit allowlist (local + prod)
//  * DO NOT rely only on process.env during preflight
//  */
// const allowedOrigins = [
//   "http://localhost:5173",
//   "https://firelivingcalc1client.vercel.app",
// ];

// /**
//  * ✅ HARD STOP FOR PREFLIGHT REQUESTS
//  * This prevents Vercel from returning a 404 on OPTIONS
//  */
// app.use((req, res, next) => {
//   const origin = req.headers.origin;

//   if (req.method === "OPTIONS") {
//     if (allowedOrigins.includes(origin)) {
//       res.header("Access-Control-Allow-Origin", origin);
//     }

//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     return res.sendStatus(200);
//   }

//   next();
// });

// /**
//  * ✅ Standard CORS middleware (for non-OPTIONS requests)
//  */
// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // Postman, curl

//       if (allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error(`CORS blocked: ${origin}`));
//       }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.use(express.json());

// // ✅ Routes
// app.use("/api/auth", require("./routes/auth"));
// app.use("/api/user", require("./routes/user"));
// app.use("/api/scenarios", require("./routes/scenario"));
// app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
// app.use("/api/ai", require("./routes/ai"));

// // ✅ DB
// mongoose.connect(process.env.MONGO_URI);

// module.exports = app;
// // This file sets up the Express server with CORS configuration, connects to MongoDB, and includes API routes.
// // It includes a hard stop for preflight OPTIONS requests to ensure proper CORS handling.

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

/**
 * ✅ Explicit allowlist (local + prod)
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://firelivingcalc1client.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean); // Remove undefined values

console.log("🔍 Allowed Origins:", allowedOrigins);
console.log("🔍 NODE_ENV:", process.env.NODE_ENV);

/**
 * ✅ CORS configuration (Vercel-safe)
 */
const corsOptions = {
  origin: function (origin, callback) {
    // Allow server-to-server tools (Postman, curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }

    return callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

/**
 * ✅ Apply CORS BEFORE routes
 */
app.use(cors(corsOptions));

/**
 * ✅ Explicitly handle preflight requests (IMPORTANT for Vercel)
 */
// if (process.env.NODE_ENV === "production") {
//   app.options("*", (req, res) => {
//     res.header("Access-Control-Allow-Origin", req.headers.origin);
//     res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE, OPTIONS");
//     res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.header("Access-Control-Allow-Credentials", "true");
//     res.sendStatus(200);
//   });
// }

// app.options("*", cors(corsOptions));

/**
 * ✅ Body parser
 */
app.use(express.json());

/**
 * ✅ Routes
 */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/user", require("./routes/user"));
app.use("/api/scenarios", require("./routes/scenario"));
app.use("/api/scenario-comparisons", require("./routes/scenarioComparison"));
app.use("/api/ai", require("./routes/ai"));

/**
 * ✅ Database
 */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

module.exports = app;
