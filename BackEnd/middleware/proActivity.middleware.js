const User = require("../database/models/user.model");
const { markProOnline } = require("../utils/proAvailability");

const THROTTLE_MS = 60 * 1000;

/** Met à jour lastActiveAt pour les artisans connectés (throttle 1 min). */
exports.touchProActivity = (req, res, next) => {
  const user = req.user;
  if (!user || user.role !== "pro") return next();

  const now = Date.now();
  const last = user.lastActiveAt ? new Date(user.lastActiveAt).getTime() : 0;
  if (now - last < THROTTLE_MS) return next();

  const activeAt = new Date();
  User.findByIdAndUpdate(user._id, markProOnline())
    .catch(() => {});
  user.lastActiveAt = activeAt;

  next();
};
