const User = require("../database/models/user.model");

const validatePassword = (pwd) => {
  if (!pwd || pwd.length < 8)
    throw new Error("Le mot de passe doit contenir au moins 8 caractères.");
  if (!/[0-9]/.test(pwd))
    throw new Error("Le mot de passe doit contenir au moins un chiffre.");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>\/?]/.test(pwd))
    throw new Error(
      "Le mot de passe doit contenir au moins un caractère spécial.",
    );
};

exports.createUserQuerie = async (body) => {
  try {
    validatePassword(body.password);
    const role = ["client", "pro"].includes(body.role) ? body.role : "client";
    const hashedPassword = await User.hashPassword(body.password);
    const user = new User({
      email: body.email,
      password: hashedPassword,
      role,
      firstName: body.firstName,
      lastName: body.lastName,
      emailVerified: true,
      ...(role === "pro" && {
        proStatus: "pending",
        companyName: body.companyName,
        siret: body.siret,
        description: body.description,
        experienceYears: body.experienceYears,
        ...(body.city && { location: { city: body.city } }),
      }),
    });

    return user.save();
  } catch (e) {
    throw new Error(e.message);
  }
};

exports.findUserPerEmail = async (email) => {
  return User.findOne({ email }).select("+password").exec();
};
exports.generateAndSetVerificationCode = async (user) => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = code;
  user.verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();
  return code;
};

exports.verifyUserCode = async (email, code) => {
  const user = await User.findOne({ email }).select(
    "+verificationCode +verificationCodeExpires",
  );
  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.emailVerified) throw new Error("Cet email est déjà vérifié.");
  if (!user.verificationCode || !user.verificationCodeExpires)
    throw new Error("Aucun code en attente. Demandez un nouveau code.");
  if (user.verificationCodeExpires < new Date())
    throw new Error("Le code a expiré. Demandez un nouveau code.");
  if (user.verificationCode !== code) throw new Error("Code invalide.");

  user.emailVerified = true;
  user.verificationCode = undefined;
  user.verificationCodeExpires = undefined;
  await user.save();
  return user;
};

const crypto = require("crypto");

exports.setPasswordResetToken = async (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();
  return token;
};

exports.resetPasswordWithToken = async (token, newPassword) => {
  validatePassword(newPassword);
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  }).select("+resetPasswordToken +resetPasswordExpires +password");

  if (!user) throw new Error("Lien invalide ou expiré.");

  user.password = await User.hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();
  return user;
};