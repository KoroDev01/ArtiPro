import React from "react";

export default function Login() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="flex w-[1200px] h-[700px]">
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
          <div className="bg-white w-[420px] p-10 rounded-2xl shadow-sm">
            {/* Logo */}
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg mb-6">
              ArtiPro
            </button>

            <h2 className="text-2xl font-semibold mb-2">Bienvenue</h2>
            <p className="text-gray-500 text-sm mb-6">
              Connectez-vous ou créez un compte pour continuer
            </p>

            {/* Switch */}
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

              <div className="flex justify-between items-center text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" />
                  Se souvenir de moi
                </label>
                <a href="/" className="text-blue-600">
                  Mot de passe oublié ?
                </a>
              </div>

              <button className="w-full bg-blue-600 text-white py-2 rounded-lg mt-2 hover:bg-blue-700 transition">
                Se connecter
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

            {/* Signup */}
            <p className="text-center text-sm mt-6">
              Pas encore de compte ?{" "}
              <a href="/" className="text-blue-600">
                Inscrivez-vous
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
