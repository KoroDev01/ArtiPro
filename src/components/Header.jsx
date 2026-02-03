// import { motion } from "framer-motion";
import { Link } from "react-router";


export default function Header() {
  return (
    <header className="py-4 px-20 flex justify-between bg-white text-black fixed w-full top-0 left-0 z-50 shadow-md items-center">
      <h1 className=" text-white  rounded-[10px] bg-[#155DFC] px-4 py-2 ">
        <a>ArtiPro</a>
      </h1>
      <nav className="flex justify-center">
        <ul className="gap-4 flex justify-center ">
          <li className="flex justify-center items-center hover:text-blue-600">
            <Link to="/">Accueil</Link>
          </li>
          <li className="flex justify-center items-center hover:text-blue-600">
            <Link to="/find-artisan">Trouver un artisan</Link>
          </li>
          <li className="flex justify-center items-center hover:text-blue-600">
            <Link to="/demandes">Demandes</Link>
          </li>
          <li className="flex justify-center items-center hover:text-blue-600">
            <Link to="/how-it-works">Comment ça marche</Link>
          </li>
          <li className="flex justify-center items-center hover:text-blue-600">
            <Link to="/connexion">Connexion</Link>
          </li>
          <li className="hover:bg-[#043579d3] flex justify-center items-center text-white  rounded-[10px] bg-[#155DFC] px-4 py-2">
            <Link to="/Inscription">Inscription</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
