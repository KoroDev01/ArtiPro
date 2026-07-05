import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Recherchez",
    description:
      "Explorez le site et découvrez les artisans qualifiés près de chez vous.",
    accent: "text-blue-400",
  },
  {
    number: "02",
    icon: "👤",
    title: "Consultez les profils",
    description:
      "Parcourez les profils, les avis clients et les compétences de chaque artisan.",
    accent: "text-violet-400",
  },
  {
    number: "03",
    icon: "📩",
    title: "Publiez une demande",
    description:
      "Décrivez votre projet et recevez des offres directement des artisans disponibles.",
    accent: "text-emerald-400",
  },
  {
    number: "04",
    icon: "✅",
    title: "Choisissez & réalisez",
    description:
      "Acceptez la meilleure offre, suivez l'avancement et laissez un avis.",
    accent: "text-amber-400",
  },
];

export default function HowItWork() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center sm:mb-16">
          <span className="section-eyebrow mb-4">Simple & efficace</span>
          <h2 className="section-title mb-4">Comment ça marche ?</h2>
          <p className="section-subtitle">
            Découvrez comment notre plateforme facilite la mise en relation
            entre vous et les artisans qualifiés.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="dark-card rounded-2xl p-6 flex flex-col items-center text-center">
              <span
                className={`mb-3 text-[10px] font-bold tracking-[0.2em] ${step.accent}`}>
                ÉTAPE {step.number}
              </span>
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-3xl">
                {step.icon}
              </span>
              <h3 className="mb-2 text-sm font-bold text-white sm:text-base">
                {step.title}
              </h3>
              <p className="text-xs leading-relaxed text-zinc-400 sm:text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="glass-panel relative mt-12 overflow-hidden rounded-3xl p-8 text-center sm:mt-16 sm:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/10" />
          <div className="relative">
            <h3 className="mb-2 text-xl font-bold text-white sm:text-2xl">
              Prêt à commencer ?
            </h3>
            <p className="mx-auto mb-6 max-w-md text-sm text-zinc-400">
              Rejoignez des milliers de clients satisfaits qui ont trouvé leur
              artisan sur ArtiPro.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <button onClick={() => navigate("/demandes")} className="btn-primary">
                Publier une demande
              </button>
              <button
                onClick={() => navigate("/find-artisan")}
                className="btn-ghost-light">
                Trouver un artisan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
