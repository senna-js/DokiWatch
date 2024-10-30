// import { AnimeWatchingStack } from "../components/AnimeStacks/temp-[AnimeWatchingStack]";
import { AnilistStack } from "../components/AnimeStacks/AnilistStack";
import { AnimeDataStack } from "../components/AnimeStacks/AnimeDataStack";
import { useEffect, useState } from "react";
// import { TopAiringAnimeStack } from "../components/AnimeStacks/topAiringStack";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { AnimeData } from "../interfaces/AnimeData";
import { consumetAnilistSearch, ConsumetAnilistSearchParams } from "../Hooks/LoadBalancer";

const Home = () => {
  const { isSignedIn } = useUser();
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeData[]>([]);

  useEffect(() => {
    const getTopAiringAnime = async () => {
      const params: ConsumetAnilistSearchParams = {
        status: "RELEASING"
      };
      const response = await consumetAnilistSearch(params);
      // console.log(response.data.results)
      setTopAiringAnime(response.data.results.map((anime:any)=>{
        const topAnime:AnimeData = {
          id:anime.id,
          idMal:anime.malId,
          title:anime.title,
          color:anime.color,
          image:anime.image
        }
        return topAnime;
      }));
    }
    getTopAiringAnime();
  }, []);
  return (
    <div className="mr-[30px] sm:mx-[75px] md:mx-[150px]">
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
        <AnimeDataStack animeData={topAiringAnime} />
      </motion.div>
      {isSignedIn && (
        <div className="mt-16">
          <motion.div
            className="m-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <AnilistStack status="CURRENT" />
          </motion.div>
          <motion.div
            className="m-7 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {/* <AnimeWatchingStack /> */}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
