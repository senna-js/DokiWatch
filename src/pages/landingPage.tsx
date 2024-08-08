import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import redragon from "../assests/redragon.jpg";

// Mock authentication check (replace with your actual auth logic)
const isAuthenticated = () => {
    const user = localStorage.getItem('user');
    const userObj = JSON.parse(user || '{}');
    const username = userObj.username;
    const accessToken = userObj.access_token;
    console.log(username);
    return Boolean(username) && Boolean(accessToken); // Returns true if a username is found, false otherwise
    // return false;
};

const LandingPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated()) {
            // Redirect to the App component if the user is authenticated
            navigate("/");
        }
    }, [navigate]);

    const handleExploreClick = () => {
        navigate("/home");
    };

    return (
        <div className="relative w-full h-screen overflow-x-hidden overflow-y-hidden ">
            <img
                src={redragon}
                alt="Background"
                className="absolute top-0 left-0 w-full h-full object-cover opacity-25"
            />
            <motion.div
                className="flex items-center justify-center h-full pb-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="container mx-auto text-center items-center justify-center px-4 sm:px-6 lg:px-8"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <motion.h1
                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-10"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        Welcome to Doki Watch
                    </motion.h1>
                    <motion.p
                        className="text-white mt-4 text-base sm:text-lg md:text-xl"
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        Explore your favorite anime & manga here.
                    </motion.p>
                    <motion.div
                        className="flex justify-center items-center"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                    >
                        <motion.button
                            onClick={handleExploreClick}
                            className="text-center mt-6 bg-transparent backdrop-blur-lg text-white border border-gray-700 rounded-lg p-3 font-anime cursor-pointer shadow-md flex hover:bg-blue-600 hover:scale-105 transform transition duration-150 ease-in-out"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6 mr-1"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                                />
                            </svg>
                            <span>Explore</span>
                        </motion.button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LandingPage;