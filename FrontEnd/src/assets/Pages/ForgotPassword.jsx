import { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setInfo(data.message);
    } catch (err) {
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

          <h1 className="text-2xl font-bold text-white mb-1">Mot de passe oublié</h1>
          <p className="text-zinc-400 text-sm mb-6">
            Entrez votre email pour recevoir un lien de réinitialisation.
          </p>

          {error && <div className="alert-error mb-4">{error}</div>}
          {info && <div className="alert-success mb-4">{info}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label-field">Email</label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-60">
              {loading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-zinc-400">
            <Link to="/Login" className="link-accent">
              Retour à la connexion
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
