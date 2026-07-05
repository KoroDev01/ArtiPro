import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import api from "../../api";
import { imageUrl } from "../../utils/imageUrl";
import UserAvatar from "../../components/UserAvatar";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-100 text-green-700" },
  in_progress: { label: "En cours", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminé", cls: "bg-gray-100 text-gray-500" },
};

const OFFER_STATUS = {
  pending: { label: "En attente", cls: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Acceptée", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Refusée", cls: "bg-gray-100 text-gray-500" },
};

export default function JobDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [offers, setOffers] = useState([]);
  const [existingReview, setExistingReview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [offerForm, setOfferForm] = useState({ price: "", message: "" });
  const [submittingOffer, setSubmittingOffer] = useState(false);
  const [offerError, setOfferError] = useState("");

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const clientId =
    post?.author?._id ?? post?.client?._id ?? post?.client ?? null;
  const isOwner =
    user && clientId && clientId.toString() === user._id?.toString();
  const isPro = user?.role === "pro";
  const status = post ? (STATUS_LABELS[post.status] ?? STATUS_LABELS.open) : null;

  const myOffer = offers.find(
    (o) =>
      o.pro?._id?.toString() === user?._id?.toString() ||
      o.pro?.toString() === user?._id?.toString(),
  );
  const acceptedOffer = offers.find((o) => o.status === "accepted");

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [postRes, offersRes] = await Promise.all([
        api.get(`/posts/${id}`),
        user
          ? api.get(`/offers/post/${id}`).catch(() => ({ data: [] }))
          : Promise.resolve({ data: [] }),
      ]);
      setPost(postRes.data);
      setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);

      if (user?.role === "client") {
        try {
          const reviewRes = await api.get(`/reviews/post/${id}`);
          setExistingReview(reviewRes.data);
        } catch {
          setExistingReview(null);
        }
      }
    } catch {
      setError("Impossible de charger cette demande.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id, user?._id]);

  const handleSubmitOffer = async (e) => {
    e.preventDefault();
    if (user?.isBlocked) {
      setOfferError("Votre compte est suspendu.");
      return;
    }
    setOfferError("");
    setSubmittingOffer(true);
    try {
      await api.post("/offers", {
        postId: id,
        price: Number(offerForm.price),
        message: offerForm.message,
      });
      toast.success("Offre envoyée !");
      setOfferForm({ price: "", message: "" });
      await loadData();
    } catch (err) {
      setOfferError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Erreur lors de l'envoi.",
      );
    } finally {
      setSubmittingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    if (!confirm("Accepter cette offre ? Les autres seront refusées.")) return;
    try {
      await api.put(`/offers/${offerId}/accept`);
      toast.success("Offre acceptée !");
      await loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Impossible d'accepter cette offre.",
      );
    }
  };

  const handleComplete = async () => {
    if (!confirm("Marquer cette mission comme terminée ?")) return;
    try {
      await api.put(`/posts/${id}/complete`);
      toast.success("Mission terminée !");
      await loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Impossible de terminer la mission.",
      );
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post("/reviews", {
        postId: id,
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      toast.success("Avis publié !");
      await loadData();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Impossible de publier l'avis.",
      );
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Header />
      <main className="mt-[72px] bg-gray-50 min-h-screen">
        <section className="max-w-4xl mx-auto px-6 py-8">
          <Link
            to="/demandes"
            className="text-sm text-blue-600 hover:text-blue-800 font-medium mb-6 inline-block">
            ← Retour aux demandes
          </Link>

          {loading && (
            <p className="text-center py-20 text-gray-400">Chargement...</p>
          )}
          {error && (
            <p className="text-center py-20 text-red-500">{error}</p>
          )}

          {!loading && !error && post && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex justify-between items-start gap-4 flex-wrap">
                  <div>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      {post.category?.name ?? "Catégorie"}
                    </span>
                    <h1 className="text-2xl font-bold mt-2">{post.title}</h1>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium ${status.cls}`}>
                    {status.label}
                  </span>
                </div>

                {post.photos?.length > 0 && (
                  <div
                    className={`mt-5 grid gap-3 ${
                      post.photos.length === 1
                        ? "grid-cols-1"
                        : post.photos.length === 2
                          ? "grid-cols-1 sm:grid-cols-2"
                          : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}>
                    {post.photos.map((photo, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() =>
                          setLightboxPhoto(imageUrl(photo, "posts"))
                        }
                        className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <img
                          src={imageUrl(photo, "posts")}
                          alt={`Photo ${i + 1}`}
                          className={`w-full object-cover transition group-hover:scale-[1.02] ${
                            post.photos.length === 1
                              ? "h-56 sm:h-72 md:h-80"
                              : "h-44 sm:h-52 md:h-56"
                          }`}
                        />
                        <span className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition" />
                      </button>
                    ))}
                  </div>
                )}

                <p className="text-gray-600 mt-4 whitespace-pre-wrap">
                  {post.description}
                </p>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-4">
                  {post.location?.city && (
                    <span>📍 {post.location.city}</span>
                  )}
                  {post.budget && (
                    <span>💰 {post.budget.toLocaleString()} DZD</span>
                  )}
                  <span>
                    📅{" "}
                    {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100">
                  <UserAvatar user={post.author} size="sm" />
                  {post.author?.firstName} {post.author?.lastName}
                </div>
              </div>

              {isOwner && post.status === "in_progress" && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold mb-3">Mission en cours</h2>
                  {acceptedOffer && (
                    <p className="text-sm text-gray-600 mb-4">
                      Artisan sélectionné :{" "}
                      <strong>
                        {acceptedOffer.pro?.firstName}{" "}
                        {acceptedOffer.pro?.lastName}
                      </strong>{" "}
                      — {acceptedOffer.price?.toLocaleString()} DZD
                    </p>
                  )}
                  <button
                    onClick={handleComplete}
                    className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                    Marquer comme terminée
                  </button>
                </div>
              )}

              {isOwner && post.status === "completed" && !existingReview && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold mb-4">Laisser un avis</h2>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Note
                      </label>
                      <select
                        value={reviewForm.rating}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            rating: Number(e.target.value),
                          })
                        }
                        className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm">
                        {[5, 4, 3, 2, 1].map((n) => (
                          <option key={n} value={n}>
                            {n} étoile{n > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Commentaire
                      </label>
                      <textarea
                        value={reviewForm.comment}
                        onChange={(e) =>
                          setReviewForm({
                            ...reviewForm,
                            comment: e.target.value,
                          })
                        }
                        required
                        rows={3}
                        className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                        placeholder="Décrivez votre expérience..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                      {submittingReview ? "Envoi..." : "Publier l'avis"}
                    </button>
                  </form>
                </div>
              )}

              {existingReview && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
                  Vous avez laissé un avis ({existingReview.rating}/5) pour
                  cette mission.
                </div>
              )}

              {isPro &&
                post.status === "open" &&
                !myOffer &&
                !user?.isBlocked && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="font-semibold mb-4">Proposer une offre</h2>
                    {offerError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                        {offerError}
                      </div>
                    )}
                    <form onSubmit={handleSubmitOffer} className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Prix (DZD)
                        </label>
                        <input
                          type="number"
                          value={offerForm.price}
                          onChange={(e) =>
                            setOfferForm({
                              ...offerForm,
                              price: e.target.value,
                            })
                          }
                          required
                          min="1"
                          className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Message
                        </label>
                        <textarea
                          value={offerForm.message}
                          onChange={(e) =>
                            setOfferForm({
                              ...offerForm,
                              message: e.target.value,
                            })
                          }
                          required
                          rows={3}
                          className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg text-sm resize-none"
                          placeholder="Présentez votre proposition..."
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingOffer}
                        className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition disabled:opacity-60">
                        {submittingOffer ? "Envoi..." : "Envoyer l'offre"}
                      </button>
                    </form>
                  </div>
                )}

              {myOffer && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-700">
                  Vous avez déjà envoyé une offre pour cette demande (
                  {myOffer.price?.toLocaleString()} DZD) — statut :{" "}
                  {OFFER_STATUS[myOffer.status]?.label ?? myOffer.status}
                </div>
              )}

              {(isOwner || isPro) && offers.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="font-semibold mb-4">
                    Offres reçues ({offers.length})
                  </h2>
                  <div className="space-y-4">
                    {offers.map((offer) => {
                      const offerStatus =
                        OFFER_STATUS[offer.status] ?? OFFER_STATUS.pending;
                      return (
                        <div
                          key={offer._id}
                          className="border border-gray-100 rounded-lg p-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <p className="font-medium">
                                {offer.pro?.firstName} {offer.pro?.lastName}
                                {offer.pro?.ratingAverage > 0 && (
                                  <span className="text-yellow-500 text-sm ml-2">
                                    ★ {offer.pro.ratingAverage.toFixed(1)}
                                  </span>
                                )}
                              </p>
                              <p className="text-lg font-semibold text-blue-600 mt-1">
                                {offer.price?.toLocaleString()} DZD
                              </p>
                              <p className="text-sm text-gray-600 mt-2">
                                {offer.message}
                              </p>
                            </div>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${offerStatus.cls}`}>
                              {offerStatus.label}
                            </span>
                          </div>
                          {isOwner &&
                            post.status === "open" &&
                            offer.status === "pending" && (
                              <button
                                onClick={() => handleAcceptOffer(offer._id)}
                                className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition">
                                Accepter cette offre
                              </button>
                            )}
                          {offer.status === "accepted" && (
                            <Link
                              to={`/artisan/${offer.pro?._id ?? offer.pro}`}
                              className="inline-block mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium">
                              Voir le profil de l'artisan →
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {!user && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
                  <p className="text-gray-600 text-sm mb-4">
                    Connectez-vous pour proposer une offre ou gérer cette
                    demande.
                  </p>
                  <button
                    onClick={() => navigate("/Login")}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition">
                    Se connecter
                  </button>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {lightboxPhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}>
          <button
            type="button"
            onClick={() => setLightboxPhoto(null)}
            className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Fermer">
            ×
          </button>
          <img
            src={lightboxPhoto}
            alt="Agrandissement"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </>
  );
}
