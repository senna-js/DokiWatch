import { AnimeDataStack } from "../components/AnimeStacks/AnimeDataStack"
import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
// import { useUser } from "@clerk/clerk-react"
import { AnimeCardData } from "../components/AnimeCard"
import { consumetAnilistSearch, ConsumetAnilistSearchParams } from "../Hooks/LoadBalancer"
import { useAnilistContext } from "../AnilistContext"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from "react-router-dom"

const Home = () => {
  // const { isSignedIn } = useUser()
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeCardData[]>([])
  const [watchingAiringAnime, setWatchingAiringAnime] = useState<AnimeCardData[]>([])
  const [watchingAiredAnime, setWatchingAiredAnime] = useState<AnimeCardData[]>([])
  const { authState, getList } = useAnilistContext()


  // Loading states
  const [loadingTopAiring, setLoadingTopAiring] = useState<boolean>(true)
  const [loadingWatchingAiring, setLoadingWatchingAiring] = useState<boolean>(true)
  const [loadingWatchingAired, setLoadingWatchingAired] = useState<boolean>(true)

  useEffect(() => {
    const getTopAiringAnime = async () => {
      const params: ConsumetAnilistSearchParams = {
        sort: ["POPULARITY_DESC"],
        status: "RELEASING",
      }
      const response = await consumetAnilistSearch(params)
      const fetchedAnime = response.data.results
        .filter((anime: any) => anime.cover || anime.image) // Ensure banner exists
        .map((anime: any) => {
          const topAnime: AnimeCardData = {
            id: anime.id,
            idMal: anime.malId,
            title: anime.title,
            color: anime.color,
            image: anime.image.replace("/large/", "/medium/"),
            description: anime.description,
            status: "RELEASING",
            totalEpisodes: anime.totalEpisodes,
            currentEpisode: anime.currentEpisode,
            bannerImage: anime.cover,
            genres: anime.genres,
            progress: 0,
            episodes: ""
          }
          console.log("bannerImage", topAnime.bannerImage)
          return topAnime
        });
      setTopAiringAnime(fetchedAnime);
      setLoadingTopAiring(false)
    }
    getTopAiringAnime()
  }, [])

  useEffect(() => {
    const getWatchingAnime = async () => {
      setLoadingWatchingAiring(true)
      setLoadingWatchingAired(true)

      const watchingAnimeData = await getList("CURRENT")

      const watchingAiringAnimeData = watchingAnimeData.filter((anime) => anime.status === "RELEASING")
      const watchingAiredAnimeData = watchingAnimeData.filter((anime) => anime.status === "FINISHED")

      console.log("Releasing", watchingAiringAnimeData)
      console.log("Released", watchingAiredAnimeData)

      setWatchingAiringAnime(watchingAiringAnimeData)
      setWatchingAiredAnime(watchingAiredAnimeData)
      setLoadingWatchingAiring(false)
      setLoadingWatchingAired(false)
    }
    getWatchingAnime()
  }, [authState])

  return (
    <div className="sm:mx-[75px] md:mx-[150px]">
      <div className="relative">
        <motion.div
          className="absolute hidden sm:block top-4 left-4 z-10 sm:left-0 sm:-mx-32"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1
            className="font-bold font-hpSimplifiedbold text-white hidden sm:hidden md:block ml-5 sm:ml-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: "clamp(1.5rem, 4vw + 1rem, 4.375rem)" }}
          >
            Welcome to Doki Watch !
          </motion.h1>
        </motion.div>
        <div className="mx-auto md:-mx-40 sm:-mx-20">
          {loadingTopAiring ? (
            <BannerCarouselSkeleton />
          ) : (
            <BannerCarousel animeData={topAiringAnime.slice(0, 10)} />
          )}
        </div>
      </div>
      <motion.div
        className="mt-8 m-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {loadingTopAiring ? (
          // Skeleton for Top Airing
          <div className="animate-pulse mt-8">
            <div className="h-8 bg-doki-light-grey rounded-[12px] w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="h-64 bg-doki-dark-grey rounded-[12px] mb-4"></div>
                  <div className="h-6 bg-doki-dark-grey rounded-[12px] mt-2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <AnimeDataStack animeData={topAiringAnime} heading="Top Airing" />
        )}
      </motion.div>
      {authState === 'authenticated' && (
        <div className="mt-16">
          <motion.div
            className="m-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {loadingWatchingAiring ? (
              // Skeleton for Watching Airing
              <div className="animate-pulse">
                <div className="h-8 bg-doki-light-grey rounded-[12px] w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index}>
                      <div className="h-64 bg-doki-dark-grey rounded-[12px] mb-4"></div>
                      <div className="h-6 bg-doki-dark-grey rounded-[12px] mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <AnimeDataStack animeData={watchingAiringAnime} heading="Watching" subheading={{ text: "Airing", color: "bg-green-300" }} />
            )}
          </motion.div>
          <motion.div
            className="m-7 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {loadingWatchingAired ? (
              // Skeleton for Watching Aired
              <div className="animate-pulse">
                <div className="h-8 bg-doki-light-grey rounded-[12px] w-1/3 mb-4"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <div key={index}>
                      <div className="h-64 bg-doki-dark-grey rounded-[12px] mb-4"></div>
                      <div className="h-6 bg-doki-dark-grey rounded-[12px] mt-2"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <AnimeDataStack animeData={watchingAiredAnime} heading="Watching" subheading={{ text: "Aired", color: "bg-blue-500" }} />
            )}
          </motion.div>
        </div>
      )}
    </div>
  )
}

