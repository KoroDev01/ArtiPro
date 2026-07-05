import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageBanner from "../../components/PageBanner";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/EmptyState";
import PhotoPicker from "../../components/PhotoPicker";
import { WILAYAS } from "../../data/wilaya";
import api from "../../api";
import { imageUrl } from "../../utils/imageUrl";
import UserAvatar from "../../components/UserAvatar";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-500/20 text-green-400" },
  in_progress: { label: "En cours", cls: "bg-blue-500/20 text-blue-400" },
  completed: { label: "Terminé", cls: "bg-zinc-500/20 text-zinc-400" },
};

export default function JobRequests() {
  const { user } = useAuth();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [tab, setTab] = useState("active");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    budget: "",
    city: "",
  });
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/posts/list").then((r) => r.data),
      api.get("/categories").then((r) => r.data),
    ])
      .then(([postsData, catsData]) => {
        setPosts(Array.isArray(postsData) ? postsData : []);
        setCategories(Array.isArray(catsData) ? catsData : []);
      })
      .catch(() => setError("Impossible de charger les demandes."))
      .finally(() => setLoading(false));
  }, []);

  const activePosts = posts.filter((p) => {
    if (p.status === "completed") return false;
    if (filterCategory && p.category?._id !== filterCategory) return false;
    if (filterStatus && p.status !== filterStatus) return false;
    if (filterCity && p.location?.city !== filterCity) return false;
    return true;
  });

  const completedPosts = posts.filter((p) => {
    if (p.status !== "completed" || !user) return false;
    const clientId = p.author?._id ?? p.client?._id ?? p.client;
    return clientId?.toString() === user._id?.toString();
  });

  const displayed = tab === "active" ? activePosts : completedPosts;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (user?.isBlocked) {
      setFormError(
        "Votre compte est suspendu. Vous ne pouvez pas créer de demande.",
      );
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      const body = new FormData();
      body.append("title", formData.title);
      body.append("description", formData.description);
      body.append("category", formData.category);
      if (formData.budget) body.append("budget", formData.budget);
      if (formData.city) body.append("city", formData.city);
      photos.forEach((f) => body.append("photos", f));

      const res = await api.post("/posts", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const data = res.data;

      setPosts((prev) => [data.savedPost ?? data, ...prev]);
      setShowModal(false);
      setFormData({
        title: "",
        description: "",
        category: "",
        budget: "",
        city: "",
      });
      setPhotos([]);
      toast.success("Demande publiée !");
    } catch (err) {
      setFormError(
        err.response?.data?.error || err.response?.data?.message || err.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-wrap">
      <Header />

      <PageBanner
        title="Demandes de Travaux"
        subtitle={`${displayed.length} demande${displayed.length !== 1 ? "s" : ""} ${tab === "active" ? "disponible" : "terminée"}${displayed.length !== 1 ? "s" : ""}`}
        action={
          user?.role === "client" && !user?.isBlocked ? (
            <button onClick={() => setShowModal(true)} className="btn-primary">
              + Nouvelle demande
            </button>
          ) : null
        }
      />

      <main className="page-main">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pt-4">
          <div className="flex gap-1 border-b border-white/10">
            <button
              onClick={() => setTab("active")}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition ${
                tab === "active" ? "tab-active" : "tab-inactive"
              }`}>
              Demandes actives
            </button>
            {user?.role === "client" && (
              <button
                onClick={() => setTab("completed")}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition ${
                  tab === "completed" ? "tab-active" : "tab-inactive"
                }`}>
                Mes missions terminées
                {completedPosts.length > 0 && (
                  <span className="ml-2 bg-white/10 text-zinc-400 text-xs px-2 py-0.5 rounded-full">
                    {completedPosts.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </section>

        {tab === "active" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-4">
            <div className="dark-card rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center">
              <span className="text-zinc-500 text-lg">🔍</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="select-field w-full md:w-auto">
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={filterCity}
                onChange={(e) => setFilterCity(e.target.value)}
                className="select-field w-full md:w-auto">
                <option value="">Toutes les wilayas</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="select-field w-full md:w-auto">
                <option value="">Tous les statuts</option>
                <option value="open">Ouvert</option>
                <option value="in_progress">En cours</option>
              </select>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 pb-12 pt-2">
          {loading && (
            <p className="text-center py-20 text-zinc-500">Chargement...</p>
          )}
          {error && <p className="text-center py-20 text-red-400">{error}</p>}
          {!loading &&
            !error &&
            displayed.length === 0 &&
            (tab === "active" ? (
              <EmptyState
                preset={
                  posts.filter((p) => p.status !== "completed").length === 0
                    ? "demandes"
                    : "demandes_filtres"
                }
                onCtaClick={() => setShowModal(true)}
              />
            ) : (
              <div className="text-center py-20 text-zinc-500">
                <p className="text-4xl mb-3">🏁</p>
                <p className="text-sm">
                  Aucune mission terminée pour l'instant.
                </p>
              </div>
            ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayed.map((post) => {
              const status = STATUS_LABELS[post.status] ?? STATUS_LABELS.open;
              const demandeur = post.author ?? post.client;

              return (
                <div
                  key={post._id}
                  className="dark-card rounded-xl p-6 flex flex-col gap-4">
                  {post.photos?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {post.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={imageUrl(photo, "posts")}
                          alt="photo"
                          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-lg">
                        🔧
                      </div>
                      <div>
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full">
                          {post.category?.name ?? "Catégorie"}
                        </span>
                        <h3 className="font-semibold mt-1 text-white">{post.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-400 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                    {post.location?.city && (
                      <span>📍 {post.location.city}</span>
                    )}
                    {post.budget && (
                      <span>💰 {post.budget.toLocaleString()} DZD</span>
                    )}
                    <span>
                      📅 {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                    </span>
                  </div>

                  <hr className="border-white/10" />

                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <UserAvatar user={demandeur} size="sm" />
                    {demandeur?.firstName} {demandeur?.lastName}
                  </div>
                  <Link
                    to={`/demandes/${post._id?.toString()}`}
                    className="link-accent">
                    Voir les détails →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">Nouvelle demande</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-300 text-2xl leading-none">
                &times;
              </button>
            </div>

            {formError && <div className="alert-error mb-4">{formError}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label-field">Titre</label>
                <input
                  type="text"
                  placeholder="Ex: Fuite d'eau à réparer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="input-field mt-1"
                />
              </div>

              <div>
                <label className="label-field">Description</label>
                <textarea
                  placeholder="Décrivez votre besoin..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="input-field mt-1 resize-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="label-field">Catégorie</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="select-field mt-1">
                    <option value="">Choisir...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="label-field">Budget (DZD)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="input-field mt-1"
                  />
                </div>
              </div>

              <div>
                <label className="label-field">Wilaya</label>
                <select
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="select-field mt-1">
                  <option value="">Choisir une wilaya...</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <PhotoPicker
                photos={photos}
                onChange={setPhotos}
                max={3}
                label="Photos"
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn-secondary flex-1">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary flex-1 disabled:opacity-60">
                  {submitting ? "Envoi..." : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
