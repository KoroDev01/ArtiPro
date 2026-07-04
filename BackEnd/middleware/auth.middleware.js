const User = require("../database/models/user.model");
const { verifyAccessToken } = require("../config/token.config");

/** Charge req.user depuis le header Authorization (JWT) si pas de session cookie. */
exports.resolveUserFromToken = async (req, res, next) => {
  if (req.user) return next();

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return next();

  try {
    const { userId } = verifyAccessToken(header.slice(7));
    const user = await User.findById(userId).exec();
    if (user) req.user = user;
  } catch {
    /* token invalide ou expiré */
  }

  next();
};
