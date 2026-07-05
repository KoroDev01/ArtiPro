import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FiArrowUpRight } from "react-icons/fi";

const SOCIAL = [
  {
    icon: FaFacebookF,
    href: "https://www.facebook.com/outlast.rust.9/",
    label: "Facebook",
  },
  { icon: FaXTwitter, href: "https://x.com/KoroSukuna", label: "X" },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/_fm28s/",
    label: "Instagram",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/faiz-abdelhakim-mali-4255932ab/",
    label: "LinkedIn",
  },
];

const LINKS = {
  Plateforme: [
    { to: "/showroom", label: "Réalisations" },
    { to: "/demandes", label: "Publier une demande" },
    { to: "/SignIn", label: "Devenir artisan" },
  ],
  Support: [{ to: "/contact", label: "Nous contacter" }],
  Légal: [
    { to: "/mentions-legales", label: "Mentions légales" },
    { to: "/confidentialite", label: "Confidentialité" },
    { to: "/cgu", label: "CGU" },
  ],
};

export default function Footer() {
  return (
    <footer className="site-footer relative mt-auto text-white">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/35 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 pb-8 pt-14 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8">
        <div className="site-footer-inner rounded-3xl p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
            {/* Brand */}
            <div className="flex flex-col items-center gap-5 text-center lg:max-w-sm lg:items-start lg:text-left">
              <Link to="/" className="group inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition group-hover:scale-105">
                  A
                </span>
                <span className="text-xl font-bold tracking-tight text-white">
                  ArtiPro
                </span>
              </Link>

              <p className="text-sm leading-relaxed text-zinc-400">
                La plateforme qui connecte les particuliers aux meilleurs
                artisans d&apos;Algérie — simplement, rapidement, en toute
                confiance.
              </p>

              <div className="flex items-center gap-2.5">
                {SOCIAL.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="footer-social">
                    <Icon size={15} />
                  </a>
                ))}
              </div>

              <Link
                to="/showroom"
                className="btn-primary hidden text-sm sm:inline-flex lg:mt-1">
                Voir les réalisations
                <FiArrowUpRight size={15} />
              </Link>
            </div>

            {/* Links */}
            <div className="grid w-full grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-10 lg:w-auto lg:min-w-[420px]">
              {Object.entries(LINKS).map(([title, items]) => (
                <div key={title}>
                  <h3 className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-blue-300/80">
                    <span className="h-1 w-1 rounded-full bg-blue-400" />
                    {title}
                  </h3>
                  <ul className="space-y-3">
                    {items.map((item) => (
                      <li key={item.to}>
                        <Link to={item.to} className="footer-link group">
                          <span className="h-px w-0 bg-blue-400 transition-all duration-200 group-hover:w-3" />
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row">
            <p className="text-xs text-zinc-500">
              © {new Date().getFullYear()} ArtiPro. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4 text-xs text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
                Artisans vérifiés
              </span>
              <span className="hidden h-3 w-px bg-white/10 sm:block" />
              <span className="hidden sm:inline">Algérie 🇩🇿</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
