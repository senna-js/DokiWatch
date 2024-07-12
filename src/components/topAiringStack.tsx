import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardMedia, Tooltip } from '@mui/material';
interface AnimeEpisode {
  mal_id: number;
  image_url: string;
  title_english: string;
  title: string;
}

const TopAiringAnimeStack = () => {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeEpisode[]>([]);
  // const carouselRef = useRef<HTMLDivElement>(null);

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

        const filteredAnime = data.data
          .filter((anime: any) => anime.year === 2024)
          .map((anime: any) => ({
            mal_id: anime.mal_id,
            image_url: anime.images.jpg.large_image_url,
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

  // const scrollLeft = () => {
  //   if (carouselRef.current) {
  //     carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
  //   }
  // };

  // const scrollRight = () => {
  //   if (carouselRef.current) {
  //     carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
  //   }
  // };
  const navigate = useNavigate();

  const handleTitleClick = (animeId) => {
    if (typeof animeId !== "number") {
      return;
    }
    navigate(`/anime/${animeId}`);
  };

  return (
    <div className="flex-row p-4 m-3 rounded-md bg-gray-800">
      <h2 className="text-2xl font-poppins pl-3">Top Airing Anime</h2>
      <hr className="my-4" />
      <div>
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
          {topAiringAnime.map((anime) => (
            // Anime card component goes here
            <Tooltip title={anime.title_english || anime.title} key={anime.mal_id} placement="top" arrow>
              <div className="text-white my-7 mx-4 w-[201px] h-[280px]">
                <Card>
                  <div className="cursor-pointer relative group rounded-sm transition-transform duration-300 ease-in-out hover:scale-110">
                    <CardMedia
                      component="img"
                      image={anime.image_url}
                      alt={anime.title_english || anime.title}
                      className="rounded-sm shadow-xl mx-auto object-cover w-[150px] h-[268px]"
                    />
                    <div className="rounded-sm mx-auto absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out" onClick={() => handleTitleClick(anime.mal_id)}></div>
                    <button
                      onClick={() => handleTitleClick(anime.mal_id)}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                      style={{ transition: 'opacity 0.2s ease-in-out' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>
                </Card>
                <div className="text-md text-[#f5f5f5] font-semibold text-center truncate mx-2 pt-2 font-poppins">
                  {anime.title_english || anime.title}
                </div>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAiringAnimeStack;
