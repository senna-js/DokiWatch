/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AnimeData } from "../../interfaces/AnimeData";
import { useAnilistAuth, anilistQuery } from "../../Hooks/Anilist";
import { AnimeDataStack } from "./AnimeDataStack";

export const AnilistStack: React.FC<StackType> = ({ status }) => {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]); // State to hold the data
  const { user, authState } = useAnilistAuth();

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

  return (
    <AnimeDataStack animeData={animeData} heading="Watching" subheading={{color:"bg-green-300",text:"Airing"}}/>
  );
};


interface StackType {
  status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";
}