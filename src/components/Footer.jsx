import { FaFacebookF } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <section>
      <div className="bg-gray-800 text-white py-8 flex justify-between px-10 items-center ">
        <div>
          <h1 className="bg-white rounded w-22 py-1 mb-5 px-2 text-xl text-blue-400">
            ArtiPro
          </h1>
          <p className="text-[13px]">
            La plateforme qui connecte les particuliers aux meilleurs artisans
            de France.
          </p>
          <div className="flex space-x-4 mt-4 text-[20px] ">
            <FaFacebookF />
            <FaTwitter />
            <FaInstagram />
            <FaLinkedin />
          </div>
        </div>
        <div>
          <h2 className="text-[20px]">Services</h2>
          <ul className="text-[12px]">
            <li>Plomberie</li>
            <li>Électricité</li>
            <li>Menuiserie</li>
            <li>Peinture</li>
            <li>Maçonnerie</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[20px]">Entreprise</h2>
          <ul className="text-[13px]">
            <li>À propos </li>
            <li>Comment ça marche</li>
            <li>Blog</li>
            <li>Carriéres</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h2 className="text-[20px]">Légal</h2>
          <ul className="text-[13px]">
            <li>Mentions légales</li>
            <li>Conditions d'utilisation</li>
            <li>Politique de confidentialité</li>
            <li>Cookies</li>
          </ul>
        </div>
      </div>
      <div className="bg-gray-800 text-white py-8 flex justify-center px-10 items-center ">
        <p className="pt-5 border-t-2 w-full border-gray-600 text-center">
          © 2025 ArtiPro. Tous droits réservés.
        </p>
      </div>
    </section>
  );
}
