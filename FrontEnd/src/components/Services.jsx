import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const CATEGORY_ICONS = {
  Plomberie: "🔧",
  Électricité: "⚡",
  Maçonnerie: "🧱",
  Peinture: "🎨",
  "Menuiserie Bois": "🪵",
  "Menuiserie Aluminium": "🪟",
  "Carrelage & Revêtements": "🏠",
  "Jardinage & Espaces verts": "🌿",
  "Climatisation & Ventilation": "❄️",
  "Chauffage & Gaz": "🔥",
  "Nettoyage & Entretien": "🧹",
  Déménagement: "📦",
  "Étanchéité & Isolation": "🛡️",
  "Faux Plafond & Cloisons": "🏗️",
  "Ferronnerie & Soudure": "⚙️",
  Plâtrerie: "🪣",
  Marbrerie: "💎",
  "Vitrerie & Miroiterie": "🪞",
  "Électroménager (réparation)": "🔌",
  "Informatique & Électronique": "💻",
};

export default function Services() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="services" className="relative py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-14">
          <span className="section-eyebrow mb-4">Nos métiers</span>
          <h2 className="section-title mb-4">Tous les corps de métier</h2>
          <p className="section-subtitle">
            Des artisans qualifiés et vérifiés dans tous les domaines pour
            répondre à vos besoins.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="dark-card animate-pulse rounded-2xl p-5 flex flex-col items-center gap-3">
                <div className="h-11 w-11 rounded-xl bg-white/10" />
                <div className="h-3 w-3/4 rounded bg-white/10" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-zinc-500">Aucune catégorie disponible.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => navigate(`/find-artisan?category=${cat._id}`)}
                className="dark-card group cursor-pointer rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-2.5 sm:gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl transition-transform duration-200 group-hover:scale-110 sm:h-14 sm:w-14 sm:text-3xl">
                  {CATEGORY_ICONS[cat.name] || "🔨"}
                </span>
                <h3 className="text-center text-xs font-semibold leading-tight text-zinc-300 transition-colors group-hover:text-blue-400 sm:text-sm">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        )}

        <div className="mt-10 text-center sm:mt-12">
          <button
            onClick={() => navigate("/find-artisan")}
            className="btn-primary">
            Voir tous les artisans →
          </button>
        </div>
      </div>
    </section>
  );
}
