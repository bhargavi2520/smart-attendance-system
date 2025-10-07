// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session"); // Corrected import
const passport = require("passport");

const { runMigrations } = require("./migrate");
const { runSeeds } = require("./seed");
const { sequelize } = require("./models");

require("./config/passport");

// Import all route handlers
const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes"); // Import dashboard routes
const classRoutes = require("./routes/classRoutes");
const departmentRoutes = require("./routes/departmentRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];
console.log("Allowed Origins on Startup:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"), false);
      }
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Register all API routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/dashboard", dashboardRoutes); // Register dashboard routes
app.use("/api/classes", classRoutes);
app.use("/api/departments", departmentRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Attendance System API." });
});

// This is the corrected startup function.
// It relies on migrations and seeds without manual table creation.
async function initializeDatabaseAndStartServer() {
  try {
    console.log("Starting server initialization...");
    await runMigrations();
    await runSeeds();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("APPLICATION BOOT FAILED:", err);
    process.exit(1);
  }
}

initializeDatabaseAndStartServer();
