import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
import UserAvatar from "../../components/UserAvatar";
import { useAuth } from "../../context/AuthContext";
import api from "../../api";
import {
  FiBriefcase,
  FiCheck,
  FiX,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiTag,
  FiUsers,
} from "react-icons/fi";

const STATUS = {
  pending: {
    label: "En attente",
    cls: "bg-yellow-500/15 text-yellow-400",
    icon: <FiClock size={12} />,
  },
  approved: {
    label: "Approuvé",
    cls: "bg-green-500/15 text-green-400",
    icon: <FiCheckCircle size={12} />,
  },
  rejected: {
    label: "Refusé",
    cls: "bg-red-500/15 text-red-400",
    icon: <FiXCircle size={12} />,
  },
};

export default function AdminCandidatures() {
  const { user, loading: authLoading } = useAuth();

  const [pros, setPros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("pending");

  const [selectedPro, setSelectedPro] = useState(null);

  const [rejectTarget, setRejectTarget] = useState(null);
  const [reason, setReason] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (authLoading || user?.role !== "admin") return;
    api
      .get("/users")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setPros(all.filter((u) => u.role === "pro"));
      })
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

  const handleApprove = async (proId) => {
    setProcessing(true);
    try {
      const res = await api.put(`/users/${proId}/approve`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
    } catch {
      /* ignore */
    }
    setProcessing(false);
  };

  const handleVerify = async (proId) => {
    try {
      const res = await api.put(`/users/${proId}/verify`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
      if (selectedPro?._id === proId) setSelectedPro(res.data.user);
    } catch {
      /* ignore */
    }
  };

  const handleUnverify = async (proId) => {
    try {
      const res = await api.put(`/users/${proId}/unverify`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
      if (selectedPro?._id === proId) setSelectedPro(res.data.user);
    } catch {
      /* ignore */
    }
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setProcessing(true);
    try {
      const res = await api.put(`/users/${rejectTarget._id}/reject`, {
        reason,
      });
      setPros((prev) =>
        prev.map((p) => (p._id === rejectTarget._id ? res.data.user : p)),
      );
      setRejectTarget(null);
      setReason("");
    } catch {
      /* ignore */
    }
    setProcessing(false);
  };

  const filtered = pros.filter(
    (p) => !filterStatus || p.proStatus === filterStatus,
  );
  const pendingCount = pros.filter((p) => p.proStatus === "pending").length;

  return (
    <AdminLayout
      title="Candidatures artisans"
      subtitle={`${pros.length} candidature${pros.length !== 1 ? "s" : ""} — ${pendingCount > 0 ? pendingCount + " en attente" : "Tout traité ✓"}`}>
      <div>

        <div className="flex gap-2 mb-6">
          {[
            { value: "pending", label: "En attente" },
            { value: "approved", label: "Approuvés" },
            { value: "rejected", label: "Refusés" },
            { value: "", label: "Tous" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterStatus(f.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                filterStatus === f.value
                  ? "bg-blue-600 text-white"
                  : "dark-card text-zinc-400 hover:text-white"
              }`}>
              {f.label}
              {f.value === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 bg-yellow-400 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="dark-card rounded-2xl p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-white/10 rounded w-48" />
                    <div className="h-3 bg-white/5 rounded w-64" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="dark-card rounded-2xl text-center py-16 text-zinc-500">
              <p className="text-3xl mb-3">📋</p>
              <p className="text-sm">
                Aucune candidature dans cette catégorie.
              </p>
            </div>
          ) : (
            filtered.map((pro) => {
              const st = STATUS[pro.proStatus] ?? STATUS.pending;
              return (
                <div
                  key={pro._id}
                  onClick={() => setSelectedPro(pro)}
                  className="dark-card rounded-2xl p-6 cursor-pointer transition">
                  <div className="flex items-start gap-4 flex-wrap">

                    <UserAvatar user={pro} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-white">
                          {pro.firstName} {pro.lastName}
                        </p>
                        <span
                          className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${st.cls}`}>
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-500 mb-3">{pro.email}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-zinc-400">
                        {pro.companyName && (
                          <span className="flex items-center gap-1.5">
                            🏢 <span>{pro.companyName}</span>
                          </span>
                        )}
                        {pro.siret && (
                          <span className="flex items-center gap-1.5">
                            📄 <span>RC/SIRET : {pro.siret}</span>
                          </span>
                        )}
                        {pro.experienceYears && (
                          <span className="flex items-center gap-1.5">
                            🧰{" "}
                            <span>{pro.experienceYears} ans d'expérience</span>
                          </span>
                        )}
                        {pro.location?.city && (
                          <span className="flex items-center gap-1.5">
                            📍 <span>{pro.location.city}</span>
                          </span>
                        )}
                      </div>

                      {pro.description && (
                        <p className="mt-3 text-sm text-zinc-400 glass-panel rounded-lg px-3 py-2 leading-relaxed">
                          {pro.description}
                        </p>
                      )}

                      {pro.proStatus === "rejected" &&
                        pro.proRejectionReason && (
                          <div className="mt-3 alert-error">
                            <span className="font-medium">
                              Motif du refus :
                            </span>{" "}
                            {pro.proRejectionReason}
                          </div>
                        )}
                    </div>

                    {pro.proStatus === "pending" && (
                      <div
                        className="flex gap-2 flex-shrink-0 mt-1"
                        onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleApprove(pro._id)}
                          disabled={processing}
                          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
                          <FiCheck size={14} /> Approuver
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRejectTarget(pro);
                            setReason("");
                          }}
                          disabled={processing}
                          className="flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
                          <FiX size={14} /> Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedPro && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedPro(null)}>
          <div
            className="modal-panel max-w-lg"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between pb-5 border-b border-white/10">
              <h3 className="font-semibold text-white">
                Dossier de candidature
              </h3>
              <button
                onClick={() => setSelectedPro(null)}
                className="text-zinc-500 hover:text-white">
                <FiX size={20} />
              </button>
            </div>

            <div className="py-5 space-y-5">

              <div className="flex items-center gap-4">
                <UserAvatar user={selectedPro} size="lg" />
                <div>
                  <p className="font-bold text-lg text-white">
                    {selectedPro.firstName} {selectedPro.lastName}
                  </p>
                  <p className="text-sm text-zinc-500">{selectedPro.email}</p>
                  {selectedPro.phone && (
                    <p className="text-sm text-zinc-500">
                      📞 {selectedPro.phone}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-auto flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${(STATUS[selectedPro.proStatus] ?? STATUS.pending).cls}`}>
                  {(STATUS[selectedPro.proStatus] ?? STATUS.pending).icon}
                  {(STATUS[selectedPro.proStatus] ?? STATUS.pending).label}
                </span>
              </div>

              <div className="dark-card rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-3">
                  Informations professionnelles
                </p>
                {selectedPro.companyName && (
                  <InfoRow
                    icon="🏢"
                    label="Entreprise"
                    value={selectedPro.companyName}
                  />
                )}
                {selectedPro.siret && (
                  <InfoRow
                    icon="📄"
                    label="RC / SIRET"
                    value={selectedPro.siret}
                  />
                )}
                {selectedPro.experienceYears && (
                  <InfoRow
                    icon="🧰"
                    label="Expérience"
                    value={`${selectedPro.experienceYears} ans`}
                  />
                )}
                {selectedPro.location?.city && (
                  <InfoRow
                    icon="📍"
                    label="Wilaya"
                    value={selectedPro.location.city}
                  />
                )}
                {selectedPro.categories?.length > 0 && (
                  <InfoRow
                    icon="🏷️"
                    label="Catégories"
                    value={selectedPro.categories
                      .map((c) => c.name || c)
                      .join(", ")}
                  />
                )}
              </div>

              {selectedPro.description && (
                <div>
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
                    Description
                  </p>
                  <p className="text-sm text-zinc-400 leading-relaxed dark-card rounded-xl p-4">
                    {selectedPro.description}
                  </p>
                </div>
              )}

              {selectedPro.proStatus === "rejected" &&
                selectedPro.proRejectionReason && (
                  <div className="alert-error">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">
                      Motif du refus
                    </p>
                    <p className="text-sm text-red-300">
                      {selectedPro.proRejectionReason}
                    </p>
                  </div>
                )}

              <p className="text-xs text-zinc-500 text-center">
                Candidature soumise le{" "}
                {new Date(selectedPro.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-4 border-t border-white/10">

              {selectedPro.isVerified ? (
                <button
                  onClick={() => handleUnverify(selectedPro._id)}
                  className="btn-secondary w-full">
                  <FiCheckCircle size={14} /> Retirer le badge Vérifié
                </button>
              ) : (
                <button
                  onClick={() => handleVerify(selectedPro._id)}
                  className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 rounded-xl text-sm font-medium transition">
                  <FiCheckCircle size={14} /> Donner le badge Vérifié ✓
                </button>
              )}

              {selectedPro.proStatus === "pending" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleApprove(selectedPro._id);
                      setSelectedPro(null);
                    }}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
                    <FiCheck size={14} /> Approuver
                  </button>
                  <button
                    onClick={() => {
                      setRejectTarget(selectedPro);
                      setSelectedPro(null);
                      setReason("");
                    }}
                    disabled={processing}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
                    <FiX size={14} /> Refuser
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="modal-overlay">
          <div className="modal-panel max-w-md">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-500/15 text-red-400 flex items-center justify-center">
                <FiXCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  Refuser la candidature
                </h3>
                <p className="text-sm text-zinc-500">
                  {rejectTarget.firstName} {rejectTarget.lastName}
                </p>
              </div>
            </div>

            <label className="text-sm font-medium text-zinc-300 block mb-2">
              Motif du refus{" "}
              <span className="text-zinc-500 font-normal">(optionnel)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Dossier incomplet, informations insuffisantes..."
              rows={3}
              className="input-field resize-none mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="btn-secondary flex-1">
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl transition text-sm font-medium disabled:opacity-60 flex items-center justify-center gap-2">
                <FiX size={14} />
                {processing ? "En cours..." : "Confirmer le refus"}
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
    <div className="flex items-start gap-2 text-sm">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-zinc-500 w-24 flex-shrink-0">{label}</span>
      <span className="text-zinc-200 font-medium">{value}</span>
    </div>
  );
}
