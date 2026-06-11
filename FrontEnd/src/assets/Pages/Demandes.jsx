import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import EmptyState from "../../components/EmptyState";
import { WILAYAS } from "../../data/wilaya";
import api, { API_BASE } from "../../api";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-100 text-green-700" },
  in_progress: { label: "En cours", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminé", cls: "bg-gray-100 text-gray-500" },
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

  const handleDelete = async (postId) => {
    if (!confirm("Supprimer cette demande ?")) return;
    try {
      await api.delete(`/posts/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      toast.success("Demande supprimée.");
    } catch {
      toast.error("Impossible de supprimer ce post.");
    }
  };

  return (
    <>
      <Header />

      <main className="mt-[72px] bg-gray-50 min-h-screen">

        <section className="bg-blue-600 text-white px-6 py-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold">Demandes de Travaux</h1>
              <p className="mt-1 text-blue-100">
                {displayed.length} demande{displayed.length !== 1 ? "s" : ""}{" "}
                {tab === "active" ? "disponible" : "terminée"}
                {displayed.length !== 1 ? "s" : ""}
              </p>
            </div>
            {user?.role === "client" && !user?.isBlocked && (
              <button
                onClick={() => setShowModal(true)}
                className="bg-white text-blue-600 font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-50 transition text-sm">
                + Nouvelle demande
              </button>
            )}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-6 pt-4">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setTab("active")}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 transition ${
                tab === "active"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              Demandes actives
            </button>
            {user?.role === "client" && (
              <button
                onClick={() => setTab("completed")}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition ${
                  tab === "completed"
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}>
                Mes missions terminées
                {completedPosts.length > 0 && (
                  <span className="ml-2 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                    {completedPosts.length}
                  </span>
                )}
              </button>
            )}
          </div>
        </section>

        {tab === "active" && (
          <section className="max-w-7xl mx-auto px-6 py-4">
            <div className="bg-white rounded-xl shadow-sm p-4 flex flex-col md:flex-row gap-3 items-center">
              <span className="text-gray-400 text-lg">🔍</span>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full md:w-auto border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Toutes les catégories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full md:w-auto border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Tous les statuts</option>
                <option value="open">Ouvert</option>
                <option value="in_progress">En cours</option>
              </select>
            </div>
          </section>
        )}

        <section className="max-w-7xl mx-auto px-6 pb-12 pt-2">
          {loading && (
            <p className="text-center py-20 text-gray-400">Chargement...</p>
          )}
          {error && <p className="text-center py-20 text-red-500">{error}</p>}
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
              <div className="text-center py-20 text-gray-400">
                <p className="text-4xl mb-3">🏁</p>
                <p className="text-sm">
                  Aucune mission terminée pour l'instant.
                </p>
              </div>
            ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayed.map((post) => {
              const status = STATUS_LABELS[post.status] ?? STATUS_LABELS.open;
              const initials =
                post.author?.firstName?.[0]?.toUpperCase() ?? "?";
              const clientId =
                post.author?._id ?? post.client?._id ?? post.client;
              const isOwner =
                user && clientId?.toString() === user._id?.toString();

              return (
                <div
                  key={post._id}
                  className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col gap-4 hover:shadow-md transition">
                  {post.photos?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {post.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={`${API_BASE}/images/posts/${photo}`}
                          alt="photo"
                          className="w-24 h-20 object-cover rounded-lg flex-shrink-0"
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-lg">
                        🔧
                      </div>
                      <div>
                        <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                          {post.category?.name ?? "Catégorie"}
                        </span>
                        <h3 className="font-semibold mt-1">{post.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                      {isOwner && (
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-400 hover:text-red-600 text-xs font-medium">
                          Supprimer
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {post.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
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

                  <hr className="border-gray-100" />

                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {initials}
                    </div>
                    {post.author?.firstName} {post.author?.lastName}
                  </div>
                  <Link
                    to={`/demandes/${post._id?.toString()}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                    Voir les détails →
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Nouvelle demande</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
                &times;
              </button>
            </div>

            {formError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Titre
                </label>
                <input
                  type="text"
                  placeholder="Ex: Fuite d'eau à réparer"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Décrivez votre besoin..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  rows={3}
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    required
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option value="">Choisir...</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    Budget (DZD)
                  </label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={formData.budget}
                    onChange={(e) =>
                      setFormData({ ...formData, budget: e.target.value })
                    }
                    className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Wilaya
                </label>
                <select
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full mt-1 p-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <option value="">Choisir une wilaya...</option>
                  {WILAYAS.map((w) => (
                    <option key={w} value={w}>
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Photos (max 3)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setPhotos(Array.from(e.target.files).slice(0, 3))
                  }
                  className="w-full mt-1 text-sm text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-600 file:text-sm file:font-medium hover:file:bg-blue-100"
                />
                {photos.length > 0 && (
                  <p className="text-xs text-gray-400 mt-1">
                    {photos.length} photo{photos.length > 1 ? "s" : ""}{" "}
                    sélectionnée{photos.length > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60">
                  {submitting ? "Envoi..." : "Publier"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
