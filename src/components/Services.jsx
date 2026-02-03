/* eslint-disable no-unused-vars */
import { IoHammerOutline } from "react-icons/io5";
import { motion } from "framer-motion";
import { MdOutlineElectricBolt } from "react-icons/md";
import { IoWaterOutline } from "react-icons/io5";
import { PiPaintBrushBroadFill } from "react-icons/pi";
import { LuTreePine } from "react-icons/lu";
import { IoHomeOutline } from "react-icons/io5";
import { LuWrench } from "react-icons/lu";
import { GiDrill } from "react-icons/gi";
export default function Services() {
  const categories = [
    { icon: <IoHammerOutline />, name: "Maçonnerie", count: "0" },
    { icon: <MdOutlineElectricBolt />, name: "Électricité", count: "0" },
    { icon: <IoWaterOutline />, name: "Plomberie", count: "0" },
    { icon: <PiPaintBrushBroadFill />, name: "Peinture", count: "0" },
    { icon: <LuTreePine />, name: "Jardinage", count: "0" },
    { icon: <IoHomeOutline />, name: "Couverture", count: "0" },
    { icon: <LuWrench />, name: "Chauffage", count: "0" },
    { icon: <GiDrill />, name: "Menuiserie", count: "0" },
  ];
  const cardVariants = {
    rest: { backgroundColor: "#ffffff" },
    hover: { backgroundColor: "#e0f2fe" },
  };

  const iconVariants = {
    rest: { backgroundColor: "#e0f2fe" }, // gray-200
    hover: { backgroundColor: "blue", color: "white" }, // your hover color
  };

  return (
    <section
      id="services"
      className="flex flex-col py-16 items-center justify-center bg-white min-h-[80vh]">
      <div id="servicesContainer" className="flex flex-col items-center  ">
        <h2 className="text-[36px]">Tous les corps de métier</h2>
        <p className="text-gray-600">
          Des artisans qualifiés et vérifiés dans tous les domaines pour
          répondre à vos besoins.
        </p>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-8 ">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="rest"
                whileHover="hover"
                animate="rest"
                className="flex  flex-col items-center px-25 py-5 border border-blue-200 rounded-lg hover:shadow-lg transition-shadow duration-300 w-[350px]  cursor-pointer">
                <motion.div
                  variants={iconVariants}
                  className="text-4xl text-blue-900 mb-4 p-4 rounded-full ">
                  {category.icon}
                </motion.div>
                <h3 className="text-xl  font-semibold mb-2">
                  { category.name}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