const BannerCarousel = ({ animeData }: { animeData: AnimeCardData[] }) => {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 510)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 510)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Reference to keep track of currentIndex inside setInterval
  const currentIndexRef = useRef(currentIndex)
  useEffect(() => {
    currentIndexRef.current = currentIndex
  }, [currentIndex])

  // Function to check if the current banner is valid
  const isValidBanner = (index: number) => {
    const banner = animeData[index]?.bannerImage;
    const image = animeData[index]?.image;
    return (
      (typeof banner === "string" && banner.trim() !== "") ||
      (typeof image === "string" && image.trim() !== "")
    );
  };

  const nextSlide = () => {
    let nextIndex = (currentIndexRef.current + 1) % animeData.length;
    let attempts = 0;
    while (!isValidBanner(nextIndex) && attempts < animeData.length) {
      nextIndex = (nextIndex + 1) % animeData.length;
      attempts++;
    }
    setCurrentIndex(nextIndex);
  };

  const prevSlide = () => {
    let prevIndex = (currentIndexRef.current - 1 + animeData.length) % animeData.length;
    let attempts = 0;
    while (!isValidBanner(prevIndex) && attempts < animeData.length) {
      prevIndex = (prevIndex - 1 + animeData.length) % animeData.length;
      attempts++;
    }
    setCurrentIndex(prevIndex);
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [animeData])

  // Initialize to the first valid banner
  useEffect(() => {
    if (!isValidBanner(currentIndex)) {
      nextSlide();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [animeData]);

  // Function to strip HTML tags from description
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const backgroundImage = isMobile
    ? animeData[currentIndex].image
    : animeData[currentIndex].bannerImage

  const navigateToPage = () => {
    navigate(`/anime/${animeData[currentIndex].idMal}`)
  }

  const handleGenreClick = (e: any) => {
    const genreName = e.target.innerText.toLowerCase();
    const navString = `/search?genre=${genreName}`;
    navigate(navString);
  };

  const handleWatch = () => {
    let cleanTitle = animeData[currentIndex].title.english || animeData[currentIndex].title.romaji;
    cleanTitle = cleanTitle.replace(/"/g, " ");
    cleanTitle = cleanTitle.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    cleanTitle = cleanTitle.replace(/[^\x00-\x7F]/g, " ");
    const navString = `/watch/${animeData[currentIndex]?.idMal}?id=${cleanTitle}&ep=1`;
    navigate(navString);
  };

  return (
    <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-none mb-8">
      <AnimatePresence initial={false}>
        {isValidBanner(currentIndex) ? (
          <motion.div
            key={currentIndex}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >

            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className="absolute inset-0 flex">
                <div className="md:w-2/3 w-3/2 bg-gradient-to-r from-doki-purple to-transparent flex flex-col justify-end p-8">
                  <div className="text-white">
                    <h2 className="text-2xl sm:text-4xl font-bold font-lato text-white mb-2">{animeData[currentIndex].title.english || animeData[currentIndex].title.romaji}</h2>
                    <div className="hidden custom:flex flex-wrap gap-2 mb-4">
                      {animeData[currentIndex].genres?.map((genre, index) => (
                        <span onClick={handleGenreClick} key={index} className="inline-block bg-primary/80 text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer hover:bg-doki-white hover:text-doki-purple">
                          {genre}
                        </span>
                      ))}
                    </div>
                    <p className="hidden md:line-clamp-3 text-lg font-hpSimplifiedbold">{stripHtmlTags(animeData[currentIndex].description)}</p>
                    <div className="flex space-x-4 mt-4">
                      {/* Detail Button */}
                      <button
                        onClick={navigateToPage}
                        className="relative text-sm px-4 py-2 font-lato bg-doki-dark-grey text-primary-foreground rounded-[21px] transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-doki-white before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 hover:text-doki-purple overflow-hidden cursor-pointer z-10 whitespace-nowrap"
                        aria-label="View Details"
                      >
                        Details &gt;
                      </button>
                      {/* Watch Button */}
                      <button
                        onClick={handleWatch}
                        className="relative text-sm px-4 py-2 font-lato bg-doki-dark-grey transition-all duration-500 ease-in-out shadow-md hover:scale-105 hover:shadow-lg before:absolute before:top-0 before:-left-full before:w-full before:h-full before:bg-doki-white before:transition-all before:duration-500 before:ease-in-out before:z-[-1] before:rounded-xl hover:before:left-0 hover:text-doki-purple text-primary-foreground rounded-[21px] overflow-hidden cursor-pointer z-10 flex items-center space-x-1"
                        aria-label="Watch Anime"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6 z-10"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
                          />
                        </svg>
                        <span className="">Watch</span>
                        {/* <span className="absolute rounded-xl w-full h-full bg-doki-white -left-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:left-0 duration-500" />
                        <span className="absolute rounded-xl w-full h-full bg-doki-white -right-32 top-0 -rotate-45 group-hover:rotate-0 group-hover:right-0 duration-500" /> */}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="w-1/2"></div>
              </div>
            </div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-doki-purple to-transparent"></div>
          </motion.div>
        ) : (
          // If no valid banner, render nothing or a placeholder
          <motion.div
            key="placeholder"
            className="absolute inset-0 flex items-center justify-center bg-doki-dark-grey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-white">No Banner Available</span>
          </motion.div>
        )}


      </AnimatePresence>



      {/* Navigation dots - Vertical on mobile, horizontal on desktop */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:flex-row md:gap-3 md:bottom-4 md:left-2/3 md:translate-x-1/2 md:top-auto">
        {animeData.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isValidBanner(index)) {
                setCurrentIndex(index);
              }
            }}
            className={`w-3 h-3 rounded-full transition-all
              ${index === currentIndex
                ? "bg-primary scale-125"
                : "bg-white/50 hover:bg-white/75"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows - Hidden on mobile */}
      <div className="hidden md:block">
        <button
          onClick={prevSlide}
          className="absolute right-4 top-[300px] -translate-y-1/2 bg-doki-dark-grey/50 text-white p-2 rounded-lg hover:bg-black/75 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-doki-dark-grey/50 text-white p-2 rounded-lg hover:bg-black/75 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

const BannerCarouselSkeleton = () => (
  <div className="relative w-full h-[400px] overflow-hidden rounded-none bg-doki-dark-grey animate-pulse">
    <div className="absolute inset-0 flex items-end p-8">
      <div className="w-full">
        <div className="h-12 bg-doki-light-grey rounded-[12px] w-3/4 mb-4"></div>
        <div className="h-8 bg-doki-light-grey rounded-[12px] w-1/2"></div>
      </div>
      {/* <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-doki-purple/80 to-transparent"></div> */}
    </div>
  </div>
)

export default Home