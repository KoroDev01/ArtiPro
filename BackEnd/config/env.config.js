const WEAK_SECRETS = new Set(["cersei", "change-me", "secret"]);

exports.validateEnv = () => {
  if (process.env.NODE_ENV !== "production") return;

  const required = ["MONGO_URI", "SESSION_SECRET"];

  const missing = required.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    console.error(
      "\n[RAILWAY] Variables obligatoires manquantes:",
      missing.join(", "),
    );
    console.error(
      "Ajoutez-les dans Railway → votre service → Variables\n",
    );
    throw new Error(
      `Variables d'environnement manquantes en production : ${missing.join(", ")}`,
    );
  }

  const recommended = ["EMAIL_USER", "EMAIL_PASS", "EMAIL_FROM"];
  const missingEmail = recommended.filter((key) => !process.env[key]?.trim());
  if (missingEmail.length) {
    console.warn(
      "[env] Emails désactivés — manquant:",
      missingEmail.join(", "),
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

  const defaults = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://artipro01.fr",
    "https://www.artipro01.fr",
    "https://arti-pro.vercel.app",
  ];

  if (fromEnv?.length) return [...new Set([...fromEnv, ...defaults])];

  return defaults;
};

/** Autorise les origines listées + tous les sous-domaines *.vercel.app */
exports.corsOriginCheck = (origin, callback) => {
  if (!origin) return callback(null, true);

  const allowed = exports.getCorsOrigins();
  if (allowed.includes(origin)) return callback(null, true);

  try {
    const { hostname } = new URL(origin);
    if (hostname.endsWith(".vercel.app")) return callback(null, true);
  } catch {
    /* ignore */
  }

  callback(null, false);
};

exports.getFrontendUrl = () =>
  process.env.FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:5173";
