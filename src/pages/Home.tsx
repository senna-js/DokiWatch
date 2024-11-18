import { AnimeDataStack } from "../components/AnimeStacks/AnimeDataStack"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useUser } from "@clerk/clerk-react"
import { AnimeCardData } from "../components/AnimeCard"
import { consumetAnilistSearch, ConsumetAnilistSearchParams } from "../Hooks/LoadBalancer"
import { useAnilistAuth } from "../AnilistContext"
import { ChevronLeft, ChevronRight } from 'lucide-react'

const Home = () => {
  const { isSignedIn } = useUser()
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeCardData[]>([])
  const [watchingAiringAnime, setWatchingAiringAnime] = useState<AnimeCardData[]>([])
  const [watchingAiredAnime, setWatchingAiredAnime] = useState<AnimeCardData[]>([])
  const { authState, getList } = useAnilistAuth()

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
      setTopAiringAnime(response.data.results.map((anime: any) => {
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
        }
        console.log("bannerImage", topAnime.bannerImage)
        return topAnime
      }))
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
        className="absolute hidden sm:block top-4 left-4 z-10 sm:left-0 sm:-mx-28"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="font-bold font-hpSimplifiedbold ml-5 sm:ml-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ fontSize: "clamp(1.5rem, 4vw + 1rem, 4.375rem)" }}
        >
          Welcome to Doki Watch !
        </motion.h1>
      </motion.div>
      <div className="mx-auto md:-mx-40">
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
      {isSignedIn && (
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768)

  const handleResize = () => {
    setIsMobile(window.innerWidth < 768)
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % animeData.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + animeData.length) % animeData.length)
  }

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [])

  // Function to strip HTML tags from description
  const stripHtmlTags = (html: string) => {
    const tmp = document.createElement("DIV")
    tmp.innerHTML = html
    return tmp.textContent || tmp.innerText || ""
  }

  const backgroundImage = isMobile
    ? animeData[currentIndex].image
    : animeData[currentIndex].bannerImage

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden rounded-none md:rounded-lg mb-8">
      <AnimatePresence initial={false}>
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
              <div className="sm:w-1/2 w-3/2 bg-gradient-to-r from-black to-transparent flex flex-col justify-end p-8">
                <div className="text-white">
                  <h2 className="text-2xl md:text-4xl font-bold font-lato text-white mb-2">{animeData[currentIndex].title.english || animeData[currentIndex].title.romaji}</h2>
                  <div className="hidden md:flex flex-wrap gap-2 mb-4">
                    {animeData[currentIndex].genres.map((genre, index) => (
                      <span key={index} className="inline-block bg-primary/80 text-primary-foreground rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className="hidden md:line-clamp-4 text-lg font-hpSimplifiedbold">{stripHtmlTags(animeData[currentIndex].description)}</p>
                </div>
              </div>
              <div className="w-1/2"></div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      {/* Navigation dots - Vertical on mobile, horizontal on desktop */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 md:flex-row md:gap-3 md:bottom-4 md:left-1/2 md:translate-x-1/2 md:top-auto">
        {animeData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
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
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/75 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}

const BannerCarouselSkeleton = () => (
  <div className="relative w-full h-[400px] overflow-hidden rounded-lg bg-doki-dark-grey animate-pulse">
    <div className="absolute inset-0 flex items-end p-8">
      <div className="w-full">
        <div className="h-8 bg-doki-light-grey rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-doki-light-grey rounded w-1/2"></div>
      </div>
    </div>
  </div>
)

export default Home