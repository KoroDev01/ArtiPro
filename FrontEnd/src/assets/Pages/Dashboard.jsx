import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import {
  FiFileText,
  FiStar,
  FiBriefcase,
  FiClock,
  FiCheckCircle,
  FiAlertCircle,
  FiChevronRight,
  FiMapPin,
  FiMessageSquare,
  FiTrendingUp,
  FiUser,
  FiUsers,
  FiTag,
  FiBriefcase as FiBriefcaseAdmin,
} from "react-icons/fi";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-100 text-green-700" },
  in_progress: { label: "En cours", cls: "bg-blue-100 text-blue-700" },
  completed: { label: "Terminé", cls: "bg-gray-100 text-gray-500" },
};

const OFFER_STATUS = {
  pending: { label: "En attente", cls: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Acceptée", cls: "bg-green-100 text-green-700" },
  rejected: { label: "Refusée", cls: "bg-red-100 text-red-700" },
};

export default function Dashboard() {
  const { user } = useAuth();
  const isPro = user?.role === "pro";
  const [pendingPros, setPendingPros] = useState(0);

  useEffect(() => {
    if (user?.role === "admin") {
      api
        .get("/users")
        .then((res) => {
          const all = Array.isArray(res.data) ? res.data : [];
          setPendingPros(
            all.filter((u) => u.role === "pro" && u.proStatus === "pending")
              .length,
          );
        })
        .catch(() => {});
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 mt-[72px] max-w-6xl mx-auto px-4 md:px-6 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.role === "admin"
              ? "Dashboard admin"
              : isPro
                ? "Dashboard artisan"
                : "Dashboard client"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bonjour {user?.firstName}, voici un aperçu de votre activité.
          </p>
        </div>
        {user?.role === "admin" ? (
          <AdminDashboard pendingPros={pendingPros} />
        ) : isPro ? (
          <ProDashboard user={user} />
        ) : (
          <ClientDashboard user={user} />
        )}
      </main>
      <Footer />
    </div>
  );
}

function ClientDashboard({ user }) {
  const [posts, setPosts] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get("/posts/list"), api.get("/offers/mine")])
      .then(([postsRes, offersRes]) => {
        const all = Array.isArray(postsRes.data) ? postsRes.data : [];
        setPosts(
          all.filter(
            (p) => p.client?._id === user._id || p.client === user._id,
          ),
        );
        setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const open = posts.filter((p) => p.status === "open").length;
  const inProgress = posts.filter((p) => p.status === "in_progress").length;
  const completed = posts.filter((p) => p.status === "completed").length;
  const totalOffers = offers.filter((o) => o.status === "pending").length;

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FiFileText />}
          color="blue"
          label="Demandes ouvertes"
          value={open}
        />
        <StatCard
          icon={<FiClock />}
          color="amber"
          label="En cours"
          value={inProgress}
        />
        <StatCard
          icon={<FiCheckCircle />}
          color="green"
          label="Terminées"
          value={completed}
        />
        <StatCard
          icon={<FiBriefcase />}
          color="purple"
          label="Offres en attente"
          value={totalOffers}
        />
      </div>

      <Section
        title="Mes demandes"
        count={posts.length}
        action={
          <Link
            to="/demandes"
            className="text-sm text-blue-600 hover:underline">
            + Nouvelle demande
          </Link>
        }>
        {posts.length === 0 ? (
          <Empty
            icon="📋"
            text="Vous n'avez pas encore publié de demande."
            cta={{ label: "Publier une demande", to: "/demandes" }}
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {posts.map((post) => {
              const s = STATUS_LABELS[post.status] ?? STATUS_LABELS.open;
              const postOffers = offers.filter(
                (o) => (o.post?._id || o.post) === post._id,
              );
              return (
                <Link
                  key={post._id}
                  to={`/demandes/${post._id?.toString()}`}
                  className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-xl transition group">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                      {post.location?.city && (
                        <span className="flex items-center gap-0.5">
                          <FiMapPin size={10} /> {post.location.city}
                        </span>
                      )}
                      <span>
                        {new Date(post.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                      {postOffers.length > 0 && (
                        <span className="flex items-center gap-0.5 text-blue-500 font-medium">
                          <FiBriefcase size={10} /> {postOffers.length} offre
                          {postOffers.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>
                      {s.label}
                    </span>
                    <FiChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-blue-400 transition"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      {offers.length > 0 && (
        <Section title="Offres reçues récemment" count={offers.length}>
          <div className="divide-y divide-gray-50">
            {offers.slice(0, 5).map((offer) => {
              const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.pending;
              return (
                <Link
                  key={offer._id}
                  to={`/demandes/${offer.post?._id?.toString() || offer.post?.toString()}`}
                  className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-xl transition group">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {offer.pro?.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">
                        {offer.pro?.firstName} —{" "}
                        {offer.post?.title || "Demande"}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {offer.message?.slice(0, 60)}…
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {offer.price?.toLocaleString()} DZD
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>
                      {s.label}
                    </span>
                    <FiChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-blue-400 transition"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>
      )}
    </div>
  );
}

function ProDashboard({ user }) {
  const [offers, setOffers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/offers/mine"),
      api.get(`/reviews/pro/${user._id}`).catch(() => ({ data: [] })),
    ])
      .then(([offersRes, reviewsRes]) => {
        setOffers(Array.isArray(offersRes.data) ? offersRes.data : []);
        setReviews(Array.isArray(reviewsRes.data) ? reviewsRes.data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pending = offers.filter((o) => o.status === "pending").length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const inProgress = offers.filter(
    (o) => o.post?.status === "in_progress" && o.status === "accepted",
  ).length;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<FiBriefcase />}
          color="blue"
          label="Offres envoyées"
          value={offers.length}
        />
        <StatCard
          icon={<FiClock />}
          color="amber"
          label="En attente"
          value={pending}
        />
        <StatCard
          icon={<FiCheckCircle />}
          color="green"
          label="Missions acceptées"
          value={accepted}
        />
        <StatCard
          icon={<FiStar />}
          color="yellow"
          label="Note moyenne"
          value={avgRating}
        />
      </div>

      {inProgress > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">
          <FiTrendingUp className="text-blue-600 flex-shrink-0" size={20} />
          <p className="text-sm text-blue-700 font-medium">
            Vous avez <span className="font-bold">{inProgress}</span> mission
            {inProgress > 1 ? "s" : ""} en cours.
          </p>
          <Link
            to="/messages"
            className="ml-auto text-sm text-blue-600 hover:underline flex items-center gap-1 flex-shrink-0">
            <FiMessageSquare size={14} /> Messagerie
          </Link>
        </div>
      )}

      <Section
        title="Mes offres envoyées"
        count={offers.length}
        action={
          <Link
            to="/demandes"
            className="text-sm text-blue-600 hover:underline">
            Parcourir les demandes
          </Link>
        }>
        {offers.length === 0 ? (
          <Empty
            icon="💼"
            text="Vous n'avez pas encore envoyé d'offre."
            cta={{ label: "Parcourir les demandes", to: "/demandes" }}
          />
        ) : (
          <div className="divide-y divide-gray-50">
            {offers.map((offer) => {
              const s = OFFER_STATUS[offer.status] ?? OFFER_STATUS.pending;
              const ps = offer.post?.status
                ? STATUS_LABELS[offer.post.status]
                : null;
              return (
                <Link
                  key={offer._id}
                  to={`/demandes/${offer.post?._id?.toString() || offer.post?.toString()}`}
                  className="flex items-center justify-between py-4 px-2 hover:bg-gray-50 rounded-xl transition group">
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">
                      {offer.post?.title || "Demande"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">
                      {offer.message?.slice(0, 60)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className="text-sm font-bold text-blue-600">
                      {offer.price?.toLocaleString()} DZD
                    </span>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>
                      {s.label}
                    </span>
                    {ps && (
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${ps.cls}`}>
                        {ps.label}
                      </span>
                    )}
                    <FiChevronRight
                      size={14}
                      className="text-gray-300 group-hover:text-blue-400 transition"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </Section>

      <Section
        title="Avis reçus"
        count={reviews.length}
        action={
          reviews.length > 0 && (
            <Link
              to={`/artisan/${user._id?.toString()}`}
              className="text-sm text-blue-600 hover:underline">
              Voir mon profil public
            </Link>
          )
        }>
        {reviews.length === 0 ? (
          <Empty icon="⭐" text="Vous n'avez pas encore reçu d'avis." />
        ) : (
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review) => (
              <div key={review._id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {review.client?.firstName?.[0]?.toUpperCase() || (
                        <FiUser size={12} />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {review.client?.firstName} {review.client?.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(review.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                  </div>
                  <Stars rating={review.rating} />
                </div>
                {review.comment && (
                  <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function AdminDashboard({ pendingPros }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/admin/candidatures"
          className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl flex-shrink-0">
            <FiBriefcase />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              Candidatures
            </p>
            <p className="text-sm text-gray-400 mt-0.5">
              {pendingPros > 0 ? (
                <span className="text-red-500 font-medium">
                  {pendingPros} en attente
                </span>
              ) : (
                "Tout traité ✓"
              )}
            </p>
          </div>
          <FiChevronRight
            size={16}
            className="text-gray-300 group-hover:text-blue-400 transition flex-shrink-0"
          />
        </Link>

        <Link
          to="/admin/users"
          className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-xl flex-shrink-0">
            <FiUsers />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 group-hover:text-purple-600 transition">
              Utilisateurs
            </p>
            <p className="text-sm text-gray-400 mt-0.5">Gérer les comptes</p>
          </div>
          <FiChevronRight
            size={16}
            className="text-gray-300 group-hover:text-purple-400 transition flex-shrink-0"
          />
        </Link>

        <Link
          to="/admin/categories"
          className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition group">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center text-xl flex-shrink-0">
            <FiTag />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-gray-800 group-hover:text-green-600 transition">
              Catégories
            </p>
            <p className="text-sm text-gray-400 mt-0.5">Gérer les métiers</p>
          </div>
          <FiChevronRight
            size={16}
            className="text-gray-300 group-hover:text-green-400 transition flex-shrink-0"
          />
        </Link>
      </div>
    </div>
  );
}

const COLOR_MAP = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  yellow: "bg-yellow-50 text-yellow-600",
};

function StatCard({ icon, color, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${COLOR_MAP[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

function Section({ title, count, action, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">
          {title}
          {count !== undefined && (
            <span className="text-sm font-normal text-gray-400 ml-2">
              ({count})
            </span>
          )}
        </h2>
        {action && <div>{action}</div>}
      </div>
      {children}
    </div>
  );
}

function Empty({ icon, text, cta }) {
  return (
    <div className="text-center py-10">
      <p className="text-3xl mb-3">{icon}</p>
      <p className="text-gray-400 text-sm">{text}</p>
      {cta && (
        <Link
          to={cta.to}
          className="mt-3 inline-block text-sm text-blue-600 hover:underline font-medium">
          {cta.label} →
        </Link>
      )}
    </div>
  );
}

function Stars({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <span
          key={s}
          className={`text-base ${s <= rating ? "text-yellow-400" : "text-gray-200"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
        ))}
      </div>
      <div className="h-64 bg-gray-200 rounded-2xl" />
      <div className="h-48 bg-gray-200 rounded-2xl" />
    </div>
  );
}
