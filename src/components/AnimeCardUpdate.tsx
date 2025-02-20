import { motion } from "framer-motion"
import { Tooltip, Zoom } from "@mui/material";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import { AnilistUserAnimeData } from "../interfaces/AnilistAnimeData";
import { useNavigate } from "react-router-dom";

export const AnimeCardUpdate: React.FC<AnimeCardProps> = ({ anime }) => {
    const navigate = useNavigate();

    const dokiTooltipBackground = "rgba(47, 54, 114, 0.8)";
    const dokiTooltipText = "#DADAE8";

    const CustomTooltip = styled(({ className, ...props }: TooltipProps) => (
        <Tooltip {...props} classes={{ popper: className }} />
    ))(() => ({
        [`& .${tooltipClasses.tooltip}`]: {
            backgroundColor: dokiTooltipBackground,
            color: dokiTooltipText,
            fontSize: "11px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            border: `1px solid rgba(255, 255, 255, 0.2)`,
        },
    }));

    const handleAnimeClick = (anime: AnilistUserAnimeData) => {
        let cleanTitle = anime.title.english || anime.title.romaji
        cleanTitle = cleanTitle.replace(/"/g, " ")
        cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        cleanTitle = cleanTitle.replace(/[^\x00-\x7F]/g, " ")

        const currentEpisode = (anime.progress === 0) ? 1 : (anime.progress ?? 0)

        // If current episode would exceed total episodes, stay on the last episode
        const targetEpisode = anime.totalEpisodes ?
            Math.min(currentEpisode, anime.totalEpisodes) :
            currentEpisode
        const navString = `/watch/${anime.idMal}?id=${cleanTitle}&ep=${targetEpisode}`
        navigate(navString)
    }

    return (
        <CustomTooltip
            key={anime.id}
            TransitionComponent={Zoom}
            title={
                <>
                    <h3 className="font-bold font-lato text-sm text-white mb-2">
                        {anime.title.english || anime.title.romaji}
                    </h3>
                    <p>Status: {anime.runningStatus}</p>
                    <p>Genres: {anime.genres?.join(', ') || 'N/A'}</p>
                    {anime.totalEpisodes !== null && (
                        <p>Total Episodes: {anime.totalEpisodes}</p>
                    )}
                </>
            }
            placement="top"
        >
            <motion.div
                key={anime.id}
                role="button"
                onClick={() => handleAnimeClick(anime)}
                className="bg-doki-dark-grey rounded-[12px] overflow-hidden cursor-pointer group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{
                    scale: 1.05,
                    transition: { duration: 0.2 }
                }}
            >
                <div className="relative w-full pt-[140%]">
                    <img
                        src={anime.image}
                        alt={anime.title.romaji || anime.title.english}
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 
                      transition-all duration-300 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
                        </div>
                    </div>
                    {anime.nextAiringEpisode && (
                        <div className="absolute top-2 right-2">
                            <span className="bg-doki-purple/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                                NEXT EP {anime.nextAiringEpisode.episode}
                            </span>
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <div className="w-full bg-doki-light-grey/30 rounded-full h-1.5">
                            <div
                                className="bg-doki-white h-1.5 rounded-full transition-all duration-300"
                                style={{
                                    // width: `${((Number(anime.progress) / (Number(anime.episodes) || Number(anime.progress) || 1)) * 100).toFixed(2)}%`
                                    width: `${((Number(anime.progress) / (Number(anime.totalEpisodes) || 1)) * 100).toFixed(2)}%`
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="p-3">
                    <h3 className="text-white font-semibold text-sm line-clamp-1">
                        {anime.title.english || anime.title.romaji}
                    </h3>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-doki-purple font-hpSimplifiedbold text-xs">
                            EP {anime.progress || 0} / {anime.totalEpisodes || '?'}
                        </span>
                        <span className="text-doki-purple font-hpSimplifiedbold text-xs">
                            {anime.runningStatus === "FINISHED" ? "FINISHED" :
                                anime.nextAiringEpisode ?
                                    `EP ${anime.nextAiringEpisode.episode} in ${Math.ceil(anime.nextAiringEpisode.timeUntilAiring / 86400)}d` :
                                    "TBA"}
                        </span>
                    </div>
                </div>
            </motion.div>
        </CustomTooltip>

    )
}

interface AnimeCardProps {
    anime: AnilistUserAnimeData
}