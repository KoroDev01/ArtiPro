import { useState, useEffect, useRef, useCallback } from "react";
import Header from "../../components/Header";
import { useAuth } from "../../context/AuthContext";
import api, { API_BASE } from "../../api";
import { imageUrl } from "../../utils/imageUrl";
import EmptyState from "../../components/EmptyState";

const POLL_INTERVAL = 4000;

function resolveReceiverId(conv, user) {
  const proId = conv.pro?._id ?? conv.pro;
  const clientId = conv.client?._id ?? conv.client;
  const myId = user?._id?.toString();

  if (myId && proId?.toString() === myId) return clientId;
  if (myId && clientId?.toString() === myId) return proId;
  if (user?.role === "client") return proId;
  if (user?.role === "pro") return clientId;
  return proId || clientId;
}

export default function Messages() {
  const { user } = useAuth();

  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [hiddenConvs, setHiddenConvs] = useState(new Set());
  const bottomRef = useRef(null);
  const selectedConvRef = useRef(null);
  const pollRef = useRef(null);
  const lastMsgCountRef = useRef({});

  useEffect(() => {
    selectedConvRef.current = selectedConv;
  }, [selectedConv]);

  useEffect(() => {
    api
      .get("/offers/mine")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setConversations(
          all.filter(
            (o) => o.post && (o.post._id || typeof o.post === "string"),
          ),
        );
      })
      .catch(() => setConversations([]))
      .finally(() => setLoadingConvs(false));
  }, []);

  const fetchMessages = useCallback((postId, silent = false) => {
    if (!postId) return;
    if (!silent) setLoadingMessages(true);
    api
      .get(`/messages/post/${postId}`)
      .then((res) => {
        const fetched = Array.isArray(res.data) ? res.data : [];
        setMessages((prev) => {
          if (
            prev.length === fetched.length &&
            prev[prev.length - 1]?._id === fetched[fetched.length - 1]?._id
          ) {
            return prev;
          }
          return fetched;
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!silent) setLoadingMessages(false);
      });
  }, []);

  useEffect(() => {
    clearInterval(pollRef.current);
    if (!selectedConv) return;

    const postId = selectedConv.post?._id || selectedConv.post;
    fetchMessages(postId, false);

    pollRef.current = setInterval(() => {
      const current = selectedConvRef.current;
      if (current) fetchMessages(current.post?._id || current.post, true);
    }, POLL_INTERVAL);

    const restoreInterval = setInterval(async () => {
      if (hiddenConvs.size === 0) return;
      try {
        for (const convId of hiddenConvs) {
          const conv = conversations.find((c) => c._id === convId);
          if (!conv) continue;
          const postId = conv.post?._id || conv.post;
          const res = await api.get(`/messages/post/${postId}`);
          const msgs = Array.isArray(res.data) ? res.data : [];
          const lastCount = lastMsgCountRef.current[postId] || 0;
          if (msgs.length > lastCount) {
            setHiddenConvs((prev) => {
              const next = new Set(prev);
              next.delete(convId);
              return next;
            });
          }
          lastMsgCountRef.current[postId] = msgs.length;
        }
      } catch {
        /* ignore */
      }
    }, 8000);
    return () => {
      clearInterval(pollRef.current);
      clearInterval(restoreInterval);
    };
  }, [selectedConv, fetchMessages, hiddenConvs]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!content.trim() || !selectedConv) return;
    setSending(true);

    const receiverId = resolveReceiverId(selectedConv, user);
    const postId = selectedConv.post?._id || selectedConv.post;

    if (!receiverId) return;

    try {
      const res = await api.post("/messages", {
        postId,
        receiverId,
        content,
      });
      if (res.status === 201) {
        setMessages((prev) => [
          ...prev,
          {
            ...res.data,
            sender: {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
            },
          },
        ]);
        setContent("");
      }
    } catch {
      /* ignore */
    }
    setSending(false);
  };

  const getInterlocutor = (conv) => {
    if (!conv) return "";
    if (user?.role === "client") {
      return conv.pro
        ? `${conv.pro.firstName} ${conv.pro.lastName ?? ""}`.trim()
        : "Artisan";
    }
    return conv.client
      ? `${conv.client.firstName} ${conv.client.lastName ?? ""}`.trim()
      : "Client";
  };

  const statusBadge = (status) => {
    const styles = {
      pending: "bg-yellow-500/20 text-yellow-400",
      accepted: "bg-green-500/20 text-green-400",
      rejected: "bg-red-500/20 text-red-400",
    };
    const labels = {
      pending: "En attente",
      accepted: "Acceptée",
      rejected: "Refusée",
    };
    return (
      <span
        className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[status] || "bg-zinc-500/20 text-zinc-400"}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="page-wrap">
      <Header />
      <div className="mt-16 h-[calc(100vh-64px)] flex">
        <aside className="w-80 dark-card border-r border-white/10 flex flex-col flex-shrink-0 !rounded-none">
          <div className="p-4 border-b border-white/10">
            <h1 className="text-lg font-semibold text-white">Messages</h1>
            <p className="text-xs text-zinc-500 mt-0.5">
              {conversations.filter((c) => !hiddenConvs.has(c._id)).length}{" "}
              conversation
              {conversations.filter((c) => !hiddenConvs.has(c._id)).length !== 1
                ? "s"
                : ""}
              {hiddenConvs.size > 0 && (
                <button
                  onClick={() => setHiddenConvs(new Set())}
                  className="ml-2 text-blue-400 hover:underline text-xs">
                  ({hiddenConvs.size} masquée{hiddenConvs.size > 1 ? "s" : ""} —
                  restaurer)
                </button>
              )}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingConvs && (
              <div className="space-y-3 p-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse space-y-2">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-1/2" />
                  </div>
                ))}
              </div>
            )}
            {!loadingConvs && conversations.length === 0 && (
              <EmptyState
                preset={user?.role === "client" ? "messages" : "messages_pro"}
                className="px-4"
              />
            )}
            {conversations
              .filter((conv) => !hiddenConvs.has(conv._id))
              .map((conv) => (
                <button
                  key={conv._id}
                  onClick={() => setSelectedConv(conv)}
                  className={`w-full text-left px-4 py-4 border-b border-white/10 hover:bg-white/5 transition ${
                    selectedConv?._id === conv._id
                      ? "bg-blue-500/10 border-l-4 border-l-blue-500"
                      : "border-l-4 border-l-transparent"
                  }`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm truncate pr-2 text-white">
                      {getInterlocutor(conv)}
                    </span>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {statusBadge(conv.status)}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHiddenConvs(
                            (prev) => new Set([...prev, conv._id]),
                          );
                          if (selectedConv?._id === conv._id)
                            setSelectedConv(null);
                        }}
                        className="text-red-400 hover:text-red-600 transition p-0.5 rounded font-bold"
                        title="Masquer cette conversation">
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-500 truncate">
                    {conv.post?.title || "Demande de travaux"}
                  </p>
                  <p className="text-xs text-blue-400 font-medium mt-1">
                    {conv.price?.toLocaleString()} DZD
                  </p>
                </button>
              ))}
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0">
          {!selectedConv ? (
            <div className="flex-1 flex items-center justify-center text-zinc-500">
              <div className="text-center">
                <div className="text-5xl mb-4">💬</div>
                <p className="font-medium text-zinc-300">
                  Sélectionnez une conversation
                </p>
                <p className="text-sm mt-1 text-zinc-500">
                  Vos échanges apparaissent ici
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="dark-card border-b border-white/10 px-6 py-4 flex items-center justify-between flex-shrink-0 !rounded-none">
                <div>
                  <h2 className="font-semibold text-white">
                    {getInterlocutor(selectedConv)}
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedConv.post?.title}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {statusBadge(selectedConv.status)}
                  <span className="text-sm font-semibold text-blue-400">
                    {selectedConv.price?.toLocaleString()} DZD
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"} animate-pulse`}>
                        <div className="h-10 bg-white/10 rounded-2xl w-48" />
                      </div>
                    ))}
                  </div>
                )}
                {!loadingMessages && messages.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-3">👋</div>
                    <p className="text-zinc-500 text-sm">
                      Aucun message pour le moment.
                    </p>
                    <p className="text-zinc-600 text-xs mt-1">
                      Commencez la discussion !
                    </p>
                  </div>
                )}
                {messages.map((msg) => {
                  const isMe =
                    msg.sender?._id?.toString() === user?._id?.toString();
                  const senderName =
                    `${msg.sender?.firstName || ""} ${msg.sender?.lastName || ""}`.trim();
                  const avatarUrl = imageUrl(msg.sender?.avatar, "avatars");
                  return (
                    <div
                      key={msg._id}
                      className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}>
                      {!isMe && (
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={senderName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            msg.sender?.firstName?.[0]?.toUpperCase()
                          )}
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                        {!isMe && (
                          <span className="text-xs text-zinc-500 font-medium mb-1 ml-1">
                            {senderName || "Utilisateur"}
                          </span>
                        )}
                        <div
                          className={`px-4 py-2.5 rounded-2xl text-sm ${
                            isMe
                              ? "bg-blue-600 text-white rounded-br-sm"
                              : "dark-card text-zinc-200 rounded-bl-sm"
                          }`}>
                          {msg.content}
                        </div>
                        <span className="text-xs text-zinc-500 mt-1 mx-1">
                          {new Date(msg.createdAt).toLocaleTimeString("fr-FR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      {isMe && (
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0 overflow-hidden">
                          {user?.avatar ? (
                            <img
                              src={imageUrl(user.avatar, "avatars")}
                              alt="moi"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            user?.firstName?.[0]?.toUpperCase()
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <div className="dark-card border-t border-white/10 p-4 flex-shrink-0 !rounded-none">
                <form onSubmit={handleSend} className="flex gap-3 items-center">
                  <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Écrivez votre message..."
                    className="input-field flex-1 !rounded-full"
                  />
                  <button
                    type="submit"
                    disabled={sending || !content.trim()}
                    className="btn-primary !rounded-full disabled:opacity-50 disabled:cursor-not-allowed">
                    {sending ? "..." : "Envoyer"}
                  </button>
                </form>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
