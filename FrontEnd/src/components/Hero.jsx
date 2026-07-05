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
import heroBg from "../assets/img/anna-claire-schellenberg-gU4UkWep8sY-unsplash.jpg";

const NAV_ITEMS = [
  {
    icon: FiSearch,
    title: "Trouver un artisan",
    description: "Parcourez les profils vérifiés près de chez vous",
    to: "/find-artisan",
    iconBg: "from-blue-500 to-blue-600",
    iconRing: "ring-blue-400/30",
    primary: true,
  },
  {
    icon: FiFileText,
    title: "Publier une demande",
    description: "Décrivez votre projet et recevez des offres",
    to: "/demandes",
    iconBg: "from-indigo-500 to-violet-600",
    iconRing: "ring-violet-400/30",
  },
  {
    icon: FiCompass,
    title: "Explorer les métiers",
    description: "Plomberie, électricité, peinture…",
    scrollTo: "services",
    iconBg: "from-sky-500 to-cyan-600",
    iconRing: "ring-cyan-400/30",
  },
];

const BADGES = [
  { icon: LuBadgeCheck, label: "Artisans vérifiés" },
  { icon: IoDocumentText, label: "Devis gratuits" },
  { icon: TbClockHour3Filled, label: "Service rapide" },
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
    <section className="relative mt-16 flex min-h-[88vh] items-center justify-center overflow-hidden">
      <img
        src={heroBg}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full scale-105 object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-800/55 via-slate-900/65 to-[#0c0f16]/90" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center px-4 py-14 text-center sm:px-6 sm:py-20">
        <div className="animate-fade-up flex w-full flex-col items-center gap-6">
          <span className="section-eyebrow">Artisans qualifiés en Algérie</span>

          <h1 className="max-w-2xl text-3xl font-bold leading-[1.12] tracking-tight text-white sm:text-4xl md:text-5xl">
            Trouvez le bon artisan pour vos travaux
          </h1>

          <p className="max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg">
            Pas sûr par où commencer ? Explorez le site et laissez-vous guider
            — les filtres détaillés vous attendent sur vos demandes.
          </p>

          <div className="hero-start-panel w-full max-w-lg rounded-2xl p-4 sm:rounded-3xl sm:p-5">
            <div className="relative mb-4 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-200/90 sm:text-[11px]">
                Par où commencer ?
              </p>
              <span className="h-px flex-1 bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
            </div>

            <div className="relative flex flex-col gap-2.5">
              {NAV_ITEMS.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.title}
                    type="button"
                    onClick={() => handleNav(item)}
                    className={`hero-start-card group flex w-full items-center gap-3 rounded-2xl px-3.5 py-3.5 text-left sm:gap-4 sm:px-4 sm:py-4 ${
                      item.primary ? "hero-start-card-primary" : ""
                    }`}>
                    <span
                      className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.iconBg} text-white shadow-lg ring-2 ${item.iconRing} sm:h-12 sm:w-12`}>
                      <Icon size={20} />
                      <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-slate-700 shadow-sm">
                        {index + 1}
                      </span>
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-bold text-slate-800 sm:text-base">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-xs leading-snug text-slate-500">
                        {item.description}
                      </span>
                    </span>

                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-all duration-200 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-md group-hover:shadow-blue-600/30">
                      <FiArrowRight size={15} />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-2 sm:max-w-lg sm:gap-2.5">
            {BADGES.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <span
                  key={badge.label}
                  className={`glass-badge flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[11px] font-medium text-zinc-200 sm:text-xs ${
                    i === 2 ? "col-span-2 mx-auto w-fit" : ""
                  }`}>
                  <Icon className="text-sm text-blue-300" />
                  {badge.label}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
