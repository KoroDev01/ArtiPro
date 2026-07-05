import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function VerifyEmail() {
  const { verifyEmail, resendCode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";
  const emailWarning = location.state?.emailWarning || "";
  const initialInfo = location.state?.info || emailWarning;

  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState(initialInfo);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const data = await verifyEmail(email, code);
      if (data.proStatus) {
        navigate("/inscription-en-attente", {
          state: { proStatus: data.proStatus, email },
        });
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setInfo("");
    setResending(true);
    try {
      await resendCode(email);
      setInfo(
        "Un nouveau code a été généré. Vérifiez votre boîte mail ou le terminal du backend en local.",
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <p className="text-zinc-400">
          Session invalide.{" "}
          <Link to="/Register" className="link-accent">
            Retour à l'inscription
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8">
          <Link
            to="/"
            className="inline-block bg-white text-zinc-900 rounded-lg px-4 py-1.5 mb-6 font-bold">
            ArtiPro
          </Link>

          <h2 className="text-2xl font-bold text-white mb-1">Vérifiez votre email</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Un code à 6 chiffres a été envoyé à <strong className="text-white">{email}</strong>
          </p>

          {error && <div className="alert-error mb-4">{error}</div>}
          {info && <div className="alert-success mb-4">{info}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              required
              className="input-field text-center text-2xl tracking-[0.5em]"
            />
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="btn-primary w-full disabled:opacity-60">
              {loading ? "Vérification..." : "Vérifier"}
            </button>
          </form>

          <button
            onClick={handleResend}
            disabled={resending}
            className="link-accent w-full text-center mt-4 disabled:opacity-60">
            {resending ? "Envoi..." : "Renvoyer le code"}
          </button>
        </div>
      </div>
    </div>
  );
}
