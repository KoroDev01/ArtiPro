import { useNavigate } from "react-router-dom";
import { LuBadgeCheck } from "react-icons/lu";
import { IoDocumentText } from "react-icons/io5";
import { TbClockHour3Filled } from "react-icons/tb";
import {
  FiSearch,
  FiFileText,
  FiCompass,
  FiArrowRight,
} from "react-icons/fi";
import Ouvrier from "../assets/img/photo-1678803262992-d79d06dd5d96.jpeg";

const NAV_ITEMS = [
  {
    icon: FiSearch,
    title: "Trouver un artisan",
    description: "Parcourez les profils vérifiés près de chez vous",
    to: "/find-artisan",
    accent: "bg-white text-blue-600",
  },
  {
    icon: FiFileText,
    title: "Publier une demande",
    description: "Décrivez votre projet et recevez des offres",
    to: "/demandes",
    accent: "bg-blue-500/30 text-white border border-white/30",
  },
  {
    icon: FiCompass,
    title: "Explorer les métiers",
    description: "Plomberie, électricité, peinture…",
    scrollTo: "services",
    accent: "bg-blue-500/30 text-white border border-white/30",
  },
];

export default function Hero() {
  const navigate = useNavigate();

  const handleNav = (item) => {
    if (item.scrollTo) {
      document
        .getElementById(item.scrollTo)
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    if (item.to) navigate(item.to);
  };

  return (
    <section className="mt-16 bg-[#1854E9] min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center">
          <div className="flex flex-col gap-5 text-white w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Trouvez le bon artisan pour vos travaux
            </h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Pas sûr par où commencer ? Explorez le site et laissez-vous
              guider — les filtres détaillés vous attendent sur vos demandes.
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20 shadow-xl">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100 mb-3 text-left">
                Par où commencer ?
              </p>
              <div className="flex flex-col gap-2.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isPrimary = item.accent.includes("bg-white");
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => handleNav(item)}
                      className={`group w-full flex items-center gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${item.accent}`}>
                      <span
                        className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                          isPrimary
                            ? "bg-blue-100 text-blue-600"
                            : "bg-white/15 text-white"
                        }`}>
                        <Icon size={20} />
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block font-semibold text-sm sm:text-base">
                          {item.title}
                        </span>
                        <span
                          className={`block text-xs mt-0.5 truncate ${
                            isPrimary ? "text-blue-500" : "text-blue-100"
                          }`}>
                          {item.description}
                        </span>
                      </span>
                      <FiArrowRight
                        size={18}
                        className="flex-shrink-0 opacity-60 group-hover:translate-x-0.5 group-hover:opacity-100 transition-all"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              {[
                {
                  icon: <LuBadgeCheck className="text-lg" />,
                  label: "Artisans Vérifiés",
                },
                {
                  icon: <IoDocumentText className="text-lg" />,
                  label: "Devis Gratuits",
                },
                {
                  icon: <TbClockHour3Filled className="text-lg" />,
                  label: "Service Rapide",
                },
              ].map((b) => (
                <span
                  key={b.label}
                  className="flex items-center gap-1.5 border border-white/40 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm backdrop-blur-sm bg-white/10">
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 hidden sm:block">
            <img
              src={Ouvrier}
              className="rounded-2xl shadow-2xl w-full object-cover h-64 sm:h-80 md:h-[460px]"
              alt="Artisan au travail"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
