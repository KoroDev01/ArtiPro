import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuBadgeCheck } from "react-icons/lu";
import { IoDocumentText } from "react-icons/io5";
import { TbClockHour3Filled } from "react-icons/tb";
import { WILAYAS } from "../data/wilaya";
import api from "../api";
import Ouvrier from "../assets/img/photo-1678803262992-d79d06dd5d96.jpeg";

export default function Hero() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");

  useEffect(() => {
    api
      .get("/categories")
      .then((r) => setCategories(Array.isArray(r.data) ? r.data : []))
      .catch(() => {});
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedWilaya) params.set("city", selectedWilaya);
    navigate(`/find-artisan?${params.toString()}`);
  };

  return (
    <section className="mt-16 bg-[#1854E9] min-h-[85vh] flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-16">
        <div className="flex flex-col md:flex-row gap-10 md:gap-12 items-center">

          <div className="flex flex-col gap-5 text-white w-full md:w-1/2 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Trouvez le bon artisan pour vos travaux
            </h1>
            <p className="text-blue-100 text-base sm:text-lg">
              Comparez les devis gratuits de professionnels qualifiés près de
              chez vous
            </p>

            <div className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Spécialité des travaux</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <select
                value={selectedWilaya}
                onChange={(e) => setSelectedWilaya(e.target.value)}
                className="flex-1 text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50">
                <option value="">Choisir une wilaya</option>
                {WILAYAS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2.5 text-sm font-semibold transition whitespace-nowrap">
                Rechercher
              </button>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
              {[
                {
                  icon: <LuBadgeCheck className="text-lg" />,
                  label: "Artisans Vérifiés",
                },
                {
                  icon: <IoDocumentText className="text-lg" />,
                  label: "Devis Gratuits",
                },
                {
                  icon: <TbClockHour3Filled className="text-lg" />,
                  label: "Service Rapide",
                },
              ].map((b) => (
                <span
                  key={b.label}
                  className="flex items-center gap-1.5 border border-white/40 rounded-xl px-3 sm:px-4 py-2 text-xs sm:text-sm backdrop-blur-sm bg-white/10">
                  {b.icon} {b.label}
                </span>
              ))}
            </div>
          </div>

          <div className="w-full md:w-1/2 hidden sm:block">
            <img
              src={Ouvrier}
              className="rounded-2xl shadow-2xl w-full object-cover h-64 sm:h-80 md:h-[460px]"
              alt="Artisan au travail"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
