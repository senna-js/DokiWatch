import React, { useState } from 'react';
import { motion } from 'framer-motion';
import kofiImage from '../assests/kofi.png'; // Adjust the path as necessary

const KoFiButton: React.FC = () => {
    const [hovered, setHovered] = useState(false);

    const handleClick = () => {
        window.open('https://ko-fi.com/eshan27', '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className="fixed bottom-10 right-4 z-50 flex items-center"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <button
                onClick={handleClick}
                className="relative bg-transparent p-0 border-none cursor-pointer"
            >
                <img
                    src={kofiImage}
                    alt="Ko-fi"
                    className="w-12 h-12 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:scale-110"
                />
                {hovered && (
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
    );
};

export default KoFiButton;