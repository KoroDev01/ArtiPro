import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import {
  FiArrowLeft,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
  FiTag,
  FiStar,
} from "react-icons/fi";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-100 text-green-700" },
  in_progress: { label: "En cours", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminé", cls: "bg-gray-100 text-gray-500" },
};

export default function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();

  const [job, setJob] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState("");

  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHover, setReviewHover] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [existingReview, setExistingReview] = useState(false);

  const fetchData = async () => {
    try {
      const [jobRes, offersRes] = await Promise.all([
        api.get(`/posts/${id}`),
        api.get(`/offers/post/${id}`),
      ]);
      setJob(jobRes.data);
      setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
    } catch {
      setError("Demande introuvable.");
    } finally {
      setLoading(false);
    }
  };

  const checkExistingReview = async () => {
    try {
      const res = await api.get(`/reviews/post/${id}`);
      if (res.data && res.data._id) setExistingReview(true);
    } catch {
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);
  useEffect(() => {
    if (job?.status === "completed" && user) checkExistingReview();
  }, [job, user]);

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cette demande ?")) return;
    try {
      await api.delete(`/posts/${id}`);
      toast.success("Demande supprimée.");
      navigate("/demandes");
    } catch {
      toast.error("Erreur lors de la suppression.");
    }
  };

  const handleAccept = async (offerId) => {
    try {
      await api.put(`/offers/${offerId}/accept`);
      toast.success("Offre acceptée !");
      fetchData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Erreur lors de l'acceptation.",
      );
    }
  };

  const handleComplete = async () => {
    try {
      await api.put(`/posts/${id}/complete`);
      toast.success("Mission marquée comme terminée !");
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur.");
    }
  };

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (user?.isBlocked) {
      setOfferError(
        "Votre compte est suspendu. Vous ne pouvez pas envoyer d'offre.",
      );
      return;
    }
    setOfferError("");
    setSubmitting(true);
    try {
      await api.post("/offers", {
        postId: id,
        price: Number(offerPrice),
        message: offerMessage,
      });
      setOfferSuccess(true);
      setShowForm(false);
      setOfferPrice("");
      setOfferMessage("");
      fetchData();
    } catch (err) {
      setOfferError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de l'envoi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) {
      setReviewError("Veuillez sélectionner une note.");
      return;
    }
    setReviewError("");
    setReviewSubmitting(true);
    try {
      await api.post("/reviews", {
        postId: id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewSuccess(true);
      setExistingReview(true);
    } catch (err) {
      setReviewError(
        err.response?.data?.message || "Erreur lors de l'envoi de l'avis.",
      );
    } finally {
      setReviewSubmitting(false);
    }
  };

  const isOwner = user && job && user._id === job.author?._id;
  const isPro = user?.role === "pro";
  const alreadyApplied = offers.some((o) => o.pro?._id === user?._id);
  const acceptedOffer = offers.find((o) => o.status === "accepted");
  const canReview =
    isOwner && job?.status === "completed" && !existingReview && !reviewSuccess;

  if (loading)
    return (
      <>
        <Header />
        <div className="mt-[72px] max-w-5xl mx-auto px-6 py-12 animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-48 bg-gray-200 rounded-xl" />
          <div className="h-32 bg-gray-200 rounded-xl" />
        </div>
      </>
    );

  if (error)
    return (
      <>
        <Header />
        <div className="mt-[72px] min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <button
              onClick={() => navigate("/demandes")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg">
              ← Retour aux demandes
            </button>
          </div>
        </div>
      </>
    );

  const status = STATUS_LABELS[job.status] ?? STATUS_LABELS.open;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mt-[72px] max-w-5xl mx-auto px-4 md:px-6 py-8">

        <Link
          to="/demandes"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 mb-6 transition">
          <FiArrowLeft /> Retour aux demandes
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">

              <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1">
                  <FiTag /> {job.category?.name || "Général"}
                </span>
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${status.cls}`}>
                  {status.label}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                {job.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6">
                {job.location?.city && (
                  <span className="flex items-center gap-1">
                    <FiMapPin className="text-blue-400" />
                    {job.location.city}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FiCalendar className="text-blue-400" />
                  {new Date(job.createdAt).toLocaleDateString("fr-FR")}
                </span>
                {job.budget && (
                  <span className="flex items-center gap-1 font-semibold text-blue-600">
                    <FiDollarSign />
                    {job.budget.toLocaleString()} DZD
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                  {job.author?.firstName?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-semibold text-sm">
                    {job.author?.firstName} {job.author?.lastName}
                  </p>
                  <p className="text-xs text-gray-400">{job.author?.email}</p>
                </div>
              </div>

              <div>
                <h2 className="font-semibold text-lg mb-3">📋 Description</h2>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {job.description}
                </p>
              </div>
            </div>

            {job.photos?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">📷 Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {job.photos.map((photo, i) => (
                    <img
                      key={i}
                      src={`http://localhost:3000/images/posts/${photo}`}
                      alt={`Photo ${i + 1}`}
                      className="rounded-xl w-full h-40 object-cover hover:scale-105 transition cursor-pointer border"
                    />
                  ))}
                </div>
              </div>
            )}

            {isOwner && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4">
                  📬 Offres reçues
                  <span className="text-gray-400 text-sm font-normal ml-2">
                    ({offers.length})
                  </span>
                </h2>

                {offers.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">
                    Aucune offre reçue pour l'instant.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {offers.map((offer) => (
                      <div
                        key={offer._id}
                        className={`rounded-xl p-5 border-l-4 border flex flex-col sm:flex-row justify-between gap-4 ${
                          offer.status === "accepted"
                            ? "border-l-green-500 bg-green-50"
                            : offer.status === "rejected"
                              ? "border-l-red-400 bg-red-50"
                              : "border-l-blue-400 bg-gray-50"
                        }`}>
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                            {offer.pro?.firstName?.[0]?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <p className="font-semibold">
                              {offer.pro?.firstName} {offer.pro?.lastName || ""}
                            </p>
                            {offer.pro?.ratingAverage > 0 && (
                              <p className="text-xs text-yellow-500">
                                ⭐ {offer.pro.ratingAverage.toFixed(1)} / 5
                              </p>
                            )}
                            <p className="text-sm text-gray-600 mt-1">
                              {offer.message}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <p className="text-lg font-bold text-blue-600">
                            {offer.price?.toLocaleString()} DZD
                          </p>
                          <span
                            className={`text-xs font-bold px-3 py-1 rounded-full ${
                              offer.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : offer.status === "rejected"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {offer.status === "accepted"
                              ? "✅ Acceptée"
                              : offer.status === "rejected"
                                ? "❌ Refusée"
                                : "⏳ En attente"}
                          </span>
                          {offer.status === "pending" &&
                            job.status === "open" && (
                              <button
                                onClick={() => handleAccept(offer._id)}
                                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition">
                                ✅ Accepter
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {job.status === "in_progress" && (
                  <button
                    onClick={handleComplete}
                    className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                    🏁 Marquer comme terminé
                  </button>
                )}
              </div>
            )}

            {isOwner && job?.status === "completed" && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <FiStar className="text-yellow-400" /> Laisser un avis
                </h2>

                {existingReview && !reviewSuccess ? (
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-gray-500 text-sm">
                    ✅ Vous avez déjà laissé un avis pour cette mission.
                  </div>
                ) : reviewSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-green-700 font-semibold text-lg">
                      🎉 Merci pour votre avis !
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      Votre retour aide la communauté ArtiPro.
                    </p>
                    <div className="flex justify-center gap-1 mt-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span
                          key={s}
                          className={`text-2xl ${s <= reviewRating ? "text-yellow-400" : "text-gray-200"}`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    {reviewError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                        {reviewError}
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-2">
                        Note *
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewRating(star)}
                            onMouseEnter={() => setReviewHover(star)}
                            onMouseLeave={() => setReviewHover(0)}
                            className="text-3xl transition-transform hover:scale-110 focus:outline-none">
                            <span
                              className={`${(reviewHover || reviewRating) >= star ? "text-yellow-400" : "text-gray-200"}`}>
                              ★
                            </span>
                          </button>
                        ))}
                        {reviewRating > 0 && (
                          <span className="ml-2 self-center text-sm text-gray-500 font-medium">
                            {
                              [
                                "",
                                "Très déçu",
                                "Déçu",
                                "Correct",
                                "Bien",
                                "Excellent !",
                              ][reviewRating]
                            }
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 block mb-1">
                        Commentaire{" "}
                        <span className="text-gray-400 font-normal">
                          (optionnel)
                        </span>
                      </label>
                      <textarea
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        rows={4}
                        placeholder="Décrivez votre expérience avec cet artisan..."
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={reviewSubmitting || reviewRating === 0}
                      className="w-full bg-yellow-400 hover:bg-yellow-500 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                      {reviewSubmitting ? "Envoi..." : "⭐ Publier mon avis"}
                    </button>
                  </form>
                )}
              </div>
            )}

            {!isOwner && isPro && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {offerSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-center font-medium">
                    ✅ Votre offre a été envoyée avec succès !
                  </div>
                )}

                {alreadyApplied && !offerSuccess ? (
                  <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-xl text-center font-medium">
                    ⏳ Vous avez déjà envoyé une offre pour cette demande.
                  </div>
                ) : (
                  !offerSuccess &&
                  job.status === "open" && (
                    <>
                      {user?.isBlocked ? (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm text-center font-medium">
                          🚫 Compte suspendu — envoi d'offre impossible.
                        </div>
                      ) : !showForm ? (
                        <button
                          onClick={() => setShowForm(true)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition">
                          💼 Envoyer une offre
                        </button>
                      ) : (
                        <form
                          onSubmit={handleSubmitOffer}
                          className="space-y-4">
                          <h3 className="font-semibold text-lg">
                            💼 Votre offre
                          </h3>

                          {offerError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                              {offerError}
                            </div>
                          )}

                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Prix proposé (DZD)
                            </label>
                            <input
                              type="number"
                              min="1"
                              value={offerPrice}
                              onChange={(e) => setOfferPrice(e.target.value)}
                              required
                              placeholder="Ex: 15000"
                              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
                            />
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700">
                              Message au client
                            </label>
                            <textarea
                              value={offerMessage}
                              onChange={(e) => setOfferMessage(e.target.value)}
                              required
                              rows={4}
                              placeholder="Décrivez votre approche, votre expérience..."
                              className="w-full mt-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm resize-none"
                            />
                          </div>

                          <div className="flex gap-3">
                            <button
                              type="submit"
                              disabled={submitting}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition disabled:opacity-50">
                              {submitting ? "Envoi..." : "📤 Envoyer l'offre"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowForm(false)}
                              className="flex-1 border border-gray-200 py-3 rounded-xl font-medium hover:bg-gray-50 transition text-sm">
                              Annuler
                            </button>
                          </div>
                        </form>
                      )}
                    </>
                  )
                )}

                {job.status !== "open" && !alreadyApplied && !offerSuccess && (
                  <p className="text-center text-gray-400 py-4">
                    Cette demande n'est plus disponible.
                  </p>
                )}
              </div>
            )}

            {!user && (
              <div className="bg-white rounded-2xl shadow-sm p-6 text-center">
                <p className="text-gray-500 mb-3">
                  Connectez-vous pour envoyer une offre
                </p>
                <Link to="/Login">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition">
                    Se connecter
                  </button>
                </Link>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-sm p-6 space-y-3 text-sm">
              <h2 className="font-semibold border-b pb-2">Récapitulatif</h2>
              <div className="flex justify-between text-gray-600">
                <span>Statut</span>
                <span
                  className={`font-medium px-2 py-0.5 rounded-full text-xs ${status.cls}`}>
                  {status.label}
                </span>
              </div>
              {job.budget && (
                <div className="flex justify-between text-gray-600">
                  <span>Budget</span>
                  <span className="font-semibold text-blue-600">
                    {job.budget.toLocaleString()} DZD
                  </span>
                </div>
              )}
              {job.location?.city && (
                <div className="flex justify-between text-gray-600">
                  <span>Ville</span>
                  <span className="font-medium">{job.location.city}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Offres reçues</span>
                <span className="font-medium">{offers.length}</span>
              </div>
              {acceptedOffer && (
                <div className="flex justify-between text-gray-600">
                  <span>Artisan retenu</span>
                  <span className="font-medium text-green-600">
                    {acceptedOffer.pro?.firstName}
                  </span>
                </div>
              )}
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 py-2.5 rounded-xl text-sm font-medium transition">
                🗑️ Supprimer cette demande
              </button>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
