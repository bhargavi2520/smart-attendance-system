require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("passport");

const { runMigrations } = require("./migrate");
const { runSeeds } = require("./seed");
const { sequelize, Sequelize } = require("./models");

require("./config/passport");

const authRoutes = require("./routes/authRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const userRoutes = require("./routes/userRoutes");
const facultyRoutes = require("./routes/facultyRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

const allowedOrigins = [process.env.CLIENT_URL, "http://localhost:5173"];
console.log("Allowed Origins on Startup:", allowedOrigins);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.includes(origin)) {
        return callback(new Error("CORS not allowed"), false);
      }
      return callback(null, true);
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

app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/faculty", facultyRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Smart Attendance System API." });
});

async function initializeDatabaseAndStartServer() {
  try {
    console.log("Starting server initialization...");
    await runMigrations();

    // HACK: Force drop and recreate of student_classes table
    console.log("--- Forcing recreation of student_classes table ---");
    const queryInterface = sequelize.getQueryInterface();
    try {
      await queryInterface.dropTable("student_classes");
    } catch (error) {
      // Ignore error if table doesn't exist
    }
    await queryInterface.createTable("student_classes", {
      student_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "student_profiles",
          key: "id",
        },
        primaryKey: true,
      },
      class_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "classes",
          key: "id",
        },
        primaryKey: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    console.log("--- student_classes table recreated ---");

    await runSeeds();
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error("APPLICATION BOOT FAILED:", err);
    process.exit(1);
  }
}

initializeDatabaseAndStartServer();
