import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useState } from "react"; // Ajout de useState pour gérer l'état
import {Link} from 'react-router-dom'
export default function Artisant() {
  const [selectedFilter, setSelectedFilter] = useState("Par defaut");
  const [selectedSpecialite, setSelectedSpecialite] = useState("Tous");
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const filtreBy = [
    "Par defaut",
    "Prix croissant",
    "Prix décroissant",
    "Popularité",
    "Nouveauté",
    "Prix",
    "Proximité",
    "Certification",
  ];

  const filtreSpecialite = [
    "Tous",
    "Plomberie",
    "Électricité",
    "Menuiserie",
    "Peinture",
    "Maçonnerie",
    "Toiture",
    "Jardinage",
    "Nettoyage",
  ];

  // Données d'exemple pour les artisans
  const artisans = [
    {
      id: 1,
      name: "Jean Dupont",
      specialite: "Plomberie",
      rating: 4.8,
      price: 45,
      certified: true,
    },
    {
      id: 2,
      name: "Marie Lambert",
      specialite: "Électricité",
      rating: 4.9,
      price: 50,
      certified: true,
    },
    {
      id: 3,
      name: "Pierre Martin",
      specialite: "Menuiserie",
      rating: 4.7,
      price: 55,
      certified: false,
    },
    {
      id: 4,
      name: "Sophie Bernard",
      specialite: "Peinture",
      rating: 4.6,
      price: 40,
      certified: true,
    },
    {
      id: 5,
      name: "Thomas Leroy",
      specialite: "Maçonnerie",
      rating: 4.5,
      price: 60,
      certified: true,
    },
    {
      id: 6,
      name: "Julie Petit",
      specialite: "Jardinage",
      rating: 4.4,
      price: 35,
      certified: false,
    },
  ];

  return (
    <section className="bg-[#F9FAFB] min-h-screen">
      <Header />
      <div className="mt-[72px]"></div> {/* Espace pour le header fixe */}
      {/* Section Hero */}
      <section className="find-artisant">
        <div className="bg-blue-500 p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl lg:text-[32px] font-bold mb-4">
            Trouver un artisan
          </h2>
          <p className="text-lg md:text-xl">
            Plus de 12 000 professionnels qualifiés à votre service
          </p>
        </div>
      </section>
      {/* Section Filtres Principaux */}
      <section className="artisants-filtre bg-white shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 md:p-6 px-4 md:px-15 max-w-7xl mx-auto">
          <input
            className="border border-gray-200 p-3 md:col-span-5 lg:col-span-4 bg-[#F3F3F5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Rechercher un artisan, une compétence..."
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <input
            className="border border-gray-200 p-3 md:col-span-3 bg-[#F3F3F5] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Ville, code postal..."
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />

          <select
            className="bg-blue-600 text-white rounded-lg p-3 text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-300 md:col-span-4 lg:col-span-3"
            name="filter"
            id="filter"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}>
            {filtreBy.map((filtre, index) => (
              <option
                key={index}
                value={filtre}
                className={`${selectedFilter === filtre ? "bg-white text-black" : "hover:bg-gray-100"}`}>
                {filtre}
              </option>
            ))}
          </select>

          <button className="bg-blue-700 hover:bg-blue-800 text-white font-medium py-3 px-6 rounded-lg text-sm transition duration-200 md:col-span-12 lg:col-span-2">
            Rechercher
          </button>
        </div>
      </section>
      {/* Section Contenu Principal */}
      <section className="p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto my-6">
        {/* Sidebar Filtres */}
        <div className="lg:col-span-3 bg-white border border-gray-200 rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-lg font-semibold mb-6 pb-3 border-b">Filtres</h2>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Spécialité
            </h3>
            <select
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              name="specialite"
              id="specialite"
              value={selectedSpecialite}
              onChange={(e) => setSelectedSpecialite(e.target.value)}>
              {filtreSpecialite.map((specialite, index) => (
                <option
                  key={index}
                  value={specialite}
                  className={`${selectedSpecialite === specialite ? "bg-white text-black" : ""}`}>
                  {specialite}
                </option>
              ))}
            </select>
          </div>

          {/* Filtres supplémentaires */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Disponibilité
            </h3>
            <div className="space-y-2">
              {["Immédiate", "Sous 48h", "Sous 1 semaine"].map(
                (option, index) => (
                  <label
                    key={index}
                    className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600" />
                    <span className="text-sm">{option}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Certification
            </h3>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" className="rounded text-blue-600" />
              <span className="text-sm">Artisans certifiés uniquement</span>
            </label>
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg text-sm transition duration-200">
            Appliquer les filtres
          </button>
        </div>

        {/* Liste des Artisans */}
        <div className="lg:col-span-9">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedSpecialite === "Tous"
                ? "Tous les artisans"
                : `Artisans en ${selectedSpecialite}`}
              <span className="text-gray-600 text-sm ml-2">
                ({artisans.length} résultats)
              </span>
            </h2>
            <div className="text-sm text-gray-600">
              Tri: <span className="font-medium">{selectedFilter}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artisans.map((artisan) => (
              <div
                key={artisan.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200">
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold">
                        {artisan.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    {artisan.certified && (
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded">
                        Certifié
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{artisan.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {artisan.specialite}
                  </p>

                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-2">
                      {"★".repeat(Math.floor(artisan.rating))}
                      <span className="text-gray-300">
                        {"★".repeat(5 - Math.floor(artisan.rating))}
                      </span>
                    </div>
                    <span className="text-sm font-medium">
                      {artisan.rating}/5
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-2xl font-bold">
                        {artisan.price}€
                      </span>
                      <span className="text-gray-600 text-sm ml-1">/heure</span>
                    </div>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm transition duration-200">
                      Contacter
                    </button>
                  </div>
                </div>

                <div className="border-t border-gray-100 p-3 bg-gray-50">
                  <Link to={`/artisan/${artisan.id}`}>
                    <button className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm">
                      Voir le profil complet
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>


        </div>
      </section>
      <Footer />
    </section>
  );
}
