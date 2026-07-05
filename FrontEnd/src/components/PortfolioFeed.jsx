import { useState, useEffect } from "react";
import api from "../api";
import { imageUrl } from "../utils/imageUrl";
import UserAvatar from "./UserAvatar";
import PhotoPicker from "./PhotoPicker";
import { useAuth } from "../context/AuthContext";
import {
  FiHeart,
  FiMessageCircle,
  FiTrash2,
  FiSend,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
} from "react-icons/fi";

function PostDetailModal({
  post,
  user,
  comments,
  commentDraft,
  onCommentDraft,
  onClose,
  onLike,
  onComment,
  onDelete,
  isOwner,
}) {
  const [photoIndex, setPhotoIndex] = useState(0);
  const photos = post.photos || [];
  const hasPhotos = photos.length > 0;

  useEffect(() => {
    setPhotoIndex(0);
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [post._id]);

  const prevPhoto = () =>
    setPhotoIndex((i) => (i > 0 ? i - 1 : photos.length - 1));
  const nextPhoto = () =>
    setPhotoIndex((i) => (i < photos.length - 1 ? i + 1 : 0));

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}>
      <div
        className="bg-white w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-xl"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
          <h3 className="font-semibold text-gray-900">Réalisation</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500">
            <FiX size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {hasPhotos && (
            <div className="relative bg-gray-900">
              <img
                src={imageUrl(photos[photoIndex], "portfolio")}
                alt=""
                className="w-full max-h-[50vh] sm:max-h-[420px] object-contain mx-auto"
              />
              {photos.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <FiChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70">
                    <FiChevronRight size={20} />
                  </button>
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {photos.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setPhotoIndex(i)}
                        className={`w-2 h-2 rounded-full transition ${
                          i === photoIndex ? "bg-white" : "bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          <div className="p-4 sm:p-5 space-y-4">
            <div>
              <p className="text-sm sm:text-base text-gray-800 whitespace-pre-wrap leading-relaxed">
                {post.caption}
              </p>
              <p className="text-xs text-gray-400 mt-2">
                {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={() => onLike(post._id)}
                disabled={!user}
                className={`flex items-center gap-1.5 text-sm font-medium transition ${
                  post.likedByMe
                    ? "text-red-500"
                    : "text-gray-500 hover:text-red-500"
                } ${!user ? "opacity-50 cursor-not-allowed" : ""}`}>
                <FiHeart
                  size={20}
                  className={post.likedByMe ? "fill-current" : ""}
                />
                {post.likeCount || 0} J'aime
              </button>
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <FiMessageCircle size={20} />
                {post.commentCount || 0} commentaire
                {(post.commentCount || 0) !== 1 ? "s" : ""}
              </span>
              {isOwner && (
                <button
                  type="button"
                  onClick={() => onDelete(post._id)}
                  className="ml-auto text-red-400 hover:text-red-600 text-sm flex items-center gap-1">
                  <FiTrash2 size={16} /> Supprimer
                </button>
              )}
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-700">
                Commentaires
              </h4>
              {(comments || []).length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-4">
                  Aucun commentaire pour l'instant.
                </p>
              ) : (
                comments.map((c) => (
                  <div key={c._id} className="flex gap-2">
                    <UserAvatar user={c.author} size="xs" />
                    <div className="flex-1 min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                      <p className="text-xs font-semibold text-gray-800">
                        {c.author?.firstName} {c.author?.lastName}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">{c.text}</p>
                    </div>
                  </div>
                ))
              )}
              {user ? (
                <div className="flex gap-2 pt-2">
                  <UserAvatar user={user} size="xs" />
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={commentDraft || ""}
                      onChange={(e) => onCommentDraft(e.target.value)}
                      placeholder="Écrire un commentaire..."
                      maxLength={500}
                      className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          onComment(post._id);
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => onComment(post._id)}
                      className="text-blue-600 hover:text-blue-700 p-2">
                      <FiSend size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 text-center py-2">
                  Connectez-vous pour commenter.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PortfolioFeed({ proId, canPost = false }) {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [caption, setCaption] = useState("");
  const [photos, setPhotos] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState("");

  const [expandedComments, setExpandedComments] = useState({});
  const [comments, setComments] = useState({});
  const [commentDrafts, setCommentDrafts] = useState({});
  const [selectedPost, setSelectedPost] = useState(null);

  const loadPosts = () => {
    setLoading(true);
    api
      .get(`/portfolio/pro/${proId}`)
      .then((res) => setPosts(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Impossible de charger les réalisations."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (proId) loadPosts();
  }, [proId]);

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

  const handleDelete = async (postId) => {
    if (!confirm("Supprimer cette publication ?")) return;
    try {
      await api.delete(`/portfolio/${postId}`);
      setPosts((prev) => prev.filter((p) => p._id !== postId));
      if (selectedPost?._id === postId) setSelectedPost(null);
    } catch {
      /* ignore */
    }
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

  const toggleComments = async (postId) => {
    const open = !expandedComments[postId];
    setExpandedComments((prev) => ({ ...prev, [postId]: open }));
    if (open) await loadComments(postId);
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

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        {[1, 2].map((i) => (
          <div key={i} className="dark-card rounded-xl h-48" />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-400 text-sm py-8">{error}</p>;
  }

  return (
    <div className="space-y-5">
      {canPost && (
        <form
          onSubmit={handlePublish}
          className="dark-card rounded-xl p-4 space-y-3">
          <h3 className="font-semibold text-sm text-white">
            Partager une réalisation
          </h3>
          {publishError && (
            <p className="text-xs text-red-300 alert-error !py-2">
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
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={publishing || !caption.trim()}
              className="btn-primary disabled:opacity-60">
              {publishing ? "Publication..." : "Publier"}
            </button>
          </div>
        </form>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">
          <p className="text-3xl mb-2">🛠️</p>
          <p className="text-sm">
            {canPost
              ? "Aucune réalisation publiée. Montrez vos travaux !"
              : "Aucune réalisation pour le moment."}
          </p>
        </div>
      ) : (
        posts.map((post) => {
          const isOwner =
            user &&
            (post.pro?._id === user._id || post.pro === user._id);
          const open = expandedComments[post._id];

          return (
            <article
              key={post._id}
              className="dark-card rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => openPost(post)}
                className="w-full text-left group">
                {post.photos?.length > 0 && (
                  <div
                    className={`relative grid gap-0.5 bg-black/40 ${
                      post.photos.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    }`}>
                    {post.photos.slice(0, 4).map((photo, i) => (
                      <div
                        key={i}
                        className={`overflow-hidden relative ${
                          post.photos.length === 3 && i === 0
                            ? "col-span-2"
                            : ""
                        }`}>
                        <img
                          src={imageUrl(photo, "portfolio")}
                          alt=""
                          className={`w-full object-cover group-hover:scale-[1.02] transition ${
                            post.photos.length === 1
                              ? "h-48 sm:h-56"
                              : "h-32 sm:h-36"
                          }`}
                        />
                        {i === 0 && (
                          <span className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                            <FiMaximize2 size={12} /> Voir
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4">
                  <p className="text-sm text-zinc-300 whitespace-pre-wrap line-clamp-3">
                    {post.caption}
                  </p>
                  <p className="text-xs link-accent mt-2 group-hover:underline">
                    Voir en détail →
                  </p>
                </div>
              </button>

              <div className="px-4 pb-4">
                <p className="text-xs text-zinc-500 mb-3">
                  {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <div className="flex items-center gap-4 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => (user ? handleLike(post._id) : null)}
                    className={`flex items-center gap-1.5 text-sm font-medium transition ${
                      post.likedByMe
                        ? "text-red-400"
                        : "text-zinc-400 hover:text-red-400"
                    }`}>
                    <FiHeart
                      size={18}
                      className={post.likedByMe ? "fill-current" : ""}
                    />
                    {post.likeCount || 0}
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleComments(post._id)}
                    className="flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-blue-400 transition">
                    <FiMessageCircle size={18} />
                    {post.commentCount || 0}
                  </button>
                  {isOwner && (
                    <button
                      type="button"
                      onClick={() => handleDelete(post._id)}
                      className="ml-auto text-zinc-500 hover:text-red-400 transition">
                      <FiTrash2 size={16} />
                    </button>
                  )}
                </div>

                {open && (
                  <div className="mt-4 space-y-3">
                    {(comments[post._id] || []).map((c) => (
                      <div key={c._id} className="flex gap-2">
                        <UserAvatar user={c.author} size="xs" />
                        <div className="flex-1 min-w-0 glass-panel rounded-xl px-3 py-2">
                          <p className="text-xs font-semibold text-white">
                            {c.author?.firstName} {c.author?.lastName}
                          </p>
                          <p className="text-sm text-zinc-400 mt-0.5">
                            {c.text}
                          </p>
                        </div>
                      </div>
                    ))}
                    {user ? (
                      <div className="flex gap-2">
                        <UserAvatar user={user} size="xs" />
                        <div className="flex-1 flex gap-2">
                          <input
                            type="text"
                            value={commentDrafts[post._id] || ""}
                            onChange={(e) =>
                              setCommentDrafts((prev) => ({
                                ...prev,
                                [post._id]: e.target.value,
                              }))
                            }
                            placeholder="Écrire un commentaire..."
                            maxLength={500}
                            className="input-field !rounded-full"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                handleComment(post._id);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleComment(post._id)}
                            className="text-blue-400 hover:text-blue-300 p-2">
                            <FiSend size={16} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-500 text-center">
                        Connectez-vous pour commenter.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </article>
          );
        })
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
          onDelete={handleDelete}
          isOwner={
            user &&
            (selectedPost.pro?._id === user._id ||
              selectedPost.pro === user._id)
          }
        />
      )}
    </div>
  );
}
