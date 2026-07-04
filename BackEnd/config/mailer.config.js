const nodemailer = require("nodemailer");
const { getFrontendUrl } = require("./env.config");

const isProduction = process.env.NODE_ENV === "production";
const devLogEnabled = process.env.MAIL_DEV_LOG === "true";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const logDevCode = (to, code) => {
  console.log("\n📧 [DEV] Code de vérification ArtiPro");
  console.log(`   Email : ${to}`);
  console.log(`   Code  : ${code}\n`);
};

const formatMailError = (err) => {
  const msg = err?.message || "";
  if (msg.includes("525") || msg.includes("Unauthorized IP")) {
    return "Impossible d'envoyer l'email : votre adresse IP n'est pas autorisée chez Brevo. En local, ajoutez MAIL_DEV_LOG=true dans BackEnd/.env.";
  }
  if (msg.includes("Invalid login") || msg.includes("535")) {
    return "Configuration email invalide. Vérifiez EMAIL_USER et EMAIL_PASS dans BackEnd/.env.";
  }
  return "Impossible d'envoyer l'email de vérification. Réessayez plus tard.";
};

const isSmtpBypassError = (err) => {
  const msg = err?.message || "";
  return (
    msg.includes("525") ||
    msg.includes("Unauthorized IP") ||
    msg.includes("Invalid login") ||
    msg.includes("535")
  );
};

exports.sendVerificationEmail = async (to, code, firstName) => {
  if (devLogEnabled) {
    logDevCode(to, code);
    return { dev: true };
  }

  try {
    await transporter.sendMail({
      from: `"ArtiPro" <${process.env.EMAIL_FROM}>`,
      to,
      subject: "Vérifiez votre adresse email - ArtiPro",
      html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#2563eb;">ArtiPro</h2>
        <p>Bonjour ${firstName || ""},</p>
        <p>Merci de vous être inscrit(e) sur ArtiPro. Voici votre code de vérification :</p>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; background:#f3f4f6; padding: 16px; text-align:center; border-radius: 12px; margin: 16px 0;">
          ${code}
        </div>
        <p>Ce code est valable pendant 10 minutes.</p>
        <p style="color:#9ca3af; font-size: 12px;">Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
    });
    return { sent: true };
  } catch (err) {
    if (!isProduction && isSmtpBypassError(err)) {
      console.warn(
        `[mail] SMTP indisponible en local (${err.message}) — code affiché dans ce terminal.`,
      );
      logDevCode(to, code);
      return { dev: true, fallback: true };
    }
    throw new Error(formatMailError(err));
  }
};

const sendMail = async (options) => {
  if (devLogEnabled) {
    console.log("\n📧 [DEV] Email (SMTP désactivé)");
    console.log(`   À      : ${options.to}`);
    console.log(`   Sujet  : ${options.subject}`);
    if (options.devPreview) console.log(`   Contenu: ${options.devPreview}`);
    console.log("");
    return { dev: true };
  }

  try {
    await transporter.sendMail({
      from: `"ArtiPro" <${process.env.EMAIL_FROM}>`,
      ...options,
    });
    return { sent: true };
  } catch (err) {
    if (!isProduction && isSmtpBypassError(err)) {
      console.warn(`[mail] SMTP indisponible (${err.message})`);
      if (options.devPreview) console.log(`   → ${options.devPreview}`);
      return { dev: true, fallback: true };
    }
    throw new Error(formatMailError(err));
  }
};

exports.sendPasswordResetEmail = async (to, token, firstName) => {
  const resetUrl = `${getFrontendUrl()}/reinitialiser-mot-de-passe?token=${token}`;
  return sendMail({
    to,
    subject: "Réinitialisation de votre mot de passe - ArtiPro",
    devPreview: `Lien reset: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#2563eb;">ArtiPro</h2>
        <p>Bonjour ${firstName || ""},</p>
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <a href="${resetUrl}" style="display:inline-block;background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;margin:16px 0;">
          Choisir un nouveau mot de passe
        </a>
        <p style="color:#6b7280;font-size:13px;">Ce lien expire dans 1 heure. Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.</p>
      </div>
    `,
  });
};

exports.sendContactEmail = async ({ name, email, message }) => {
  const to = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM;
  return sendMail({
    to,
    replyTo: email,
    subject: `[ArtiPro Contact] Message de ${name}`,
    devPreview: `${name} <${email}>: ${message}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="color:#2563eb;">Nouveau message contact</h2>
        <p><strong>Nom :</strong> ${name}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong></p>
        <p style="white-space:pre-wrap;background:#f3f4f6;padding:12px;border-radius:8px;">${message}</p>
      </div>
    `,
  });
};
