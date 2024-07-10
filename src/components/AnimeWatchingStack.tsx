/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { start } from "repl";
import { useAnimeContext } from "../AnimeContext";
import { AnimeCard } from "./AnimeCard";
import { AnimeData } from "../interfaces/AnimeData";

export const AnimeWatchingStack = (props: AnimeStackProps) => {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]); // State to hold the data
  let accessToken: unknown;
  const user = localStorage.getItem("user");
  ///////////////////////////////
  let username: string | undefined;
  if (user) {
    username = JSON.parse(localStorage.getItem("user") as string).username;
    if (JSON.parse(localStorage.getItem("user") as string).access_token) {
      accessToken = JSON.parse(
        localStorage.getItem("user") as string
      ).access_token;
    }
    else {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      accessToken = hashParams.get("access_token");
      const user = JSON.parse(localStorage.getItem("user") as string);
      user["access_token"] = accessToken;
      localStorage.setItem("user", JSON.stringify(user));

      if (!accessToken) {
        console.log("No access token found or its over,connect to anilist");
      }
    }
  } else {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    accessToken = hashParams.get("access_token");
    const user = JSON.parse(localStorage.getItem("user") as string);
    user["access_token"] = accessToken;
    localStorage.setItem("user", JSON.stringify(user));

    if (!accessToken) {
      console.log("No access token found or its over,connect to anilist");
    }
  }

  // accessToken = "hi";
  // let username = "itzKirito";
  const { triggerFetch, setTriggerFetch } = useAnimeContext();
  useEffect(() => {
    const fetchData = async () => {
      if (!triggerFetch) return;

      const query = `
          query ($username: String) {
            MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
              lists {
                name
                entries {
                  mediaId
                  status
                  score
                  progress
                  media {
                    title {
                      romaji
                      english
                    }
                    idMal
                    coverImage {
                      large
                    }
                    bannerImage
                    status(version: 1)
                    season
                    episodes
                  }
                }
              }
            }
          }
        `;

      const variables = {
        username: username,
      };

      try {
        // console.log("fetching anime list", accessToken);
        const response = await fetch("https://graphql.anilist.co", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            query,
            variables,
          }),
        });

        const { data } = await response.json();
        // console.log(data);

        if (
          data &&
          data.MediaListCollection &&
          data.MediaListCollection.lists
        ) {
          const lists = data.MediaListCollection.lists;
          const animeList: AnimeData[] = lists.flatMap((list: any) =>
            list.entries.filter((entry:any)=>(entry.media.status === "FINISHED"))
            .map((entry: any) => ({
              mal_id: entry.media.idMal,
              title: {
                romaji: entry.media.title.romaji,
                english: entry.media.title.english
              },
              image: {
                large: entry.media.coverImage.large,
                color: entry.media.coverImage.color
              }
            }))
          );
          setAnimeData(animeList); // Set the fetched data
          setTriggerFetch(false); // Reset the trigger fetch flag
        }
      } catch (error) {
        console.error("Error fetching anime list:", error);
      }
    };

    fetchData();
  }, [triggerFetch]); // Trigger fetch when the context value changes

  // Render the component
  return (
    <div className="flex-row p-4 m-6 rounded-md bg-gray-800 ">
      <h2 className="text-xl">Anime Watching</h2>
      <hr className="my-4" />
      {animeData && (
        <div className="flex gap-4 overflow-x-auto">
          {
            animeData.map((anime) => (
              <div key={anime?.mal_id}>
                <AnimeCard anime={anime} />
                {/* More anime details */}
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};
interface AnimeStackProps {
  type: string;
}
