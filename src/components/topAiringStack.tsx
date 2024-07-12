import { useEffect, useState, useRef } from "react";

interface AnimeEpisode {
  episodeId: string;
  episodeNumber: number;
  genres: string[];
  id: string;
  image: string;
  title: string;
  url: string;
}

const TopAiringAnimeStack = () => {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeEpisode[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTopAiringAnime = async () => {
      try {
        const response = await fetch(
          "https://consumet-deploy.vercel.app/anime/gogoanime/top-airing"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        setTopAiringAnime(data.results);
      } catch (error) {
        console.error("Error fetching top airing anime:", error);
      }
    };

    fetchTopAiringAnime();
  }, []); // Empty dependency array means this effect runs once after the initial render

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="top-airing-anime-stack p-4">
      <h2 className="text-2xl font-bold mb-4">Top Airing Anime</h2>
      <div className="relative">
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &lt;
        </button>
        <div
          ref={carouselRef}
          className="anime-cards-container flex overflow-x-scroll space-x-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {topAiringAnime.map((anime, index) => (
            <div
              key={anime.id || index}
              className="flex flex-col items-center bg-transparent shadow-md rounded-lg p-4 min-w-[300px]"
            >
              <img
                src={anime.image}
                alt={anime.title}
                className="anime-image w-full h-48 object-cover rounded-md mb-2"
              />
              <span className="anime-title text-center font-medium text-white">
                {anime.title}
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default TopAiringAnimeStack;
