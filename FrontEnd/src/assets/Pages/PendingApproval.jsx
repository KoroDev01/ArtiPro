import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function PendingApproval() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};

  const proStatus = user?.proStatus ?? state.proStatus;
  const proRejectionReason =
    user?.proRejectionReason ?? state.proRejectionReason;
  const isRejected = proStatus === "rejected";

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-10 max-w-md w-full text-center">
        <Link
          to="/"
          className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-lg mb-8 text-sm font-semibold">
          ArtiPro
        </Link>

        {isRejected ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-3xl mx-auto mb-5">
              ✕
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Candidature refusée
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Votre candidature n'a pas été acceptée par notre équipe.
            </p>
            {proRejectionReason && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-700 mb-6 text-left">
                <span className="font-medium">Motif :</span>{" "}
                {proRejectionReason}
              </div>
            )}
            <button
              onClick={async () => {
                await logout();
                navigate("/Login");
              }}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-yellow-100 text-yellow-500 flex items-center justify-center text-3xl mx-auto mb-5">
              ⏳
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Candidature en attente
            </h2>
            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Votre dossier a bien été reçu. Notre équipe va l'examiner et vous
              recevrez une confirmation sous{" "}
              <span className="font-medium text-gray-700">48h</span>.
            </p>

            <button
              onClick={async () => {
                await logout();
                navigate("/Login");
              }}
              className="w-full border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
