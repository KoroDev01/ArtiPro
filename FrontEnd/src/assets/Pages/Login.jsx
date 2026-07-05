import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === "pro") navigate("/dashboard");
      else navigate("/");
    } catch (err) {
      if (err.proStatus === "pending" || err.proStatus === "rejected") {
        navigate("/inscription-en-attente", {
          state: {
            proStatus: err.proStatus,
            proRejectionReason: err.proRejectionReason,
            email: err.email || email,
            firstName: err.firstName,
            lastName: err.lastName,
            companyName: err.companyName,
            siret: err.siret,
          },
        });
        return;
      }
      if (err.banned) {
        if (err.banPermanent) {
          navigate("/compte-suspendu", { replace: true });
        } else {
          navigate("/demandes", { replace: true });
        }
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="glass-panel rounded-2xl p-8">
          <Link
            to="/"
            className="inline-block bg-white text-zinc-900 rounded-lg px-4 py-1.5 mb-6 font-bold">
            ArtiPro
          </Link>

          <h2 className="text-2xl font-bold text-white mb-1">Bienvenue</h2>
          <p className="text-zinc-400 text-sm mb-6">
            Connectez-vous pour continuer
          </p>

            {location.state?.message && (
              <div className="alert-success mb-4">
                {location.state.message}
              </div>
            )}

            {error && (
              <div className="alert-error mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="label-field">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-field mt-1"
                />
              </div>

              <div className="text-right">
                <Link
                  to="/mot-de-passe-oublie"
                  className="link-accent text-xs">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

          <p className="text-center text-sm mt-6 text-zinc-400">
            Pas encore de compte ?{" "}
            <Link to="/SignIn" className="link-accent">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
