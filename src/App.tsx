import { Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import { AnimeProvider } from "./AnimeContext"; // Import AnimeProvider
import { Navbar } from "./components/navbar";
import { AnimeWatchingStack } from "./components/AnimeStacks/AnimeWatchingStack";
import { AnimeAiringStack } from "./components/AnimeStacks/AnimeAiringStack";
import { TopAiringAnimeStack } from "./components/AnimeStacks/topAiringStack";
import scene from "./assests/scene6.mp4";
import redragon from "./assests/redragon.jpg";
import LandingPage from "./pages/landingPage";
import { Anime } from "./pages/Anime";
import { Watch } from "./pages/Watch";
import { Search } from "./pages/Search";
import { useUser } from "@clerk/clerk-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from 'react-intersection-observer';
import { Watchgogo } from "./pages/Watch-gogo";

const App = () => {
  const { isSignedIn } = useUser();
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        width: '100%',
        opacity: 1,
        transition: { duration: 0.5 },
      });
    }
  }, [controls, inView]);

  return (
    <AnimeProvider>
      <div className="min-h-screen bg-gray-900 text-white relative">
        {/* <div className="absolute z-0 w-full h-full bg-gradient-to-br from-slate-700 via-gray-800 to-zinc-900 opacity-25"></div> */}
        {/* <video
          autoPlay
          muted
          loop
          id="background-video"
          className="absolute z-0 w-full h-full object-cover opacity-25"
        >
          <source src={scene} type="video/mp4" />
          Your browser does not support the video tag.
        </video> */}
        <img
          src={redragon}
          alt="Background"
          className="absolute z-0 w-full h-full object-cover opacity-25"
        />
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route
              path="/home"
              element={
                <div>
                  <motion.div
                    className="p-4 sm:p-8 ml-4 sm:ml-24"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h1
                      className="text-2xl sm:text-4xl font-bold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Welcome to Doki Watch
                    </motion.h1>
                    <motion.p
                      className="mt-2 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Explore your favorite anime & manga here.
                    </motion.p>
                  </motion.div>
                  <motion.div
                    className="mt-8 sm:mt-16 ml-4 sm:ml-24"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <TopAiringAnimeStack />
                  </motion.div>
                  {isSignedIn && (
                    <motion.div
                      className="ml-4 sm:ml-24"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.8 }}
                    >
                      <AnimeAiringStack />
                      <AnimeWatchingStack />
                    </motion.div>
                  )}
                </div>
              }
            />
            <Route path="/anime/:id" element={<Anime />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/watch/:id" element={<Watch />} />
            {/* <Route path= "/watch/:id" element={<Watchgogo/>}/> */}
          </Routes>
        </div>
      </div>
    </AnimeProvider>
  );
};

export default App;
