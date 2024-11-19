import { Card, CardMedia, Tooltip, Zoom } from "@mui/material";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

type MediaStatus = "RELEASING" | "FINISHED" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";
export interface AnimeCardData {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english: string;
  };
  image: string;
  color: string;
  description: string;
  status: MediaStatus;
  totalEpisodes: number | null;
  currentEpisode: number | null;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
    airingAt: number;
  };
  bannerImage: string;
  genres: string[];
}


export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  const navigate = useNavigate();

  const navigateToPage = () => {
    navigate(`/anime/${anime.idMal}`);
  };

  return (
    <Tooltip
      TransitionComponent={Zoom}
      title={
        <>
          <h3>{anime.title.english || anime.title.romaji}</h3>
        </>
      }
      placement="top"
      arrow
      sx={{
        "& .MuiTooltip-tooltip": {},
        "& .MuiTooltip-arrow": {
          color: "#f5f5f5",
        },
      }}
    >
      <div
        className="my-7 mx-4 w-[201px] h-[280px] 
      sm:w-[150px] sm:h-[210px] md:w-[201px] md:h-[280px]"
      >
        <Card
          sx={{
            backgroundColor: "transparent",
            boxShadow: "none",
            "& .MuiCardContent-root": {
              backgroundColor: "transparent",
            },
            "&:hover": {
              transform: "scale(1.05)",
              transition: "transform 0.3s ease-in-out",
              borderRadius: "16px",
              border: "2px solid #2F3672",
            },
          }}
        >
          <div
            className="cursor-pointer relative group rounded-[16px] transition-transform 
          duration-300 ease-in-out hover:scale-110"
          >
            <CardMedia
              component="img"
              image={anime.image}
              alt={anime.title.english}
              className="rounded-[16px] shadow-xl mx-auto object-cover w-[150px] h-[268px]
              border-2 border-doki-purple"
            />
            <div
              className="rounded-[16px] mx-auto absolute top-0 left-0 w-full h-full
               bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity 
               duration-300 ease-in-out"
              onClick={navigateToPage}
            ></div>

            <button
              onClick={navigateToPage}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              opacity-0 group-hover:opacity-100"
              style={{ transition: "opacity 0.2s ease-in-out" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-doki-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </Card>
        <div>
          <div className="text-md relative text-doki-purple font-semibold text-center truncate mx-2 pt-2 font-poppins">
            {anime.title.english || anime.title.romaji}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

interface AnimeCardProps {
  anime: AnimeCardData;
}
