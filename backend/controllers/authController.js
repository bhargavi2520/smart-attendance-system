const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { Resend } = require("resend");

// Destructure all the models we'll need, including 'Class'
const { User, Role, StudentProfile, FacultyProfile, Class } = db;

// HELPER: Function to get full user details efficiently

const getFullUser = async (userId) => {
  const user = await User.findByPk(userId, {
    attributes: {
      exclude: ["password", "passwordResetToken", "passwordResetExpires"],
    },
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

  // This block ensures the roles are always in the correct format
  if (user && user.roles) {
    const userObject = user.get({ plain: true });
    // This converts [{ name: "ADMIN" }] into ["admin"]
    userObject.roles = userObject.roles.map((role) => role.name.toLowerCase());
    return userObject;
  }

  return user;
};
// backend/controllers/authController.js

const generateToken = (user, rememberMe = false) => {
  // --- THIS IS THE FIX ---
  // The user object already has a plain array of lowercase role strings.
  // We can use it directly.
  const roles = user.roles;
  // --- END OF FIX ---

  const expiresIn = rememberMe ? "7d" : "3h";

  return jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

// Main login handler
exports.login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ message: "Identifier and password are required." });
    }

    const isEmail = identifier.includes("@");
    let user;

    if (isEmail) {
      user = await User.findOne({ where: { email: identifier } });
    } else {
      const studentProfile = await StudentProfile.findOne({
        where: { rollNumber: identifier },
      });
      if (studentProfile) {
        user = await User.findByPk(studentProfile.userId);
      }
    }

    if (!user || !(await user.validPassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Fetch the full user object with all associations for the response
    const fullUser = await getFullUser(user.id);
    const token = generateToken(fullUser, rememberMe);

    res.json({ user: fullUser, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Google OAuth callback handler
exports.googleCallback = async (req, res) => {
  try {
    // req.user comes from Passport's verify callback and contains the user ID
    const fullUser = await getFullUser(req.user.id);
    const token = generateToken(fullUser);

    // Redirect to the frontend, passing the token for the client to handle
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

// Get the currently authenticated user's details
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

// Forgot password handler
exports.forgotPassword = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    // Always return a success-like message to prevent email enumeration attacks
    if (user) {
      const resetToken = crypto.randomBytes(32).toString("hex");
      user.passwordResetToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
      user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
      await user.save();

      const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

      await resend.emails.send({
        from: "Smart Attendance <onboarding@resend.dev>",
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>Hello ${user.name},</p><p>You requested a password reset. Please click the link below to set a new password. This link will expire in 15 minutes.</p><a href="${resetURL}" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a><p>If you did not request this, please ignore this email.</p>`,
      });
    }

    res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    // Even on error, send a generic message
    res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }
};

// Reset password handler
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    user.password = req.body.password; // Assumes a pre-save hook handles hashing
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
