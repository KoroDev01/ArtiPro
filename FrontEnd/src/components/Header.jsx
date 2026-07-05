import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import UserAvatar from "./UserAvatar";
import {
  FiBell,
  FiX,
  FiCheck,
  FiMenu,
  FiUser,
  FiLogOut,
  FiGrid,
  FiMessageSquare,
  FiFileText,
  FiHome,
  FiSearch,
  FiAlertOctagon,
} from "react-icons/fi";

const NOTIF_ICONS = {
  new_offer: "📬",
  offer_accepted: "✅",
  offer_rejected: "❌",
  post_completed: "🏁",
  new_review: "⭐",
  new_message: "💬",
};

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notifs, setNotifs] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef(null);
  const pollRef = useRef(null);

  const displayNotifs = user ? notifs : [];
  const unread = displayNotifs.filter((n) => !n.read).length;

  const fetchNotifs = () => {
    if (!user) return;
    api
      .get("/notifications")
      .then((res) => setNotifs(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifs();
    pollRef.current = window.setInterval(fetchNotifs, 15000);
    return () => window.clearInterval(pollRef.current);
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  const handleMarkAllRead = async () => {
    await api.put("/notifications/read-all").catch(() => {});
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClickNotif = async (notif) => {
    setNotifOpen(false);
    if (!notif.read) {
      await api.put(`/notifications/${notif._id}/read`).catch(() => {});
      setNotifs((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, read: true } : n)),
      );
    }
    if (notif.link) navigate(notif.link);
  };

  const isActive = (path) => location.pathname === path;
  const isHome = location.pathname === "/";

  const headerCls = isHome
    ? "bg-white/10 backdrop-blur-2xl border-b border-white/15"
    : "bg-slate-900/50 backdrop-blur-2xl border-b border-white/10";

  const logoCls = isHome
    ? "bg-white text-zinc-900 hover:bg-zinc-100"
    : "bg-blue-600 text-white hover:bg-blue-500";

  const navCls = (path) => {
    if (isHome) {
      return `text-sm font-medium transition-colors ${
        isActive(path) ? "text-white" : "text-white/75 hover:text-white"
      }`;
    }
    return `text-sm font-medium transition-colors ${
      isActive(path) ? "text-blue-400" : "text-zinc-400 hover:text-white"
    }`;
  };

  return (
    <>
      {user?.isBlocked && <BanBanner user={user} />}

      <header
        className={`fixed left-0 right-0 h-16 z-50 ${headerCls} ${user?.isBlocked ? "top-[44px]" : "top-0"}`}>
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={`flex-shrink-0 rounded-lg px-4 py-1.5 text-sm font-bold transition ${logoCls}`}>
            ArtiPro
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={navCls("/")}>
              Accueil
            </Link>
            <Link to="/showroom" className={navCls("/showroom")}>
              Réalisations
            </Link>
            {user && (
              <Link to="/demandes" className={navCls("/demandes")}>
                Demandes
              </Link>
            )}
            {user && (
              <>
                <Link to="/messages" className={navCls("/messages")}>
                  Messages
                </Link>
                <Link to="/dashboard" className={navCls("/dashboard")}>
                  Dashboard
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                <div className="relative" ref={notifRef}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setNotifOpen((v) => !v);
                    }}
                    className={`relative flex items-center justify-center w-9 h-9 rounded-full transition ${
                      isHome ? "hover:bg-white/10" : "hover:bg-white/5"
                    }`}
                    aria-label="Notifications">
                    <FiBell
                      size={18}
                      className={isHome ? "text-white" : "text-zinc-300"}
                    />
                    {unread > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    )}
                  </button>
                  {notifOpen && (
                    <NotifPanel
                      notifs={displayNotifs}
                      onMarkAll={handleMarkAllRead}
                      onClickNotif={handleClickNotif}
                      onClose={() => setNotifOpen(false)}
                    />
                  )}
                </div>

                <Link
                  to="/profile"
                  className={`hidden lg:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition ${
                    isHome
                      ? "border-white/20 hover:bg-white/10"
                      : "border-white/10 hover:bg-white/5"
                  }`}>
                  <UserAvatar user={user} size="sm" />
                  <span
                    className={`text-sm font-medium ${isHome ? "text-white" : "text-zinc-200"}`}>
                    {user.firstName}
                  </span>
                </Link>

                <Link
                  to="/profile"
                  className="flex lg:hidden items-center justify-center"
                  aria-label="Mon profil">
                  <UserAvatar user={user} size="md" />
                </Link>

                <button
                  onClick={logout}
                  className={`hidden cursor-alias lg:flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition ${
                    isHome
                      ? "text-red-300 hover:text-red-200 hover:bg-white/10"
                      : "text-red-400 hover:text-red-300 hover:bg-white/5"
                  }`}>
                  <FiLogOut size={15} />
                  Déconnexion
                </button>

                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex lg:hidden items-center justify-center w-9 h-9 rounded-full transition ${
                    isHome ? "hover:bg-white/10" : "hover:bg-white/5"
                  }`}
                  aria-label="Menu">
                  {menuOpen ? (
                    <FiX size={20} className={isHome ? "text-white" : "text-zinc-200"} />
                  ) : (
                    <FiMenu size={20} className={isHome ? "text-white" : "text-zinc-200"} />
                  )}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className={`text-xs sm:text-sm font-medium transition px-2 sm:px-3 py-1.5 whitespace-nowrap ${
                    isHome
                      ? "text-white/90 hover:text-white"
                      : "text-zinc-400 hover:text-white"
                  }`}>
                  Connexion
                </Link>
                <Link
                  to="/SignIn"
                  className={`text-xs sm:text-sm font-medium px-2.5 sm:px-4 py-1.5 rounded-lg transition whitespace-nowrap ${
                    isHome
                      ? "text-white border border-white/30 hover:bg-white/10"
                      : "bg-blue-600 text-white hover:bg-blue-500"
                  }`}>
                  Inscription
                </Link>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className={`flex lg:hidden items-center justify-center w-9 h-9 rounded-full transition ${
                    isHome ? "hover:bg-white/10" : "hover:bg-white/5"
                  }`}
                  aria-label="Menu">
                  {menuOpen ? (
                    <FiX size={20} className={isHome ? "text-white" : "text-zinc-200"} />
                  ) : (
                    <FiMenu size={20} className={isHome ? "text-white" : "text-zinc-200"} />
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40 lg:hidden"
            onClick={() => setMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 z-40 lg:hidden glass-panel !shadow-none max-h-[calc(100vh-64px)] overflow-y-auto border-t border-white/10">
            <nav className="flex flex-col py-3">
              <MobileLink
                to="/"
                icon={<FiHome size={16} />}
                active={isActive("/")}
                onNavigate={closeMenu}>
                Accueil
              </MobileLink>
              <MobileLink
                to="/showroom"
                icon={<FiGrid size={16} />}
                active={isActive("/showroom")}
                onNavigate={closeMenu}>
                Réalisations
              </MobileLink>
              {user && (
                <MobileLink
                  to="/demandes"
                  icon={<FiFileText size={16} />}
                  active={isActive("/demandes")}
                  onNavigate={closeMenu}>
                  Demandes
                </MobileLink>
              )}

              {user ? (
                <>
                  <div className="h-px bg-white/10 mx-4 my-2" />
                  <div className="px-4 py-2 flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-zinc-500 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-white/10 mx-4 my-2" />
                  <MobileLink
                    to="/messages"
                    icon={<FiMessageSquare size={16} />}
                    active={isActive("/messages")}
                    onNavigate={closeMenu}>
                    Messages
                  </MobileLink>
                  <MobileLink
                    to="/dashboard"
                    icon={<FiGrid size={16} />}
                    active={isActive("/dashboard")}
                    onNavigate={closeMenu}>
                    Dashboard
                  </MobileLink>
                  <MobileLink
                    to="/profile"
                    icon={<FiUser size={16} />}
                    active={isActive("/profile")}
                    onNavigate={closeMenu}>
                    Mon profil
                  </MobileLink>
                  <div className="h-px bg-white/10 mx-4 my-2" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                    <FiLogOut size={16} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-white/10 mx-4 my-2" />
                  <MobileLink
                    to="/Login"
                    icon={<FiUser size={16} />}
                    active={isActive("/Login")}
                    onNavigate={closeMenu}>
                    Connexion
                  </MobileLink>
                  <MobileLink
                    to="/SignIn"
                    icon={<FiUser size={16} />}
                    active={isActive("/SignIn")}
                    onNavigate={closeMenu}>
                    Inscription
                  </MobileLink>
                </>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
}

function MobileLink({ to, icon, active, children, onNavigate }) {
  return (
    <Link
      to={to}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition ${
        active
          ? "text-blue-400 bg-white/10"
          : "text-zinc-300 hover:bg-white/5 hover:text-white"
      }`}>
      <span className={active ? "text-blue-400" : "text-zinc-500"}>{icon}</span>
      {children}
    </Link>
  );
}

