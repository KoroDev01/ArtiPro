exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
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
