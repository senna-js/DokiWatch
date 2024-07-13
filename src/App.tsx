import { Routes, Route } from "react-router-dom";
import { AnimeProvider } from "./AnimeContext"; // Import AnimeProvider
import { Navbar } from "./components/navbar";
import { AnimeWatchingStack } from "./components/AnimeWatchingStack";
import { AnimeAiringStack } from "./components/AnimeAiringStack";
import TopAiringAnimeStack from "./components/topAiringStack";
import scene from "./assests/scene6.mp4";
import LandingPage from "./pages/landingPage";
import { Anime } from "./pages/Anime";
import { Watch } from "./pages/Watch";
import { Search } from "./pages/Search";
import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { isSignedIn } = useUser();
  return (
    <AnimeProvider>
      <div className="min-h-screen bg-gray-900 text-white relative">
        <video
          autoPlay
          muted
          loop
          id="background-video"
          className="absolute z-0 w-full h-full object-cover opacity-25"
        >
          <source src={scene} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route
              path="/home"
              element={
                <div>
                  <div className="p-8 ml-24">
                    <h1 className="text-4xl font-bold">
                      Welcome to Doki Watch
                    </h1>
                    <p className="mt-2">
                      Explore your favorite anime & manga here.
                    </p>
                  </div>
                  <div className="mt-16 ml-24">
                    <TopAiringAnimeStack />
                  </div>
                  {isSignedIn && (
                    <div className="ml-24">
                      <AnimeAiringStack />
                      <AnimeWatchingStack />
                    </div>
                  )}
                </div>
              }
            />
            <Route path="/anime/:id" element={<Anime />} />
            <Route path="/watch" element={<Watch />} />
            <Route path="/search" element={<Search />} />
            <Route path="/" element={<LandingPage />} />
          </Routes>
        </div>
      </div>
    </AnimeProvider>
  );
};

export default App;
