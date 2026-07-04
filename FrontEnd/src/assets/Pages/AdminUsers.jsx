import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import {
  FiUsers,
  FiShield,
  FiShieldOff,
  FiSearch,
  FiTag,
  FiClock,
  FiX,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiMapPin,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";

const DURATIONS = [
  { value: "30min", label: "30 minutes" },
  { value: "1day", label: "1 jour" },
  { value: "1week", label: "1 semaine" },
  { value: "2weeks", label: "2 semaines" },
  { value: "permanent", label: "Permanent" },
];

const ROLE_LABELS = {
  client: { label: "Client", cls: "bg-blue-50 text-blue-600" },
  pro: { label: "Pro", cls: "bg-purple-50 text-purple-600" },
  admin: { label: "Admin", cls: "bg-orange-50 text-orange-600" },
};

export default function AdminUsers() {
  const { user, loading: authLoading } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);

  const [banTarget, setBanTarget] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState("1day");
  const [banning, setBanning] = useState(false);

  useEffect(() => {
    if (authLoading || user?.role !== "admin") return;
    api
      .get("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authLoading, user?.role]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (user?.role !== "admin") return <Navigate to="/" replace />;

  const handleBan = async () => {
    if (!banTarget) return;
    setBanning(true);
    try {
      const res = await api.put(`/users/${banTarget._id}/ban`, {
        duration: selectedDuration,
      });
      setUsers((prev) =>
        prev.map((u) => (u._id === banTarget._id ? res.data.user : u)),
      );
      setBanTarget(null);
    } catch {
      /* ignore */
    } finally {
      setBanning(false);
    }
  };

  const handleUnban = async (userId) => {
    try {
      const res = await api.put(`/users/${userId}/unban`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
    } catch {
      /* ignore */
    }
  };

  const handleVerify = async (userId) => {
    try {
      const res = await api.put(`/users/${userId}/verify`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
      if (selectedUser?._id === userId) setSelectedUser(res.data.user);
    } catch {
      /* ignore */
    }
  };

  const handleUnverify = async (userId) => {
    try {
      const res = await api.put(`/users/${userId}/unverify`);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? res.data.user : u)),
      );
      if (selectedUser?._id === userId) setSelectedUser(res.data.user);
    } catch {
      /* ignore */
    }
  };

  const getBanLabel = (u) => {
    if (!u.isBlocked) return null;
    if (!u.banUntil) return "Permanent";
    const diff = new Date(u.banUntil) - new Date();
    if (diff <= 0) return "Expiré";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (days > 0) return `${days}j ${hours}h restants`;
    if (hours > 0) return `${hours}h ${mins}min restants`;
    return `${mins}min restantes`;
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      u.firstName?.toLowerCase().includes(q) ||
      u.lastName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q);
    const matchRole = !filterRole || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const banned = filtered.filter((u) => u.isBlocked).length;

  return (
    <AdminLayout
      title="Utilisateurs"
      subtitle={`${users.length} compte${users.length !== 1 ? "s" : ""} — ${banned} suspendu${banned !== 1 ? "s" : ""}`}>
      <div>

        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">Tous les rôles</option>
            <option value="client">Client</option>
            <option value="pro">Pro</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="divide-y divide-gray-50">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="px-6 py-4 animate-pulse flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-40" />
                    <div className="h-3 bg-gray-100 rounded w-56" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-3xl mb-3">👥</p>
              <p className="text-sm">Aucun utilisateur trouvé.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((u) => {
                const role = ROLE_LABELS[u.role] ?? ROLE_LABELS.client;
                const banLabel = getBanLabel(u);
                const isMe = u._id === user._id;

                return (
                  <div
                    key={u._id}
                    onClick={() => setSelectedUser(u)}
                    className="px-6 py-4 flex items-center gap-4 flex-wrap cursor-pointer hover:bg-gray-50 transition">

                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold flex-shrink-0">
                      {u.firstName?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-sm text-gray-800">
                          {u.firstName} {u.lastName}
                          {isMe && (
                            <span className="ml-1 text-xs text-gray-400">
                              (vous)
                            </span>
                          )}
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${role.cls}`}>
                          {role.label}
                        </span>
                        {u.isVerified && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-green-50 text-green-600">
                            <FiCheckCircle size={10} /> Vérifié
                          </span>
                        )}
                        {u.isBlocked && (
                          <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600">
                            <FiClock size={10} />
                            {banLabel}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 truncate">
                        {u.email}
                      </p>
                    </div>

                    {!isMe && u.role !== "admin" && (
                      <div
                        className="flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}>
                        {u.isBlocked ? (
                          <button
                            onClick={() => handleUnban(u._id)}
                            className="flex items-center gap-1.5 text-xs font-medium text-green-600 hover:text-green-700 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded-lg transition">
                            <FiShieldOff size={13} /> Débannir
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setBanTarget(u);
                              setSelectedDuration("1day");
                            }}
                            className="flex items-center gap-1.5 text-xs font-medium text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition">
                            <FiShield size={13} /> Bannir
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {selectedUser && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedUser(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Profil utilisateur
              </h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {selectedUser.firstName?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-lg text-gray-900">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${(ROLE_LABELS[selectedUser.role] ?? ROLE_LABELS.client).cls}`}>
                      {
                        (ROLE_LABELS[selectedUser.role] ?? ROLE_LABELS.client)
                          .label
                      }
                    </span>
                    {selectedUser.isBlocked && (
                      <span className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium bg-red-50 text-red-600">
                        <FiClock size={10} />{" "}
                        {getBanLabel(selectedUser) || "Banni"}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                  Informations
                </p>
                <InfoRow
                  icon={<FiMail size={13} />}
                  label="Email"
                  value={selectedUser.email}
                />
                {selectedUser.phone && (
                  <InfoRow
                    icon={<FiPhone size={13} />}
                    label="Téléphone"
                    value={selectedUser.phone}
                  />
                )}
                <InfoRow
                  icon={<FiClock size={13} />}
                  label="Inscrit le"
                  value={new Date(selectedUser.createdAt).toLocaleDateString(
                    "fr-FR",
                    { day: "numeric", month: "long", year: "numeric" },
                  )}
                />
                {selectedUser.location?.city && (
                  <InfoRow
                    icon={<FiMapPin size={13} />}
                    label="Wilaya"
                    value={selectedUser.location.city}
                  />
                )}
              </div>

              {selectedUser.role === "pro" && (
                <div className="bg-purple-50 rounded-xl p-4 space-y-2">
                  <p className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">
                    Informations professionnelles
                  </p>
                  {selectedUser.companyName && (
                    <InfoRow
                      icon={<FiBriefcase size={13} />}
                      label="Entreprise"
                      value={selectedUser.companyName}
                    />
                  )}
                  {selectedUser.siret && (
                    <InfoRow
                      icon={<FiBriefcase size={13} />}
                      label="RC/SIRET"
                      value={selectedUser.siret}
                    />
                  )}
                  {selectedUser.experienceYears && (
                    <InfoRow
                      icon={<FiClock size={13} />}
                      label="Expérience"
                      value={`${selectedUser.experienceYears} ans`}
                    />
                  )}
                  <InfoRow
                    icon={<FiStar size={13} />}
                    label="Note"
                    value={`${(selectedUser.ratingAverage ?? 0).toFixed(1)} / 5 (${selectedUser.ratingCount ?? 0} avis)`}
                  />
                  {selectedUser.categories?.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <span className="text-gray-400 w-24 flex-shrink-0">
                        Catégories
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedUser.categories.map((cat) => (
                          <span
                            key={cat._id || cat}
                            className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                            {cat.name || cat}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedUser.description && (
                    <p className="text-xs text-gray-500 bg-white rounded-lg px-3 py-2 mt-2">
                      {selectedUser.description}
                    </p>
                  )}
                </div>
              )}
            </div>

            {selectedUser._id !== user._id && selectedUser.role !== "admin" && (
              <div className="flex flex-col gap-2 px-6 py-4 border-t border-gray-100">

                {selectedUser.role === "pro" &&
                  (selectedUser.isVerified ? (
                    <button
                      onClick={() => handleUnverify(selectedUser._id)}
                      className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition">
                      <FiCheckCircle size={14} /> Retirer le badge Vérifié
                    </button>
                  ) : (
                    <button
                      onClick={() => handleVerify(selectedUser._id)}
                      className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                      <FiCheckCircle size={14} /> Donner le badge Vérifié ✓
                    </button>
                  ))}

                <div className="flex gap-2">
                  {selectedUser.isBlocked ? (
                    <button
                      onClick={() => {
                        handleUnban(selectedUser._id);
                        setSelectedUser(null);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                      <FiShieldOff size={14} /> Débannir
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setBanTarget(selectedUser);
                        setSelectedUser(null);
                        setSelectedDuration("1day");
                      }}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                      <FiShield size={14} /> Bannir ce compte
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {banTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                <FiShield size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Bannir un compte
                </h3>
                <p className="text-sm text-gray-500">
                  {banTarget.firstName} {banTarget.lastName}
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Choisissez la durée de suspension :
            </p>

            <div className="grid grid-cols-1 gap-2 mb-6">
              {DURATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => setSelectedDuration(d.value)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm font-medium transition ${
                    selectedDuration === d.value
                      ? "border-red-500 bg-red-50 text-red-600"
                      : "border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50"
                  }`}>
                  <span>{d.label}</span>
                  {selectedDuration === d.value && (
                    <span className="w-2 h-2 rounded-full bg-red-500" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setBanTarget(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
                Annuler
              </button>
              <button
                onClick={handleBan}
                disabled={banning}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                <FiShield size={14} />
                {banning ? "En cours..." : "Confirmer le ban"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-400 w-24 flex-shrink-0 text-xs">{label}</span>
      <span className="text-gray-700 font-medium text-xs truncate">
        {value}
      </span>
    </div>
  );
}
