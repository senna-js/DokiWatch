
import React, { useState, useEffect } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import axios from "axios";
import "./Watch.css";
import * as Realm from "realm-web";
import { currEpisodeData } from "../interfaces/CurrEpisodeData";
import { VideoPlayer } from "../components/VideoPlayer";
import { DiscussionEmbed } from "disqus-react";
import { CommentCount } from 'disqus-react';
import { Console } from "console";

interface AnimeData {
  id: string;
  title: string;
  malID: number;
  alID: number;
  image: string;
  description: string;
  totalEpisodes: number;
  hasSub: boolean;
  hasDub: boolean;
}

interface Episode {
  id: string;
  number: number;
  title: string;
}

interface mongoAnime {
  mal_id: number;
  al_id: number;
  zoro_id: string;
}

export const Watch: React.FC = () => {
  const [animeData, setAnimeData] = useState<AnimeData>();
  const [episodesData, setEpisodesData] = useState<Episode[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodeId, setEpisodeId] = useState<string>();
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>();
  const [currentEpisode, setCurrentEpisode] = useState<currEpisodeData>();
  const params = useParams();
  const { id: pathId } = useParams();
  const app = new Realm.App({ id: "application-0-lrdgzin" });
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  // Toggle function
  const toggleCommentsVisibility = () => {
    setIsCommentsVisible(!isCommentsVisible);
  };

  useEffect(() => {
    if (animeData?.malID == params.id) return;

    const fetchAnimeData = async (mongo: globalThis.Realm.Services.MongoDB) => {
      const animeResponses: any = (
        await axios.get(
          `https://consumet-deploy.vercel.app/anime/zoro/${searchParams.get(
            "id"
          )}`
        )
      ).data.results;
      for (let i = 0; i < animeResponses.length; i++) {
        const anime = animeResponses[i];
        try {
          const response = await axios.get(
            `https://consumet-deploy.vercel.app/anime/zoro/info?id=${anime.id}`
          );
          console.log(anime.id);
          if (response.data.malID == params.id) {
            setAnimeData(response.data);
            setEpisodesData(response.data.episodes);
            console.log("SELECTED:");
            console.log(response.data);

            const newAnime: mongoAnime = {
              mal_id: response.data.malID,
              al_id: response.data.alID,
              zoro_id: response.data.id,
            };
            const databaseAnime = await mongo
              .db("Zoro")
              .collection("mappings")
              .findOne({ mal_id: response.data.malID });
            if (!databaseAnime) {
              console.log("Inserting new anime into database", newAnime);
              await mongo.db("Zoro").collection("mappings").insertOne(newAnime);
            }
            return;
          }
        } catch (error) {
          console.error("Error fetching anime data:", error);
        }
      }
    };

    const fetchDatabase = async () => {
      const user = await app.logIn(
        Realm.Credentials.apiKey(import.meta.env.VITE_MONGO_API_KEY)
      );
      const mongo = user.mongoClient("mongodb-atlas");
      const anime = await mongo
        .db("Zoro")
        .collection("mappings")
        .findOne({ mal_id: parseInt(params.id || "-1") });
      console.log(anime);
      if (anime) {
        const animeData = await axios.get(
          `https://consumet-deploy.vercel.app/anime/zoro/info?id=${anime.zoro_id}`
        );
        setAnimeData(animeData.data);
        setEpisodesData(animeData.data.episodes);
        console.log("Anime found in database");
        console.log("SELECTED:");
        console.log(animeData.data);
      } else {
        console.log("Anime not found in database");
        fetchAnimeData(mongo);
      }
    };
    fetchDatabase();

    return () => {
      console.log("closing database connection");
      app.currentUser?.logOut();
    };
  }, [params]);

  useEffect(() => {
    setCurrentEpisodeNumber(parseInt(searchParams.get("ep") || "-1"));
  }, [searchParams]);

  useEffect(() => {
    if (!animeData || !(episodesData.length > 0) || !currentEpisodeNumber)
      return;
    setEpisodeId(episodesData[currentEpisodeNumber - 1].id);
  }, [animeData, episodesData, currentEpisodeNumber]);

  useEffect(() => {
    if (!episodeId) return;
    const fetchEpisodeData = async () => {
      const subResponse = axios.get(
        `https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${episodeId}`
      );
      const dubResponse = axios.get(
        `https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${episodeId.replace(
          /(\$both|\$sub)$/,
          "$dub"
        )}`
      );
      const results = await Promise.allSettled([subResponse, dubResponse]);

      let subData = results[0].status === "fulfilled" ? results[0].value : null;
      const dubData =
        results[1].status === "fulfilled" ? results[1].value : null;

      if (!subData) {
        console.log("Converting episode id");
        const newId = episodeId.includes("$both")
          ? episodeId.replace("$both", "$sub")
          : episodeId.replace("$sub", "$both");
        subData = await axios.get(
          `https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${newId}`
        );
      }
      if (!subData && !dubData) {
        console.log("Incorrect Episode id");
      } else if (subData) {
        const episodeData: currEpisodeData = {
          intro: subData.data.intro,
          outro: subData.data.outro,
          sources: {
            sub: subData.data.sources[0].url.replace(
              /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
              "/api-$1"
            ),
            dub: dubData?.data.sources[0].url.replace(
              /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
              "/api-$1"
            ),
          },
          thumbnailSrc: subData.data.subtitles
            .find((sub: any) => sub.lang === "Thumbnails")
            .url.replace("https://s.megastatics.com/thumbnails", "/api-thumb"),
          dubThumbnailSrc: dubData?.data.subtitles
            .find((sub: any) => sub.lang === "Thumbnails")
            .url.replace("https://s.megastatics.com/thumbnails", "/api-thumb"),
          subtitles: subData.data.subtitles
            .filter((sub: any) => sub.lang !== "Thumbnails")
            .map((sub: any) => ({
              url: sub.url.replace(
                "https://s.megastatics.com/subtitle",
                "/api-sub"
              ),
              lang: sub.lang,
            })),
          dubSubtitles: dubData?.data.subtitles
            .filter((sub: any) => sub.lang !== "Thumbnails")
            .map((sub: any) => ({
              url: sub.url.replace(
                "https://s.megastatics.com/subtitle",
                "/api-sub"
              ),
              lang: sub.lang,
            })),
        };
        //remove duplicate subtitles
        episodeData.subtitles = episodeData.subtitles.filter(
          (sub, index, self) =>
            index === self.findIndex((t) => t.lang === sub.lang)
        );
        episodeData.dubSubtitles = episodeData.dubSubtitles?.filter(
          (sub, index, self) =>
            index === self.findIndex((t) => t.lang === sub.lang)
        );

        console.log(episodeData);
        setCurrentEpisode(episodeData);
      } else {
        console.log("Subdata not found, dubdata found");
      }
    };

    fetchEpisodeData();
  }, [episodeId]);

  useEffect(() => {
    console.log(currentEpisode);
  }, [currentEpisode]);

  const [isQueried, setIsQueried] = useState(false);
  // const queryAnilist = async () => {
  //   var user = localStorage.getItem("user");
  //   var accessToken = JSON.parse(user as string).access_token;
  //   const query = `
  //     query ($username: String ,$mediaId: Int) {
  //           MediaList(userName: $username,mediaId: $mediaId){
  //           id
  //           status
  //           progress
  //         }
  //     }`;
  //   const variables = {
  //     username: JSON.parse(localStorage.getItem("user") as string).username,
  //     mediaId: parseInt(pathId ?? ""),
  //   };
  //   console.log("variables", variables);
  //   const response = await axios.post(
  //     "https://graphql.anilist.co",
  //     {
  //       query,
  //       variables,
  //     },
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Accept: "application/json",
  //         Authorization: `Bearer ${accessToken}`,
  //       },
  //     }
  //   );

  //   // Access the response data
  //   const data = response.data;
  //   console.log(data);
  //   if (data.data.MediaList.status === "CURRENT") {
  //     return data.data.MediaList.progress;
  //   } else {
  //     console.log("Not watching this anime", data.data.MediaList.status);
  //   }
  // };
  const updateAnilist = async (progress: number, mediaID: number) => {
    try {
      var user = localStorage.getItem("user");
      var accessToken = JSON.parse(user as string).access_token;
      const query = `
      mutation ($mediaId: Int, $progress: Int) {
        SaveMediaListEntry(mediaId: $mediaId, progress: $progress) {
          id
          status
          progress
        }
      }
    `;

      console.log(typeof mediaID);

      const variables = {
        mediaId: mediaID,
        progress: parseInt(searchParams.get("ep") ?? ""),
      };

      console.log("variables", variables);

      const response = await axios.post(
        "https://graphql.anilist.co",
        {
          query,
          variables,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      // Access the response data
      const data = response.data;
      console.log(data);

      return true; // Indicate that the operation was successful
    } catch (error) {
      console.error("An error occurred while updating Anilist:", error);
      return false; // Indicate that an error occurred
    }
  };

  const handleProgress = async (state: any) => {
    setPlayedSeconds(state.playedSeconds);
    const percentageWatched = totalDuration
      ? (state.playedSeconds / totalDuration) * 100
      : 0;

    let mid = parseInt(pathId ?? "");
    const mediaIdList = JSON.parse(
      sessionStorage.getItem("mediaIdList") || "[]"
    );

    // Find the object that matches the given mal_id
    const foundItem = mediaIdList.find(
      (item: { mal_id: number; progress: number }) => item.mal_id === mid
    );

    // Extract the mediaId and progress if found, otherwise set to null
    const mediaId = foundItem ? foundItem.mediaId : null;
    const progress = foundItem ? foundItem.progress : null;

    // Update mid to use the found mediaId for further processing
    mid = mediaId;

    if (
      percentageWatched >= 80 &&
      !isQueried &&
      !isNaN(mid) &&
      currentEpisodeNumber &&
      currentEpisodeNumber > progress
    ) {
      let success = await updateAnilist(
        parseInt(searchParams.get("ep") as string),
        mid
      );

      if (success) {
        // If the update was successful, update the mediaIdList with the new progress
        const updatedList = mediaIdList.map(
          (item: { mal_id: number; mediaId: number; progress: number }) => {
            if (item.mediaId === mid) {
              return { ...item, progress: currentEpisodeNumber };
            }
            return item;
          }
        );

        // Save the updated list back to session storage
        sessionStorage.setItem("mediaIdList", JSON.stringify(updatedList));
        console.log("Media list updated successfully with new progress.");
      }

      setIsQueried(true); // Ensure this block is only executed once
    }
  };

  const handleDuration = (duration: number) => {
    setTotalDuration(duration);
  };

  const handleWatchEpisode = (episodeId: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("ep", episodeId.toString());
    setSearchParams(newSearchParams);
  };

  const handlePrev = () => {
    if (!currentEpisodeNumber) return;
    if (currentEpisodeNumber > 1) {
      handleWatchEpisode(currentEpisodeNumber - 1);
    } else {
      alert("You are watching the first episode");
    }
  };

  const handleNext = () => {
    if (!currentEpisodeNumber) return;
    console.log("currentEpisodeNumber", currentEpisodeNumber);
    console.log("episodesData.length", episodesData.length);
    if (currentEpisodeNumber === episodesData.length) {
      alert("You are watching the last episode");
    } else {
      handleWatchEpisode(currentEpisodeNumber + 1);
    }
  };
  return (
    <div className="sm:ml-16 sm:mt-5 ">
      <div className="flex flex-col-reverse sm:flex-row h-fit">
        <div className="flex flex-col py-2 bg-gray-800 h-fit max-h-[560px] sm:max-h-[624px] sm:h-[624px] sm:w-72 mx-1 sm:mx-0 border border-white sm:border-r-slate-500 backdrop-blur-lg text-center rounded-l-md rounded-r-md sm:rounded-r-none">
          <div className="text-center font-poppins font-semibold pb-2">
            EPISODES
          </div>
          <hr className="" />
          <div className="overflow-y-auto cursor-pointer scrollHide">
            {episodesData.map((episode, index) => (
              <div
                key={index}
                className={`relative flex justify-start items-center h-14 ${
                  episode.number == currentEpisodeNumber
                    ? "bg-gray-700"
                    : "bg-gray-800 hover:bg-gray-700"
                } transition-colors duration-150 ease-in-out`}
                onClick={() => {
                  handleWatchEpisode(episode.number);
                }}
              >
                {episode.number == currentEpisodeNumber && (
                  <div className="absolute inset-0 bg-gray-600 animate-slideIn z-0"></div>
                )}
                <div
                  className={`w-1 relative bg-blue-500 h-full transition-opacity duration-500 ease-in-out ${
                    episode.number == currentEpisodeNumber
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                ></div>
                <div className="relative z-10 hover:text-pink-200 ml-2 text-border-white font-poppins cursor-pointer truncate">
                  {episode.number}. {episode.title}
                </div>
                {/* <div className="sm:hidden text-white mx-auto font-poppins">
                  E-{episode.number}
                </div> */}
              </div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-4xl relative">
          {currentEpisode && currentEpisodeNumber ? (
            <div className="sm:w-[1000px]">
              <VideoPlayer
                currentEpisode={currentEpisode}
                handlePreviousEpisode={handlePrev}
                handleNextEpisode={handleNext}
                hasPreviousEpisode={currentEpisodeNumber > 1}
                hasNextEpisode={currentEpisodeNumber < episodesData.length}
                onProgress={handleProgress}
                onDuration={handleDuration}
              />
              <div className="bg-gray-800 border border-white backdrop-blur-lg rounded-ee-md h-auto sm:h-14 flex flex-row sm:flex-row items-center mb-1 mx-1 sm:mx-0 px-4 py-1 mt-1 sm:mt-0">
                <div className="flex-1 flex flex-col sm:flex-row justify-center items-center sm:mt-0">
                  {/* Find the current episode and display its title */}
                  <p className="whitespace-nowrap text-xs sm:text-sm font-poppins font-semibold text-white px-1 pl-2 p-1 truncate">
                    CURRENT EPISODE:{" "}
                  </p>
                  <p className="truncate whitespace-normal sm:whitespace-nowrap text-xs sm:text-sm mr-2 flex items-center font-poppins bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg px-1 p-1 rounded-md font-semibold">
                    {currentEpisodeNumber} -{" "}
                    {
                      episodesData.find(
                        (episode) => episode.number === currentEpisodeNumber
                      )?.title
                    }
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <span className="loading loading-spinner text-info"></span>
              <p className="ml-2 font-poppins font-semibold">loading..</p>
            </div>
          )}
        </div>
      </div>
      <div
        id="jjk"
        className="mt-2 bg-transparent backdrop-blur-lg border border-white text-center rounded-md py-2"
      >
        {/* {`${params.id} - ${currentEpisodeNumber}`} */}
        {/* Toggle Button */}
        <div className="toggle-container justify-center items-center mb-4">
          <input
            type="checkbox"
            id="toggle-comments"
            className="toggle-checkbox"
            onChange={toggleCommentsVisibility}
          />
          <label htmlFor="toggle-comments" className="toggle-label">
            <span className="toggle-inner" />
            <span className="toggle-switch" />
          </label>
          <span className="whitespace-nowrap font-anime">
            {isCommentsVisible ? "Hide Comments" : "Show Comments"}
          </span>
        </div>

        {/* Conditional rendering based on isCommentsVisible */}
        {isCommentsVisible && (
          <>
            <div className="disqus-container">
              <DiscussionEmbed
                shortname="doki-watch"
                config={{
                  url: window.location.href,
                  identifier: `${params.id}-${currentEpisodeNumber}`,
                  title: `Episode ${currentEpisodeNumber}`,
                  language: "en", // e.g. for Traditional Chinese (Taiwan)
                }}
              />
              <CommentCount
                shortname="doki-watch"
                config={{
                  url: window.location.href,
                  identifier: `${params.id}-${currentEpisodeNumber}`,
                  title: `Episode ${currentEpisodeNumber}`,
                }}
              >
                {/* Placeholder Text */}
                Comments
              </CommentCount>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
