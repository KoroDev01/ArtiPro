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

  const navLinkCls = (path) =>
    `text-sm font-medium transition-colors ${
      isActive(path) ? "text-blue-600" : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <>
      {user?.isBlocked && <BanBanner user={user} />}

      <header
        className={`fixed left-0 right-0 h-16 bg-white border-b border-gray-100 shadow-sm z-50 ${user?.isBlocked ? "top-[44px]" : "top-0"}`}>
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <Link
            to="/"
            className="flex-shrink-0 bg-blue-600 text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
            ArtiPro
          </Link>

          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className={navLinkCls("/")}>
              Accueil
            </Link>
            <Link to="/find-artisan" className={navLinkCls("/find-artisan")}>
              Trouver un artisan
            </Link>
            {user && (
              <Link to="/demandes" className={navLinkCls("/demandes")}>
                Demandes
              </Link>
            )}
            {user && (
              <>
                <Link to="/messages" className={navLinkCls("/messages")}>
                  Messages
                </Link>
                <Link to="/dashboard" className={navLinkCls("/dashboard")}>
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
                    className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition"
                    aria-label="Notifications">
                    <FiBell size={18} className="text-gray-600" />
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
                  className="hidden lg:flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border border-gray-200 hover:bg-gray-50 transition">
                  <UserAvatar user={user} size="sm" />
                  <span className="text-sm font-medium text-gray-700">
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
                  className="hidden cursor-alias lg:flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition">
                  <FiLogOut size={15} />
                  Déconnexion
                </button>

                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition"
                  aria-label="Menu">
                  {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className="text-xs sm:text-sm font-medium text-gray-600 hover:text-blue-600 transition px-2 sm:px-3 py-1.5 whitespace-nowrap">
                  Connexion
                </Link>
                <Link
                  to="/SignIn"
                  className="text-xs sm:text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-2.5 sm:px-4 py-1.5 rounded-lg transition whitespace-nowrap">
                  Inscription
                </Link>
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="flex lg:hidden items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition"
                  aria-label="Menu">
                  {menuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
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
          <div className="fixed top-16 left-0 right-0 bg-white z-40 lg:hidden shadow-lg border-t border-gray-100 max-h-[calc(100vh-64px)] overflow-y-auto">
            <nav className="flex flex-col py-3">
              <MobileLink
                to="/"
                icon={<FiHome size={16} />}
                active={isActive("/")}
                onNavigate={closeMenu}>
                Accueil
              </MobileLink>
              <MobileLink
                to="/find-artisan"
                icon={<FiSearch size={16} />}
                active={isActive("/find-artisan")}
                onNavigate={closeMenu}>
                Trouver un artisan
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
                  <div className="h-px bg-gray-100 mx-4 my-2" />
                  <div className="px-4 py-2 flex items-center gap-3">
                    <UserAvatar user={user} size="md" />
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-100 mx-4 my-2" />
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
                  <div className="h-px bg-gray-100 mx-4 my-2" />
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition">
                    <FiLogOut size={16} />
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <div className="h-px bg-gray-100 mx-4 my-2" />
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
          ? "text-blue-600 bg-blue-50"
          : "text-gray-700 hover:bg-gray-50 hover:text-blue-600"
      }`}>
      <span className={active ? "text-blue-600" : "text-gray-400"}>{icon}</span>
      {children}
    </Link>
  );
}

function NotifPanel({ notifs, onMarkAll, onClickNotif, onClose }) {
  const unread = notifs.filter((n) => !n.read).length;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <span className="font-semibold text-sm">Notifications</span>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={onMarkAll}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1">
              <FiCheck size={12} /> Tout lire
            </button>
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <FiX size={16} />
          </button>
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto">
        {notifs.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">
            <p className="text-2xl mb-2">🔔</p>
            Aucune notification
          </div>
        ) : (
          notifs.map((notif) => (
            <button
              key={notif._id}
              onClick={() => onClickNotif(notif)}
              className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-gray-50 transition border-b border-gray-50 last:border-0 ${!notif.read ? "bg-blue-50/60" : ""}`}>
              <span className="text-lg flex-shrink-0 mt-0.5">
                {NOTIF_ICONS[notif.type] || "🔔"}
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm leading-snug ${!notif.read ? "font-medium text-gray-800" : "text-gray-600"}`}>
                  {notif.message}
                </p>
                <p className="text-xs text-gray-400 mt-1">
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
