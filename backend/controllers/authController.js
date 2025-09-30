const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require("crypto");
const User = db.User;
const Role = db.Role;
const StudentProfile = db.StudentProfile;
const FacultyProfile = db.FacultyProfile;
const { Resend } = require("resend");

const generateToken = (id, roles) => {
  const expiresIn = "3h";
  return jwt.sign({ id, roles }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

exports.login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        { model: Role, as: "roles" },
        { model: StudentProfile, as: "studentProfile" },
        { model: FacultyProfile, as: "facultyProfile" },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.validPassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const roles = user.roles.map((role) => role.name);
    const token = generateToken(user.id, roles);

    res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles,
      studentProfile: user.studentProfile,
      facultyProfile: user.facultyProfile,
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, as: "roles" }],
    });

    const roles = user.roles.map((role) => role.name);
    const token = generateToken(user.id, roles);

    res.redirect(`${process.env.CLIENT_URL}/?token=${token}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.CLIENT_URL}/login?error=google_failed`);
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Role, as: "roles" },
        { model: StudentProfile, as: "studentProfile" },
        { model: FacultyProfile, as: "facultyProfile" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const roles = user.roles.map((role) => role.name);

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      roles,
      studentProfile: user.studentProfile,
      facultyProfile: user.facultyProfile,
    };

    res.json(userData);
  } catch (error) {
    console.error("GetMe error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.forgotPassword = async (req, res) => {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(200).json({
        message: "If a user with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "Smart Attendance <onboarding@resend.dev>",
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.firstName} ${user.lastName},</p>
        <p>You requested a password reset. Please click the link below to set a new password. This link will expire in 15 minutes.</p>
        <a href="${resetURL}" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
    res.status(200).json({
      message: "If an account with that email exists, a reset link has been sent.",
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
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Token is invalid or has expired." });
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
