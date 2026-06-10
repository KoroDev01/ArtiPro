import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BannedPage() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <a href="/" className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-lg mb-8 text-sm font-semibold">
          ArtiPro
        </a>

        <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-3xl mx-auto mb-5">
          🚫
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Compte suspendu</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          Votre compte a été suspendu de manière permanente par notre équipe de modération. Vous ne pouvez plus accéder à la plateforme.
        </p>

        <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600 mb-6">
          Si vous pensez qu'il s'agit d'une erreur, contactez notre support.
        </div>

        <button
          onClick={async () => { await logout(); navigate("/Login"); }}
          className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
