import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar";
import { AnimeStack } from "./components/AnimeStack";
import { useAnimeContext } from "./AnimeContext"; // Import the context
import scene from "./assests/scene.mp4";

const App = () => {
  const { setTriggerFetch } = useAnimeContext(); // Access setTriggerFetch from context

  useEffect(() => {
    // Check if user is authenticated and has access token
    if (
      localStorage.getItem("user") &&
      JSON.parse(localStorage.getItem("user") as string).access_token
    ) {
      console.log(JSON.parse(localStorage.getItem("user") as string));
      setTriggerFetch(true); // Trigger anime data fetch
    }
  }, [setTriggerFetch]);

  return (
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
            path="/"
            element={
              <div>
                <div className="p-8">
                  <h1 className="text-4xl font-bold">Welcome to Doki Watch</h1>
                  <p className="mt-2">
                    Explore your favorite anime & manga here.
                  </p>
                </div>
                <div className="mt-16 ml-24">
                  <AnimeStack type="Airing" />
                  <AnimeStack type="Watching" />
                </div>
              </div>
            }
          />
          <Route path="/anime" element={<div>anime</div>} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
