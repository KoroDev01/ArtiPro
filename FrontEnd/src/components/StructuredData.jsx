import { Helmet } from "react-helmet-async";
import { FAQ_ITEMS } from "../config/seo";
import { SITE_NAME, SITE_URL } from "../config/site";

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/og-artipro.png`,
    description:
      "Plateforme algérienne de mise en relation entre clients et artisans professionnels qualifiés.",
    areaServed: {
      "@type": "Country",
      name: "Algérie",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@artipro.dz",
      availableLanguage: ["French", "Arabic"],
    },
    sameAs: [
      "https://www.facebook.com/outlast.rust.9/",
      "https://x.com/KoroSukuna",
      "https://www.instagram.com/_fm28s/",
    ],
  };
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: "fr-DZ",
    description:
      "Trouver un artisan en Algérie — demandes de travaux, devis gratuits, artisans vérifiés.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/showroom?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function buildServiceSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Mise en relation avec des artisans en Algérie",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    areaServed: { "@type": "Country", name: "Algérie" },
    serviceType: [
      "Plomberie",
      "Électricité",
      "Peinture",
      "Maçonnerie",
      "Menuiserie",
      "Climatisation",
    ],
    description:
      "Publication de demandes de travaux et réception d'offres d'artisans qualifiés en Algérie.",
    url: SITE_URL,
  };
}

/** JSON-LD injecté dans le head (homepage + pages clés). */
export default function StructuredData({ includeFaq = false }) {
  const graphs = [
    buildOrganizationSchema(),
    buildWebSiteSchema(),
    buildServiceSchema(),
  ];
  if (includeFaq) graphs.push(buildFaqSchema());

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify({ "@context": "https://schema.org", "@graph": graphs })}
      </script>
    </Helmet>
  );
}
