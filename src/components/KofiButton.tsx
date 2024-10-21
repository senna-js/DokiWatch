import React, { useState } from "react";
import { motion } from "framer-motion";
import kofiImage from "../assests/kofi.png";
import coffeeImage from "../assests/Coffee.png";

const KoFiButton: React.FC = () => {
  const [hoveredKoFi, setHoveredKoFi] = useState(false);
  const [hoveredCoffee, setHoveredCoffee] = useState(false);
  const [hoveredDiscord, setHoveredDiscord] = useState(false);

  const handleKoFiClick = () => {
    window.open("https://ko-fi.com/eshan27", "_blank", "noopener,noreferrer");
  };

  const handleCoffeeClick = () => {
    window.open(
      "https://www.buymeacoffee.com/eshan2703",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleDiscordClick = () => {
    window.open(
      "https://discord.gg/tpEhcq2vc6",
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="fixed bottom-0 right-4 z-50 flex flex-col items-center gap-4">
      <div className="relative w-full h-full">
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-52 bg-transparent backdrop-blur-lg border border-gray-500 bg-gray-800 rounded-t-full"></div>
        <div
          className="relative z-10"
          onMouseEnter={() => setHoveredCoffee(true)}
          onMouseLeave={() => setHoveredCoffee(false)}
        >
          <button
            onClick={handleCoffeeClick}
            className="relative bg-transparent p-0 border-none cursor-pointer mb-4"
          >
            <img
              src={coffeeImage}
              alt="Buy Me a Coffee"
              className="w-12 h-12 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
            />
            {hoveredCoffee && (
              <motion.span
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -50 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute whitespace-nowrap bottom-1/2 right-1/2 transform translate-y-1/2 bg-black bg-opacity-80 text-white text-sm font-bold py-1 px-3 rounded-lg shadow-lg"
              >
                Buy Me a Coffee
              </motion.span>
            )}
          </button>
        </div>
        <div
          className="relative z-10"
          onMouseEnter={() => setHoveredKoFi(true)}
          onMouseLeave={() => setHoveredKoFi(false)}
        >
          <button
            onClick={handleKoFiClick}
            className="relative bg-transparent p-0 border-none cursor-pointer mb-4"
          >
            <img
              src={kofiImage}
              alt="Ko-fi"
              className="w-12 h-12 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
            />
            {hoveredKoFi && (
              <motion.span
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -50 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute whitespace-nowrap bottom-1/2 right-1/2 transform translate-y-1/2 bg-black bg-opacity-80 text-white text-sm font-bold py-1 px-3 rounded-lg shadow-lg"
              >
                Support Us on Ko-fi
              </motion.span>
            )}
          </button>
        </div>
        <div
          className="relative z-10"
          onMouseEnter={() => setHoveredDiscord(true)}
          onMouseLeave={() => setHoveredDiscord(false)}
        >
          <button
            onClick={handleDiscordClick}
            className="relative bg-transparent p-0 border-none cursor-pointer mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              shapeRendering="geometricPrecision"
              textRendering="geometricPrecision"
              imageRendering="optimizeQuality"
              fillRule="evenodd"
              clipRule="evenodd"
              viewBox="0 0 512 365.467"
              className="w-12 h-12 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
            >
              <path
                fill="#fff"
                d="M378.186 365.028s-15.794-18.865-28.956-35.099c57.473-16.232 79.41-51.77 79.41-51.77-17.989 11.846-35.099 20.182-50.454 25.885-21.938 9.213-42.997 14.917-63.617 18.866-42.118 7.898-80.726 5.703-113.631-.438-25.008-4.827-46.506-11.407-64.494-18.867-10.091-3.947-21.059-8.774-32.027-14.917-1.316-.877-2.633-1.316-3.948-2.193-.877-.438-1.316-.878-1.755-.878-7.898-4.388-12.285-7.458-12.285-7.458s21.06 34.659 76.779 51.331c-13.163 16.673-29.395 35.977-29.395 35.977C36.854 362.395 0 299.218 0 299.218 0 159.263 63.177 45.633 63.177 45.633 126.354-1.311 186.022.005 186.022.005l4.388 5.264C111.439 27.645 75.461 62.305 75.461 62.305s9.653-5.265 25.886-12.285c46.945-20.621 84.236-25.885 99.592-27.64 2.633-.439 4.827-.878 7.458-.878 26.763-3.51 57.036-4.387 88.624-.878 41.68 4.826 86.43 17.111 132.058 41.68 0 0-34.66-32.906-109.244-55.281l6.143-7.019s60.105-1.317 122.844 45.628c0 0 63.178 113.631 63.178 253.585 0-.438-36.854 62.739-133.813 65.81l-.001.001zm-43.874-203.133c-25.006 0-44.75 21.498-44.75 48.262 0 26.763 20.182 48.26 44.75 48.26 25.008 0 44.752-21.497 44.752-48.26 0-26.764-20.182-48.262-44.752-48.262zm-160.135 0c-25.008 0-44.751 21.498-44.751 48.262 0 26.763 20.182 48.26 44.751 48.26 25.007 0 44.75-21.497 44.75-48.26.439-26.763-19.742-48.262-44.75-48.262z"
              />
            </svg>
            {hoveredDiscord && (
              <motion.span
                initial={{ opacity: 0, x: 0 }}
                animate={{ opacity: 1, x: -50 }}
                exit={{ opacity: 0, x: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute whitespace-nowrap bottom-1/2 right-1/2 transform translate-y-1/2 bg-black bg-opacity-80 text-white text-sm font-bold py-1 px-3 rounded-lg shadow-lg"
              >
                Join our Discord Server !
              </motion.span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default KoFiButton;
