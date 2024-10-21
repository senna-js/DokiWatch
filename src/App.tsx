import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AnimeProvider } from "./AnimeContext"; // Import AnimeProvider
import { AnimeListProvider } from "./AnimeListContext";
import { Navbar } from "./components/navbar";
import { AnimeWatchingStack } from "./components/AnimeStacks/AnimeWatchingStack";
import { AnimeAiringStack } from "./components/AnimeStacks/AnimeAiringStack";
import { TopAiringAnimeStack } from "./components/AnimeStacks/topAiringStack";
// import scene from "./assests/scene6.mp4";
import LandingPage from "./pages/landingPage";
import { Anime } from "./pages/Anime";
import { Watch } from "./pages/Watch";
import { Search } from "./pages/Search";
import Manga from "./pages/Manga";
import Read from "./pages/Read";
import { useUser } from "@clerk/clerk-react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimeList } from "./pages/AnimeList";
// import { Watchgogo } from "./pages/Watch-gogo";

const App = () => {
  const { isSignedIn } = useUser();
  const controls = useAnimation();
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      controls.start({
        width: "100%",
        opacity: 1,
        transition: { duration: 0.5 },
      });
    }
  }, [controls, inView]);

  return (
    <AnimeProvider>
      <AnimeListProvider>
        <div className="min-h-screen text-doki-white relative overflow-x-hidden overflow-y-hidden">
          <div className="absolute z-0 w-full h-full bg-doki-purple text-doki-white"></div>
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
          <Navbar />
          <div className="sm:h-[109px] h-[67px]"></div>
          <Routes>
            <Route
              path="/home"
              element={
                <div>
                  <motion.div
                    className="p-4 sm:p-8 m-4 relative"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.h1
                      className="text-2xl sm:text-[70px] font-bold font-hpSimplifiedbold"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      Welcome to Doki Watch
                    </motion.h1>
                    {/* <motion.p
                      className="mt-2 text-sm sm:text-base"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      Explore your favorite anime & manga here.
                    </motion.p> */}
                  </motion.div>
                  <motion.div
                    className="mt-8 sm:mt-16 m-7"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <TopAiringAnimeStack />
                  </motion.div>
                  {isSignedIn && (
                    <motion.div
                      className="m-7"
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
            <Route
              path="/watching"
              element={<AnimeList title="Watching" list="watching" />}
            />
            <Route
              path="/completed"
              element={<AnimeList title="Completed" list="completed" />}
            />
            <Route
              path="/plan-to-watch"
              element={<AnimeList title="Plan to Watch" list="planToWatch" />}
            />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/watch/:id" element={<Watch />} />
            <Route path="/manga" element={<Manga />} />
            <Route path="/read/:mangaName" element={<Read />} />
            {/* <Route path= "/watch/:id" element={<Watchgogo/>}/> */}
          </Routes>
        </div>
      </AnimeListProvider>
    </AnimeProvider>
  );
};

export default App;
