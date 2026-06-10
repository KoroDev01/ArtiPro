import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-8">

          <div className="flex flex-col items-center sm:items-start gap-3 text-center sm:text-left">
            <Link
              to="/"
              className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition">
              ArtiPro
            </Link>
            <p className="text-gray-400 text-sm max-w-xs">
              La plateforme qui connecte les particuliers aux meilleurs artisans
              d'Algérie.
            </p>

            <div className="flex items-center gap-3 mt-1">
              {[
                { icon: <FaFacebookF size={14} />, href: "#" },
                { icon: <FaXTwitter size={14} />, href: "#" },
                { icon: <FaInstagram size={14} />, href: "#" },
                { icon: <FaLinkedin size={14} />, href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  className="w-8 h-8 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-gray-400 hover:text-white transition">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-center sm:justify-end gap-x-10 gap-y-6">
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Plateforme
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    to="/find-artisan"
                    className="hover:text-white transition">
                    Trouver un artisan
                  </Link>
                </li>
                <li>
                  <Link to="/demandes" className="hover:text-white transition">
                    Publier une demande
                  </Link>
                </li>
                <li>
                  <Link to="/SignIn" className="hover:text-white transition">
                    Devenir artisan
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
                Légal
              </h3>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>
                  <Link
                    to="/mentions-legales"
                    className="hover:text-white transition">
                    Mentions légales
                  </Link>
                </li>
                <li>
                  <Link
                    to="/confidentialite"
                    className="hover:text-white transition">
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link to="/cgu" className="hover:text-white transition">
                    CGU
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} ArtiPro. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
