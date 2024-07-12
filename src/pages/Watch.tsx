/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable prefer-const */
import React, { useState, useEffect, } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from "axios";
import { Button } from "@mui/material";

interface Source {
  url: string;
  quality: string;
}

interface Episode {
  id: number,
  title_english: string,
  title_romaji: string
}

export const Watch: React.FC = () => {
  const [streamUrl, setStreamUrl] = useState<string | null>(null);
  const [sources, setSources] = useState<Source[]>([]);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [episodesData, setEpisodesData] = useState<Episode[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  let params = useParams<{ id: any }>();
  let id: string = params.id;
  const [episodeId, setEpisodeId] = useState(id);
  const [currentEpisodeNumber, setCurrentEpisodeNumber] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Clean the id by removing unwanted characters
      const cleanId = id.replace(/["',.]/g, '');
      console.log(cleanId);
      const cacheKey = `watchData-${cleanId}`;
      const cachedData = sessionStorage.getItem(cacheKey);

      if (cachedData) {
        const data = JSON.parse(cachedData);
        setSources(data.sources);
        setStreamUrl(data.sources[4].url); // Default to 1080p
      } else {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_CONSUMET_API_ENDPOINT}watch/${cleanId}`
          );
          const data = response.data;
          if (data && data.sources && data.sources.length > 0) {
            sessionStorage.setItem(cacheKey, JSON.stringify(data));
            setSources(data.sources);
            setStreamUrl(data.sources[4].url); // Default to 1080p
          }
        } catch (error) {
          console.log("Error:", error);
        }
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    axios.get(`https://api.jikan.moe/v4/anime/${searchParams.get("id")}/episodes`)
      .then(res => {
        console.log(res.data.data)
        setEpisodesData(res.data.data.map((episode: any) => ({
          id: episode.mal_id,
          title_english: episode.title,
          title_romaji: episode.title_romanji
        }))
        )
      })
  }, [searchParams])

  useEffect(() => {
    console.log(episodesData)
  }, [episodesData]);

  const reload = () => {
    window.location.reload();
  }

  const handleQualityChange = (url: string) => {
    setStreamUrl(url);
    setSettingsVisible(false); // Hide settings menu after selection
  };

  const handleDownload = () => {
    const player = document.querySelector("video");
    if (player) {
      const a = document.createElement("a");
      a.href = player.src;
      a.download = "video.mp4";
      a.click();
    }
  };
  //TODO: @Eshan276 @Gadzrux @karan8404 Implement the next and previous episode functionality

  // Assuming params.id is in the format "someString-EpisodeNumber"
  // and useParams is from 'react-router-dom' for navigation

  useEffect(() => {
    setEpisodeId(id);
    // Add any additional logic here to fetch new episode data based on the updated id
  }, [id]); // This effect runs whenever the 'id' parameter changes

  useEffect(() => {
    // Extract episode number from episodeId and update state
    const episodeNumber = parseInt(episodeId.split("-").pop() || "0", 10);
    setCurrentEpisodeNumber(episodeNumber);
  }, [episodeId]);

  const handlePrev = () => {
    if (currentEpisodeNumber > 1) {
      const newId = episodeId.replace(`episode-${currentEpisodeNumber}`, `episode-${currentEpisodeNumber - 1}`);
      navigate(`/watch/${newId}`);
    } else {
      alert("You are watching the first episode");
    }
  };

  //TODO: @Eshan276 @Gadzrux @karan8404 Find a way to get the total number of episodes or check from the url params whethere there's any ep available after incrementing the ep index
  const handleNext = () => {
    const newEpisodeNumber = currentEpisodeNumber + 1;
    const newId = episodeId.replace(`episode-${currentEpisodeNumber}`, `episode-${newEpisodeNumber}`);

    navigate(`/watch/${newId}`);
  };

  const handleWatchEpisode = (episodeId: string) => {
    
  };


  // useEffect(() => {
  //   // Add the following code to the useEffect hook
  //   const episode = sources.find((source) => source.url === streamUrl)?.episode;
  //   console.log(episode);
  //   if (episode) {
  //     setCurrentEpisode(episode);
  //   }
  // }, [streamUrl, sources]);

  // const handleNextEpisode = () => {
  //   const nextEpisode = sources.find((source) => source.episode === currentEpisode + 1);
  //   console.log(nextEpisode);
  //   if (nextEpisode) {
  //     setStreamUrl(nextEpisode.url);
  //   }
  // };

  // const handlePreviousEpisode = () => {
  //   const previousEpisode = sources.find((source) => source.episode === currentEpisode - 1);
  //   console.log(previousEpisode);
  //   if (previousEpisode) {
  //     setStreamUrl(previousEpisode.url);
  //   }
  // };

  return (
    <div className="flex h-screen w-screen justify-center mt-10">
      <div className="flex flex-row h-max">
        <div className="">
          <div className="bg-slate-600 w-48 h-full text-center rounded-l-md border-r-2 border-r-slate-500 flex flex-col py-2">
            <div className="text-center">Episodes</div>
            <hr />
            <div className="overflow-y-scroll h-[32rem]">
              {episodesData.map((episode, index) => (
                <div key={index} className="py-2">
                  <a href={`/watch/${episode.id}`} className="hover:text-white">{episode.title_english}</a>
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
                className="absolute top-2.5 left-2.5 z-10 p-2 bg-black bg-opacity-50 text-white border-none cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

              </button>

              <button
                onClick={() => setSettingsVisible(!settingsVisible)}
                className="absolute top-2.5 right-2.5 z-10 p-2 bg-black bg-opacity-50 text-white border-none cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>

              </button>
              <ReactPlayer
                url={streamUrl}
                playing={true}
                controls={true}
                width="100%"
                height="500px"
                className="aspect-video"
              />
              <div className="bg-slate-600 rounded-ee-md h-14 flex items-center px-4 py-auto">
                <Button variant="contained" onClick={handlePrev}>Prev episode</Button>
                <div className="ml-auto">
                  <Button variant="contained" onClick={handleNext} >Next episode</Button>
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
            <div
              className="absolute top-10 right-2.5 bg-black border border-gray-300 shadow-md z-20"
            >
              {sources.map((source, index) => (
                <div
                  key={index}
                  onClick={() => handleQualityChange(source.url)}
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: streamUrl === source.url ? "Black" : "Black",
                  }}
                >
                  {source.quality}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
