const passport = require("passport");
const { app } = require("../app");
const User = require("../database/models/user.model");
const localStrategy = require("passport-local").Strategy;
const { findUserPerEmail } = require("../queries/user.queries.js");

console.log("Initializing Passport.js configuration");

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (e) {
    done(e, null);
  }
});

passport.use(
  new localStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const user = await findUserPerEmail(email);
        if (!user) {
          console.log("User not found with email:", email);
          return done(null, false, { message: "Incorrect email." });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      } catch (e) {
        return done(e);
      }
    },
  ),
);
