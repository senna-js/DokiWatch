import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { AnilistUserAnimeData, MediaListStatus } from "../interfaces/AnilistAnimeData"
import { useAnilistContext } from "../AnilistContext"
import { useNavigate } from "react-router-dom"
import { Tooltip, Zoom } from "@mui/material";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { styled } from '@mui/material/styles';
import Pagination from "../components/Pagination"
import dokiGirl from "../assests/doki-girl.webp";
import dokiGirlPhone from "../assests/doki-girl-phone.png";

const User = () => {
    const { authState, user, getList, authenticate } = useAnilistContext()
    const [activeList, setActiveList] = useState<MediaListStatus>("CURRENT")
    const [animeList, setAnimeList] = useState<AnilistUserAnimeData[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 20
    const navigate = useNavigate()

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

    if (authState === 'unauthenticated') {
        return (
            <div className="relative w-full h-screen overflow-x-hidden overflow-y-hidden">
                {/* Desktop background */}
                <div className="hidden sm:block">
                    <img
                        src={dokiGirl}
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>
                {/* Mobile background */}
                <div className="sm:hidden">
                    <img
                        src={dokiGirlPhone}
                        alt="Background"
                        className="absolute top-0 left-0 w-full h-full object-cover"
                    />
                </div>

                <motion.div
                    className="relative font-lato flex flex-col items-center justify-center min-h-[80vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex flex-wrap flex-col items-center text-center space-y-4">
                        <motion.h1
                            className="text-3xl sm:text-4xl font-bold text-doki-white mb-2"
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            Connect to AniList
                        </motion.h1>
                        <motion.p
                            className="font-hpSimplifiedbold text-doki-light-grey mb-8"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Connect your AniList account to sync and manage your anime watchlist
                        </motion.p>
                        <motion.button
                            onClick={authenticate}
                            className="flex justify-center mt-6 bg-doki-purple
              border-2 border-doki-light-grey
               text-doki-light-grey rounded-[12px] sm:text-base text-xs  md:w-40 sm:w-32 w-28
               cursor-pointer shadow-md p-1
                hover:bg-doki-light-grey font-lato
                 hover:text-doki-purple transform transition duration-150 ease-in-out"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            Connect to AniList
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    useEffect(() => {
        const getAnimeList = async () => {
            if (authState !== 'authenticated') return
            setLoading(true)
            const fetchedAnime = await getList(activeList)
            const sortedAnime = fetchedAnime.sort((a, b) =>
                (b.updatedAt || 0) - (a.updatedAt || 0)
            ).map((anime) => ({
                ...anime,
                episodes: anime.totalEpisodes?.toString() || '?',
                progress: anime.progress || 0
            }))
            setAnimeList(sortedAnime)
            setLoading(false)
        }
        getAnimeList()
    }, [authState, activeList])

    const listTypes: { status: MediaListStatus; title: string }[] = [
        { status: "CURRENT", title: "Continue Watching" },
        { status: "COMPLETED", title: "Completed" },
        { status: "PLANNING", title: "Plan to Watch" },
        { status: "DROPPED", title: "Dropped" },
        { status: "PAUSED", title: "On Hold" }
    ]

    const currentItems = animeList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    )
    const totalPages = Math.ceil(animeList.length / itemsPerPage)

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
        <div className="sm:mx-[75px] md:mx-[150px]">
            <motion.div
                className="relative mt-8 mx-6 sm:mx-7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="flex items-center gap-4 mb-8">
                    {user?.avatar && (
                        <img
                            src={user.avatar}
                            alt="Profile"
                            className="w-20 h-20 rounded-full border-2 border-doki-purple"
                        />
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-white">{user?.name}</h1>
                        <p className="text-doki-light-grey">AniList Profile</p>
                    </div>
                </div>
            </motion.div>

            <div className="relative font-lato flex gap-4 mx-7 overflow-x-auto scrollHide">
                {listTypes.map(({ status, title }) => (
                    <button
                        key={status}
                        onClick={() => {
                            setActiveList(status)
                            setCurrentPage(1)
                        }}
                        className={`px-4 py-2 rounded-full transition-colors duration-200 whitespace-nowrap
                            ${activeList === status
                                ? "bg-doki-purple text-white border border-doki-white"
                                : "bg-doki-dark-grey text-doki-purple hover:bg-doki-light-grey border border-doki-purple"
                            }`}
                    >
                        {title}
                    </button>
                ))}
            </div>

            <motion.div
                className="relative m-7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <div className="relative container bg-doki-light-grey rounded-[16px] p-6">
                    <h2 className="text-3xl font-lato font-bold text-doki-purple mb-6">
                        {listTypes.find(lt => lt.status === activeList)?.title} ({animeList.length})
                    </h2>

                    <hr className="border border-doki-purple mb-4" />
                    {loading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 10 }).map((_, index) => (
                                <div key={index} className="animate-pulse bg-doki-dark-grey rounded-[12px] overflow-hidden">
                                    <div className="w-full pt-[140%] relative bg-doki-light-grey/20"></div>
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-doki-light-grey/20 rounded"></div>
                                        <div className="h-3 bg-doki-light-grey/20 rounded w-2/3"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {currentItems.map((anime) => (
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
                                ))}
                            </div>


                        </>
                    )}
                </div>
            </motion.div>
            {totalPages > 1 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            )}
        </div>
    )
}

export default User