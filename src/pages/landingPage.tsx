import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dokiGirl from "../assests/doki-girl.png";
import dokiGirlPhone from "../assests/doki-girl-phone.png";
// Mock authentication check (replace with your actual auth logic)
const isAuthenticated = () => {
  const user = localStorage.getItem("user");
  const userObj = JSON.parse(user || "{}");
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
      <div className="sm:h-[109px] h-[67px]"></div>
      <div className="hidden sm:block">
        <img
          src={dokiGirl}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <div className="sm:hidden">
        <img
          src={dokiGirlPhone}
          alt="Background"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
      </div>
      <motion.div
        className="flex justify-center h-full pt-[100px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.9 }}
        transition={{ duration: 0.5 }}
        style={{ opacity: 1 }}
      >
        <motion.div
          className="container mx-auto text-center items-center justify-center px-4 sm:px-6 lg:px-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ opacity: 1 }}
        >
          <motion.h1
            className="text-3xl sm:text-4xl md:text-[48px] lg:text-[72px] font-hpSimplifiedbold
             text-doki-white mt-10"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            style={{ opacity: 1 }}
          >
            Welcome to Doki Watch
          </motion.h1>
          <motion.p
            className="font-hpSimplifiedbold
             text-doki-light-grey mt-4 text-base sm:text-lg md:text-[25px] lg:text-[38px]"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            style={{ opacity: 1 }}
          >
            Your Go-To stop for Anime & Manga!
          </motion.p>
          <motion.div
            className="flex justify-center items-center"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 0.9 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            style={{ opacity: 1 }}
          >
            <motion.button
              onClick={handleExploreClick}
              className="flex justify-center mt-6 bg-doki-purple
              border-2 border-doki-light-grey
               text-doki-light-grey rounded-[12px] text-2xl md:w-40 sm:w-32 w-28
               cursor-pointer shadow-md p-1
                hover:bg-doki-light-grey font-lato
                 hover:text-doki-purple transform transition duration-150 ease-in-out"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <span>Explore</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingPage;
