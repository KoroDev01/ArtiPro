import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "./site";

const DEFAULT_IMAGE = `${SITE_URL}/og-artipro.png`;

/** SEO par route publique (pages indexables). */
export const ROUTE_SEO = {
  "/": {
    title: "ArtiPro — Trouver un artisan en Algérie | Artisans qualifiés",
    description:
      "Trouvez le bon artisan en Algérie sur ArtiPro. Publiez votre demande, recevez des devis gratuits et choisissez parmi des artisans vérifiés : plomberie, électricité, peinture, maçonnerie et plus.",
    keywords:
      "artisan algérie, trouver artisan algérie, artisans qualifiés algérie, devis gratuit artisan, plateforme artisans algérie",
    path: "/",
  },
  "/showroom": {
    title: "Réalisations d'artisans en Algérie | ArtiPro Showroom",
    description:
      "Découvrez les réalisations et travaux publiés par des artisans professionnels en Algérie. Photos, avis et portfolios vérifiés sur ArtiPro.",
    keywords:
      "réalisations artisans algérie, portfolio artisan, travaux artisans algérie, showroom artisan",
    path: "/showroom",
  },
  "/contact": {
    title: "Contact ArtiPro — Support et assistance",
    description:
      "Contactez l'équipe ArtiPro pour toute question sur la plateforme, l'inscription artisan ou l'aide aux clients en Algérie.",
    path: "/contact",
  },
  "/SignIn": {
    title: "Inscription artisan en Algérie | Rejoindre ArtiPro",
    description:
      "Inscrivez-vous comme artisan professionnel sur ArtiPro et recevez des demandes de clients en Algérie. Inscription gratuite, compte vérifié.",
    keywords:
      "devenir artisan algérie, inscription artisan, plateforme artisan algérie",
    path: "/SignIn",
  },
  "/Login": {
    title: "Connexion ArtiPro",
    description: "Connectez-vous à votre compte ArtiPro client ou artisan.",
    path: "/Login",
    noindex: true,
  },
  "/cgu": {
    title: "Conditions générales d'utilisation | ArtiPro",
    description: "CGU de la plateforme ArtiPro — mise en relation clients et artisans en Algérie.",
    path: "/cgu",
  },
  "/mentions-legales": {
    title: "Mentions légales | ArtiPro",
    description: "Mentions légales du site ArtiPro.",
    path: "/mentions-legales",
  },
  "/confidentialite": {
    title: "Politique de confidentialité | ArtiPro",
    description: "Politique de confidentialité et protection des données ArtiPro.",
    path: "/confidentialite",
  },
};

export function getSeoForPath(pathname) {
  const base = ROUTE_SEO[pathname];
  if (base) return { ...base, image: DEFAULT_IMAGE };

  if (pathname.startsWith("/artisan/")) {
    return {
      title: "Profil artisan en Algérie | ArtiPro",
      description:
        "Consultez le profil, les réalisations et les avis de cet artisan professionnel sur ArtiPro, la plateforme artisans en Algérie.",
      path: pathname,
      image: DEFAULT_IMAGE,
    };
  }

  return {
    title: `${SITE_NAME} — Artisans qualifiés en Algérie`,
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    path: pathname,
    image: DEFAULT_IMAGE,
    noindex: true,
  };
}

export function canonicalUrl(path = "/") {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${clean === "/" ? "" : clean}`;
}

export const FAQ_ITEMS = [
  {
    question: "Comment trouver un artisan en Algérie sur ArtiPro ?",
    answer:
      "Publiez une demande de travaux en décrivant votre projet et votre ville. Les artisans qualifiés de votre catégorie reçoivent une notification et vous envoient des offres avec prix et délais. Vous comparez et choisissez librement.",
  },
  {
    question: "ArtiPro est-il gratuit pour les clients ?",
    answer:
      "Oui, la publication de demandes et la réception de devis sont gratuites pour les particuliers. Vous ne payez que l'artisan choisi, selon les termes convenus entre vous.",
  },
  {
    question: "Les artisans sur ArtiPro sont-ils vérifiés ?",
    answer:
      "Chaque compte artisan est validé par notre équipe avant publication. Les profils affichent les réalisations, avis clients et informations professionnelles pour vous aider à faire le bon choix.",
  },
  {
    question: "Quels métiers sont disponibles sur ArtiPro ?",
    answer:
      "ArtiPro couvre les principaux corps de métier : plomberie, électricité, peinture, maçonnerie, menuiserie, climatisation, carrelage et bien d'autres selon les catégories actives sur la plateforme.",
  },
  {
    question: "Comment devenir artisan partenaire sur ArtiPro ?",
    answer:
      "Créez un compte artisan via la page d'inscription, renseignez votre entreprise et votre ville. Après validation par un administrateur, vous pouvez répondre aux demandes et publier vos réalisations.",
  },
];
