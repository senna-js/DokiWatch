/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { AnimeCardData } from "../AnimeCard";
import { useAnilistContext } from "../../AnilistContext";
import { AnimeDataStack } from "./AnimeDataStack";

export const AnilistStack: React.FC<StackType> = ({ status }) => {
  const [animeData, setAnimeData] = useState<AnimeCardData[]>([]); // State to hold the data
  const { authState, getList } = useAnilistContext();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAnimeData = await getList(status);

      setAnimeData(fetchedAnimeData);
    };
    fetchData();
  }, [authState]);

  return (
    <AnimeDataStack animeData={animeData} heading="Watching" subheading={{ color: "bg-green-300", text: "Airing" }} />
  );
};


interface StackType {
  status: "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";
}