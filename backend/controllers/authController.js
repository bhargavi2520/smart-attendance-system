const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Import Op
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const User = db.User;

const generateToken = (id, role, department) => {
  // Use a short expiration for normal logins
  const expiresIn = "3h";

  return jwt.sign({ id, role, department }, process.env.JWT_SECRET, {
    expiresIn: expiresIn,
  });
};

// MODIFIED FOR ROLL NUMBER AND REMEMBER ME
exports.login = async (req, res) => {
  try {
    const { identifier, password, rememberMe } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { rollNumber: identifier }],
      },
    });

    if (user && (await user.validPassword(password))) {
      const token = jwt.sign(
        { id: user.id, role: user.role, department: user.department },
        process.env.JWT_SECRET,
        { expiresIn: rememberMe ? "1d" : "3h" } // Set expiration based on rememberMe
      );

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        token: token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
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
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      // Note: Don't reveal if a user exists or not for security reasons
      return res
        .status(200)
        .json({
          message:
            "If a user with that email exists, a reset link has been sent.",
        });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Expires in 10 minutes

    await user.save();

    // IMPORTANT: Use your Vercel URL here for the link to work in production
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const transporter = nodemailer.createTransport({
      /* your email config */
    });

    await transporter.sendMail({
      to: user.email,
      from: "Password Support <no-reply@yourdomain.com>",
      subject: "Your Password Reset Link",
      text: `Click this link to reset your password: ${resetURL}`,
    });

    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    // Handle errors without leaking info
    res.status(500).json({ message: "Error processing request" });
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
