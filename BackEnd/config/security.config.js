exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    const user = req.user;
    if (user.isBlocked) {
      const now = new Date();
      if (!user.banUntil || user.banUntil > now) {
        return res
          .status(403)
          .json({ message: "Compte suspendu.", banUntil: user.banUntil });
      }

      user.isBlocked = false;
      user.banUntil = null;
      user.save().catch(() => {});
    }
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
exports.isAdmin = (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Forbidden" });
};

exports.hasRole = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      return next();
    }

    return res.status(403).json({
      message: `Forbidden - ${role} only`,
    });
  };
};
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    const u = req.user;
    if (u.role === "pro" && u.proStatus !== "approved") {
      return res
        .status(403)
        .json({
          message: "Compte en attente de validation.",
          proStatus: u.proStatus,
        });
    }
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};
