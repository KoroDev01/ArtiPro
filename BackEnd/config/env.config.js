const WEAK_SECRETS = new Set(["cersei", "change-me", "secret"]);

exports.validateEnv = () => {
  if (process.env.NODE_ENV !== "production") return;

  const required = [
    "MONGO_URI",
    "SESSION_SECRET",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",
  ];

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(
      `Variables d'environnement manquantes en production : ${missing.join(", ")}`,
    );
  }

  const secret = process.env.SESSION_SECRET;
  if (secret.length < 32 || WEAK_SECRETS.has(secret)) {
    throw new Error(
      "SESSION_SECRET doit faire au moins 32 caractères aléatoires en production.",
    );
  }

  if (process.env.MAIL_DEV_LOG === "true") {
    console.warn(
      "[env] MAIL_DEV_LOG est activé — désactivez-le en production.",
    );
  }
};

exports.getCorsOrigins = () => {
  const fromEnv = process.env.CORS_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (fromEnv?.length) return fromEnv;

  return [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://artipro01.fr",
    "https://www.artipro01.fr",
  ];
};

exports.getFrontendUrl = () =>
  process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
