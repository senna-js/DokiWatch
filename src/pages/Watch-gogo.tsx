/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import "./Watch.css";
import { SkipPrevious } from "@mui/icons-material";
import { SkipNext } from "@mui/icons-material";

enum Quality {
  lowRes,
  midRes,
  highRes,
  fullRes,
}

interface AnimeData {
  title: {
    romaji: string;
    english: string;
  };
  coverImage: {
    extraLarge: string;
  };
  description: string;
  episodes: number;
  malID: number;
  alID: number;
}

interface Episode {
  zoroId: string;
  gogoId: string;
  gogoDubId?: string;
  number: number;
  title: string;
}

interface currEpisodeData {
  sources: {
    sub: {
      lowRes: string;
      midRes: string;
      highRes: string;
      fullRes: string;
    };
    dub?: {
      lowRes: string;
      midRes: string;
      highRes: string;
      fullRes: string;
    };
  };
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
  dub,
}

export const Watchgogo: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [streamType, setStreamType] = useState<StreamType>(StreamType.sub);
  const [quality, setQuality] = useState<Quality>(Quality.fullRes);
  //   const [qualitiesList, setQualitiesList] = useState<Quality[]>([]);
  //   const [qualityLevel, setQualityLevel] = useState<number | null>(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [animeData, setAnimeData] = useState<AnimeData>();
  const [episodesData, setEpisodesData] = useState<Episode[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [gogoAnimeId, setgogoAnimeId] = useState("");
  const [zoroId, setZoroId] = useState("");
  const [progress, setProgress] = useState<number>();
  const [mediaID, setMediaID] = useState<number>();
  const [subtitleurl, setSubtitleUrl] = useState<string>("");
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState<number>(
    parseInt(searchParams.get("ep") || "-1")
  );
  const [currentEpisode, setCurrentEpisode] = useState<currEpisodeData>();
  const [playedSeconds, setPlayedSeconds] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const params = useParams();
  const playerRef: any = useRef(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  //   useEffect(() => {
  //     let hls: any;

  //     if (playerRef.current) {
  //       const player = playerRef.current.getInternalPlayer();

  //       if (Hls.isSupported()) {
  //         hls = new Hls();
  //         hls.loadSource(streamUrl);
  //         hls.attachMedia(player);

  //         hls.on(Hls.Events.MANIFEST_LOADED, () => {
  //           const levels: Quality[] = hls.levels.map(
  //             (level: any, index: any) => ({
  //               level: index,
  //               label: `${level.height}p`,
  //             })
  //           );
  //           setQualitiesList(levels);

  //           Set to highest quality by default
  //           if (qualityLevel == null) {
  //             const highestQualityIndex = hls.levels.length - 1;
  //             hls.currentLevel = highestQualityIndex;
  //             setQualityLevel(highestQualityIndex);
  //           }

  //           If a specific qualityLevel is set, use it instead
  //           if (
  //             qualityLevel !== null &&
  //             qualityLevel >= 0 &&
  //             qualityLevel < hls.levels.length
  //           ) {
  //             hls.currentLevel = qualityLevel;
  //           }
  //         });

  //         Listen for quality level changes outside of manifest loading
  //         if (
  //           qualityLevel !== null &&
  //           qualityLevel >= 0 &&
  //           qualityLevel < hls.levels.length
  //         ) {
  //           hls.currentLevel = qualityLevel;
  //         }
  //       }
  //     }

  //     return () => {
  //       if (hls) {
  //         hls.destroy();
  //       }
  //     };
  //   }, [streamUrl, qualityLevel]);

  //   const fetchAnimeData = async (animeResponses: any) => {
  //     if (animeData?.malID == params.id) return;
  //     for (let i = 0; i < animeResponses.length; i++) {
  //       const anime = animeResponses[i];
  //       try {
  //         const response = await axios.get(
  //           `https://consumet-deploy.vercel.app/anime/zoro/info?id=${anime.id}`
  //         );
  //         console.log(anime.id);
  //         if (response.data.malID == params.id) {
  //           setAnimeData(response.data);
  //           setEpisodesData(response.data.episodes);
  //           console.log("SELECTED:");
  //           console.log(response.data);
  //           return;
  //         }
  //       } catch (error) {
  //         console.error("Error fetching anime data:", error);
  //       }
  //     }
  //   };

  useEffect(() => {
    const mediaIdList = JSON.parse(
      sessionStorage.getItem("mediaIdList") || "null"
    );
    //console.log(mediaIdList);
    if (!mediaIdList) {
      alert("You are not connected to anilist");
    } else {
      for (let i = 0; i < mediaIdList.length; i++) {
        const mediaId = mediaIdList[i];
        // console.log(
        //   "mediaobj: ",
        //   mediaId.mal_id,
        //   "param_id",
        //   params.id,
        //   "mediaid",
        //   mediaId.mediaId
        // );
        if (mediaId.mal_id == params.id) {
          //   console.log("Setting Media ID: ", mediaId.mediaId);
          setMediaID(mediaId.mediaId);
          setProgress(mediaId.progress);
          break;
        }
      }
    }
    // console.log("Media ID: ", mediaID);
    if (animeData?.malID === params.id) return;
    const query = `query($id:Int){
        Media(idMal: $id,type:ANIME) {
                        id
                        title {
                            romaji
                            english
                        }
                        coverImage {
                            extraLarge
                        }
                        description
                        episodes
    }}`;
    const variables = { id: parseInt(params.id || "0") };
    axios
      .post(
        `https://graphql.anilist.co`,
        { query, variables },
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        const data = response.data.data.Media;
        data.alID = data.id;
        data.malID = parseInt(params.id || "0");
        setAnimeData(data);
      });
  }, [params]);
  useEffect(() => {
    console.log("Updated Media ID:", mediaID);
  }, [mediaID]);
  useEffect(() => {
    setCurrentEpisodeNumber(parseInt(searchParams.get("ep") || "-1"));
  }, [searchParams]);

  useEffect(() => {
    if (!animeData || !animeData.alID) return;
    var gogoId: string;
    var zoroId: string;
    axios
      .get(`https://api-mappings.madara.live/anime/${animeData.alID}`)
      .then((response) => {
        console.log(response.data);
        if (!gogoId && response.data.mappings.gogoanime) {
          gogoId = response.data.mappings.gogoanime.id;
        }
        if (!zoroId && response.data.mappings.zoro) {
          zoroId = response.data.mappings.zoro.id;
        }

        if (
          (!gogoId || !zoroId) &&
          response.data.mappings.anify.info.mappings
        ) {
          const mappings = response.data.mappings.anify.info.mappings;
          for (const mapping of mappings) {
            if (!gogoId && mapping.providerId === "gogoanime") {
              gogoId = mapping.id;
            }
            if (!zoroId && mapping.providerId === "zoro") {
              zoroId = mapping.id;
            }
          }
        }
      })
      .then(() => {
        if (gogoId) {
          if (gogoId.startsWith("/category/"))
            gogoId = gogoId.substring("/category/".length);
          if (gogoId.endsWith("-dub"))
            gogoId = gogoId.substring(0, gogoId.length - 4);
          console.log("GogoAnime ID : ", gogoId);
          setgogoAnimeId(gogoId);
        } else {
          console.error("No GogoAnime ID found for this anime");
        }
        if (zoroId) {
          if (zoroId.startsWith("/")) zoroId = zoroId.substring(1);
          if (zoroId.startsWith("watch/")) zoroId = zoroId.substring(6);
          if (zoroId.includes("?"))
            zoroId = zoroId.substring(0, zoroId.indexOf("?"));
          console.log("Zoro ID : ", zoroId);
          setZoroId(zoroId);
        } else {
          console.error("No Zoro ID found for this anime");
        }
      });
  }, [animeData]);

  useEffect(() => {
    if (!zoroId || !gogoAnimeId) return;
    let zoroEpisodesData: any;
    let gogoEpisodes: string[] = [];
    let gogoDubEpisodes: string[] = [];
    let totalEpisodes: number = 0;
    const fetchEpisodesData = async () => {

      await axios
        .get(`https://consumet-deploy.vercel.app/anime/zoro/info?id=${zoroId}`)
        .then((response) => {
          zoroEpisodesData = response.data.episodes;
          totalEpisodes = response.data.totalEpisodes;
        })
        .catch((error) => {
          console.error("Error with fetching Zoro Episodes Data\nZoro Id : ", zoroId, error);
        });

      await axios
        .get(`https://consumet-deploy.vercel.app/anime/gogoanime/info/${gogoAnimeId}`)
        .then((response) => {
          gogoEpisodes = response.data.episodes.map(
            (episode: any) => episode.id
          );
        })
        .catch((error) => {
          console.error(
            "Error with fetching Gogoanime Sub Episodes Data\nGogoAnime Id : ", gogoAnimeId, error);
        });

      await axios
        .get(`https://consumet-deploy.vercel.app/anime/gogoanime/info/${gogoAnimeId}-dub`)
        .then((response) => {
          gogoDubEpisodes = response.data.episodes.map(
            (episode: any) => episode.id
          );
        })
        .catch((error) => {
          console.error("Error with fetching Gogoanime Dub Episodes Data\nGogoAnime Id : ", gogoAnimeId, error);
        });

      let tempEpisodesData: Episode[] = [];
      for (let i = 0; i < totalEpisodes; i++) {
        let episode: Episode = {
          zoroId: zoroEpisodesData[i].id,
          gogoId: gogoEpisodes[i],
          gogoDubId: gogoDubEpisodes[i],
          number: i + 1,
          title: zoroEpisodesData[i].title,
        };
        tempEpisodesData.push(episode);
      }
      setEpisodesData(tempEpisodesData);
      console.log("Episodes Data : ");
      console.log(tempEpisodesData);
    };
    fetchEpisodesData();
  }, [zoroId, gogoAnimeId]);

  useEffect(() => {
    if (
      !gogoAnimeId ||
      !zoroId ||
      episodesData.length === 0 ||
      currentEpisodeNumber < 0
    )
      return;
    var currEpisodeData: currEpisodeData = {
      sources: {
        sub: { lowRes: "", midRes: "", highRes: "", fullRes: "" },
        dub: { lowRes: "", midRes: "", highRes: "", fullRes: "" },
      },
      intro: { start: 0, end: 0 },
      outro: { start: 0, end: 0 },
    };
    const fetchCurrEpisodeData = async () => {
      //get current episode intro and outros from zoro
      try {
        await axios
          .get(`https://consumet-deploy.vercel.app/anime/zoro/watch?episodeId=${episodesData[currentEpisodeNumber - 1].zoroId}`)
          .then((response) => {
            console.log(response.data);
            currEpisodeData.intro = response.data.intro;
            currEpisodeData.outro = response.data.outro;
          });
      } catch (error) {
        console.log(
          "Error fetching current episode Intro and Outro\nEpisode Id : ",
          episodesData[currentEpisodeNumber - 1].zoroId
        );
      }
      // try {
      await axios
        .get(`https://consumet-deploy.vercel.app/anime/gogoanime/watch/${episodesData[currentEpisodeNumber - 1].gogoId}`)
        .then((response) => {
          console.log(response.data);
          currEpisodeData.sources.sub = {
            lowRes: response.data.sources[0].url,
            midRes: response.data.sources[1].url,
            highRes: response.data.sources[2].url,
            fullRes: response.data.sources[3].url,
          };
        });
      // }
      // catch (error) {
      //     console.error("Error fetching current episode data from GogoAnime\nEpisode Id : ", episodesData[currentEpisodeNumber - 1].gogoId);
      //     console.log(error);
      // }
      try {
        await axios
          .get(`https://consumet-deploy.vercel.app/anime/gogoanime/watch/${episodesData[currentEpisodeNumber - 1].gogoDubId}`)
          .then((response) => {
            console.log(response.data);
            currEpisodeData.sources.dub = {
              lowRes: response.data.sources[0].url,
              midRes: response.data.sources[1].url,
              highRes: response.data.sources[2].url,
              fullRes: response.data.sources[3].url,
            };
          });
      } catch (error) {
        console.log("No Dub for this episode\nEpisode Id : ", episodesData[currentEpisodeNumber - 1].gogoDubId);
        currEpisodeData.sources.dub = undefined;
      }
      setCurrentEpisode(currEpisodeData);
    };

    fetchCurrEpisodeData();
  }, [gogoAnimeId, zoroId, currentEpisodeNumber, episodesData]);

  useEffect(() => {
    if (!currentEpisode || !currentEpisode.sources) return;
    console.log(streamType, quality, currentEpisode.sources);
    setStreamUrl(currentEpisode.sources.sub.fullRes);
    // switch (streamType) {
    //   case StreamType.sub:
    //     switch (quality) {
    //       case Quality.lowRes:
    //         setStreamUrl(currentEpisode.sources.sub.lowRes);
    //         break;
    //       case Quality.midRes:
    //         setStreamUrl(currentEpisode.sources.sub.midRes);
    //         break;
    //       case Quality.highRes:
    //         setStreamUrl(currentEpisode.sources.sub.highRes);
    //         break;
    //       case Quality.fullRes:
    //         setStreamUrl(currentEpisode.sources.sub.fullRes);
    //         break;
    //     }
    //     break;
    //   case StreamType.dub:
    //     if (!currentEpisode.sources.dub) {
    //       switch (quality) {
    //         case Quality.lowRes:
    //           setStreamUrl(currentEpisode.sources.sub.lowRes);
    //           break;
    //         case Quality.midRes:
    //           setStreamUrl(currentEpisode.sources.sub.midRes);
    //           break;
    //         case Quality.highRes:
    //           setStreamUrl(currentEpisode.sources.sub.highRes);
    //           break;
    //         case Quality.fullRes:
    //           setStreamUrl(currentEpisode.sources.sub.fullRes);
    //           break;
    //       }
    //       return;
    //     }
    //     switch (quality) {
    //       case Quality.lowRes:
    //         setStreamUrl(currentEpisode.sources.dub.lowRes);
    //         break;
    //       case Quality.midRes:
    //         setStreamUrl(currentEpisode.sources.dub.midRes);
    //         break;
    //       case Quality.highRes:
    //         setStreamUrl(currentEpisode.sources.dub.highRes);
    //         break;
    //       case Quality.fullRes:
    //         setStreamUrl(currentEpisode.sources.dub.fullRes);
    //         break;
    //     }
    //     break;
    // }
  }, [currentEpisode]);

  const handleQualityChange = (quality: Quality) => {
    setQuality(quality);
    setSettingsVisible(false); // Hide settings menu after selection
  };

  useEffect(() => {
    console.log("Stream URL : ", streamUrl);
    if (streamUrl)
      setIsPlayerReady(true);
    // reloadReactPlayer();
  }, [streamUrl]);

  //     const reloadReactPlayer = () => {
  //         setPlayerKey((playerKey+1)%2);
  //     };

  useEffect(() => {
    if (!currentEpisode || !currentEpisode.sources) return;
    console.log(currentEpisode);
  }, [currentEpisode]);

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
  const updateAnilist = async (mediaID: number, progress: number) => {
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
    //const mid = parseInt(searchParams.get("mid") ?? "");
    if (
      percentageWatched >= 80 &&
      !isQueried &&
      progress! < currentEpisodeNumber &&
      mediaID
    ) {
      // if (isNaN(mid)) {
      //   console.error("Invalid or missing 'mid' parameter");
      // } else {

      // }
      //console.log("Updating Anilist", mediaID);
      updateAnilist(mediaID, currentEpisodeNumber);
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
      playerRef.current.seekTo(introEndTime, "seconds");
      playerRef.current.getInternalPlayer().play();
    }
  };
  const handleSkipEnding = () => {
    if (currentEpisode && playerRef.current) {
      const outroEndTime = currentEpisode.outro.end;
      playerRef.current.seekTo(outroEndTime, "seconds");
      playerRef.current.getInternalPlayer().play();
    }
  };

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
          {isPlayerReady ? (
            <div>
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
                url={streamUrl!}
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
                      debug: true,
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
                        label: "English Subtitles",
                      },
                    ],
                  },
                }}
              />
              <div className="absolute bottom-0 left-0 w-full h-full flex justify-between items-center pointer-events-none">
                {currentEpisode && (
                  <button
                    className="m-2 ml-4 border border-white bg-slate-500 bg-opacity-50 p-2 rounded-md pointer-events-auto hover:bg-slate-400"
                    onClick={handleSkipIntro}
                    style={{
                      visibility:
                        playedSeconds < currentEpisode.intro.end &&
                          playedSeconds > currentEpisode.intro.start
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    Skip Intro &gt;&gt;
                  </button>
                )}
                {currentEpisode && (
                  <button
                    className="m-2 mr-4 border border-white bg-slate-500 bg-opacity-50 p-2 rounded-md pointer-events-auto hover:bg-slate-400"
                    onClick={handleSkipEnding}
                    style={{
                      visibility:
                        playedSeconds > currentEpisode.outro.start &&
                          playedSeconds < currentEpisode.outro.end
                          ? "visible"
                          : "hidden",
                    }}
                  >
                    Skip Outro &gt;&gt;
                  </button>
                )}
              </div>
              <div className="bg-gray-800 gap-2 border border-white backdrop-blur-lg h-16 flex items-center justify-center px-4 py-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  id="closed-caption"
                  fill="currentColor"
                >
                  <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 6.5c0 .28-.22.5-.5.5H10c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v.5zm7 0c0 .28-.22.5-.5.5H17c-.28 0-.5-.22-.5-.5h-2v3h2c0-.28.22-.5.5-.5h.5c.28 0 .5.22.5.5v.5c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v.5z"></path>
                </svg>
                <p className="mb-1">:</p>
                {/* TODO:Style sub and dub buttons */}
                <button
                  className="cursor-pointer border border-gray-700 rounded-md px-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out"
                  onClick={() => {
                    setStreamType(StreamType.sub);
                  }}
                >
                  SUB
                </button>
                {animeData &&
                  episodesData[currentEpisodeNumber - 1].gogoDubId ? (
                  <button
                    className="cursor-pointer border border-gray-700 rounded-md px-2 hover:bg-slate-700 hover:scale-105 transform transition duration-150 ease-in-out"
                    onClick={() => {
                      setStreamType(StreamType.dub);
                    }}
                  >
                    DUB
                  </button>
                ) : null}
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
              {[
                Quality.lowRes,
                Quality.midRes,
                Quality.highRes,
                Quality.fullRes,
              ].map((qualityOption: Quality) => (
                <div
                  key={qualityOption}
                  onClick={() => handleQualityChange(qualityOption)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                  }}
                  className={`bg-black bg-opacity-50 rounded-md border ${qualityOption == quality ? "bg-blue-200" : ""
                    }`}
                >
                  <div className="opacity-100">
                    {["360p", "480p", "720p", "1080p"][qualityOption]}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
