import plombier from "../assets/img/plombierTest.jpg";
import elec from "../assets/img/ElecTest.jpg";
import peintre from "../assets/img/PeintreTest.jpg";
import { FaStar } from "react-icons/fa";

export default function ArtiMenu() {
  const artisants = [
    {
      name: "Jean Dupont",
      thumbnail: plombier,
      rating: 4.9,
      adresse: "75001 Paris",
      reviews: 120,
      specialty: "Plomberie",
      description:
        "Expert en réparation de fuites et installation de sanitaires.",
    },
    {
      name: "Marie Curie",
      thumbnail: elec,
      rating: 4.8,
      adresse: "75001 Paris",
      reviews: 98,
      specialty: "Électricité",
      description:
        "Spécialiste en installations électriques résidentielles et commerciales.",
    },
    {
      name: "Paul Martin",
      thumbnail: peintre,
      rating: 4.7,
      adresse: "123 Rue de Paris, 75001 Paris",
      reviews: 85,
      specialty: "Menuiserie",
      description:
        "Artisan menuisier pour tous vos projets en bois sur mesure.",
    },
  ];
  return (
    <section
      id="artiMenu"
      className="flex flex-col py-16 items-center  bg-gray-100 h-screen">
      <h2 className="text-[36px]">Artisans en vedette</h2>
      <p className="text-gray-600">
        Découvrez les artisans les mieux notés par nos clients
      </p>
      <div className="w-full  flex justify-center  mt-8 ">
        {artisants.map((artisant, index) => (
          <div
            key={index}
            className="p-4 m-4 flex-col flex-1 flex justify-start items-center bg-white rounded-lg shadow-md ">
            <div className=" w-full">
              <img
                className="min-h-[400px] max-h-[250px] w-full"
                src={artisant.thumbnail}
                alt={artisant.name}
              />
            </div>

            <div className="flex justify-between w-full px-4 pt-10">
              <h3 className="text-xl font-semibold">{artisant.name}</h3>
              <p className="text-yellow-500 flex justify-center items-center bg-yellow-50 px-2">
                <FaStar className="text-yellow-400" />
                {artisant.rating}
              </p>
            </div>
            <div className="text-blue-500 flex justify-start w-full px-4">
              {artisant.specialty}
            </div>
            <div className="px-4 flex justify-start w-full">
              {artisant.adresse}
            </div>
            <div className="px-4 flex justify-start w-full">
              {artisant.description}
            </div>
            <div className="px-4 flex justify-start w-full">
              {artisant.reviews} avis
            </div>
          </div>
        ))}
      </div>
      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 hover:scale-110 transition-transform duration-300 hover:cursor-pointer">
        Voir plus
      </button>
    </section>
  );
}
