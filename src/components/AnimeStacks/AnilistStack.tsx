/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import { AnimeCard } from "../AnimeCard";
import { AnimeData } from "../../interfaces/AnimeData";
import { useAnilistAuth, anilistQuery } from "../../Hooks/Anilist";

export const AnilistStack: React.FC<StackType> = ({ status }) => {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]); // State to hold the data
  const { user, authState } = useAnilistAuth();
  const carouselRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      if (authState !== "authenticated")
        return;
      if (!user) {
        console.log("Invalid authState", authState, user);
        return;
      }
      const query = `
      query MediaListCollection($page: Int, $perPage: Int, $userId: Int, $type: MediaType, $status: MediaListStatus) {
        Page(page: $page, perPage: $perPage) {
          mediaList(userId: $userId, type: $type, status: $status) {
            media {
              id
              idMal
              title {
                romaji
                english
              }
              description
              coverImage {
                extraLarge
                color
              }
            }
          id
          }
        }
      }`;

      const variables = {
        page: 1,
        perPage: 50,
        userId: user.id,
        type: "ANIME",
        status: status
      };

      const response = await anilistQuery(query, variables, false);

      const mediaList = response.data.Page.mediaList;

      const fetchedAnimeData: AnimeData[] = mediaList.map((media: any) => {
        const anime: AnimeData = {
          id: media.media.id,
          idMal: media.media.idMal,
          title: {
            romaji: media.media.title.romaji,
            english: media.media.title.english,
          },
          image: media.media.coverImage.extraLarge,
          color: media.media.coverImage.color,
          entryId: media.id,
        };
        return anime;
      });

      setAnimeData(fetchedAnimeData);
    };
    fetchData();
  }, [authState]);

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

  // Render the component
  return (
    <div className="relative">
      <div className="p-3 m-7 sm:m-0 sm:mb-7 rounded-[16px] sm:rounded-none bg-doki-light-grey backdrop-blur-lg">
        <h2 className="text-2xl sm:text-4xl font-lato text-doki-purple pl-3 flex items-center">
          Watching
          <span className="flex items-center ml-2">
            <span className="w-2.5 h-2.5 bg-green-300 rounded-full mr-1"></span>
            <p className="text-base text-doki-purple font-bold font-poppins text-opacity-50">
              Airing
            </p>
          </span>
        </h2>
        <hr className="border border-doki-purple my-4" />
        <div className="relative overflow-hidden">
          {animeData && animeData.length > 0 ? (
            <div
              className="flex gap-1 overflow-x-auto overflow-y-hidden"
              ref={carouselRef}
            >
              {animeData.map((anime) => (
                <div key={anime.idMal}>
                  <AnimeCard anime={anime} />
                  {/* More anime details */}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-end text-white font-poppins text-opacity-50 cursor-help">
              Connect to Anilist
            </div>
          )}
        </div>
      </div>
      {/* Left Navigation Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 sm:-translate-x-12 h-full 
       w-14 sm:w-12 bg-doki-dark-grey hidden sm:flex 
        justify-center items-center hover:bg-doki-white rounded-l-[16px] transition-colors duration-300"
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


interface StackType {
  status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";
}