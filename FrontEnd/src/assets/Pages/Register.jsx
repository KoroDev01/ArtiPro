import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { WILAYAS } from "../../data/wilaya";

const validatePassword = (pwd) => {
  if (pwd.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
  if (!/[0-9]/.test(pwd)) return "Le mot de passe doit contenir au moins un chiffre.";
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) return "Le mot de passe doit contenir au moins un caractère spécial.";
  return null;
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState("client");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",

    companyName: "",
    siret: "",
    description: "",
    experienceYears: "",
    city: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    const pwdErr = validatePassword(formData.password);
    if (pwdErr) return setError(pwdErr);
    if (formData.password !== formData.confirmPassword) {
      return setError("Les mots de passe ne correspondent pas.");
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 1) {
      const pwdErr = validatePassword(formData.password);
      if (pwdErr) return setError(pwdErr);
      if (formData.password !== formData.confirmPassword) {
        return setError("Les mots de passe ne correspondent pas.");
      }
    }
    setError("");
    setLoading(true);
    try {
      await register({ ...formData, role });
      if (role === "pro") {
        navigate("/inscription-en-attente");
      } else {
        navigate("/");
      }
    } catch (err) {
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

          <h2 className="text-2xl font-bold mb-1">Créer un compte</h2>
          <p className="text-gray-500 text-sm mb-6">
            Inscrivez-vous pour commencer à utiliser la plateforme
          </p>

          <div className="flex bg-gray-100 rounded-full p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole("client");
                setStep(1);
              }}
              className={`flex-1 rounded-full py-2 text-sm transition ${role === "client" ? "bg-white shadow font-medium" : "text-gray-500"}`}>
              Client
            </button>
            <button
              type="button"
              onClick={() => {
                setRole("pro");
                setStep(1);
              }}
              className={`flex-1 rounded-full py-2 text-sm transition ${role === "pro" ? "bg-white shadow font-medium" : "text-gray-500"}`}>
              Artisan
            </button>
          </div>

          {role === "pro" && (
            <div className="flex items-center gap-2 mb-6">
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 1 ? "bg-blue-600 text-white" : "bg-green-100 text-green-600"}`}>
                {step > 1 ? "✓" : "1"}
              </div>
              <div
                className={`flex-1 h-0.5 ${step > 1 ? "bg-blue-600" : "bg-gray-200"}`}
              />
              <div
                className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${step === 2 ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-400"}`}>
                2
              </div>
              <span className="text-xs text-gray-400 ml-1">
                {step === 1
                  ? "Informations personnelles"
                  : "Informations professionnelles"}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          {step === 1 && (
            <form
              onSubmit={role === "pro" ? handleNextStep : handleSubmit}
              className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Prénom
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Nom
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="votre@email.com"
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg mt-2 hover:bg-blue-700 transition font-medium text-sm disabled:opacity-60">
                {role === "pro"
                  ? "Continuer →"
                  : loading
                    ? "Création en cours..."
                    : "S'inscrire"}
              </button>
            </form>
          )}

          {step === 2 && role === "pro" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700 mb-2">
                🔍 Votre candidature sera examinée par notre équipe avant
                activation.
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nom de l'entreprise
                </label>
                <input
                  type="text"
                  name="companyName"
                  placeholder="Ex: Plomberie Dupont"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Numéro RC / SIRET
                </label>
                <input
                  type="text"
                  name="siret"
                  placeholder="Numéro d'enregistrement"
                  value={formData.siret}
                  onChange={handleChange}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Années d'expérience
                  </label>
                  <input
                    type="number"
                    name="experienceYears"
                    placeholder="Ex: 5"
                    min="0"
                    max="60"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Wilaya
                  </label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Choisir...</option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description de vos services
                </label>
                <textarea
                  name="description"
                  placeholder="Décrivez votre activité, vos compétences..."
                  value={formData.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium text-sm disabled:opacity-60">
                  {loading ? "Envoi..." : "Envoyer ma candidature"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm mt-6 text-gray-600">
            Déjà un compte ?{" "}
            <Link
              to="/Login"
              className="text-blue-600 font-medium hover:underline">
              Connectez-vous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { ok: password.length >= 8, label: "8 caractères minimum" },
    { ok: /[0-9]/.test(password), label: "Au moins un chiffre" },
    { ok: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password), label: "Au moins un caractère spécial" },
  ];
  const score = checks.filter(c => c.ok).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-green-500"];
  const labels = ["", "Faible", "Moyen", "Fort"];
  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex gap-1">
        {[0,1,2].map(i => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < score ? colors[score] : "bg-gray-200"}`} />
        ))}
      </div>
      {score > 0 && <p className={`text-xs font-medium ${score === 3 ? "text-green-600" : score === 2 ? "text-yellow-600" : "text-red-500"}`}>{labels[score]}</p>}
      <div className="space-y-0.5">
        {checks.map((check) => (
          <p key={check.label} className={`text-xs flex items-center gap-1 ${check.ok ? "text-green-600" : "text-gray-400"}`}>
            {check.ok ? "✓" : "○"} {check.label}
          </p>
        ))}
      </div>
    </div>
  );
}