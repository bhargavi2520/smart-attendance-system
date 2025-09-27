const db = require("../models");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize"); // Import Op
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
