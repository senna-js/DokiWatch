/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import "./Watch.css";
import { SkipPrevious } from "@mui/icons-material";
import { SkipNext } from "@mui/icons-material";
import Hls from "hls.js";
import * as Realm from "realm-web";

interface Quality {
  level: number;
  label: string;
}

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

interface currEpisodeData {
  sources: {
    sub: string;
    dub?: string;
  };
  subtitles: {
    url: string;
    lang: string;
  }[];
  intro: {
    start: number;
    end: number;
  };
  outro: {
    start: number;
    end: number;
  };
}

enum StreamType {
  sub,
  dub
}

interface mongoAnime {
  mal_id: number;
  al_id: number;
  zoro_id: string;
}

export const Watch: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamType, setStreamType] = useState<StreamType>(StreamType.sub);
  const [qualitiesList, setQualitiesList] = useState<Quality[]>([]);
  const [qualityLevel, setQualityLevel] = useState<number | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [animeData, setAnimeData] = useState<AnimeData>();
  const [episodesData, setEpisodesData] = useState<Episode[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [episodeId, setEpisodeId] = useState("");
  // const [progress, setProgress] = useState<number>(0);
  const [subtitleurl, setSubtitleUrl] = useState<string>("");
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(
    parseInt(searchParams.get("ep") || "-1")
  );
  const [currentEpisode, setCurrentEpisode] = useState<currEpisodeData>();
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const params = useParams();
  const playerRef: any = useRef(null);
  const app = new Realm.App({ id: "application-0-lrdgzin" });


  useEffect(() => {
    let hls: any;

    if (playerRef.current) {
      const player = playerRef.current.getInternalPlayer();

      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(streamUrl);
        hls.attachMedia(player);

        hls.on(Hls.Events.MANIFEST_LOADED, () => {
          const levels: Quality[] = hls.levels.map(
            (level: any, index: any) => ({
              level: index,
              label: `${level.height}p`,
            })
          );
          setQualitiesList(levels);

          // Set to highest quality by default
          if (qualityLevel == null) {
            const highestQualityIndex = hls.levels.length - 1;
            hls.currentLevel = highestQualityIndex;
            setQualityLevel(highestQualityIndex);
          }

          // If a specific qualityLevel is set, use it instead
          if (
            qualityLevel !== null &&
            qualityLevel >= 0 &&
            qualityLevel < hls.levels.length
          ) {
            hls.currentLevel = qualityLevel;
          }
        });

        // Listen for quality level changes outside of manifest loading
        if (
          qualityLevel !== null &&
          qualityLevel >= 0 &&
          qualityLevel < hls.levels.length
        ) {
          hls.currentLevel = qualityLevel;
        }
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamUrl, qualityLevel]);

  useEffect(() => {
    if (animeData?.malID == params.id) return;

    const fetchAnimeData = async (mongo: globalThis.Realm.Services.MongoDB) => {
      const animeResponses: any = (await axios.get(`https://consumet-deploy.vercel.app/anime/zoro/${searchParams.get("id")}`)).data.results;
      for (let i = 0; i < animeResponses.length; i++) {
        const anime = animeResponses[i];
        try {
          const response = await axios.get(`https://consumet-deploy.vercel.app/anime/zoro/info?id=${anime.id}`);
          console.log(anime.id);
          if (response.data.malID == params.id) {
            setAnimeData(response.data);
            setEpisodesData(response.data.episodes);
            console.log("SELECTED:");
            console.log(response.data);

            const newAnime: mongoAnime = {
              mal_id: response.data.malID,
              al_id: response.data.alID,
              zoro_id: response.data.id
            }
            mongo.db("Zoro").collection("mappings").findOneAndReplace({ mal_id: response.data.malID }, newAnime, { upsert: true });
            return;
          }
        } catch (error) {
          console.error("Error fetching anime data:", error);
        }
      }
    };

    const fetchDatabase = async () => {
      const user = await app.logIn(Realm.Credentials.apiKey(import.meta.env.VITE_MONGO_API_KEY));
      const mongo = user.mongoClient("mongodb-atlas");
      const anime = await mongo.db("Zoro").collection("mappings").findOne({ mal_id: parseInt(params.id || "-1") });
      console.log(anime);
      if (anime) {
        const animeData = await axios.get(`https://consumet-deploy.vercel.app/anime/zoro/info?id=${anime.zoro_id}`);
        setAnimeData(animeData.data);
        setEpisodesData(animeData.data.episodes);
        console.log("Anime found in database")
        console.log("SELECTED:");
        console.log(animeData.data);
      }
      else {
        console.log("Anime not found in database");
        fetchAnimeData(mongo);
      }
    }
    fetchDatabase();
  }, [params]);

  useEffect(() => {

    setCurrentEpisodeNumber(parseInt(searchParams.get("ep") || "-1"));
  }, [searchParams]);

  useEffect(() => {
    if (!animeData || !episodesData) return;
    setEpisodeId(episodesData[currentEpisodeNumber - 1].id);
  }, [animeData, currentEpisodeNumber]);

  useEffect(() => {
    if (!episodeId) return;
    const fetchData = async () => {
      const cacheKey = `watchData-${episodeId}`;
      // const cachedData = sessionStorage.getItem(cacheKey);
      const cachedData = null;
      if (cachedData) {
        console.log("using cached data");
        const data: currEpisodeData = JSON.parse(cachedData);
        console.log(data.subtitles);
        data.subtitles.forEach((element) => {
          if (element.lang == "English") {
            setSubtitleUrl(element.url);
          }
        });
        // setSubtitleUrl(data.subtitles[0].url);
        console.log(subtitleurl);
      } else {
        const response = await axios.get(
          `https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${episodeId}`
        );
        let currEpisodeResponse: currEpisodeData = response.data;
        currEpisodeResponse.sources.sub = response.data.sources[0].url;
        currEpisodeResponse.sources.dub = undefined; //this is default behaviour, setting for clarity
        console.log(response.data)
        if (animeData?.hasDub) {
          try {
            const dubId = episodeId.replace('$both', '$dub');
            const dubResponse = await axios.get(
              `https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${dubId}`
            );
            currEpisodeResponse.sources.dub = dubResponse.data.sources[0].url;
          } catch (error) {
            console.error("Error fetching dub data:", error);
          }
        }

        if (currEpisodeResponse.sources.sub) {
          currEpisodeResponse.sources.sub = currEpisodeResponse.sources.sub.replace(
            /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
            "/api-$1"
          );
        }
        else {
          console.log("Invalid Stream URL");
          console.log(
            response.data.sources[0]
              ? response.data.sources[0].url
              : "No source URL found"
          );
        }
        if (currEpisodeResponse.sources.dub) {
          currEpisodeResponse.sources.dub = currEpisodeResponse.sources.dub.replace(
            /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
            "/api-$1"
          );
        }
        setCurrentEpisode(currEpisodeResponse);
        console.log("eshan", currEpisodeResponse.sources);
        // response.data.subtitles.forEach((element: any) => {
        //   if (element.lang === "English") {
        //     console.log("Found English Subtitle");
        //     setSubtitleUrl(element.url);
        //   }
        // });
        sessionStorage.setItem(cacheKey, JSON.stringify(currEpisodeResponse));
      }
    };
    console.log("Fetching data for episode:", episodeId);
    fetchData();
  }, [episodeId]);

  useEffect(() => {
    if (!currentEpisode || !currentEpisode.sources) return;
    currentEpisode.subtitles.forEach((element) => {
      if (element.lang == "English") {
        console.log("Found English Subtitle");
        setSubtitleUrl(element.url);
      }
    });
  }, [episodeId])

  useEffect(() => {
    console.log("Stream Type Changed to:", streamType);
    if (currentEpisode) {
      if (streamType === StreamType.sub && currentEpisode.sources.sub) {
        setStreamUrl(currentEpisode.sources.sub);
      } else if (streamType === StreamType.dub && currentEpisode.sources.dub) {
        setStreamUrl(currentEpisode.sources.dub);
      } else if (streamType === StreamType.dub && !currentEpisode.sources.dub) {
        setStreamUrl(currentEpisode.sources.sub);
      }
    }
  }, [streamType, currentEpisode]);

  useEffect(() => {
    if (!currentEpisode || !currentEpisode.sources) return;
    console.log(currentEpisode);
  }, [currentEpisode]);

  const reload = () => {
    window.location.reload();
  };

  const handleQualityChange = (index: number) => {
    setQualityLevel(index);
    setSettingsVisible(false); // Hide settings menu after selection
  };

  const handleDownload = (): void => {
    const player = document.querySelector("video");
    if (player) {
      const a = document.createElement("a");
      a.href = player.src;
      a.download = "video.mp4";
      document.body.appendChild(a); // Append the anchor to the body
      a.click(); // Programmatically click the anchor to trigger the download
      document.body.removeChild(a); // Clean up by removing the anchor from the body
    }
  };
  const [isQueried, setIsQueried] = useState(false);
  const queryAnilist = async () => {
    var user = localStorage.getItem("user");
    var accessToken = JSON.parse(user as string).access_token;
    const query = `
      query ($username: String ,$mediaId: Int) {
            MediaList(userName: $username,mediaId: $mediaId){
            id
            status
            progress
          }
      }`;
    const variables = {
      username: JSON.parse(localStorage.getItem("user") as string).username,
      mediaId: parseInt(searchParams.get("mid") ?? ""),
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
    if (data.data.MediaList.status === "CURRENT") {
      return data.data.MediaList.progress;
    } else {
      console.log("Not watching this anime", data.data.MediaList.status);
    }
  };
  const updateAnilist = async (progress: number) => {
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
    const variables = {
      mediaId: parseInt(searchParams.get("mid") ?? ""),
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
  };

  const handleProgress = (state: any) => {
    setPlayedSeconds(state.playedSeconds);
    const percentageWatched = totalDuration
      ? (state.playedSeconds / totalDuration) * 100
      : 0;
    //console.log(`Watched: ${percentageWatched.toFixed(2)}%`);
    // if (!isQueried) {
    //   queryAnilist();
    //   setIsQueried(true);
    // }
    const mid = parseInt(searchParams.get("mid") ?? "");
    if (percentageWatched >= 80 && !isQueried && !isNaN(mid)) {
      // if (isNaN(mid)) {
      //   console.error("Invalid or missing 'mid' parameter");
      // } else {

      // }
      updateAnilist(parseInt(searchParams.get("ep") as string));
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
    if (currentEpisodeNumber > 1) {
      handleWatchEpisode(currentEpisodeNumber - 1);
    } else {
      alert("You are watching the first episode");
    }
  };

  const handleNext = () => {
    console.log("currentEpisodeNumber", currentEpisodeNumber);
    console.log("episodesData.length", episodesData.length);
    if (currentEpisodeNumber === episodesData.length) {
      alert("You are watching the last episode");
    } else {
      handleWatchEpisode(currentEpisodeNumber + 1);
    }
  };

  const handleSkipIntro = () => {
    if (currentEpisode && playerRef.current) {
      const introEndTime = currentEpisode.intro.end;
      playerRef.current.seekTo(introEndTime, 'seconds');
      playerRef.current.getInternalPlayer().play();

    }
  }
  const handleSkipEnding = () => {
    if (currentEpisode && playerRef.current) {
      const outroEndTime = currentEpisode.outro.end;
      playerRef.current.seekTo(outroEndTime, 'seconds');
      playerRef.current.getInternalPlayer().play();
    }
  }

  return (
    <div className="flex h-screen w-screen justify-center mt-10">
      <div className="flex flex-row h-max">
        <div className="">
          <div className="bg-gray-800 border border-white backdrop-blur-lg w-64 h-full text-center rounded-l-md border-r-2 border-r-slate-500 flex flex-col py-2">
            <div className="text-center font-poppins font-semibold pb-2">
              EPISODES
            </div>
            <hr className="" />
            <div className="overflow-y-auto h-[37rem] scrollHide">
              {episodesData.map((episode, index) => (
                <div
                  key={index}
                  className={`episode-row flex justify-start items-center h-16 py-2 ${episode.number == currentEpisodeNumber
                    ? "bg-red-700"
                    : "bg-gray-800 hover:bg-gray-700"
                    } transition-colors duration-150 ease-in-out`}
                  onClick={() => {
                    handleWatchEpisode(episode.number);
                  }}
                >
                  <div className="hover:text-pink-200 ml-2 text-border-white font-poppins cursor-pointer truncate">
                    {episode.number}. {episode.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full max-w-4xl relative">
          {streamUrl ? (
            <div onLoad={reload}>
              <button
                onClick={handleDownload}
                className="absolute top-2.5 right-2.5 mr-12 z-10 p-2 rounded-md bg-black bg-opacity-50 text-white border-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
              </button>

              <button
                onClick={() => setSettingsVisible(!settingsVisible)}
                className="absolute top-2.5 right-2.5 z-10 p-2 rounded-md bg-black bg-opacity-50 text-white border-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
              </button>
              <ReactPlayer
                ref={playerRef}
                url={streamUrl}
                playing={true}
                controls={true}
                width="100%"
                height="500px"
                className="aspect-video border border-white rounded-tr-md"
                onProgress={handleProgress}
                onDuration={handleDuration}
                config={{
                  file: {
                    hlsOptions: {
                      enableWorker: true,
                    },
                    attributes: {
                      crossOrigin: "anonymous",
                    },
                    tracks: [
                      {
                        kind: "subtitles",
                        src: subtitleurl,
                        srcLang: "en",
                        default: true,
                        label: "English Subtitles"
                      },
                    ],
                  },
                }}

              />
              <div className="absolute bottom-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
                {currentEpisode && (
                  <button className="m-2 ml-4 border border-white bg-slate-500 bg-opacity-50 p-2 rounded-md pointer-events-auto hover:bg-slate-400"
                    onClick={handleSkipIntro} style={{ visibility: (playedSeconds < currentEpisode.intro.end && playedSeconds > currentEpisode.intro.start) ? 'visible' : 'hidden' }}>Skip Intro &gt;&gt;</button>
                )}
                {currentEpisode && (
                  <button className="m-2 mr-4 border border-white bg-slate-500 bg-opacity-50 p-2 rounded-md pointer-events-auto hover:bg-slate-400"
                    onClick={handleSkipEnding} style={{
                      visibility: (playedSeconds > currentEpisode.outro.start
                        && playedSeconds < currentEpisode.outro.end)
                        ? 'visible' : 'hidden'
                    }}>Skip Outro &gt;&gt;</button>
                )}
              </div>
              <div className="bg-gray-800 gap-2 border border-white backdrop-blur-lg h-16 flex items-center justify-center px-4 py-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" id="closed-caption" fill="currentColor">
                  <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 6.5c0 .28-.22.5-.5.5H10c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v.5zm7 0c0 .28-.22.5-.5.5H17c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v.5z"></path>
                </svg><p className="mb-1">:</p>
                {/* TODO:Style sub and dub buttons */}
                <button className="cursor-pointer border border-gray-700 rounded-md px-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out" onClick={() => { setStreamType(StreamType.sub) }}>SUB</button>
                {animeData && animeData.hasDub && currentEpisode?.sources.dub ?
                  <button className="cursor-pointer border border-gray-700 rounded-md px-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out" onClick={() => { setStreamType(StreamType.dub) }}>DUB</button>
                  : null}
              </div>
              <div className="bg-gray-800 border border-white backdrop-blur-lg rounded-ee-md h-20 flex items-center px-4 py-auto">
                <div
                  className="cursor-pointer ml-auto border border-gray-700 rounded-lg px-2 py-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out"
                  title="Previous Episode"
                >
                  <SkipPrevious className="flex" onClick={handlePrev} />
                </div>
                <div className="flex-1 flex justify-center">
                  {/* Find the current episode and display its title */}
                  <p className="whitespace-nowrap flex flex-col items-center font-poppins font-semibold text-white px-1 pl-2 p-1">
                    CURRENT EPISODE:{" "}
                  </p>
                  <p className="whitespace-nowrap mr-2 flex flex-col items-center font-poppins bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg px-1 p-1 rounded-md font-semibold text-md text-white">
                    {currentEpisodeNumber} -{" "}
                    {
                      episodesData.find(
                        (episode) => episode.number === currentEpisodeNumber
                      )?.title
                    }
                  </p>
                </div>
                <div
                  className="cursor-pointer ml-auto border border-gray-700 rounded-lg px-2 py-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out"
                  title="Next Episode"
                >
                  <SkipNext
                    className="flex cursor-pointer"
                    onClick={handleNext}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <span className="loading loading-spinner text-info"></span>
              <p className="ml-2 font-poppins font-semibold">loading..</p>
            </div>
          )}

          {settingsVisible && (
            <div className="flex flex-col absolute top-10 right-2.5 shadow-md z-20 mt-3">
              {qualitiesList.map((quality) => (
                <div
                  key={quality.level}
                  onClick={() => handleQualityChange(quality.level)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  className={`bg-black bg-opacity-50 rounded-md border ${quality.level == qualityLevel ? "bg-blue-200" : ""
                    }`}
                >
                  <div className="opacity-100">{quality.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
