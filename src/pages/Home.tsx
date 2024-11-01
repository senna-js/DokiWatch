import { AnimeDataStack } from "../components/AnimeStacks/AnimeDataStack";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { AnimeCardData } from "../components/AnimeCard";
import { consumetAnilistSearch, ConsumetAnilistSearchParams } from "../Hooks/LoadBalancer";
import { useAnilistAuth, anilistQuery } from "../AnilistContext";

const Home = () => {
  const { isSignedIn } = useUser();
  const [topAiringAnime, setTopAiringAnime] = useState<AnimeCardData[]>([]);
  const [watchingAiringAnime, setWatchingAiringAnime] = useState<AnimeCardData[]>([]);
  const [watchingAiredAnime, setWatchingAiredAnime] = useState<AnimeCardData[]>([]);
  const { user, authState } = useAnilistAuth();

  useEffect(() => {
    const getTopAiringAnime = async () => {
      const params: ConsumetAnilistSearchParams = {
        status: "RELEASING"
      };
      const response = await consumetAnilistSearch(params);
      // console.log(response.data.results)
      setTopAiringAnime(response.data.results.map((anime: any) => {
        const topAnime: AnimeCardData = {
          id: anime.id,
          idMal: anime.malId,
          title: anime.title,
          color: anime.color,
          image: anime.image.replace("/large/","/medium/")
        }
        return topAnime;
      }));
    }
    getTopAiringAnime();
  }, []);

  useEffect(() => {
    const getWatchingAnime = async () => {
      if (authState !== "authenticated")
        return;
      if (!user) {
        console.log("Invalid authState", authState, user);
        return;
      }
      console.log("Fetching Watching Anime");
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
                medium
                color
              }
              status
              episodes
              nextAiringEpisode {
                episode
                timeUntilAiring
              }
            }
          }
        }
      }`;

      const variables = {
        page: 1,
        perPage: 50,
        userId: user.id,
        type: "ANIME",
        status: "CURRENT"
      };

      const response = await anilistQuery(query, variables, undefined, true);

      const mediaList: [any] = response.data.Page.mediaList;

      const watchingAiringAnimeData: AnimeCardData[] = mediaList.filter((media: any) => media.media.status === "RELEASING")
        .map((media: any) => {
          const anime: AnimeCardData = {
            id: media.media.id,
            idMal: media.media.idMal,
            title: {
              romaji: media.media.title.romaji,
              english: media.media.title.english,
            },
            image: media.media.coverImage.medium,
            color: media.media.coverImage.color,
          };
          return anime;
        });

      const watchingAiredAnimeData: AnimeCardData[] = mediaList.filter((media: any) => media.media.status === "FINISHED")
        .map((media: any) => {
          const anime: AnimeCardData = {
            id: media.media.id,
            idMal: media.media.idMal,
            title: {
              romaji: media.media.title.romaji,
              english: media.media.title.english,
            },
            image: media.media.coverImage.medium,
            color: media.media.coverImage.color,
          };
          return anime;
        });

      console.log("Releasing", watchingAiringAnimeData)
      console.log("Released", watchingAiredAnimeData)

      setWatchingAiringAnime(watchingAiringAnimeData);
      setWatchingAiredAnime(watchingAiredAnimeData);
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
        <AnimeDataStack animeData={topAiringAnime} heading="Top Airing" />
      </motion.div>
      {isSignedIn && (
        <div className="mt-16">
          <motion.div
            className="m-7"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <AnimeDataStack animeData={watchingAiringAnime} heading="Watching" subheading={{ text: "Airing", color: "bg-green-300" }} />
          </motion.div>
          <motion.div
            className="m-7 mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <AnimeDataStack animeData={watchingAiredAnime} heading="Watching" subheading={{ text: "Aired", color: "bg-blue-500" }} />
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Home;
