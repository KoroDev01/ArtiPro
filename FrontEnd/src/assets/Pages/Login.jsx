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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Link
            to="/"
            className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-lg mb-6 text-sm font-semibold">
            ArtiPro
          </Link>

          <h2 className="text-2xl font-bold mb-1">Bienvenue</h2>
          <p className="text-gray-500 text-sm mb-6">
            Connectez-vous pour continuer
          </p>

            {location.state?.message && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
                {location.state.message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Mot de passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="text-right">
                <Link
                  to="/mot-de-passe-oublie"
                  className="text-xs text-blue-600 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg mt-2 hover:bg-blue-700 transition font-medium text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>

          <p className="text-center text-sm mt-6 text-gray-600">
            Pas encore de compte ?{" "}
            <Link
              to="/SignIn"
              className="text-blue-600 font-medium hover:underline">
              Inscrivez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
