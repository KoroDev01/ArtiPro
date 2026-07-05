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
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="glass-panel rounded-2xl p-10 max-w-md w-full text-center">
        <Link
          to="/"
          className="inline-block bg-white text-zinc-900 rounded-lg px-4 py-1.5 mb-8 font-bold">
          ArtiPro
        </Link>

        {isRejected ? (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-3xl mx-auto mb-5">
              ✕
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Candidature refusée
            </h2>
            <p className="text-zinc-400 text-sm mb-4">
              Votre candidature n'a pas été acceptée par notre équipe.
            </p>
            {proRejectionReason && (
              <div className="alert-error mb-6 text-left">
                <span className="font-medium">Motif :</span>{" "}
                {proRejectionReason}
              </div>
            )}
            <button
              onClick={async () => {
                await logout();
                navigate("/Login");
              }}
              className="btn-secondary w-full">
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-3xl mx-auto mb-5">
              ⏳
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              Candidature en attente
            </h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Votre dossier a bien été reçu. Notre équipe va l'examiner et vous
              recevrez une confirmation sous{" "}
              <span className="font-medium text-zinc-300">48h</span>.
            </p>

            <button
              onClick={async () => {
                await logout();
                navigate("/Login");
              }}
              className="btn-secondary w-full">
              Se déconnecter
            </button>
          </>
        )}
      </div>
    </div>
  );
}
