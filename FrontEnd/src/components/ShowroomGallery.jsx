import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api";
import { imageUrl } from "../utils/imageUrl";
import UserAvatar from "./UserAvatar";
import PhotoPicker from "./PhotoPicker";
import { PostDetailModal } from "./PortfolioFeed";
import { useAuth } from "../context/AuthContext";
import {
  FiHeart,
  FiMessageCircle,
  FiMaximize2,
  FiSearch,
  FiX,
  FiUser,
} from "react-icons/fi";

function ArtisanSearch({
  selectedPro,
  onSelect,
  onClear,
}) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const fetchPros = useCallback((q) => {
    setLoading(true);
    api
      .get("/portfolio/showroom/pros", { params: q ? { q } : {} })
      .then((res) => setSuggestions(Array.isArray(res.data) ? res.data : []))
      .catch(() => setSuggestions([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => fetchPros(query.trim()), query.trim() ? 300 : 0);
    return () => clearTimeout(timer);
  }, [query, open, fetchPros]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (pro) => {
    onSelect(pro);
    setQuery("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className="dark-card rounded-2xl p-4 sm:p-5">
      <label
        htmlFor="artisan-search"
        className="mb-3 block text-sm font-semibold text-white">
        Rechercher un artisan
      </label>
      <p className="mb-3 text-xs text-zinc-500">
        Trouvez un professionnel pour voir uniquement ses réalisations.
      </p>

      {selectedPro ? (
        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 px-3 py-2.5">
          <UserAvatar user={selectedPro} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">
              {selectedPro.firstName} {selectedPro.lastName}
            </p>
            {selectedPro.companyName && (
              <p className="truncate text-xs text-zinc-400">
                {selectedPro.companyName}
              </p>
            )}
          </div>
          <Link
            to={`/artisan/${selectedPro._id}`}
            className="text-xs font-medium text-blue-400 hover:underline">
            Voir le profil
          </Link>
          <button
            type="button"
            onClick={onClear}
            className="flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-zinc-300 transition hover:bg-white/10 hover:text-white">
            <FiX size={14} />
            Tout afficher
          </button>
        </div>
      ) : (
        <div className="relative">
          <FiSearch
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            size={18}
          />
          <input
            id="artisan-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            placeholder="Nom, prénom ou entreprise..."
            className="input-field w-full !pl-10"
            autoComplete="off"
          />

          {open && (
            <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-72 overflow-y-auto rounded-xl border border-white/10 bg-slate-900/95 shadow-xl backdrop-blur-xl">
              {loading ? (
                <p className="px-4 py-3 text-sm text-zinc-500">Recherche...</p>
              ) : suggestions.length === 0 ? (
                <p className="px-4 py-3 text-sm text-zinc-500">
                  {query.trim().length >= 2
                    ? "Aucun artisan trouvé avec des réalisations."
                    : "Aucun artisan n'a encore publié de réalisation."}
                </p>
              ) : (
                <>
                  {!query.trim() && (
                    <p className="border-b border-white/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">
                      Artisans avec réalisations
                    </p>
                  )}
                  {suggestions.map((pro) => (
                    <button
                      key={pro._id}
                      type="button"
                      onClick={() => pick(pro)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5">
                      <UserAvatar user={pro} size="sm" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-white">
                          {pro.firstName} {pro.lastName}
                        </p>
                        <p className="truncate text-xs text-zinc-500">
                          {pro.companyName ||
                            pro.location?.city ||
                            "Artisan"}
                        </p>
                      </div>
                      <FiUser className="flex-shrink-0 text-zinc-600" size={16} />
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ShowroomGallery({
  publishOpen = false,
  setPublishOpen,
  publishRef,
}) {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const proParam = searchParams.get("artisan");

  const canPost =
    user?.role === "pro" && user?.proStatus === "approved";

  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [selectedPro, setSelectedPro] = useState(null);
  const [proLoading, setProLoading] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [comments, setComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    if (!proParam) {
      setSelectedPro(null);
      setProLoading(false);
      return;
    }
    if (selectedPro?._id === proParam) return;

    setProLoading(true);
    api
      .get(`/pro/${proParam}`)
      .then((res) => setSelectedPro(res.data))
      .catch(() => setSelectedPro(null))
      .finally(() => setProLoading(false));
  }, [proParam]);

  const loadPosts = useCallback(() => {
    if (proParam && proLoading) return;
    setLoading(true);
    setError("");
    const url = selectedPro
      ? `/portfolio/showroom?pro=${selectedPro._id}`
      : "/portfolio/showroom";

    api
      .get(url)
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Impossible de charger les réalisations."))
      .finally(() => setLoading(false));
  }, [selectedPro, proParam, proLoading]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const selectPro = (pro) => {
    setSelectedPro(pro);
    setSearchParams(pro?._id ? { artisan: pro._id } : {});
  };

  const clearPro = () => {
    setSelectedPro(null);
    setSearchParams({});
  };

  const loadComments = async (postId) => {
    if (comments[postId]) return comments[postId];
    try {
      const res = await api.get(`/portfolio/${postId}/comments`);
      const list = Array.isArray(res.data) ? res.data : [];
      setComments((prev) => ({ ...prev, [postId]: list }));
      return list;
    } catch {
      setComments((prev) => ({ ...prev, [postId]: [] }));
      return [];
    }
  };

  const openPost = async (post) => {
    setSelectedPost(post);
    await loadComments(post._id);
  };

  const syncPost = (updated) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updated._id ? updated : p)),
    );
    setSelectedPost((prev) =>
      prev?._id === updated._id ? { ...prev, ...updated } : prev,
    );
  };

  const handleLike = async (postId) => {
    if (!user) return;
    try {
      const res = await api.post(`/portfolio/${postId}/like`);
      syncPost(res.data);
    } catch {
      /* ignore */
    }
  };

  const handleComment = async (postId) => {
    const text = commentDrafts[postId]?.trim();
    if (!text || !user) return;
    try {
      const res = await api.post(`/portfolio/${postId}/comments`, { text });
      setComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), res.data],
      }));
      setCommentDrafts((prev) => ({ ...prev, [postId]: "" }));
      const updated = posts.find((p) => p._id === postId);
      if (updated) {
        syncPost({
          ...updated,
          commentCount: (updated.commentCount || 0) + 1,
        });
      }
    } catch {
      /* ignore */
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!caption.trim()) return;
    setPublishing(true);
    setPublishError("");
    try {
      const body = new FormData();
      body.append("caption", caption.trim());
      photos.forEach((f) => body.append("photos", f));
      const res = await api.post("/portfolio", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPosts((prev) => [res.data, ...prev]);
      setCaption("");
      setPhotos([]);
      setPublishOpen?.(false);
    } catch (err) {
      setPublishError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Publication impossible.",
      );
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-8">
      {publishOpen && canPost && (
        <form
          ref={publishRef}
          onSubmit={handlePublish}
          className="dark-card space-y-3 rounded-2xl p-4 sm:p-5">
          <h3 className="text-sm font-semibold text-white">
            Publier une réalisation
          </h3>
          {publishError && (
            <p className="alert-error !py-2 text-xs text-red-300">
              {publishError}
            </p>
          )}
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Décrivez ce travail réalisé..."
            rows={3}
            maxLength={2000}
            className="input-field resize-none"
          />
          <PhotoPicker
            photos={photos}
            onChange={setPhotos}
            max={4}
            className="glass-panel rounded-xl p-3"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setPublishOpen?.(false)}
              className="btn-secondary">
              Annuler
            </button>
            <button
              type="submit"
              disabled={publishing || !caption.trim()}
              className="btn-primary disabled:opacity-60">
              {publishing ? "Publication..." : "Publier"}
            </button>
          </div>
        </form>
      )}

      <ArtisanSearch
        selectedPro={selectedPro}
        onSelect={selectPro}
        onClear={clearPro}
      />

      {selectedPro && !loading && (
        <p className="text-sm text-zinc-400">
          {posts.length} réalisation{posts.length !== 1 ? "s" : ""} de{" "}
          <span className="font-medium text-white">
            {selectedPro.firstName} {selectedPro.lastName}
          </span>
        </p>
      )}

      {loading || proLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dark-card animate-pulse rounded-2xl h-72" />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-400 text-sm py-12">{error}</p>
      ) : posts.length === 0 ? (
        <div className="dark-card rounded-2xl py-16 text-center">
          <p className="text-4xl mb-3">🛠️</p>
          <h3 className="text-lg font-semibold text-white mb-2">
            {selectedPro
              ? "Aucune réalisation pour cet artisan"
              : "Aucune réalisation pour le moment"}
          </h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            {selectedPro
              ? "Cet artisan n'a pas encore publié de travaux sur la plateforme."
              : "Les artisans publieront bientôt leurs travaux ici. Revenez plus tard pour découvrir leurs réalisations."}
          </p>
          {selectedPro && (
            <button
              type="button"
              onClick={clearPro}
              className="btn-secondary mt-6">
              Voir toutes les réalisations
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const pro = post.pro;
            const proId = pro?._id || pro;
            const cover = post.photos?.[0];

            return (
              <article
                key={post._id}
                className="dark-card group flex flex-col overflow-hidden rounded-2xl">
                <Link
                  to={`/artisan/${proId}`}
                  className="flex items-center gap-3 border-b border-white/10 p-3 transition hover:bg-white/5">
                  <UserAvatar user={pro} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white">
                      {pro?.firstName} {pro?.lastName}
                    </p>
                    {pro?.companyName && (
                      <p className="truncate text-xs text-zinc-500">
                        {pro.companyName}
                      </p>
                    )}
                  </div>
                </Link>

                <button
                  type="button"
                  onClick={() => openPost(post)}
                  className="flex flex-1 flex-col text-left">
                  {cover ? (
                    <div className="relative overflow-hidden bg-black/30">
                      <img
                        src={imageUrl(cover, "portfolio")}
                        alt=""
                        className="h-44 w-full object-cover transition duration-300 group-hover:scale-[1.03] sm:h-48"
                      />
                      <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                        <FiMaximize2 size={12} /> Voir
                      </span>
                      {post.photos.length > 1 && (
                        <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
                          +{post.photos.length - 1}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-white/5 text-3xl sm:h-48">
                      🛠️
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-4">
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-zinc-300">
                      {post.caption}
                    </p>
                    <p className="mt-2 text-xs text-zinc-500">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </button>

                <div className="flex items-center gap-4 border-t border-white/10 px-4 py-3">
                  <button
                    type="button"
                    onClick={() => handleLike(post._id)}
                    disabled={!user}
                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                      post.likedByMe
                        ? "text-red-400"
                        : "text-zinc-400 hover:text-red-400"
                    } ${!user ? "cursor-not-allowed opacity-50" : ""}`}>
                    <FiHeart
                      size={16}
                      className={post.likedByMe ? "fill-current" : ""}
                    />
                    {post.likeCount || 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => openPost(post)}
                    className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 transition hover:text-blue-400">
                    <FiMessageCircle size={16} />
                    {post.commentCount || 0}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {selectedPost && (
        <PostDetailModal
          post={selectedPost}
          user={user}
          comments={comments[selectedPost._id] || []}
          commentDraft={commentDrafts[selectedPost._id]}
          onCommentDraft={(v) =>
            setCommentDrafts((prev) => ({
              ...prev,
              [selectedPost._id]: v,
            }))
          }
          onClose={() => setSelectedPost(null)}
          onLike={handleLike}
          onComment={handleComment}
          onDelete={() => {}}
          isOwner={false}
        />
      )}
    </div>
  );
}
