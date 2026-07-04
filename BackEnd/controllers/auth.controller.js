const passport = require("passport");
const User = require("../database/models/user.model.js");
const {
  verifyUserCode,
  generateAndSetVerificationCode,
  setPasswordResetToken,
  resetPasswordWithToken,
} = require("../queries/user.queries.js");
const {
  sendVerificationEmail,
  sendPasswordResetEmail,
} = require("../config/mailer.config.js");
const { authPayload } = require("../config/token.config.js");

const loginSuccess = (res, user, extra = {}) =>
  res.status(200).json(authPayload(user, { message: "Login successful", ...extra }));
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
          return loginSuccess(res, user, {
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
      loginSuccess(res, user);
    });
  })(req, res, next);
};

exports.sessionDelete = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.status(200).json({ message: "Logout successful" });
  });
};
exports.verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    if (!email || !code)
      return res.status(400).json({ error: "Email et code requis." });

    const user = await verifyUserCode(email, code);

    if (user.role === "pro") {
      return res.status(200).json({
        message:
          "Email vérifié. Votre candidature est en attente de validation.",
        emailVerified: true,
        proStatus: user.proStatus,
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(200).json(
        authPayload(user, { message: "Email vérifié avec succès." }),
      );
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis." });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: "Utilisateur introuvable." });
    if (user.emailVerified)
      return res.status(400).json({ error: "Cet email est déjà vérifié." });

    const code = await generateAndSetVerificationCode(user);
    const result = await sendVerificationEmail(user.email, code, user.firstName);
    if (result?.dev) {
      return res.status(200).json({
        message: result.fallback
          ? "Code régénéré. Consultez le terminal du backend (SMTP indisponible en local)."
          : "Code régénéré (mode dev). Consultez le terminal du backend.",
        dev: true,
      });
    }
    res.status(200).json({ message: "Un nouveau code a été envoyé." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email requis." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(200).json({
        message:
          "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
      });
    }

    const token = await setPasswordResetToken(user);
    await sendPasswordResetEmail(user.email, token, user.firstName);

    res.status(200).json({
      message:
        "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé.",
    });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token et mot de passe requis." });
    }

    await resetPasswordWithToken(token, password);
    res.status(200).json({ message: "Mot de passe mis à jour avec succès." });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};
