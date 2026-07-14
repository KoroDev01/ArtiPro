/** URL publique du site (Vercel ou domaine custom). */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL || "https://artipro01.fr"
).replace(/\/$/, "");

export const SITE_NAME = "ArtiPro";

export const SITE_TAGLINE =
  "Plateforme n°1 pour trouver des artisans qualifiés en Algérie";

export const SITE_DESCRIPTION =
  "ArtiPro connecte particuliers et artisans professionnels en Algérie. Publiez votre demande de travaux, comparez les offres et recevez des devis gratuits. Plombiers, électriciens, peintres, maçons et plus.";

export const SITE_KEYWORDS = [
  "artisan algérie",
  "artisan en algérie",
  "trouver artisan algérie",
  "artisans qualifiés algérie",
  "devis artisan algérie",
  "plateforme artisans algérie",
  "plombier algérie",
  "électricien algérie",
  "travaux maison algérie",
  "ArtiPro",
].join(", ");

export const CONTACT_EMAIL = "contact@artipro.dz";

export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/outlast.rust.9/",
  twitter: "https://x.com/KoroSukuna",
  instagram: "https://www.instagram.com/_fm28s/",
  linkedin:
    "https://www.linkedin.com/in/faiz-abdelhakim-mali-4255932ab/",
};
