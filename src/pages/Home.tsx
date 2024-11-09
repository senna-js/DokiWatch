import { AnimeDataStack } from "../components/AnimeStacks/AnimeDataStack";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { AnimeCardData } from "../components/AnimeCard";
import { consumetAnilistSearch, ConsumetAnilistSearchParams } from "../Hooks/LoadBalancer";
import { useAnilistAuth } from "../AnilistContext";

const Home = () => {
  const { isSignedIn } = useUser();
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeCardData[]>([]);
  const [watchingAiringAnime, setWatchingAiringAnime] = useState<AnimeCardData[]>([]);
  const [watchingAiredAnime, setWatchingAiredAnime] = useState<AnimeCardData[]>([]);
  const { authState, getList } = useAnilistAuth();

  // Loading states
  const [loadingTopAiring, setLoadingTopAiring] = useState<boolean>(true);
  const [loadingWatchingAiring, setLoadingWatchingAiring] = useState<boolean>(true);
  const [loadingWatchingAired, setLoadingWatchingAired] = useState<boolean>(true);

  useEffect(() => {
    const getTopAiringAnime = async () => {
      const params: ConsumetAnilistSearchParams = {
        sort: ["TRENDING_DESC"],
        status: "RELEASING",
      };
      const response = await consumetAnilistSearch(params);
      // console.log(response.data.results)
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
          currentEpisode: anime.currentEpisode
        }
        return topAnime;
      }));
      setLoadingTopAiring(false);
    }
    getTopAiringAnime();
  }, []);

  useEffect(() => {
    const getWatchingAnime = async () => {
      setLoadingWatchingAiring(true);
      setLoadingWatchingAired(true);

      const watchingAnimeData = await getList("CURRENT");

      const watchingAiringAnimeData = watchingAnimeData.filter((anime) => anime.status === "RELEASING");
      const watchingAiredAnimeData = watchingAnimeData.filter((anime) => anime.status === "FINISHED");

      console.log("Releasing", watchingAiringAnimeData)
      console.log("Released", watchingAiredAnimeData)

      setWatchingAiringAnime(watchingAiringAnimeData);
      setWatchingAiredAnime(watchingAiredAnimeData);
      setLoadingWatchingAiring(false);
      setLoadingWatchingAired(false);
    };
    getWatchingAnime();
  }, [authState]);
  return (
    <div className="sm:mx-[75px] md:mx-[150px]">
      <motion.div
        className="pl-10 sm:pl-0 relative"
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
          Welcome to Doki Watch
        </motion.h1>
        {/* <motion.p
            className="mt-2 text-sm sm:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Explore your favorite anime & manga here.
          </motion.p> */}
      </motion.div>
      <motion.div
        className="mt-8 m-7"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {loadingTopAiring ? (
          // Skeleton for Top Airing
          <div className="animate-pulse">
            <div className="h-8 bg-doki-light-grey rounded-[12px] w-1/3 mb-4"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index}>
                  <div className="h-48 bg-doki-dark-grey rounded-[12px] mb-4"></div>
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
                      <div className="h-48 bg-doki-dark-grey rounded-[12px] mb-4"></div>
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
                      <div className="h-48 bg-doki-dark-grey rounded-[12px] mb-4"></div>
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
  );
};

export default Home;
