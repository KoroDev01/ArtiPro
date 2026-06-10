import { useState, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout";
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
    cls: "bg-yellow-50 text-yellow-600",
    icon: <FiClock size={12} />,
  },
  approved: {
    label: "Approuvé",
    cls: "bg-green-50 text-green-600",
    icon: <FiCheckCircle size={12} />,
  },
  rejected: {
    label: "Refusé",
    cls: "bg-red-50 text-red-600",
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

  if (!authLoading && user?.role !== "admin")
    return <Navigate to="/" replace />;

  useEffect(() => {
    api
      .get("/users")
      .then((res) => {
        const all = Array.isArray(res.data) ? res.data : [];
        setPros(all.filter((u) => u.role === "pro"));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleApprove = async (proId) => {
    setProcessing(true);
    try {
      const res = await api.put(`/users/${proId}/approve`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
    } catch {}
    setProcessing(false);
  };

  const handleVerify = async (proId) => {
    try {
      const res = await api.put(`/users/${proId}/verify`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
      if (selectedPro?._id === proId) setSelectedPro(res.data.user);
    } catch {}
  };

  const handleUnverify = async (proId) => {
    try {
      const res = await api.put(`/users/${proId}/unverify`);
      setPros((prev) => prev.map((p) => (p._id === proId ? res.data.user : p)));
      if (selectedPro?._id === proId) setSelectedPro(res.data.user);
    } catch {}
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
    } catch {}
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
                  : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300"
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
                className="bg-white rounded-2xl shadow-sm p-6 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-48" />
                    <div className="h-3 bg-gray-100 rounded w-64" />
                  </div>
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm text-center py-16 text-gray-400">
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
                  className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer hover:shadow-md transition">
                  <div className="flex items-start gap-4 flex-wrap">

                    <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-base font-bold flex-shrink-0">
                      {pro.firstName?.[0]?.toUpperCase() || "?"}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p className="font-semibold text-gray-900">
                          {pro.firstName} {pro.lastName}
                        </p>
                        <span
                          className={`flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-medium ${st.cls}`}>
                          {st.icon} {st.label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{pro.email}</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
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
                        <p className="mt-3 text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
                          {pro.description}
                        </p>
                      )}

                      {pro.proStatus === "rejected" &&
                        pro.proRejectionReason && (
                          <div className="mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2 text-sm text-red-600">
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
                          className="flex items-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-500 px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60">
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPro(null)}>
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}>

            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                Dossier de candidature
              </h3>
              <button
                onClick={() => setSelectedPro(null)}
                className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-5">

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xl font-bold flex-shrink-0">
                  {selectedPro.firstName?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-lg text-gray-900">
                    {selectedPro.firstName} {selectedPro.lastName}
                  </p>
                  <p className="text-sm text-gray-400">{selectedPro.email}</p>
                  {selectedPro.phone && (
                    <p className="text-sm text-gray-400">
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

              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
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
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    Description
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-4">
                    {selectedPro.description}
                  </p>
                </div>
              )}

              {selectedPro.proStatus === "rejected" &&
                selectedPro.proRejectionReason && (
                  <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">
                      Motif du refus
                    </p>
                    <p className="text-sm text-red-700">
                      {selectedPro.proRejectionReason}
                    </p>
                  </div>
                )}

              <p className="text-xs text-gray-400 text-center">
                Candidature soumise le{" "}
                {new Date(selectedPro.createdAt).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex flex-col gap-2 px-6 py-4 border-t border-gray-100">

              {selectedPro.isVerified ? (
                <button
                  onClick={() => handleUnverify(selectedPro._id)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition">
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
                    className="flex-1 flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-500 py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-60">
                    <FiX size={14} /> Refuser
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {rejectTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-500 flex items-center justify-center">
                <FiXCircle size={18} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Refuser la candidature
                </h3>
                <p className="text-sm text-gray-500">
                  {rejectTarget.firstName} {rejectTarget.lastName}
                </p>
              </div>
            </div>

            <label className="text-sm font-medium text-gray-700 block mb-2">
              Motif du refus{" "}
              <span className="text-gray-400 font-normal">(optionnel)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Ex: Dossier incomplet, informations insuffisantes..."
              rows={3}
              className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 text-sm resize-none mb-5"
            />

            <div className="flex gap-3">
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl hover:bg-gray-50 transition text-sm font-medium">
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
      <span className="text-gray-400 w-24 flex-shrink-0">{label}</span>
      <span className="text-gray-700 font-medium">{value}</span>
    </div>
  );
}
