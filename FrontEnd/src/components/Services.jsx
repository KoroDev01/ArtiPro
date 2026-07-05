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

      <div className="services-illustration mb-10 flex justify-center px-4 sm:mb-12 sm:px-6 lg:px-8">
        <img
          src={tradesIllustration}
          alt="Illustration des différents corps de métier artisanaux"
          className="w-full max-w-md rounded-xl"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
        <button
          onClick={() => navigate("/showroom")}
          className="btn-primary">
          Voir les réalisations →
        </button>
      </div>
    </section>
  );
}
