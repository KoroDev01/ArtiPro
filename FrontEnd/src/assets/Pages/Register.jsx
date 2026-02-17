import React from "react";

export default function Register() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-[1200px] h-[750px]">
        {/* Image Left */}
        <div className="w-1/2 flex items-center justify-center">
          <img
            src="/src/assets/img/photo-1678803262992-d79d06dd5d96.jpeg"
            alt="chantier"
            className="w-[85%] h-[90%] object-cover rounded-2xl shadow-lg"
          />
        </div>

        {/* Form Right */}
        <div className="w-1/2 flex items-center justify-center">
          <div className="bg-white w-[450px] p-10 rounded-2xl shadow-sm">
            {/* Logo */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6">
              ArtiPro
            </button>

            <h2 className="text-2xl font-semibold mb-2">Créer un compte</h2>
            <p className="text-gray-500 text-sm mb-6">
              Inscrivez-vous pour commencer à utiliser la plateforme
            </p>

            {/* Switch Client / Artisan */}
            <div className="flex bg-gray-100 rounded-full p-1 mb-6">
              <button className="flex-1 bg-white rounded-full py-2 text-sm shadow">
                Client
              </button>
              <button className="flex-1 py-2 text-sm text-gray-500">
                Artisan
              </button>
            </div>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm">Nom complet</label>
                <input
                  type="text"
                  placeholder="Votre nom"
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  placeholder="votre@email.com"
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm">Mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm">Confirmer mot de passe</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full mt-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-start gap-2 text-sm">
                <input type="checkbox" className="mt-1" />
                <span>
                  J'accepte les{" "}
                  <a href="/" className="text-blue-600">
                    conditions d'utilisation
                  </a>
                </span>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
                S'inscrire
              </button>
            </div>

            {/* Divider */}
            <div className="my-6 text-center text-gray-400 text-sm">
              Ou continuer avec
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 border py-2 rounded-lg hover:bg-gray-50">
                Google
              </button>
              <button className="flex-1 border py-2 rounded-lg hover:bg-gray-50">
                Facebook
              </button>
            </div>

            {/* Login Link */}
            <p className="text-center text-sm mt-6">
              Déjà un compte ?{" "}
              <a href="/login" className="text-blue-600">
                Connectez-vous
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
