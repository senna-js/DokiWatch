/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef } from "react";
import { AnimeCard } from "../AnimeCard";
import { AnimeData } from "../../interfaces/AnimeData";

interface AnimeDataStackProps {
  animeData: AnimeData[];
  heading: string;
  subheading?: {
    text: string;
    color: string;
  }
}

export const AnimeDataStack: React.FC<AnimeDataStackProps> = ({ animeData, heading, subheading }) => {
  const carouselRef = useRef<HTMLDivElement>(null)

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
      <div className="p-3 m-7 sm:m-0 rounded-[16px] sm:rounded-none bg-doki-light-grey">
        <h2 className="text-2xl sm:text-4xl font-lato text-doki-purple pl-3 flex items-center">
          {heading}
          {subheading &&
            <span className="flex items-center ml-2">
              <span className={`w-2.5 h-2.5 ${subheading.color} rounded-full mr-1`}></span>
              <p className="text-base text-doki-purple font-bold font-poppins text-opacity-50">
                {subheading.text}
              </p>
            </span>
          }
        </h2>
        <hr className="border border-doki-purple my-4" />
        <div className="relative overflow-hidden flex justify-center items-center">
          <div
            className="flex gap-1 overflow-x-auto overflow-y-hidden"
            ref={carouselRef}
          // style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {animeData.map((anime) => (
              <div key={anime.idMal} className="flex-shrink-0">
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