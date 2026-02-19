const passport = require("passport");
exports.sessionNew = (req, res, next) => {
  res.status(200).json({
    message: "Sign-in form",
  });
};

exports.sessionCreate = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      next(err);
    } else if (!user) {
      res.status(401).json({ error: info.message });
    } else {
      req.login(user, (err) => {
        if (err) {
          next(err);
        } else {
          res.status(200).json({ message: "Login successful", user });
        }
      });
    }
  })(req, res, next);
};

exports.sessionDelete = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      next(err);
    } else {
      res.status(200).json({ message: "Logout successful" });
    }
  });
};