function NotifPanel({ notifs, onMarkAll, onClickNotif, onClose }) {
  const unread = notifs.filter((n) => !n.read).length;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-12 w-80 glass-panel rounded-2xl z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
        <span className="font-semibold text-sm text-white">Notifications</span>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAll}
              className="text-xs text-blue-400 hover:underline flex items-center gap-1">
              <FiCheck size={12} /> Tout lire
            </button>
          )}
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300">
            <FiX size={16} />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 text-sm">
            <p className="text-2xl mb-2">🔔</p>
            Aucune notification
          </div>
        ) : (
          notifs.map((notif) => (
            <button
              key={notif._id}
              onClick={() => onClickNotif(notif)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-white/5 transition border-b border-white/5 last:border-0 ${!notif.read ? "bg-blue-500/10" : ""}`}>
              <span className="text-lg flex-shrink-0 mt-0.5">
                {NOTIF_ICONS[notif.type] || "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm leading-snug ${!notif.read ? "font-medium text-white" : "text-zinc-400"}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {new Date(notif.createdAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!notif.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-1.5" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function BanBanner({ user }) {
  if (!user?.isBlocked) return null;

  const isPermanent = !user.banUntil;
  let timeLeft = null;

  if (!isPermanent) {
    const diff = new Date(user.banUntil) - new Date();
    if (diff <= 0) return null;

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) timeLeft = `${days} jour${days > 1 ? "s" : ""} et ${hours}h`;
    else if (hours > 0) timeLeft = `${hours}h ${mins}min`;
    else timeLeft = `${mins} minute${mins > 1 ? "s" : ""}`;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-red-600 text-white px-4 py-2.5 flex items-center justify-center gap-2 text-sm font-medium shadow-lg">
      <FiAlertOctagon size={16} className="flex-shrink-0" />
      <span>
        🚫 Votre compte est suspendu
        {isPermanent
          ? " de façon permanente"
          : ` — temps restant : ${timeLeft}`}
        . Vous pouvez uniquement consulter les demandes.
      </span>
    </div>
  );
}
