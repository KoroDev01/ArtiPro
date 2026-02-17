import React from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function JobRequests() {
  return (
    <>
      <Header />

      <main className="mt-[72px]bg-gray-50 min-h-screen">
        {/* Title */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-3xl font-bold">Demandes de Travaux</h1>
          <p className="text-gray-500 mt-2">
            Trouvez des projets à réaliser dans votre région
          </p>
        </section>

        {/* Filters */}
        <section className="max-w-7xl mx-auto px-6">
          <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-4 items-center">
            <span className="text-gray-400">🔍</span>

            <select className="w-full md:w-auto border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Toutes les catégories</option>
            </select>

            <select className="w-full md:w-auto border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Toutes les wilayas</option>
            </select>

            <select className="w-full md:w-auto border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Ouvert</option>
              <option>Fermé</option>
            </select>
          </div>
        </section>

        {/* Job cards */}
        <section className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    🔧
                  </div>

                  <div>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Plomberie
                    </span>
                    <h3 className="font-semibold mt-1">Test Job Request</h3>
                  </div>
                </div>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Ouvert
                </span>
              </div>

              <p className="text-sm text-gray-600">
                This is a test job request for plumbing work
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 Alger</span>
                <span>💰 5 000 DZD</span>
                <span>📅 2025-02-15</span>
              </div>

              <hr />

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                    T
                  </div>
                  <span>Test User</span>
                </div>

                <span className="text-gray-400">28 janvier 2026</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                    🔧
                  </div>

                  <div>
                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full">
                      Plomberie
                    </span>
                    <h3 className="font-semibold mt-1">Test Job Request</h3>
                  </div>
                </div>

                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  Ouvert
                </span>
              </div>

              <p className="text-sm text-gray-600">
                This is a test job request for plumbing work
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                <span>📍 Alger</span>
                <span>💰 5 000 DZD</span>
                <span>📅 2025-02-15</span>
              </div>

              <hr />

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold">
                    T
                  </div>
                  <span>Test User</span>
                </div>

                <span className="text-gray-400">28 janvier 2026</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
