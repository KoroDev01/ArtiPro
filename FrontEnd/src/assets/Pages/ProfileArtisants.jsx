import React from "react";
import Header from "../../components/Header.jsx";
import { Link } from "react-router-dom";
export default function ArtisanProfile() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header />

      {/* Main */}
      <main className="flex-1 mt-[72px] max-w-7xl mx-auto px-6 py-8 w-full">
        <Link to="/find-artisan" className="text-sm text-gray-500 hover:text-blue-600 mb-4 inline-block">
          ← Retour aux artisans
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow">
            {/* Banner */}
            <div className="h-32 bg-gradient-to-right from-blue-700 to-blue-500 rounded-t-xl" />

            <div className="p-6 -mt-12">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-blue-400 border-4 border-white flex items-center justify-center text-2xl font-bold text-blue-700">
                  T
                </div>

                <div>
                  <h1 className="text-xl font-semibold">Test User</h1>
                  <div className="text-sm text-gray-500 flex gap-3 items-center mt-1">
                    <span>🔧 Plomberie</span>
                    <span>📍 Alger</span>
                    <span className="flex items-center gap-1">
                      ⭐ 0.0 <span className="text-gray-400">(0 avis)</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-4 mt-6 text-sm">
                <button className="px-4 py-1 rounded-full bg-gray-100 font-medium">
                  À propos
                </button>
                <button className="text-gray-500 hover:text-blue-600">
                  Portfolio
                </button>
                <button className="text-gray-500 hover:text-blue-600">
                  Avis (0)
                </button>
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="font-semibold mb-2">Description</h2>
                <p className="text-sm text-gray-600">
                  Plombier expérimenté avec 10 ans d&apos;expérience
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <InfoCard title="Expérience" value="10 ans" icon="🧰" />
                  <InfoCard title="Tarif horaire" value="2000 DZD" icon="⏱️" />
                  <InfoCard title="Projets" value="0+" icon="📁" />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-xl shadow p-6 h-fit">
            <h2 className="font-semibold mb-4">Contacter l&apos;artisan</h2>

            <textarea
              placeholder="Décrivez votre projet..."
              className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              rows={5}
            />

            <button className="w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full flex items-center justify-center gap-2">
              💬 Envoyer un message
            </button>

            <p className="text-xs text-center text-gray-500 mt-2">
              Réponse généralement sous 24h
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-neutral-900 text-gray-300 mt-12">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-white mb-2">DzArtisan</h3>
            <p className="text-sm text-gray-400">
              La plateforme de référence pour trouver des artisans qualifiés en
              Algérie.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Navigation</h4>
            <ul className="text-sm space-y-1">
              <li>Trouver un Artisan</li>
              <li>Demandes de Travaux</li>
              <li>Devenir Artisan</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-2">Contact</h4>
            <p className="text-sm">contact@dzartisan.dz</p>
            <p className="text-sm">+213 555 123 456</p>
            <p className="text-sm">Alger, Algérie</p>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500 py-4 border-t border-gray-700">
          © 2026 DzArtisan. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
}

function InfoCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 flex items-center gap-3">
      <span className="text-xl">{icon}</span>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <p className="font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}
