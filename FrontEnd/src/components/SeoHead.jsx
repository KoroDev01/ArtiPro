import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { canonicalUrl, getSeoForPath } from "../config/seo";
import { SITE_NAME, SITE_URL } from "../config/site";

/**
 * Met à jour title, meta, canonical et Open Graph à chaque changement de route.
 */
export default function SeoHead({ override } = {}) {
  const { pathname } = useLocation();
  const seo = { ...getSeoForPath(pathname), ...override };
  const url = canonicalUrl(seo.path || pathname);
  const robots = seo.noindex ? "noindex, nofollow" : "index, follow";

  return (
    <Helmet>
      <html lang="fr" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords ? <meta name="keywords" content={seo.keywords} /> : null}
      <meta name="robots" content={robots} />
      <link rel="canonical" href={url} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:locale" content="fr_DZ" />
      {seo.image ? <meta property="og:image" content={seo.image} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      {seo.image ? <meta name="twitter:image" content={seo.image} /> : null}

      <meta name="geo.region" content="DZ" />
      <meta name="geo.placename" content="Algérie" />
      <meta name="author" content={SITE_NAME} />
      <link rel="alternate" hrefLang="fr-dz" href={url} />
      <link rel="alternate" hrefLang="fr" href={url} />
      <link rel="alternate" hrefLang="x-default" href={`${SITE_URL}/`} />
    </Helmet>
  );
}
