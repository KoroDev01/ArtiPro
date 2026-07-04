import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
    <>
      <Header />
      <main className="mt-16 min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contactez-nous</h1>
            <p className="text-gray-500 text-sm">
              Une question ? Notre équipe vous répond sous 48h.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <FiUser size={14} /> Nom
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <FiMail size={14} /> Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                  <FiMessageSquare size={14} /> Message
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-60">
                {loading ? "Envoi..." : "Envoyer le message"}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 mt-6">
              Ou écrivez-nous directement à{" "}
              <a href="mailto:contact@artipro.dz" className="text-blue-600 hover:underline">
                contact@artipro.dz
              </a>
            </p>
          </div>

          <p className="text-center mt-6">
            <Link to="/" className="text-sm text-blue-600 hover:underline">
              ← Retour à l'accueil
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
