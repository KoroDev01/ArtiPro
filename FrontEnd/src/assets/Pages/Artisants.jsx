import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import PageBanner from "../../components/PageBanner";
import api from "../../api";
import UserAvatar from "../../components/UserAvatar";
import EmptyState from "../../components/EmptyState";
import { WILAYAS } from "../../data/wilaya";
import {
  FiMapPin,
  FiStar,
  FiCheckCircle,
  FiClock,
  FiSearch,
  FiSliders,
  FiX,
} from "react-icons/fi";

export default function Artisant() {
  const [searchParams] = useSearchParams();

  const [artisans, setArtisans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState(
    searchParams.get("city") || "",
  );
  const [selectedCat, setSelectedCat] = useState(
    searchParams.get("category") || "",
  );
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCategories(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});
  }, []);

  const fetchPros = () => {
    setLoading(true);
    setError("");
    const params = {};
    if (selectedCat) params.category = selectedCat;
    if (selectedCity) params.city = selectedCity;
    if (onlyAvailable) params.available = "true";
    api
      .get("/pros/search", { params })
      .then((res) => setArtisans(Array.isArray(res.data) ? res.data : []))
      .catch(() => setError("Impossible de charger les artisans."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const city = searchParams.get("city") || "";
    const cat = searchParams.get("category") || "";
    setSelectedCity(city);
    setSelectedCat(cat);
  }, [searchParams]);

  useEffect(() => {
    fetchPros();
  }, [selectedCat, selectedCity, onlyAvailable]);

  const filtered = artisans.filter((a) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      a.firstName?.toLowerCase().includes(q) ||
      a.lastName?.toLowerCase().includes(q) ||
      a.companyName?.toLowerCase().includes(q) ||
      a.categories?.some((c) => c.name?.toLowerCase().includes(q))
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "rating_desc")
      return (b.ratingAverage ?? 0) - (a.ratingAverage ?? 0);
    if (sortBy === "rating_asc")
      return (a.ratingAverage ?? 0) - (b.ratingAverage ?? 0);
    if (sortBy === "exp_desc")
      return (b.experienceYears ?? 0) - (a.experienceYears ?? 0);
    return 0;
  });

  const activeFilterCount = [selectedCat, selectedCity, onlyAvailable].filter(
    Boolean,
  ).length;

  const resetFilters = () => {
    setSelectedCat("");
    setSelectedCity("");
    setOnlyAvailable(false);
  };

  const Stars = ({ rating = 0 }) => (
    <span className="text-yellow-400 text-sm">
      {"★".repeat(Math.floor(rating))}
      <span className="text-zinc-700">
        {"★".repeat(5 - Math.floor(rating))}
      </span>
    </span>
  );

  return (
    <div className="page-wrap">
      <Header />

      <PageBanner
        title="Trouver un artisan"
        subtitle={`${sorted.length} professionnel${sorted.length !== 1 ? "s" : ""} qualifié${sorted.length !== 1 ? "s" : ""} disponible${sorted.length !== 1 ? "s" : ""}`}
      />

      <section className="dark-card border-b border-white/10 sticky top-16 z-30 !rounded-none">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 space-y-3">
          <div className="relative w-full">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
              size={15}
            />
            <input
              className="input-field pl-9"
              placeholder="Nom, compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              className="select-field flex-1 min-w-0 sm:flex-none sm:min-w-[180px]"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}>
              <option value="default">Trier par défaut</option>
              <option value="rating_desc">Meilleures notes</option>
              <option value="rating_asc">Notes croissantes</option>
              <option value="exp_desc">Plus expérimentés</option>
            </select>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl border text-sm font-medium transition flex-shrink-0 ${
                showFilters || activeFilterCount > 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "btn-secondary"
              }`}>
              <FiSliders size={15} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button onClick={fetchPros} className="btn-primary flex-1 sm:flex-none">
              Rechercher
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex-1 min-w-0">
              <label className="label-field mb-1.5 block text-xs">
                Spécialité
              </label>
              <select
                className="select-field"
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}>
                <option value="">Toutes les spécialités</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 min-w-0">
              <label className="label-field mb-1.5 block text-xs">
                Wilaya
              </label>
              <select
                className="select-field"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}>
                <option value="">Toutes les wilayas</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-1 flex items-center gap-2 pb-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-300">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={(e) => setOnlyAvailable(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4"
                />
                Disponibles uniquement
              </label>
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 font-medium pb-0.5">
                <FiX size={14} /> Réinitialiser
              </button>
            )}
          </div>
        )}

        {activeFilterCount > 0 && !showFilters && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-3 flex flex-wrap gap-2">
            {selectedCat && (
              <span className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                {categories.find((c) => c._id === selectedCat)?.name ||
                  "Catégorie"}
                <button onClick={() => setSelectedCat("")}>
                  <FiX size={11} />
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="flex items-center gap-1.5 bg-blue-500/20 text-blue-400 text-xs px-3 py-1 rounded-full font-medium">
                📍 {selectedCity}
                <button onClick={() => setSelectedCity("")}>
                  <FiX size={11} />
                </button>
              </span>
            )}
            {onlyAvailable && (
              <span className="flex items-center gap-1.5 bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full font-medium">
                Disponibles
                <button onClick={() => setOnlyAvailable(false)}>
                  <FiX size={11} />
                </button>
              </span>
            )}
          </div>
        )}
      </section>

      <main className="page-main flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="dark-card rounded-2xl p-4 sm:p-6 animate-pulse flex gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-white/10 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-white/10 rounded w-1/3" />
                  <div className="h-3 bg-white/5 rounded w-1/2" />
                  <div className="h-3 bg-white/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && <div className="alert-error">{error}</div>}

        {!loading && !error && sorted.length === 0 && (
          <EmptyState preset="artisans" className="dark-card rounded-2xl" />
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {sorted.map((artisan) => {
              const rating = artisan.ratingAverage ?? 0;
              const available =
                artisan.effectiveAvailability ??
                artisan.availability !== false;

              return (
                <div
                  key={artisan._id}
                  className="dark-card rounded-2xl p-4 sm:p-6">
                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0">
                      <UserAvatar user={artisan} size="card" square />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {artisan.firstName} {artisan.lastName}
                          </h3>
                          {artisan.companyName && (
                            <p className="text-zinc-500 text-xs mt-0.5 truncate">
                              {artisan.companyName}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:flex-shrink-0">
                          {artisan.isVerified && (
                            <span className="flex items-center gap-1 text-green-400 text-xs font-medium bg-green-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">
                              <FiCheckCircle size={11} /> Vérifié
                            </span>
                          )}
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                              available
                                ? "bg-green-500/20 text-green-400"
                                : "bg-zinc-500/20 text-zinc-400"
                            }`}>
                            {available ? "Disponible" : "Occupé"}
                          </span>
                        </div>
                      </div>

                      {artisan.categories?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {artisan.categories.slice(0, 3).map((c) => (
                            <span
                              key={c._id}
                              className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                              {c.name}
                            </span>
                          ))}
                          {artisan.categories.length > 3 && (
                            <span className="text-xs bg-white/10 text-zinc-500 px-2 py-0.5 rounded-full">
                              +{artisan.categories.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-zinc-500">
                        <div className="flex items-center gap-1.5">
                          <Stars rating={rating} />
                          <span className="font-semibold text-zinc-300">
                            {rating.toFixed(1)}
                          </span>
                          <span className="text-zinc-500">
                            ({artisan.ratingCount ?? 0})
                          </span>
                        </div>
                        {artisan.experienceYears != null && (
                          <span className="flex items-center gap-1">
                            <FiClock className="text-blue-400 flex-shrink-0" size={13} />
                            {artisan.experienceYears} ans
                          </span>
                        )}
                        {artisan.location?.city && (
                          <span className="flex items-center gap-1 min-w-0">
                            <FiMapPin className="text-blue-400 flex-shrink-0" size={13} />
                            <span className="truncate">{artisan.location.city}</span>
                          </span>
                        )}
                      </div>

                      {artisan.description && (
                        <p className="mt-2 text-xs text-zinc-500 line-clamp-2 sm:line-clamp-1 hidden sm:block">
                          {artisan.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10 flex justify-stretch sm:justify-end">
                    <Link
                      to={`/artisan/${artisan._id?.toString()}`}
                      className="btn-primary w-full sm:w-auto">
                      Voir le profil →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
