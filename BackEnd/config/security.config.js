exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

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

  if (user.role === "pro" && user.proStatus !== "approved") {
    return res.status(403).json({
      message: "Compte en attente de validation.",
      proStatus: user.proStatus,
    });
  }

  return next();
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
