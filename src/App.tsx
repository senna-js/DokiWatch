import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AnimeProvider } from "./AnimeContext";
import { AnimeListProvider } from "./AnimeListContext";
import { Navbar } from "./components/navbar";
import LandingPage from "./pages/landingPage";
import { Anime } from "./pages/Anime";
import { Watch } from "./pages/Watch";
import { Search } from "./pages/Search";
import Manga from "./pages/Manga";
import Read from "./pages/Read";
import { useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { AnimeList } from "./pages/AnimeList";
import Home from "./pages/Home";
// import { Watchgogo } from "./pages/Watch-gogo";

const App = () => {
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
          <div className="absolute w-full h-full bg-doki-purple"></div>
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
            <Route path="/home" element={<Home />} />
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
