import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import {
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiBriefcase,
  FiMessageSquare,
  FiArrowLeft,
} from "react-icons/fi";

export default function ArtisanProfile() {
  const { id } = useParams();
  const { user } = useAuth();

  const navigate = useNavigate();
  const [artisan, setArtisan] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("about");

  const [showBanModal, setShowBanModal] = useState(false);
  const [banDuration, setBanDuration] = useState("1day");
  const [banning, setBanning] = useState(false);
  const [banSuccess, setBanSuccess] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const [existingOffer, setExistingOffer] = useState(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/pro/${id}`),
      api.get(`/reviews/pro/${id}`).catch(() => ({ data: [] })),
    ])
      .then(([proRes, reviewsRes]) => {
        setArtisan(proRes.data);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      })
      .catch(() => setError("Impossible de charger ce profil."))
      .finally(() => setLoading(false));

    if (user && user.role === "client") {
      api
        .get("/offers/mine")
        .then((res) => {
          const offers = Array.isArray(res.data) ? res.data : [];
          const offer = offers.find((o) => o.pro?._id === id || o.pro === id);
          if (offer) setExistingOffer(offer);
        })
        .catch(() => {});
    }
  }, [id]);

  const Stars = ({ rating = 0, size = "sm" }) => {
    const sz = size === "lg" ? "text-xl" : "text-sm";
    return (
      <span className={sz}>
        <span className="text-yellow-400">
          {"★".repeat(Math.floor(rating))}
        </span>
        <span className="text-gray-300">
          {"★".repeat(5 - Math.floor(rating))}
        </span>
      </span>
    );
  };

  const handleBan = async () => {
    setBanning(true);
    try {
      const durations = {
        "30min": 30 * 60 * 1000,
        "1day": 24 * 60 * 60 * 1000,
        "1week": 7 * 24 * 60 * 60 * 1000,
        "2weeks": 14 * 24 * 60 * 60 * 1000,
      };
      const banUntil =
        banDuration === "permanent"
          ? null
          : new Date(Date.now() + durations[banDuration]);
      const res = await api.put(`/users/${id}/ban`, { duration: banDuration });
      setArtisan((prev) => ({
        ...prev,
        isBlocked: true,
        banUntil: res.data.user?.banUntil,
      }));
      setBanSuccess("Compte suspendu avec succès.");
      setShowBanModal(false);
    } catch {}
    setBanning(false);
  };

  const handleUnban = async () => {
    try {
      await api.put(`/users/${id}/unban`);
      setArtisan((prev) => ({ ...prev, isBlocked: false, banUntil: null }));
      setBanSuccess("Compte réactivé.");
    } catch {}
  };

  if (loading)
    return (
      <>
        <Header />
        <div className="mt-[72px] max-w-7xl mx-auto px-6 py-12 animate-pulse">
          <div className="bg-white rounded-xl shadow p-6">
            <div className="h-32 bg-gray-200 rounded-xl mb-6" />
            <div className="flex gap-4 -mt-12 mb-4">
              <div className="w-24 h-24 rounded-xl bg-gray-300 border-4 border-white" />
              <div className="mt-12 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-40" />
                <div className="h-3 bg-gray-200 rounded w-28" />
              </div>
            </div>
          </div>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="mt-[72px] max-w-7xl mx-auto px-6 py-12 text-center text-red-500">
          {error}
        </div>
      </>
    );

  if (!artisan) return null;

  const initials =
    `${artisan.firstName?.[0] ?? ""}${artisan.lastName?.[0] ?? ""}`.toUpperCase();
  const available = artisan.availability !== false;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 mt-[72px] max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        <Link
          to="/find-artisan"
          className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center gap-1">
          <FiArrowLeft /> Retour aux artisans
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-blue-700 to-blue-400" />

              <div className="px-6 pb-6 -mt-12">
                <div className="flex flex-col sm:flex-row sm:items-end gap-4 mb-4">
                  {artisan.avatar ? (
                    <img
                      src={`https://artipro-production.up.railway.app${artisan.avatar}`}
                      alt={artisan.firstName}
                      className="w-24 h-24 rounded-xl object-cover border-4 border-white shadow"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-blue-100 border-4 border-white shadow flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-2xl">
                        {initials}
                      </span>
                    </div>
                  )}

                  <div className="sm:mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h1 className="text-xl font-bold">
                        {artisan.firstName} {artisan.lastName}
                      </h1>
                      {artisan.isVerified && (
                        <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">
                          <FiCheckCircle /> Vérifié
                        </span>
                      )}
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${available ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                        {available ? "Disponible" : "Occupé"}
                      </span>
                    </div>

                    {artisan.companyName && (
                      <p className="text-gray-500 text-sm mt-0.5">
                        {artisan.companyName}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Stars rating={artisan.ratingAverage ?? 0} />
                        <span className="font-medium text-gray-700">
                          {(artisan.ratingAverage ?? 0).toFixed(1)}
                        </span>
                        <span className="text-gray-400">
                          ({artisan.ratingCount ?? 0} avis)
                        </span>
                      </span>
                      {artisan.location?.city && (
                        <span className="flex items-center gap-1">
                          <FiMapPin className="text-blue-400" />
                          {artisan.location.city}
                        </span>
                      )}
                      {artisan.experienceYears && (
                        <span className="flex items-center gap-1">
                          <FiClock className="text-blue-400" />
                          {artisan.experienceYears} ans d'exp.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {artisan.categories?.map((c) => (
                    <span
                      key={c._id}
                      className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-medium">
                      {c.name}
                    </span>
                  ))}
                </div>

                <div className="flex gap-1 border-b border-gray-100">
                  {[
                    { key: "about", label: "À propos", icon: <FiUser /> },
                    {
                      key: "reviews",
                      label: `Avis (${artisan.ratingCount ?? 0})`,
                      icon: <FiStar />,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition ${
                        activeTab === tab.key
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}>
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                {activeTab === "about" && (
                  <div className="mt-5 space-y-5">
                    {artisan.description && (
                      <div>
                        <h2 className="font-semibold mb-2">Description</h2>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {artisan.description}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {artisan.experienceYears && (
                        <InfoCard
                          icon="🧰"
                          title="Expérience"
                          value={`${artisan.experienceYears} ans`}
                        />
                      )}
                      <InfoCard
                        icon="⭐"
                        title="Note moyenne"
                        value={`${(artisan.ratingAverage ?? 0).toFixed(1)} / 5`}
                      />
                      <InfoCard
                        icon="📋"
                        title="Avis reçus"
                        value={`${artisan.ratingCount ?? 0}`}
                      />
                      {artisan.siret && (
                        <InfoCard
                          icon="🏢"
                          title="SIRET"
                          value={artisan.siret}
                        />
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="mt-5 space-y-4">
                    {reviews.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">
                        Aucun avis pour le moment.
                      </p>
                    ) : (
                      reviews.map((review) => (
                        <div
                          key={review._id}
                          className="border border-gray-100 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                                {review.client?.firstName?.[0]?.toUpperCase()}
                              </div>
                              <span className="font-medium text-sm">
                                {review.client?.firstName}{" "}
                                {review.client?.lastName}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Stars rating={review.rating} />
                              <span className="text-sm font-medium">
                                {review.rating}/5
                              </span>
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-gray-600">
                              {review.comment}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(review.createdAt).toLocaleDateString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="font-semibold mb-1 flex items-center gap-2">
                <FiMessageSquare className="text-blue-500" /> Contacter
                l'artisan
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Réponse généralement sous 24h
              </p>

              {user ? (
                user._id === id ? (
                  <p className="text-sm text-center text-gray-400 py-4">
                    C'est votre profil.
                  </p>
                ) : existingOffer ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-xs text-green-700 flex items-center gap-2">
                      <FiCheckCircle size={12} /> Vous avez déjà une offre avec
                      cet artisan
                    </div>
                    {sent ? (
                      <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3 text-center">
                        ✅ Message envoyé !
                      </div>
                    ) : (
                      <>
                        {sendError && (
                          <div className="bg-red-50 border border-red-200 text-red-600 text-xs rounded-lg px-3 py-2">
                            {sendError}
                          </div>
                        )}
                        <textarea
                          placeholder="Écrivez votre message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={4}
                        />
                        <button
                          onClick={async () => {
                            if (!message.trim()) return;
                            setSending(true);
                            setSendError("");
                            try {
                              await api.post("/messages", {
                                postId:
                                  existingOffer.post?._id || existingOffer.post,
                                receiverId: id,
                                content: message.trim(),
                              });
                              setSent(true);
                              setMessage("");
                              setTimeout(() => navigate("/messages"), 1500);
                            } catch (err) {
                              setSendError(
                                err.response?.data?.message ||
                                  "Erreur lors de l'envoi.",
                              );
                            } finally {
                              setSending(false);
                            }
                          }}
                          disabled={sending || !message.trim()}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60">
                          <FiMessageSquare size={14} />
                          {sending ? "Envoi..." : "Envoyer le message"}
                        </button>
                        <button
                          onClick={() => navigate("/messages")}
                          className="w-full border border-gray-200 text-gray-600 hover:bg-gray-50 py-2 rounded-lg text-sm transition">
                          Voir toutes les conversations
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                      💡 Publiez une demande pour recevoir une offre de cet
                      artisan et pouvoir lui écrire.
                    </p>
                    <Link to="/demandes">
                      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2">
                        <FiBriefcase /> Publier une demande
                      </button>
                    </Link>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">
                    Connectez-vous pour contacter cet artisan
                  </p>
                  <Link to="/Login">
                    <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg text-sm font-medium transition">
                      Se connecter
                    </button>
                  </Link>
                </div>
              )}
            </div>

            {user?.role === "admin" && (
              <div className="bg-white rounded-xl shadow-sm p-5 space-y-3">
                <h2 className="font-semibold text-sm flex items-center gap-2 text-gray-700">
                  🛡️ Modération
                </h2>
                {banSuccess && (
                  <p className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded-lg">
                    {banSuccess}
                  </p>
                )}
                {artisan.isBlocked ? (
                  <div className="space-y-2">
                    <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg flex items-center gap-1.5">
                      🚫 Compte suspendu{" "}
                      {artisan.banUntil
                        ? `jusqu'au ${new Date(artisan.banUntil).toLocaleDateString("fr-FR")}`
                        : "(permanent)"}
                    </p>
                    <button
                      onClick={handleUnban}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                      ✅ Débannir ce compte
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowBanModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                    🚫 Bannir ce compte
                  </button>
                )}
              </div>
            )}

            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3 text-sm">
              <h2 className="font-semibold border-b pb-2">Informations</h2>
              <div className="flex justify-between text-gray-600">
                <span>Disponibilité</span>
                <span
                  className={`font-medium ${available ? "text-green-600" : "text-gray-400"}`}>
                  {available ? "Disponible" : "Indisponible"}
                </span>
              </div>
              {artisan.experienceYears && (
                <div className="flex justify-between text-gray-600">
                  <span>Expérience</span>
                  <span className="font-medium">
                    {artisan.experienceYears} ans
                  </span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Note</span>
                <span className="font-medium">
                  {(artisan.ratingAverage ?? 0).toFixed(1)} / 5
                </span>
              </div>
              {artisan.location?.city && (
                <div className="flex justify-between text-gray-600">
                  <span>Ville</span>
                  <span className="font-medium">{artisan.location.city}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {showBanModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-lg">
                🚫
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Bannir ce compte
                </h3>
                <p className="text-sm text-gray-500">
                  {artisan.firstName} {artisan.lastName}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Choisissez la durée de suspension :
            </p>

            <div className="grid grid-cols-1 gap-2 mb-6">
              {[
                { value: "30min", label: "30 minutes" },
                { value: "1day", label: "1 jour" },
                { value: "1week", label: "1 semaine" },
                { value: "2weeks", label: "2 semaines" },
                { value: "permanent", label: "Permanent" },
              ].map((d) => (
                <button
                  key={d.value}
                  onClick={() => setBanDuration(d.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                    banDuration === d.value
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                  }`}>
                  <span>{d.label}</span>
                  {banDuration === d.value && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBanModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
                Annuler
              </button>
              <button
                onClick={handleBan}
                disabled={banning}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-60">
                {banning ? "En cours..." : "Confirmer le ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoCard({ icon, title, value }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
