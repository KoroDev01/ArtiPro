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
    <section id="services" className="py-14 sm:py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Tous les corps de métier
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Des artisans qualifiés et vérifiés dans tous les domaines pour
            répondre à vos besoins.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 animate-pulse flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="h-3 bg-gray-200 rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <p className="text-center text-gray-400">
            Aucune catégorie disponible.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => navigate(`/find-artisan?category=${cat._id}`)}
                className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 border border-gray-100 hover:border-blue-300 hover:shadow-md hover:bg-blue-50 transition-all duration-200 group cursor-pointer">
                <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform duration-200">
                  {CATEGORY_ICONS[cat.name] || "🔨"}
                </span>
                <h3 className="font-semibold text-xs sm:text-sm text-gray-700 text-center group-hover:text-blue-600 transition-colors leading-tight">
                  {cat.name}
                </h3>
              </button>
            ))}
          </div>
        )}

        <div className="text-center mt-8 sm:mt-10">
          <button
            onClick={() => navigate("/find-artisan")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold transition text-sm">
            Voir tous les artisans →
          </button>
        </div>
      </div>
    </section>
  );
}
