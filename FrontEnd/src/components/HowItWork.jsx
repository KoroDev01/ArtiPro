import { useNavigate } from "react-router-dom";

const steps = [
  {
    number: "01",
    icon: "🔍",
    title: "Recherchez",
    description:
      "Explorez le site et découvrez les artisans qualifiés près de chez vous.",
    color: "bg-blue-50 border-blue-200",
    numberColor: "text-blue-600",
  },
  {
    number: "02",
    icon: "👤",
    title: "Consultez les profils",
    description:
      "Parcourez les profils, les avis clients et les compétences de chaque artisan.",
    color: "bg-purple-50 border-purple-200",
    numberColor: "text-purple-600",
  },
  {
    number: "03",
    icon: "📩",
    title: "Publiez une demande",
    description:
      "Décrivez votre projet et recevez des offres directement des artisans disponibles.",
    color: "bg-green-50 border-green-200",
    numberColor: "text-green-600",
  },
  {
    number: "04",
    icon: "✅",
    title: "Choisissez & réalisez",
    description:
      "Acceptez la meilleure offre, suivez l'avancement et laissez un avis.",
    color: "bg-orange-50 border-orange-200",
    numberColor: "text-orange-600",
  },
];

export default function HowItWork() {
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Comment ça marche ?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto">
            Découvrez comment notre plateforme facilite la mise en relation
            entre vous et les artisans qualifiés.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {steps.map((step) => (
            <div
              key={step.number}
              className={`rounded-2xl border p-5 sm:p-6 flex flex-col items-center text-center ${step.color}`}>
              <span
                className={`text-xs font-bold tracking-widest mb-3 ${step.numberColor}`}>
                ÉTAPE {step.number}
              </span>
              <span className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                {step.icon}
              </span>
              <h3 className="font-bold text-gray-900 mb-2 text-sm sm:text-base">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 bg-blue-600 rounded-2xl p-6 sm:p-10 text-center text-white">
          <h3 className="text-xl sm:text-2xl font-bold mb-2">
            Prêt à commencer ?
          </h3>
          <p className="text-blue-100 mb-5 sm:mb-6 text-sm">
            Rejoignez des milliers de clients satisfaits qui ont trouvé leur
            artisan sur ArtiPro.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/demandes")}
              className="bg-white text-blue-600 hover:bg-blue-50 px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-sm transition">
              Publier une demande
            </button>
            <button
              onClick={() => navigate("/find-artisan")}
              className="border border-white text-white hover:bg-white/10 px-5 sm:px-6 py-2.5 rounded-xl font-semibold text-sm transition">
              Trouver un artisan
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
