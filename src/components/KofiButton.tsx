import React, { useState } from 'react';
import { motion } from 'framer-motion';
import kofiImage from '../assests/kofi.png';
import coffeeImage from '../assests/Coffee.png';

const KoFiButton: React.FC = () => {
    const [hoveredKoFi, setHoveredKoFi] = useState(false);
    const [hoveredCoffee, setHoveredCoffee] = useState(false);

    const handleKoFiClick = () => {
        window.open('https://ko-fi.com/eshan27', '_blank', 'noopener,noreferrer');
    };

    const handleCoffeeClick = () => {
        window.open('https://www.buymeacoffee.com/eshan2703', '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="fixed bottom-0 right-4 z-50 flex flex-col items-center gap-4">
            <div className="relative w-full h-full">
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-36 bg-transparent backdrop-blur-lg border border-gray-500 bg-gray-800 rounded-t-full"></div>
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
            </div>
        </div>
    );
};

export default KoFiButton;