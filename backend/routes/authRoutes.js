const express = require("express");
const router = express.Router();
const passport = require("passport");
const {
  login,
  getMe,
  googleCallback,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Traditional Login
router.post("/login", login);
router.get("/me", protect, getMe);

// Google OAuth Routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
    session: false, // We will use JWTs, not sessions
  }),
  googleCallback
);

module.exports = router;
