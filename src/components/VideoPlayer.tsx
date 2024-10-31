import { CurrEpisodeData } from "../interfaces/CurrEpisodeData";
import { useState, useRef, useEffect } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import {
  MediaPlayer,
  useMediaStore,
  useMediaRemote,
  type MediaPlayerInstance,
  MediaProvider,
  TextTrack,
  Poster,
  HLSErrorEvent
} from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
} from "@vidstack/react/player/layouts/default";
import { CustomMenu } from "./VideoPlayerComponents/CustomMenu";
import { SkipButtons } from "./VideoPlayerComponents/SkipButtons";
import { EpisodeControlButtons } from "./VideoPlayerComponents/EpisodeControlButtons";
import { CustomLocalStorage } from "./VideoPlayerComponents/CustomLocalStorage";
import "./VideoPlayerComponents/player.css";
import {
  VTTtoJSON,
  type VTTJSON,
} from "./VideoPlayerComponents/ThumbnailsHandler";
import axios from "axios";
import loadingSpinner from "../assests/Loading-Spinner.webp";

enum StreamType {
  sub,
  dub,
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentEpisode,
  hasPreviousEpisode,
  hasNextEpisode,
  handlePreviousEpisode,
  handleNextEpisode,
  onProgress,
  onDuration,
  fetchEpisodes,
}) => {
  const player = useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(player);
  const { currentTime, duration } = useMediaStore(player);
  const [streamType, setStreamType] = useState<StreamType>(
    JSON.parse(localStorage.getItem("streamType") || "0")
  );
  const [trueStreamType, setTrueStreamType] = useState<StreamType>(streamType);
  const [thumbnails, setThumbnails] = useState<VTTJSON[]>();
  const [storage, setStorage] = useState<CustomLocalStorage>();

  useEffect(() => {
    console.warn("changed player");
  }, [player]);

  // Handle duration changes
  useEffect(() => {
    if (duration) {
      onDuration(duration);
    }
  }, [duration]);

  // Handle progress tracking
  useEffect(() => {
    if (currentTime) onProgress({ playedSeconds: currentTime });
  }, [currentTime]);
  useEffect(() => {
    if (JSON.parse(localStorage.getItem("streamType") || "{}") !== streamType)
      localStorage.setItem("streamType", JSON.stringify(streamType));
    if (streamType === StreamType.dub && !currentEpisode.sources.dub)
      setTrueStreamType(StreamType.sub);
    else setTrueStreamType(streamType);
  }, [streamType]);

  useEffect(() => {
    if (trueStreamType === StreamType.sub) {
      currentEpisode.subtitles.forEach((subtitle) => {
        player.current?.textTracks.add(
          new TextTrack({
            src: subtitle.url,
            kind: "subtitles",
            label: subtitle.lang,
            default: subtitle.lang === "English",
            id: subtitle.lang,
          })
        );
      });
    } else {
      currentEpisode.dubSubtitles?.forEach((subtitle) => {
        player.current?.textTracks.add(
          new TextTrack({
            src: subtitle.url,
            kind: "subtitles",
            label: subtitle.lang,
            default: subtitle.lang === "English",
            id: subtitle.lang,
          })
        );
      });
    }
    const textTrack = player.current?.textTracks.getById("English");
    if (textTrack)
      textTrack.mode = "showing";
    return () => {
      player.current?.textTracks.clear();
    };
  }, [currentEpisode.subtitles, currentEpisode.dubSubtitles, trueStreamType]);

  useEffect(() => {
    const fetchThumbnails = async (src: string) => {
      const response = await axios.get(src);
      const thumbnailsVTT = response.data;
      const cleanSrc = src.replace(/thumbnails\.vtt$/, "");
      //if (!thumbnailsVTT) return;
      const thumbnails = VTTtoJSON(thumbnailsVTT, cleanSrc);
      setThumbnails(thumbnails);
    };
    if (trueStreamType === StreamType.sub) {
      if (!currentEpisode.thumbnailSrc)
        return;

      fetchThumbnails(currentEpisode.thumbnailSrc);
    } else {
      if (!currentEpisode.dubThumbnailSrc)
        return;
      fetchThumbnails(currentEpisode.dubThumbnailSrc);
    }
    return () => {
      setThumbnails([]);
    };
  }, [
    currentEpisode.thumbnailSrc,
    currentEpisode.dubThumbnailSrc,
    trueStreamType,
  ]);

  useEffect(() => {
    setStorage(new CustomLocalStorage("vidstack-storage", currentEpisode.zoroId))
  }, [currentEpisode.zoroId])

  const loadSkipButton: boolean =
    (currentTime > currentEpisode.intro.start &&
      currentTime < currentEpisode.intro.end) ||
    (currentTime > currentEpisode.outro.start &&
      currentTime < currentEpisode.outro.end);

  const skipText: string =
    currentTime > currentEpisode.intro.start &&
      currentTime < currentEpisode.intro.end
      ? "Skip Intro"
      : "Skip Outro";

  const handleSkip = () => {
    if (
      currentTime > currentEpisode.intro.start &&
      currentTime < currentEpisode.intro.end
    ) {
      remote.seek(currentEpisode.intro.end);
    } else if (
      currentTime > currentEpisode.outro.start &&
      currentTime < currentEpisode.outro.end
    ) {
      remote.seek(currentEpisode.outro.end);
    }
  };

  const handleError = (error: HLSErrorEvent) => {
    //@ts-ignore
    if (error.type === "networkError" && (error.details == "manifestLoadError" || error.details == "fragLoadError") && error.fatal) {
      console.log("ManifestLoadError", error)
      fetchEpisodes(true)
    }
    else
      console.log("Unregistered Error", error)
  }

  return (
    <div className="relative border border-white">
      {currentEpisode && (
        <>
          <MediaPlayer
            aspectRatio="16/9"
            className="mb-0 pb-0"
            src={[currentEpisode.sources.sub, currentEpisode.sources.dub][trueStreamType]}
            ref={player}
            onHlsError={handleError}
            load="eager"
            posterLoad="eager"
            logLevel="debug"
            storage={storage}
            autoPlay
          >
            <MediaProvider role="button">
              <Poster
                className="vds-poster"
                src={loadingSpinner}
                alt="Loading Screen"
              />
            </MediaProvider>
            <DefaultVideoLayout
              icons={defaultLayoutIcons}
              slots={{
                googleCastButton: null,
                settingsMenu: (
                  <CustomMenu
                    trueStreamType={trueStreamType}
                    setStreamType={(streamType) => setStreamType(streamType)}
                    hasDub={!!currentEpisode.sources.dub}
                  />
                ),
                afterEndTime: (
                  <SkipButtons
                    handleSkip={handleSkip}
                    skipText={skipText}
                    loadSkipButton={loadSkipButton}
                  />
                ),
                beforeCaptionButton: (
                  <EpisodeControlButtons
                    hasPreviousEpisode={hasPreviousEpisode}
                    hasNextEpisode={hasNextEpisode}
                    handlePreviousEpisode={handlePreviousEpisode}
                    handleNextEpisode={handleNextEpisode}
                  />
                ),
                // captions: null,
              }}
              thumbnails={thumbnails}
            />
          </MediaPlayer>
        </>
      )}
    </div>
  );
};

interface VideoPlayerProps {
  currentEpisode: CurrEpisodeData;
  hasPreviousEpisode: boolean;
  hasNextEpisode: boolean;
  handlePreviousEpisode: () => void;
  handleNextEpisode: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onDuration: (duration: number) => void;
  fetchEpisodes: (forceRefetch: boolean) => void;
}
// interface VideoPlayerProps {
//   currentEpisode: currEpisodeData;
//   hasPreviousEpisode: boolean;
//   hasNextEpisode: boolean;
//   handlePreviousEpisode: () => void;
//   handleNextEpisode: () => void;
//   mediaID?: number;
//   currentEpisodeNumber: number;
//   progress?: number;
//   updateAnilist: (mediaId: number, episode: number) => void;
//   onProgress: (state: { playedSeconds: number }) => void;
//   onDuration: (duration: number) => void;
// }
