/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
// import { start } from "repl";
import { useAnimeContext } from "../AnimeContext";
import { AnimeCard } from "./AnimeCard";
import { AnimeData } from "../interfaces/AnimeData";

export const AnimeAiringStack = () => {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]); // State to hold the data
  let accessToken: unknown;

  //token is now set inside the user object, prev it was set as a different variable in localstorage
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token") as string;

  let userObject;

  if (user) {
    userObject = JSON.parse(user);
  } else {
    userObject = {};
  }
  console.log("user ache", user);
  if (token) {
    userObject["access_token"] = token;
  }
  //localStorage.setItem("user", JSON.stringify(userObject));

  ///////////////////////////////
  let username: string | undefined;
  if (user) {
    username = JSON.parse(localStorage.getItem("user") as string).username;
    if (JSON.parse(localStorage.getItem("user") as string).access_token) {
      accessToken = JSON.parse(
        localStorage.getItem("user") as string
      ).access_token;
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
  } else {
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (!hashParams.get("access_token")) {
      return;
    }
    accessToken = hashParams.get("access_token");
    const user = JSON.parse(localStorage.getItem("user") as string);
    if (!user) return;
    user["access_token"] = accessToken;
    localStorage.setItem("user", JSON.stringify(user));

    if (!accessToken) {
      console.log("No access token found or its over,connect to anilist");
    }
  }

  // accessToken = "hi";
  // let username = "itzKirito";
  let { triggerFetch, setTriggerFetch } = useAnimeContext();
  if (accessToken) {
    triggerFetch = true;
  }
  useEffect(() => {
    const fetchData = async () => {
      //console.log("fetching anime list", accessToken, triggerFetch);
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
                      extraLarge
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

        if (
          data &&
          data.MediaListCollection &&
          data.MediaListCollection.lists
        ) {
          const lists = data.MediaListCollection.lists;
          console.log(lists);
          const animeList: AnimeData[] = lists.flatMap((list: any) =>
            list.entries
              .filter((entry: any) => entry.media.status === "RELEASING")
              .map((entry: any) => ({
                mal_id: entry.media.idMal,
                title: entry.media.title.romaji,
                title_english: entry.media.title.english,
                image: entry.media.coverImage.extraLarge,
                mediaId: entry.mediaId,
              }))
          );
          // console.log(animeList);
          var mediaIdList = {};
          if (lists[0].entries.length === 0) {
            console.log("No anime found in the list");
          } else {
            mediaIdList = lists[0].entries.map((entry: any) => ({
              mal_id: entry.media.idMal,
              mediaId: entry.mediaId,
              progress: entry.progress,
            }));
          }

          //console.log(mediaIdList);
          sessionStorage.setItem("mediaIdList", JSON.stringify(mediaIdList));
          setAnimeData(animeList); // Set the fetched data
          setTriggerFetch(false); // Reset the trigger fetch flag
        } else {
          console.log("No data found");
        }
      } catch (error) {
        console.error("Error fetching anime list:", error);
      }
    };

    fetchData();
  }, [triggerFetch]); // Trigger fetch when the context value changes

  // Render the component
  return (
    <div className="flex-row p-4 m-3 rounded-md bg-transparent backdrop-blur-lg border border-white">
      <h2 className="text-2xl font-poppins pl-3 ">Anime Airing</h2>
      <hr className="my-4" />
      {animeData && animeData.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto overflow-y-hidden">
          {animeData.map((anime) => (
            <div key={anime?.mal_id}>
              <AnimeCard anime={anime} />
              {/* More anime details */}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-end text-white font-poppins text-opacity-50 cursor-help">
          Connect to Anilist
        </div>
      )}
    </div>
  );
};
