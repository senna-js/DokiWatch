import { useEffect, useState, useRef } from "react";
import { AnimeCard } from "../AnimeCard";
import { AnimeData } from "../../interfaces/AnimeData";

export const TopAiringAnimeStack = () => {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeData[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchTopAiringAnime = async () => {
      try {
        const response = await fetch(
          "https://api.jikan.moe/v4/top/anime?filter=airing&type=tv"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data.data);
        const filteredAnime: AnimeData[] = data.data
          .filter((anime: any) => anime.year === 2024)
          .map((anime: any) => ({
            mal_id: anime.mal_id,
            image: anime.images.jpg.large_image_url,
            title_english: anime.title_english,
            title: anime.title,
          }));

        setTopAiringAnime(filteredAnime);
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
    <div className="relative">
      <div className="p-3 m-7 sm:m-0 rounded-[16px] sm:rounded-none bg-doki-light-grey backdrop-blur-lg">
        <h2 className="text-2xl sm:text-4xl font-lato text-doki-purple pl-3">
          Top Airing
        </h2>
        <hr className="border border-doki-purple my-4" />
        <div className="relative overflow-hidden">
          <div
            className="flex gap-1 overflow-x-auto overflow-y-hidden"
            ref={carouselRef}
            // style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {topAiringAnime.map((anime) => (
              <div key={anime?.mal_id} className="flex-shrink-0">
                <AnimeCard anime={anime} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Left Navigation Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 sm:-translate-x-12 h-full w-10 sm:w-12 bg-doki-dark-grey text-doki-purple hidden sm:flex justify-center items-center hover:bg-doki-white rounded-l-[16px] transition-colors duration-300"
        onClick={scrollLeft}
      >
        <svg
          width="40"
          height="24"
          viewBox="0 0 52 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="-rotate-90"
        >
          <path
            d="M45 25L26 7L7 25"
            stroke="#2F3672"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Right Navigation Button */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 sm:translate-x-12 h-full w-10 sm:w-12 bg-doki-dark-grey text-doki-purple hidden sm:flex justify-center items-center hover:bg-doki-white rounded-r-[16px] transition-colors duration-300"
        onClick={scrollRight}
      >
        <svg
          width="40"
          height="24"
          viewBox="0 0 52 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-90"
        >
          <path
            d="M45 25L26 7L7 25"
            stroke="#2F3672"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default TopAiringAnimeStack;
