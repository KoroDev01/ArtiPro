import { FaCcDiscover } from "react-icons/fa";
import { FaDochub } from "react-icons/fa";
import { FaCodeCompare } from "react-icons/fa6";
import { CiTimer } from "react-icons/ci";

export default function HowItWork() {
  const steps = [
    {
      title: "Étape 1: Recherche",
      icon: <FaCcDiscover />,
      description:
        "Recherchez des artisans qualifiés en fonction de vos besoins spécifiques.",
    },
    {
      title: "Étape 2: Sélection",
      icon: <FaDochub />,
      description:
        "Parcourez les profils des artisans, consultez les avis et sélectionnez celui qui vous convient.",
    },
    {
      title: "Étape 3: Mise en relation",
      icon: <FaCodeCompare />,
      description:
        "Contactez directement l'artisan pour discuter des détails du projet et obtenir un devis.",
    },
    {
      title: "Étape 4: Réalisation",
      icon: <CiTimer />,
      description:
        "Laissez l'artisan réaliser le travail tout en suivant l'avancement du projet.",
    },
  ];
  return (
    <section
      id="howItWork"
      className="flex flex-col py-16 items-center  bg-white min-h-[80vh]">
      <div id="howItWorkContainer" className="flex flex-col items-center  ">
        <h2 className="text-[36px]">Comment ça marche</h2>
        <p className="text-gray-600">
          Découvrez comment notre plateforme facilite la mise en relation entre
          vous et les artisans qualifiés.
        </p>
      </div>
      <div className="flex gap-10 mt-8 w-[80%]  ">
        {steps.map((step, index) => (
          <div
            key={index}
            className=" border border-blue-200 rounded-lg p-6 mb-6 flex-col flex items-center w-full cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <div className="text-6xl  mb-4 p-4 rounded-full justify-center items-center flex bg-blue-600 hover:bg-blue-700 text-white w-20 h-20 ">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
            <p className="text-gray-700 text-center">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
