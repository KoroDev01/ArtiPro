import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">

          <div className="relative mb-6">
            <p className="text-[120px] md:text-[160px] font-black text-gray-100 leading-none select-none">
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl">🔧</span>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-3">
            Page introuvable
          </h1>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Cette page n'existe pas ou a été déplacée.<br />
            Retournez à l'accueil pour continuer.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-100 transition"
            >
              ← Retour
            </button>
            <Link
              to="/"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
            >
              Accueil
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
