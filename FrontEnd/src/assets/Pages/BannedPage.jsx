import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BannedPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-panel rounded-2xl p-10 max-w-md w-full text-center">
        <Link
          to="/"
          className="inline-block bg-white text-zinc-900 rounded-lg px-4 py-1.5 mb-8 font-bold">
          ArtiPro
        </Link>

        <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-3xl mx-auto mb-5">
          🚫
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Compte suspendu</h2>
        <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
          Votre compte a été suspendu de manière permanente par notre équipe de modération. Vous ne pouvez plus accéder à la plateforme.
        </p>

        <div className="alert-error mb-6">
          Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
        </div>

        <button
          onClick={async () => { await logout(); navigate("/Login"); }}
          className="btn-secondary w-full">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
