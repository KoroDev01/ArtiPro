const jwt = require("jsonwebtoken");

const getSecret = () => {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET est requis.");
  return secret;
};

exports.signAccessToken = (userId) =>
  jwt.sign({ sub: userId.toString() }, getSecret(), { expiresIn: "14d" });

exports.verifyAccessToken = (token) => {
  const payload = jwt.verify(token, getSecret());
  return { userId: payload.sub };
};

exports.toSafeUser = (user) => {
  const data = user.toObject ? user.toObject() : { ...user };
  delete data.password;
  delete data.verificationCode;
  delete data.verificationCodeExpires;
  delete data.passwordResetToken;
  delete data.passwordResetExpires;
  return data;
};

exports.authPayload = (user, extra = {}) => ({
  ...extra,
  user: exports.toSafeUser(user),
  token: exports.signAccessToken(user._id),
});
