const passport = require("passport");

exports.sessionNew = (req, res, next) => {
  res.status(200).json({ message: "Sign-in form" });
};

exports.sessionCreate = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ error: info.message });

    if (user.isBlocked) {
      const now = new Date();
      const isPermanent = !user.banUntil;
      const isStillBanned = isPermanent || user.banUntil > now;

      if (isStillBanned) {
        if (isPermanent) {
          return res.status(403).json({
            message: "Compte suspendu.",
            banned: true,
            banPermanent: true,
            banUntil: null,
          });
        }

        return req.login(user, (loginErr) => {
          if (loginErr) return next(loginErr);
          return res.status(200).json({
            message: "Login successful",
            user,
            banned: true,
            banPermanent: false,
            banUntil: user.banUntil,
          });
        });
      }

      user.isBlocked = false;
      user.banUntil = null;
      user.save().catch(() => {});
    }

    if (user.role === "pro" && user.proStatus !== "approved") {
      return res.status(403).json({
        message: "Compte en attente de validation.",
        proStatus: user.proStatus,
        proRejectionReason: user.proRejectionReason || null,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName || null,
        siret: user.siret || null,
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json({ message: "Login successful", user });
    });
  })(req, res, next);
};

exports.sessionDelete = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
};
