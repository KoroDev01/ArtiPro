// import { motion } from "framer-motion";
import { Link } from "react-router";

export default function Header() {
  return (
    <div className="w-full  justify-center items-center ">
      <header className="w-full py-4 px-20 flex justify-between bg-white text-black fixed top-0 left-1/2 transform -translate-x-1/2 shadow-md items-center">
        <div className="flex items-center gap-8 justify-between mx-auto w-7xl">
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
                <Link to="/Login">Connexion</Link>
              </li>
              <li className="hover:bg-[#043579d3] flex justify-center items-center text-white  rounded-[10px] bg-[#155DFC] px-4 py-2">
                <Link to="/SignIn">Inscription</Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </div>
  );
}
