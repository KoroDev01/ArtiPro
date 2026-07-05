import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useAuth } from "../../context/AuthContext";
import api, { API_BASE } from "../../api";
import { imageUrl } from "../../utils/imageUrl";
import PortfolioFeed from "../../components/PortfolioFeed";
import PageBanner from "../../components/PageBanner";
import { WILAYAS } from "../../data/wilaya";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiBriefcase,
  FiEdit2,
  FiCheck,
  FiX,
  FiCamera,
  FiStar,
  FiFileText,
  FiClock,
  FiToggleLeft,
  FiToggleRight,
  FiMapPin,
  FiChevronRight,
  FiAlertCircle,
  FiAward,
  FiShield,
  FiHash,
} from "react-icons/fi";

const STATUS_LABELS = {
  open: { label: "Ouvert", cls: "bg-green-500/15 text-green-400" },
  in_progress: { label: "En cours", cls: "bg-blue-500/15 text-blue-400" },
  completed: { label: "Terminé", cls: "bg-zinc-500/15 text-zinc-400" },
};

export default function Profile() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [profileData, setProfileData] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  const [allCategories, setAllCategories] = useState([]);

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState("");

  useEffect(() => {
    if (!user) return;

    api
      .get("/me")
      .then((res) => {
        setProfileData(res.data);
        setForm({
          firstName: res.data.firstName || "",
          lastName: res.data.lastName || "",
          phone: res.data.phone || "",
          description: res.data.description || "",
          companyName: res.data.companyName || "",
          siret: res.data.siret || "",
          experienceYears: res.data.experienceYears || "",
          city: res.data.location?.city || "",
          availability: res.data.availability ?? true,
          selectedCategories: (res.data.categories || []).map(
            (c) => c._id || c,
          ),
        });
      })
      .catch(() => navigate("/Login"));

    api
      .get("/categories")
      .then((res) => setAllCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    if (user.role === "client") {
      api
        .get("/posts/list")
        .then((res) => {
          const all = Array.isArray(res.data) ? res.data : [];
          setMyPosts(
            all.filter(
              (p) => p.client?._id === user._id || p.client === user._id,
            ),
          );
        })
        .catch(() => {})
        .finally(() => setLoadingPosts(false));
    } else if (user.role === "pro") {
      api
        .get("/offers/mine")
        .then((res) => setMyOffers(Array.isArray(res.data) ? res.data : []))
        .catch(() => {})
        .finally(() => setLoadingPosts(false));
    } else {
      setLoadingPosts(false);
    }
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    setSaveSuccess(false);
    try {
      const payload = { ...form };
      if (isPro) payload.categories = form.selectedCategories;
      const res = await api.put("/me", payload);
      setProfileData(res.data);
      setSaveSuccess(true);
      setEditing(false);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      setSaveError(
        err.response?.data?.message || "Erreur lors de la sauvegarde.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setSaveError("");
    setForm({
      firstName: profileData.firstName || "",
      lastName: profileData.lastName || "",
      phone: profileData.phone || "",
      description: profileData.description || "",
      companyName: profileData.companyName || "",
      siret: profileData.siret || "",
      experienceYears: profileData.experienceYears || "",
      city: profileData.location?.city || "",
      availability: profileData.availability ?? true,
      selectedCategories: (profileData.categories || []).map((c) => c._id || c),
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append("avatar", file);
    try {
      const res = await api.post("/me/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setProfileData((prev) => ({ ...prev, avatar: res.data.user.avatar }));
      updateUser({ avatar: res.data.user.avatar });
    } catch {
      setAvatarError("Impossible de mettre à jour la photo.");
    } finally {
      setAvatarUploading(false);
    }
  };

  if (!user || !profileData) {
    return (
      <div className="page-wrap">
        <Header />
        <div className="page-main max-w-5xl mx-auto px-6 py-12 animate-pulse space-y-4">
          <div className="h-8 bg-white/10 rounded w-1/3" />
          <div className="h-48 bg-white/10 rounded-xl" />
        </div>
      </div>
    );
  }

  const initials =
    `${profileData.firstName?.[0] ?? ""}${profileData.lastName?.[0] ?? ""}`.toUpperCase();
  const isPro = profileData.role === "pro";
  const isClient = profileData.role === "client";

  return (
    <div className="page-wrap">
      <Header />

      <PageBanner
        title={`${profileData.firstName} ${profileData.lastName}`}
        subtitle={profileData.email}
      />

      <main className="page-main max-w-5xl mx-auto px-4 md:px-6 py-8 w-full">
        {saveSuccess && (
          <div className="mb-4 alert-success flex items-center gap-2">
            <FiCheck /> Profil mis à jour avec succès
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-5">
            <div className="dark-card rounded-2xl p-6 flex flex-col items-center text-center">
              <div className="relative mb-4">
                {profileData.avatar ? (
                  <img
                    src={imageUrl(profileData.avatar, "avatars")}
                    alt={profileData.firstName}
                    className="w-24 h-24 rounded-2xl object-cover border-4 border-black shadow"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-blue-500/20 border-4 border-black shadow flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-2xl">
                      {initials}
                    </span>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={avatarUploading}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow transition"
                  title="Changer la photo">
                  {avatarUploading ? (
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiCamera size={14} />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {avatarError && (
                <p className="text-xs text-red-500 mb-2 flex items-center gap-1">
                  <FiAlertCircle size={12} /> {avatarError}
                </p>
              )}

              <h2 className="font-bold text-lg text-white">
                {profileData.firstName} {profileData.lastName}
              </h2>
              <p className="text-sm text-zinc-500 mt-0.5">
                {profileData.email}
              </p>

              <span
                className={`mt-2 text-xs px-3 py-1 rounded-full font-medium ${
                  isPro
                    ? "bg-blue-500/15 text-blue-400"
                    : isClient
                      ? "bg-purple-500/15 text-purple-400"
                      : "bg-zinc-500/15 text-zinc-400"
                }`}>
                {isPro ? "Artisan" : isClient ? "Client" : "Admin"}
              </span>

              {isPro && (
                <div className="mt-3 flex items-center gap-1 text-sm text-zinc-400">
                  <span className="text-yellow-400">★</span>
                  <span className="font-medium text-white">
                    {(profileData.ratingAverage ?? 0).toFixed(1)}
                  </span>
                  <span className="text-zinc-500">
                    ({profileData.ratingCount ?? 0} avis)
                  </span>
                </div>
              )}
            </div>

            <div className="dark-card rounded-2xl p-5 space-y-3 text-sm">
              <h3 className="font-semibold text-zinc-300 border-b border-white/10 pb-2">
                Résumé
              </h3>
              {isClient && (
                <div className="flex justify-between text-zinc-400">
                  <span>Demandes publiées</span>
                  <span className="font-medium text-white">{myPosts.length}</span>
                </div>
              )}
              {isPro && (
                <>
                  <div className="flex justify-between text-zinc-400">
                    <span>Offres envoyées</span>
                    <span className="font-medium text-white">{myOffers.length}</span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Missions acceptées</span>
                    <span className="font-medium text-white">
                      {myOffers.filter((o) => o.status === "accepted").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Visites du profil</span>
                    <span className="font-medium text-white">
                      {profileData.profileViewCount ?? 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>Disponibilité</span>
                    <span
                      className={`font-medium ${profileData.availability ? "text-green-400" : "text-zinc-500"}`}>
                      {profileData.availability ? "Disponible" : "Occupé"}
                    </span>
                  </div>
                </>
              )}
              <div className="flex justify-between text-zinc-400">
                <span>Membre depuis</span>
                <span className="font-medium text-white">
                  {new Date(profileData.createdAt).toLocaleDateString("fr-FR", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="dark-card rounded-2xl p-6">
              <div className="flex justify-between items-center mb-5">
                <h2 className="font-semibold text-lg text-white">
                  Informations personnelles
                </h2>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="link-accent flex items-center gap-1.5">
                    <FiEdit2 size={14} /> Modifier
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleCancel}
                      className="btn-secondary flex items-center gap-1 !py-1.5 !px-3">
                      <FiX size={14} /> Annuler
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-1 !py-1.5 !px-3 disabled:opacity-50">
                      <FiCheck size={14} />{" "}
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                )}
              </div>

              {saveError && (
                <div className="mb-4 alert-error flex items-center gap-2">
                  <FiAlertCircle size={14} /> {saveError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  icon={<FiUser size={14} />}
                  label="Prénom"
                  value={form.firstName}
                  editing={editing}
                  onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                />
                <Field
                  icon={<FiUser size={14} />}
                  label="Nom"
                  value={form.lastName}
                  editing={editing}
                  onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                />
                <Field
                  icon={<FiMail size={14} />}
                  label="Email"
                  value={profileData.email}
                  editing={false}
                />
                <Field
                  icon={<FiPhone size={14} />}
                  label="Téléphone"
                  value={form.phone}
                  placeholder="Ajouter un numéro"
                  editing={editing}
                  onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                />
              </div>

              {isPro && (
                <div className="mt-5 pt-5 border-t border-white/10 space-y-4">
                  <h3 className="text-sm font-semibold text-zinc-400 flex items-center gap-1.5">
                    <FiBriefcase size={14} /> Informations professionnelles
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field
                      icon={<FiBriefcase size={14} />}
                      label="Entreprise"
                      value={form.companyName}
                      placeholder="Nom de votre entreprise"
                      editing={editing}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, companyName: v }))
                      }
                    />
                    <Field
                      icon={<FiHash size={14} />}
                      label="RC / SIRET"
                      value={form.siret}
                      placeholder="Numéro d'enregistrement"
                      editing={editing}
                      onChange={(v) => setForm((f) => ({ ...f, siret: v }))}
                    />
                    <Field
                      icon={<FiClock size={14} />}
                      label="Années d'expérience"
                      value={form.experienceYears}
                      placeholder="Ex: 5"
                      type="number"
                      editing={editing}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, experienceYears: v }))
                      }
                    />
                    <div>
                      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-1.5">
                        <FiMapPin size={14} /> Wilaya
                      </label>
                      {editing ? (
                        <select
                          value={form.city}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, city: e.target.value }))
                          }
                          className="select-field">
                          <option value="">Choisir...</option>
                          {WILAYAS.map((w) => (
                            <option key={w} value={w}>
                              {w}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <p className="text-sm text-zinc-200 glass-panel rounded-xl px-4 py-2.5">
                          {form.city || (
                            <span className="text-zinc-500 italic">
                              Non renseignée
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-2">
                      <FiAward size={14} /> Catégories
                    </label>
                    {editing ? (
                      <div className="flex flex-wrap gap-2">
                        {allCategories.map((cat) => {
                          const selected = form.selectedCategories?.includes(
                            cat._id,
                          );
                          return (
                            <button
                              key={cat._id}
                              type="button"
                              onClick={() => {
                                setForm((f) => ({
                                  ...f,
                                  selectedCategories: selected
                                    ? f.selectedCategories.filter(
                                        (id) => id !== cat._id,
                                      )
                                    : [
                                        ...(f.selectedCategories || []),
                                        cat._id,
                                      ],
                                }));
                              }}
                              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
                                selected
                                  ? "bg-blue-600 text-white border-blue-600"
                                  : "bg-white/5 text-zinc-400 border-white/10 hover:border-blue-400"
                              }`}>
                              {cat.name}
                            </button>
                          );
                        })}
                        {allCategories.length === 0 && (
                          <p className="text-sm text-zinc-500 italic">
                            Aucune catégorie disponible
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {profileData.categories?.length > 0 ? (
                          profileData.categories.map((cat) => (
                            <span
                              key={cat._id || cat}
                              className="bg-blue-500/15 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                              {cat.name || cat}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-zinc-500 italic">
                            Aucune catégorie sélectionnée
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${
                      profileData.proStatus === "approved"
                        ? "bg-green-500/10 border-green-500/30"
                        : profileData.proStatus === "rejected"
                          ? "bg-red-500/10 border-red-500/30"
                          : "bg-yellow-500/10 border-yellow-500/30"
                    }`}>
                    <FiShield
                      size={16}
                      className={
                        profileData.proStatus === "approved"
                          ? "text-green-600"
                          : profileData.proStatus === "rejected"
                            ? "text-red-500"
                            : "text-yellow-500"
                      }
                    />
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Statut du compte :{" "}
                        <span
                          className={
                            profileData.proStatus === "approved"
                              ? "text-green-600"
                              : profileData.proStatus === "rejected"
                                ? "text-red-500"
                                : "text-yellow-600"
                          }>
                          {profileData.proStatus === "approved"
                            ? "Approuvé ✓"
                            : profileData.proStatus === "rejected"
                              ? "Refusé"
                              : "En attente de validation"}
                        </span>
                      </p>
                      {profileData.proStatus === "rejected" &&
                        profileData.proRejectionReason && (
                          <p className="text-xs text-red-500 mt-0.5">
                            Motif : {profileData.proRejectionReason}
                          </p>
                        )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide block mb-1.5">
                      Description
                    </label>
                    {editing ? (
                      <textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm((f) => ({
                            ...f,
                            description: e.target.value,
                          }))
                        }
                        rows={4}
                        placeholder="Décrivez votre activité, vos spécialités..."
                        className="input-field resize-none"
                      />
                    ) : (
                      <p className="text-sm text-zinc-400 glass-panel rounded-xl px-4 py-3 min-h-[80px]">
                        {form.description || (
                          <span className="text-zinc-500 italic">
                            Aucune description
                          </span>
                        )}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between glass-panel rounded-xl px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-zinc-200">
                        Disponibilité
                      </p>
                      <p className="text-xs text-zinc-500">
                        Visible par les clients — indisponible si vous êtes
                        déconnecté
                      </p>
                    </div>
                    {editing ? (
                      <button
                        type="button"
                        onClick={() =>
                          setForm((f) => ({
                            ...f,
                            availability: !f.availability,
                          }))
                        }
                        className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border transition ${
                          form.availability
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-white/5 border-white/10 text-zinc-500"
                        }`}>
                        {form.availability ? (
                          <FiToggleRight size={18} />
                        ) : (
                          <FiToggleLeft size={18} />
                        )}
                        {form.availability ? "Disponible" : "Occupé"}
                      </button>
                    ) : (
                      <span
                        className={`text-sm font-medium px-3 py-1.5 rounded-lg ${
                          form.availability
                            ? "bg-green-500/15 text-green-400"
                            : "bg-zinc-500/15 text-zinc-400"
                        }`}>
                        {form.availability ? "Disponible" : "Occupé"}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {isClient && (
              <div className="dark-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                    <FiFileText size={18} className="text-blue-400" />
                    Mes demandes
                    <span className="text-sm font-normal text-zinc-500">
                      ({myPosts.length})
                    </span>
                  </h2>
                  <Link
                    to="/demandes"
                    className="link-accent">
                    Voir tout
                  </Link>
                </div>

                {loadingPosts ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-white/5 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : myPosts.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-zinc-500 text-sm">
                      Vous n'avez pas encore publié de demande.
                    </p>
                    <Link
                      to="/demandes"
                      className="mt-3 inline-block link-accent font-medium">
                      Publier une demande →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myPosts.slice(0, 5).map((post) => {
                      const s =
                        STATUS_LABELS[post.status] ?? STATUS_LABELS.open;
                      return (
                        <Link
                          key={post._id}
                          to={`/demandes/${post._id?.toString()}`}
                          className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/5 transition group">
                          <div className="min-w-0">
                            <p className="font-medium text-sm text-white truncate">
                              {post.title}
                            </p>
                            <div className="flex items-center gap-2 mt-1 text-xs text-zinc-500">
                              {post.location?.city && (
                                <span className="flex items-center gap-0.5">
                                  <FiMapPin size={10} /> {post.location.city}
                                </span>
                              )}
                              <span>
                                {new Date(post.createdAt).toLocaleDateString(
                                  "fr-FR",
                                )}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium ${s.cls}`}>
                              {s.label}
                            </span>
                            <FiChevronRight
                              size={14}
                              className="text-zinc-600 group-hover:text-blue-400 transition"
                            />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {isPro && (
              <div className="dark-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-semibold text-lg text-white">Mes réalisations</h2>
                  <Link
                    to={`/artisan/${user._id}`}
                    className="link-accent">
                    Voir mon profil public →
                  </Link>
                </div>
                <PortfolioFeed proId={user._id} canPost />
              </div>
            )}

            {isPro && (
              <div className="dark-card rounded-2xl p-6">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-semibold text-lg text-white flex items-center gap-2">
                    <FiStar size={18} className="text-blue-400" />
                    Mes offres envoyées
                    <span className="text-sm font-normal text-zinc-500">
                      ({myOffers.length})
                    </span>
                  </h2>
                </div>

                {loadingPosts ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-16 bg-white/5 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                ) : myOffers.length === 0 ? (
                  <div className="text-center py-10">
                    <p className="text-zinc-500 text-sm">
                      Vous n'avez pas encore envoyé d'offre.
                    </p>
                    <Link
                      to="/demandes"
                      className="mt-3 inline-block link-accent font-medium">
                      Parcourir les demandes →
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myOffers.slice(0, 5).map((offer) => (
                      <Link
                        key={offer._id}
                        to={`/demandes/${offer.post?._id?.toString() || offer.post?.toString()}`}
                        className="flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-blue-500/30 hover:bg-white/5 transition group">
                        <div className="min-w-0">
                          <p className="font-medium text-sm text-white truncate">
                            {offer.post?.title || "Demande"}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {offer.message?.slice(0, 60)}…
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                          <span className="text-sm font-semibold text-blue-400">
                            {offer.price?.toLocaleString()} DZD
                          </span>
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              offer.status === "accepted"
                                ? "bg-green-500/15 text-green-400"
                                : offer.status === "rejected"
                                  ? "bg-red-500/15 text-red-400"
                                  : "bg-yellow-500/15 text-yellow-400"
                            }`}>
                            {offer.status === "accepted"
                              ? "Acceptée"
                              : offer.status === "rejected"
                                ? "Refusée"
                                : "En attente"}
                          </span>
                          <FiChevronRight
                            size={14}
                            className="text-zinc-600 group-hover:text-blue-400 transition"
                          />
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Field({
  icon,
  label,
  value,
  editing,
  onChange,
  placeholder = "",
  type = "text",
}) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-500 uppercase tracking-wide flex items-center gap-1 mb-1.5">
        {icon} {label}
      </label>
      {editing && onChange ? (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="input-field"
        />
      ) : (
        <p className="text-sm text-zinc-200 glass-panel rounded-xl px-4 py-2.5">
          {value || (
            <span className="text-zinc-500 italic">{placeholder || "—"}</span>
          )}
        </p>
      )}
    </div>
  );
}
