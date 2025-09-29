const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Import Op
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = db.User;
const { Resend } = require("resend");

const generateToken = (id, role, department) => {
  // Use a short expiration for normal logins
  const expiresIn = "3h";

  return jwt.sign({ id, role, department }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

exports.login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { rollNumber: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid username " });
    }

    const match = await user.validPassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET,
      { expiresIn: rememberMe ? "1d" : "3h" }
    );

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ADDED for Google OAuth
exports.googleCallback = (req, res) => {
  // Passport.js attaches the user to req.user after successful authentication
  const token = generateToken(req.user.id, req.user.role, req.user.department);
  // Redirect user back to the frontend, passing the token in the URL
  res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ["id", "name", "email", "role", "department", "rollNumber"],
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  // 2. INITIALIZE RESEND WITH YOUR API KEY
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(200).json({
        message:
          "If a user with that email exists, a reset link has been sent.",
      });
    }

    // Generate token and save it to the database (same as before)
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // --- START: RESEND EMAIL LOGIC ---

    // 3. SEND THE EMAIL
    await resend.emails.send({
      from: "Smart Attendance <onboarding@resend.dev>", // <-- Use your verified domain
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the link below to set a new password. This link will expire in 15 minutes.</p>
        <a href="${resetURL}" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    // --- END: RESEND EMAIL LOGIC ---

    res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    // Even if sending fails, send a generic message for security
    res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [db.Sequelize.Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Token is invalid or has expired." });
    }

    user.password = req.body.password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    await user.save();

    res.status(200).json({ message: "Password has been successfully reset." });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
