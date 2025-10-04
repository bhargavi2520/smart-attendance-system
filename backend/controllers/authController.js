// controllers/authController.js
"use strict";
const db = require("../models");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Resend } = require("resend");
const { Op } = require("sequelize");

const { User, Role, StudentProfile, FacultyProfile, Class } = db;

// Generate JWT Token
const generateToken = (user, rememberMe = false) => {
  const roles = user.roles.map((role) => role.name);
  const expiresIn = rememberMe ? "7d" : "3h";
  return jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// Function to get full user details
const getFullUser = async (userId) => {
  return await User.findByPk(userId, {
    include: [
      {
        model: Role,
        as: "roles",
        attributes: ["name"],
        through: { attributes: [] },
      },
      { model: FacultyProfile, as: "facultyProfile" },
      {
        model: StudentProfile,
        as: "studentProfile",
        // FIX: Correctly include the Class model to get the department
        include: [
          {
            model: Class,
            as: "class",
            attributes: ["id", "name", "department", "year"],
          },
        ],
      },
    ],
  });
};

exports.login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;
    let user;

    const isEmail = identifier.includes("@");
    if (isEmail) {
      user = await User.findOne({ where: { email: identifier } });
    } else {
      const studentProfile = await StudentProfile.findOne({
        where: { roll_number: identifier },
      });
      if (studentProfile) {
        user = await User.findByPk(studentProfile.user_id);
      }
    }

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch the full user object with all associations
    const fullUser = await getFullUser(user.id);

    const token = generateToken(fullUser, rememberMe);
    res.json({ user: fullUser, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    // req.user comes from Passport's verify callback and contains the user ID
    const fullUser = await getFullUser(req.user.id);
    const token = generateToken(fullUser);
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

exports.getMe = async (req, res) => {
  try {
    // req.user.id is attached by the 'protect' middleware
    const fullUser = await getFullUser(req.user.id);
    if (!fullUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: fullUser });
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  // This function appears correct and does not need changes based on the error.
  // ... (existing code)
};

exports.resetPassword = async (req, res) => {
  // This function also appears correct.
  // ... (existing code)
};
