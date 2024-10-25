/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
// import { start } from "repl";
import { useAnimeContext } from "../../AnimeContext";
import { AnimeCard } from "../AnimeCard";
import { AnimeData } from "../../interfaces/AnimeData";

export const AnimeAiringStack = () => {
  const [animeData, setAnimeData] = useState<AnimeData[]>([]); // State to hold the data
  const carouselRef = useRef<HTMLDivElement>(null);
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

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  // Render the component
  return (
    <div className="relative">
      <div className="p-3 m-7 sm:m-0 sm:mb-7 rounded-[16px] sm:rounded-none bg-doki-light-grey backdrop-blur-lg">
        <h2 className="text-2xl sm:text-4xl font-lato text-doki-purple pl-3 flex items-center">
          Watching
          <span className="flex items-center ml-2">
            <span className="w-2.5 h-2.5 bg-green-300 rounded-full mr-1"></span>
            <p className="text-base text-doki-purple font-bold font-poppins text-opacity-50">
              Airing
            </p>
          </span>
        </h2>
        <hr className="border border-doki-purple my-4" />
        <div className="relative overflow-hidden">
          {animeData && animeData.length > 0 ? (
            <div
              className="flex gap-1 overflow-x-auto overflow-y-hidden"
              ref={carouselRef}
            >
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
      </div>
      {/* Left Navigation Button */}
      <button
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 sm:-translate-x-12 h-full 
       w-14 sm:w-12 bg-doki-dark-grey hidden sm:flex 
        justify-center items-center hover:bg-doki-white rounded-l-[16px] transition-colors duration-300"
        onClick={scrollLeft}
      >
        <svg
          width="40"
          height="24"
          viewBox="0 0 52 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="-rotate-90"
        >
          <path
            d="M45 25L26 7L7 25"
            stroke="#2F3672"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Right Navigation Button */}
      <button
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 sm:translate-x-12 h-full w-10 sm:w-12 bg-doki-dark-grey text-doki-purple hidden sm:flex justify-center items-center hover:bg-doki-white rounded-r-[16px] transition-colors duration-300"
        onClick={scrollRight}
      >
        <svg
          width="40"
          height="24"
          viewBox="0 0 52 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="rotate-90"
        >
          <path
            d="M45 25L26 7L7 25"
            stroke="#2F3672"
            strokeWidth="9"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};
