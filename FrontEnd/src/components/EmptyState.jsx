import { Link } from "react-router-dom";

const PRESETS = {
  demandes: {
    icon: "📋",
    title: "Aucune demande pour le moment",
    description: "Soyez le premier à publier une demande et trouvez l'artisan qu'il vous faut.",
    cta: { label: "Publier une demande", action: "modal" },
  },
  demandes_filtres: {
    icon: "🔎",
    title: "Aucun résultat",
    description: "Aucune demande ne correspond à vos filtres. Essayez d'en modifier quelques-uns.",
  },
  artisans: {
    icon: "🔍",
    title: "Aucun artisan trouvé",
    description: "Aucun artisan ne correspond à votre recherche. Essayez de modifier vos filtres.",
  },
  messages: {
    icon: "💬",
    title: "Aucune conversation",
    description: "Vos échanges avec les artisans apparaîtront ici une fois qu'une offre aura été envoyée.",
    cta: { label: "Voir les réalisations", to: "/showroom" },
  },
  messages_pro: {
    icon: "💬",
    title: "Aucune conversation",
    description: "Vos échanges avec les clients apparaîtront ici une fois que vous aurez envoyé une offre.",
    cta: { label: "Voir les demandes", to: "/demandes" },
  },
  offres: {
    icon: "📬",
    title: "Aucune offre reçue",
    description: "Les artisans intéressés par votre demande pourront vous envoyer une offre ici.",
  },
  avis: {
    icon: "⭐",
    title: "Aucun avis pour le moment",
    description: "Les avis de vos clients apparaîtront ici après chaque mission terminée.",
  },
};

export default function EmptyState({ preset, icon, title, description, cta, onCtaClick, className = "" }) {
  const config = preset ? PRESETS[preset] : {};
  const _icon        = icon        || config.icon        || "📭";
  const _title       = title       || config.title       || "Aucun résultat";
  const _description = description || config.description || "";
  const _cta         = cta         || config.cta;

  return (
    <div className={`flex flex-col items-center justify-center text-center py-16 px-6 ${className}`}>
      <div className="relative mb-5">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-4xl">
          {_icon}
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500/20 border border-blue-500/30">
          <span className="text-xs text-blue-300">✦</span>
        </div>
      </div>

      <h3 className="mb-2 text-base font-semibold text-white">{_title}</h3>

      {_description && (
        <p className="mb-5 max-w-xs text-sm leading-relaxed text-zinc-500">{_description}</p>
      )}

      {_cta && (
        _cta.action === "modal" ? (
          <button onClick={onCtaClick} className="btn-primary">
            {_cta.label}
          </button>
        ) : (
          <Link to={_cta.to} className="btn-primary">
            {_cta.label}
          </Link>
        )
      )}
    </div>
  );
}
