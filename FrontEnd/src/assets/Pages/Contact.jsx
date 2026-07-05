import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageBanner from "../../components/PageBanner";
import api from "../../api";
import { FiMail, FiUser, FiMessageSquare } from "react-icons/fi";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await api.post("/contact", form);
      setSuccess(res.data.message);
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-wrap">
      <Header />
      <PageBanner
        title="Contactez-nous"
        subtitle="Une question ? Notre équipe vous répond sous 48h."
      />
      <main className="page-main py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="dark-card rounded-2xl p-8">
            {error && <div className="alert-error mb-4">{error}</div>}
            {success && <div className="alert-success mb-4">{success}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-field flex items-center gap-2 mb-1">
                  <FiUser size={14} /> Nom
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field flex items-center gap-2 mb-1">
                  <FiMail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="label-field flex items-center gap-2 mb-1">
                  <FiMessageSquare size={14} /> Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="input-field resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60">
                {loading ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>

            <p className="text-center text-xs text-zinc-500 mt-6">
              Ou écrivez-nous directement à{" "}
              <a href="mailto:contact@artipro.dz" className="text-blue-400 hover:underline">
                contact@artipro.dz
              </a>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="link-accent">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
