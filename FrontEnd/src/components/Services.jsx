import { useNavigate } from "react-router-dom";
import tradesIllustration from "../assets/img/trades-hub-illustration.png";

export default function Services() {
  const navigate = useNavigate();

  return (
    <section id="services" className="relative py-16 sm:py-24">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center sm:mb-12">
          <span className="section-eyebrow mb-4">Nos métiers</span>
          <h2 className="section-title mb-4">Tous les corps de métier</h2>
          <p className="section-subtitle">
            Des artisans qualifiés et vérifiés dans tous les domaines pour
            répondre à vos besoins.
          </p>
        </div>
      </div>

      <div className="services-illustration mb-10 w-full px-4 sm:mb-12 sm:px-6 lg:px-8">
        <div className="glass-panel relative mx-auto w-full max-w-md overflow-hidden rounded-2xl">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-violet-600/10" />
          <div className="relative p-2">
            <div className="aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-white/10">
              <img
                src={tradesIllustration}
                alt="Illustration des différents corps de métier artisanaux"
                className="h-full w-full object-cover object-center"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/find-artisan")}
          className="btn-primary">
          Voir tous les artisans →
        </button>
      </div>
    </section>
  );
}
