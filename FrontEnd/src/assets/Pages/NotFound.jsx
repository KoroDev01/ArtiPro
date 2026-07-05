import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-wrap">
      <Header />

      <main className="page-main flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="relative mb-6">
            <p className="text-[120px] md:text-[160px] font-black text-white/5 leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🔧</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-white mb-3">
            Page introuvable
          </h1>
          <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
            Cette page n'existe pas ou a été déplacée.<br />
            Retournez à l'accueil pour continuer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="btn-secondary"
            >
              ← Retour
            </button>
            <Link to="/" className="btn-primary">
              Accueil
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
