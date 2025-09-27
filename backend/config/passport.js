const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("../models");
const User = db.User;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find a user based on their Google email
        const email = profile.emails[0].value;
        let user = await User.findOne({ where: { email } });

        // This is the crucial step for your "fixed database" requirement.
        // If the user's email does not exist in your pre-approved list, reject the login.
        if (!user) {
          return done(null, false, {
            message: "This email is not authorized to access this system.",
          });
        }

        // If the user exists but hasn't linked their Google account yet, link it.
        if (!user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
