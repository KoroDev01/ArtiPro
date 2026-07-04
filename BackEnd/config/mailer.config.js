const nodemailer = require("nodemailer");
const { getFrontendUrl } = require("./env.config");

const isProduction = process.env.NODE_ENV === "production";
const devLogEnabled = process.env.MAIL_DEV_LOG === "true";

const getBrevoApiKey = () =>
  process.env.BREVO_API_KEY?.trim() || null;

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 8000,
  greetingTimeout: 8000,
  socketTimeout: 10000,
});

const withTimeout = (promise, ms = 12000) =>
  Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Délai email dépassé")), ms),
    ),
  ]);

const logDevCode = (to, code, reason = "") => {
  console.log("\n📧 [DEV] Code de vérification ArtiPro");
  if (reason) console.log(`   Raison : ${reason}`);
  console.log(`   Email : ${to}`);
  console.log(`   Code  : ${code}\n`);
};

const verificationHtml = (code, firstName) => `
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
`;

const sendViaBrevoApi = async ({ to, subject, html, replyTo }) => {
  const apiKey = getBrevoApiKey();
  if (!apiKey) return null;

  const from = process.env.EMAIL_FROM;
  if (!from) throw new Error("EMAIL_FROM manquant.");

  const res = await withTimeout(
    fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        sender: { name: "ArtiPro", email: from },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        ...(replyTo && { replyTo: { email: replyTo } }),
      }),
    }),
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Brevo API ${res.status}: ${body}`);
  }

  return { sent: true, via: "api" };
};

const sendViaSmtp = async ({ to, subject, html, replyTo }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("EMAIL_USER ou EMAIL_PASS manquant.");
  }

  await withTimeout(
    transporter.sendMail({
      from: `"ArtiPro" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      ...(replyTo && { replyTo }),
    }),
  );

  return { sent: true, via: "smtp" };
};

const deliverEmail = async ({ to, subject, html, replyTo, devPreview }) => {
  if (devLogEnabled) {
    console.log("\n📧 [DEV] Email (envoi désactivé)");
    console.log(`   À      : ${to}`);
    console.log(`   Sujet  : ${subject}`);
    if (devPreview) console.log(`   Contenu: ${devPreview}`);
    console.log("");
    return { dev: true };
  }

  const errors = [];

  if (getBrevoApiKey()) {
    try {
      return await sendViaBrevoApi({ to, subject, html, replyTo });
    } catch (err) {
      errors.push(`API: ${err.message}`);
      console.error("[mail] Brevo API échec:", err.message);
    }
  }

  try {
    return await sendViaSmtp({ to, subject, html, replyTo });
  } catch (err) {
    errors.push(`SMTP: ${err.message}`);
    console.error("[mail] SMTP échec:", err.message);
  }

  const detail = errors.join(" | ");
  const err = new Error(detail || "Envoi email impossible.");
  err.fallback = true;
  throw err;
};

exports.sendVerificationEmail = async (to, code, firstName) => {
  try {
    return await deliverEmail({
      to,
      subject: "Vérifiez votre adresse email - ArtiPro",
      html: verificationHtml(code, firstName),
      devPreview: `Code: ${code}`,
    });
  } catch (err) {
    if (err.fallback || isProduction) {
      console.warn(`[mail] Code affiché en log pour ${to} (email non envoyé)`);
      logDevCode(to, code, err.message);
      return { dev: true, fallback: true, error: err.message };
    }
    throw err;
  }
};

exports.sendPasswordResetEmail = async (to, token, firstName) => {
  const resetUrl = `${getFrontendUrl()}/reinitialiser-mot-de-passe?token=${token}`;
  return deliverEmail({
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
        <p style="color:#6b7280;font-size:13px;">Ce lien expire dans 1 heure.</p>
      </div>
    `,
  });
};

exports.sendContactEmail = async ({ name, email, message }) => {
  const to = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM;
  return deliverEmail({
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
