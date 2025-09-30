const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const crypto = require("crypto");
const { Resend } = require("resend");

// Destructure all the models we'll need
const { User, Role, StudentProfile, FacultyProfile } = db;

// Updated generateToken to handle rememberMe and the new roles array
const generateToken = (user, rememberMe = false) => {
  const roles = user.roles.map((role) => role.name);
  const expiresIn = rememberMe ? "7d" : "3h"; // Extend token life if rememberMe is true

  return jwt.sign({ id: user.id, roles }, process.env.JWT_SECRET, {
    expiresIn,
  });
};

exports.login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    let user;

    // Check if the identifier looks like an email
    const isEmail = identifier.includes("@");

    if (isEmail) {
      // If it's an email, find the user directly
      user = await User.findOne({
        where: { email: identifier },
        // Include all associated data we need
        include: [
          { model: Role, as: "roles", attributes: ["name"] },
          { model: StudentProfile, as: "studentProfile" },
          { model: FacultyProfile, as: "facultyProfile" },
        ],
      });
    } else {
      // If it's not an email, assume it's a roll number and search the profiles
      const studentProfile = await StudentProfile.findOne({
        where: { rollNumber: identifier },
        // Include the main User model and all its associations
        include: [
          {
            model: User,
            as: "user",
            include: [
              { model: Role, as: "roles", attributes: ["name"] },
              { model: FacultyProfile, as: "facultyProfile" },
            ],
          },
        ],
      });

      if (studentProfile) {
        user = studentProfile.user;
        // Manually attach the student profile to the user object for consistency
        user.studentProfile = studentProfile;
      }
    }

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await user.validPassword(password);

    if (!match) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user, rememberMe);

    // Construct the user data to send back to the frontend
    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((r) => r.name),
      profile: user.studentProfile || user.facultyProfile, // Send the specific profile
      token,
    };

    res.json(userData);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    // req.user comes from Passport's verify callback
    const user = await User.findByPk(req.user.id, {
      include: [{ model: Role, as: "roles", attributes: ["name"] }],
    });

    const token = generateToken(user);

    // Redirect to the frontend, passing the token in the URL
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
        { model: Role, as: "roles", attributes: ["name"] },
        { model: StudentProfile, as: "studentProfile" },
        { model: FacultyProfile, as: "facultyProfile" },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userData = {
      id: user.id,
      name: user.name,
      email: user.email,
      roles: user.roles.map((role) => role.name),
      profile: user.studentProfile || user.facultyProfile,
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
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await resend.emails.send({
      from: "Smart Attendance <onboarding@resend.dev>", // Replace with your verified domain
      to: user.email,
      subject: "Password Reset Request",
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the link below to set a new password. This link will expire in 15 minutes.</p>
        <a href="${resetURL}" style="background-color: #4f46e5; color: white; padding: 10px 15px; text-decoration: none; border-radius: 5px;">Reset Your Password</a>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT PASSWORD ERROR:", error);
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
        passwordResetExpires: { [Op.gt]: Date.now() },
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
