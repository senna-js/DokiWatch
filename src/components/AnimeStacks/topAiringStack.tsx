import { useEffect, useState } from "react";
import { AnimeCard } from "../AnimeCard";
import { AnimeData } from "../../interfaces/AnimeData";

export const TopAiringAnimeStack = () => {
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeData[]>([]);
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

  return (
    <div className="flex-row p-4 m-3 rounded-md bg-transparent backdrop-blur-lg border border-white">
      <h2 className="text-2xl font-poppins pl-3">Top Airing</h2>
      <hr className="my-4" />
      <div>
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
          {topAiringAnime.map((anime) => (
            // Anime card component goes here
            <div key={anime?.mal_id}>
              <AnimeCard key={anime.mal_id} anime={anime} />
              {/* More anime details */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopAiringAnimeStack;
