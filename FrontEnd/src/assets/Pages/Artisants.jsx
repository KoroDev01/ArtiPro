import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
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
      <span className="text-gray-200">
        {"★".repeat(5 - Math.floor(rating))}
      </span>
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <section className="mt-16 bg-blue-600 py-8 sm:py-10 px-4 sm:px-6 text-white text-center">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">Trouver un artisan</h1>
        <p className="text-blue-100 text-sm">
          {sorted.length} professionnel{sorted.length !== 1 ? "s" : ""} qualifié
          {sorted.length !== 1 ? "s" : ""} disponible
          {sorted.length !== 1 ? "s" : ""}
        </p>
      </section>

      <section className="bg-white border-b border-gray-100 shadow-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 space-y-3">
          <div className="relative w-full">
            <FiSearch
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={15}
            />
            <input
              className="w-full border border-gray-200 pl-9 pr-3 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nom, compétence..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-3">
            <select
              className="flex-1 min-w-0 sm:flex-none sm:min-w-[180px] border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
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
                  : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
              }`}>
              <FiSliders size={15} />
              Filtres
              {activeFilterCount > 0 && (
                <span className="bg-white text-blue-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>

            <button
              onClick={fetchPros}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 sm:px-5 rounded-xl text-sm transition">
              Rechercher
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="flex-1 min-w-0">
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Spécialité
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">
                Wilaya
              </label>
              <select
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
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
              <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
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
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 font-medium pb-0.5">
                <FiX size={14} /> Réinitialiser
              </button>
            )}
          </div>
        )}

        {activeFilterCount > 0 && !showFilters && (
          <div className="max-w-7xl mx-auto px-4 md:px-6 pb-3 flex flex-wrap gap-2">
            {selectedCat && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                {categories.find((c) => c._id === selectedCat)?.name ||
                  "Catégorie"}
                <button onClick={() => setSelectedCat("")}>
                  <FiX size={11} />
                </button>
              </span>
            )}
            {selectedCity && (
              <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                📍 {selectedCity}
                <button onClick={() => setSelectedCity("")}>
                  <FiX size={11} />
                </button>
              </span>
            )}
            {onlyAvailable && (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs px-3 py-1 rounded-full font-medium">
                Disponibles
                <button onClick={() => setOnlyAvailable(false)}>
                  <FiX size={11} />
                </button>
              </span>
            )}
          </div>
        )}
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-6 py-8 w-full">
        {loading && (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 animate-pulse flex gap-3 sm:gap-4">
                <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && sorted.length === 0 && (
          <EmptyState
            preset="artisans"
            className="bg-white rounded-2xl border border-gray-100"
          />
        )}

        {!loading && !error && sorted.length > 0 && (
          <div className="space-y-3 sm:space-y-4">
            {sorted.map((artisan) => {
              const rating = artisan.ratingAverage ?? 0;
              const available = artisan.availability !== false;

              return (
                <div
                  key={artisan._id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-3 sm:gap-5">
                    <div className="flex-shrink-0">
                      <UserAvatar user={artisan} size="card" square />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-start">
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base font-bold text-gray-900 truncate">
                            {artisan.firstName} {artisan.lastName}
                          </h3>
                          {artisan.companyName && (
                            <p className="text-gray-400 text-xs mt-0.5 truncate">
                              {artisan.companyName}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 sm:flex-shrink-0">
                          {artisan.isVerified && (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                              <FiCheckCircle size={11} /> Vérifié
                            </span>
                          )}
                          <span
                            className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                              available
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-500"
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
                              className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                              {c.name}
                            </span>
                          ))}
                          {artisan.categories.length > 3 && (
                            <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
                              +{artisan.categories.length - 3}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-2 sm:mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-gray-500">
                        <div className="flex items-center gap-1.5">
                          <Stars rating={rating} />
                          <span className="font-semibold text-gray-700">
                            {rating.toFixed(1)}
                          </span>
                          <span className="text-gray-400">
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
                        <p className="mt-2 text-xs text-gray-400 line-clamp-2 sm:line-clamp-1 hidden sm:block">
                          {artisan.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-50 flex justify-stretch sm:justify-end">
                    <Link
                      to={`/artisan/${artisan._id?.toString()}`}
                      className="w-full sm:w-auto text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl text-sm transition">
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
