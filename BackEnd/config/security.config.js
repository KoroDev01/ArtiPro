const isStillBanned = (user) => {
  if (!user?.isBlocked) return false;
  const now = new Date();
  return !user.banUntil || user.banUntil > now;
};

const clearExpiredBan = (user) => {
  if (user.isBlocked && user.banUntil && user.banUntil <= new Date()) {
    user.isBlocked = false;
    user.banUntil = null;
    user.save().catch(() => {});
  }
};

exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = req.user;
  clearExpiredBan(user);

  if (user.role === "pro" && user.proStatus !== "approved") {
    return res.status(403).json({
      message: "Compte en attente de validation.",
      proStatus: user.proStatus,
    });
  }

  return next();
};

exports.isNotBanned = (req, res, next) => {
  if (!isStillBanned(req.user)) {
    return next();
  }

  return res.status(403).json({
    message: "Compte suspendu.",
    banned: true,
    banPermanent: !req.user.banUntil,
    banUntil: req.user.banUntil || null,
  });
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
