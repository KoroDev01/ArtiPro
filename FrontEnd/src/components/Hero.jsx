import { LuBadgeCheck } from "react-icons/lu";
import { IoDocumentText } from "react-icons/io5";
import { TbClockHour3Filled } from "react-icons/tb";

import Ouvrier from "../assets/img/photo-1678803262992-d79d06dd5d96.jpeg";
export default function Hero() {
  const wilayas = [
    {code : 0, name: "Choisit une wilaya"},
    {code : 1, name: "Adrar"},
    {code : 2, name: "Chlef"},
    {code : 3, name: "Laghouat"},
    {code : 4, name: "Oum El Bouaghi"},
    {code : 5, name: "Batna"},
    {code : 6, name: "Béjaïa"},
    {code : 7, name: "Biskra"},
    {code : 8, name: "Béchar"},
    {code : 9, name: "Blida"},
    {code : 10, name: "Bouira"},
    {code : 11, name: "Tamanrasset"},
    {code : 12, name: "Tébessa"},
    {code : 13, name: "Tlemcen"},
    {code : 14, name: "Tiaret"},
    {code : 15, name: "Tizi Ouzou"},
    {code : 16, name: "Alger"},
    {code : 17, name: "Djelfa"},
    {code : 18, name: "Jijel"},
    {code : 19, name: "Sétif"},
    {code : 20, name: "Saïda"},
    {code : 21, name: "Skikda"},
    {code : 22, name: "Sidi Bel Abbès"},
    {code : 23, name: "Annaba"},
    {code : 24, name: "Guelma"},
    {code : 25, name: "Constantine"},
    {code : 26, name: "Médéa"},
    {code : 27, name: "Mostaganem"},
    {code : 28, name: "M'Sila"},
    {code : 29, name: "Mascara"},
    {code : 30, name: "Ouargla"},
    {code : 31, name: "Oran"},
    {code : 32, name: "El Bayadh"},
    {code : 33, name: "Illizi"},
    {code : 34, name: "Bordj Bou Arréridj"},
    {code : 35, name: "Boumerdès"},
    {code : 36, name: "El Tarf"},
    {code : 37, name: "Tindouf"},
    {code : 38, name: "Tissemsilt"},
    {code : 39, name: "El Oued"},
    {code : 40, name: "Khenchela"},
    {code : 41, name: "Souk Ahras"},
    {code : 42, name: "Tipaza"},
    {code : 43, name: "Mila"},
    {code : 44, name: "Aïn Defla"},
    {code : 45, name: "Naâma"},
    {code : 46, name: "Aïn Témouchent"},
    {code : 47, name: "Ghardaïa"},
    {code : 48, name: "Relizane"}
  ];
  const typesTravaux = [
    "Spécialité des travaux",
    "Plomberie",
    "Électricité",
    "Peinture",
    "Maçonnerie",
    "Menuiserie",
    "Carrelage",
    "Toiture",
    "Jardinage",
    "Nettoyage",
    "Déménagement"
  ];
  return (
    <section className="mt-[72px] min-h-[80vh] bg-[#1854E9] items-center justify-center flex">
      <div className=" px-15 min-height[80vh] flex flex-col justify-center  ">
        <div className="flex py-24 gap-10 text-white items-center ">
          <div className="flex flex-col w-1/2 gap-6 align-center">
            <h2 className="text-6xl">
              Trouvez le bon artisan pour vos travaux
            </h2>
            <p>
              Comparez les devis gratuits de professionnels qualifiés près de
              chez vous
            </p>
            <div className="w-full bg-white h-12 rounded-2xl px-0.5 py-1 flex justify-around ">
              <a
                href="#"
                className=" text-black self-center px-1 rounded-2xl w-12 h-10 flex
               justify-center items-center mr-2 ">
                <i className="fa-solid fa-magnifying-glass "></i>
              </a>
              <select name="typeTravaux" id="typeTravaux" className="border-0 rounded px-2 bg-gray-100 focus-visible:ring-0 text-gray-900 text-[12px] w-full mr-4 grow">
                {typesTravaux.map((type, index) => (
                  <option key={index} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                name="wilaya"
                id="wilayas"
                className="border-0 rounded px-2 bg-gray-100 focus-visible:ring-0 text-gray-900 text-[12px] w-full mr-4 grow">
                {wilayas.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
              <button className="bg-[#155DFC] text-white rounded-[10px] px-8 py-2 mr-4 w-full grow hover:bg-blue-700 hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                Rechercher
              </button>
            </div>
            <div className="flex gap-2 mt-4 justify-between">
              <p className="text-sm text-[16px] flex items-center gap-2 border border-white rounded-[10px] px-3 py-1">
                <LuBadgeCheck className="inline-block text-white text-[20px]" />
                Artisans Vérifiés
              </p>
              <p className="text-sm text-[16px] flex items-center gap-2 border border-white rounded-[10px] px-3 py-1">
                <IoDocumentText className="inline-block text-white text-[20px]" />
                Devis Gratuits
              </p>
              <p className="text-sm text-[16px] flex items-center gap-2 border border-white rounded-[10px] px-3 py-1">
                <TbClockHour3Filled className="inline-block text-white text-[20px]" />
                Service Rapide
              </p>
            </div>
          </div>
          <div className="w-[70%] flex justify-end ">
            <img
              src={Ouvrier}
              className="rounded-2xl shadow-2xl w-full object-cover h-[500px] "
              alt="Hero Image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
