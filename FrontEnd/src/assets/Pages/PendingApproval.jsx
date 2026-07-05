import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";

const POLL_MS = 15000;

export default function PendingApproval() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state ?? {};

  const email = user?.email ?? state.email ?? "";
  const [proStatus, setProStatus] = useState(
    user?.proStatus ?? state.proStatus ?? "pending",
  );
  const [proRejectionReason, setProRejectionReason] = useState(
    user?.proRejectionReason ?? state.proRejectionReason ?? null,
  );

  const isRejected = proStatus === "rejected";

  useEffect(() => {
    if (!email || proStatus === "approved") return;

    const checkApproval = async () => {
      try {
        const res = await api.get("/pros/approval-status", {
          params: { email },
        });
        const status = res.data.proStatus;

        if (status === "approved") {
          if (user) updateUser({ proStatus: "approved" });
          navigate("/", {
            replace: true,
            state: { proApproved: true },
          });
          return;
        }

        if (status === "rejected") {
          setProStatus("rejected");
          setProRejectionReason(res.data.proRejectionReason || null);
        }
      } catch {
        /* ignore polling errors */
      }
    };

    checkApproval();
    const timer = window.setInterval(checkApproval, POLL_MS);
    return () => window.clearInterval(timer);
  }, [email, proStatus, user, updateUser, navigate]);

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
            <p className="text-xs text-zinc-500 mb-6">
              Cette page se met à jour automatiquement — vous serez redirigé
              dès que votre compte sera validé.
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
