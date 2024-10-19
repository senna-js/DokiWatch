import { currEpisodeData } from "../interfaces/CurrEpisodeData"
import { useState, useRef, useEffect } from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, useMediaStore, useMediaRemote, type MediaPlayerInstance, MediaProvider, TextTrack } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { CustomMenu } from "./VideoPlayerComponents/CustomMenu";
import { SkipButtons } from "./VideoPlayerComponents/SkipButtons";
import { EpisodeControlButtons } from "./VideoPlayerComponents/EpisodeControlButtons";
import { VTTtoJSON, type VTTJSON } from "./VideoPlayerComponents/ThumbnailsHandler";
import axios from "axios";

enum StreamType {
  sub,
  dub
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentEpisode,
  hasPreviousEpisode,
  hasNextEpisode,
  handlePreviousEpisode,
  handleNextEpisode,
  onProgress,
  onDuration,
}) => {
  const player = useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(player);
  const { currentTime, duration } = useMediaStore(player);
  const [streamType, setStreamType] = useState<StreamType>(JSON.parse(localStorage.getItem("streamType") || "0"));
  const [trueStreamType, setTrueStreamType] = useState<StreamType>(streamType);
  const [thumbnails, setThumbnails] = useState<VTTJSON[]>();

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
    if (currentTime) {
      onProgress({ playedSeconds: currentTime });
    }
  }, [currentTime]);
  useEffect(() => {
    localStorage.setItem("streamType", JSON.stringify(streamType));
    console.log("Changing stream type to ", ["Sub", "Dub"][streamType]);
    if (streamType === StreamType.dub && !currentEpisode.sources.dub)
      setTrueStreamType(StreamType.sub);
    else setTrueStreamType(streamType);
  }, [streamType]);

  useEffect(() => {
    console.log(
      "Changing true stream type to ",
      ["Sub", "Dub"][trueStreamType]
    );
  }, [trueStreamType]);

  useEffect(() => {
    if (trueStreamType === StreamType.sub) {
      console.log("Adding subtitle tracks");
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
      console.log("Adding dub subtitle tracks");
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
    if (textTrack) {
      console.log("English text track found", textTrack);
      textTrack.mode = "showing";
    }
    return () => {
      console.log("Clearing text tracks");
      player.current?.textTracks.clear();
    };
  }, [currentEpisode.subtitles, currentEpisode.dubSubtitles, trueStreamType]);

  useEffect(() => {
    const fetchThumbnails = async (src: string) => {
      console.log("Source: ", src);
      const response = await axios.get(src);
      const thumbnailsVTT = response.data;
      const cleanSrc = src.replace(/thumbnails\.vtt$/, "");

      const thumbnails = VTTtoJSON(thumbnailsVTT, cleanSrc);
      console.log("Thumbnails: ", thumbnails);
      setThumbnails(thumbnails);
    };
    if (trueStreamType === StreamType.sub) {
      console.log("Changing to Sub thumbnails ");
      if (!currentEpisode.thumbnailSrc) {
        console.log("Sub Thumbnail not found");
        return;
      }
      fetchThumbnails(currentEpisode.thumbnailSrc);
    } else {
      console.log("Changing to Dub thumbnails ");
      if (!currentEpisode.dubThumbnailSrc) {
        console.log("Dub thumbnail not found");
        return;
      }
      fetchThumbnails(currentEpisode.dubThumbnailSrc);
    }
    return () => {
      console.log("Clearing thumbnails");
      setThumbnails([]);
    };
  }, [
    currentEpisode.thumbnailSrc,
    currentEpisode.dubThumbnailSrc,
    trueStreamType,
  ]);

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
    console.log("Skip button clicked");
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

  return (
    <div className="relative border border-white">
      {currentEpisode && (
        <>
          <MediaPlayer
            className="mb-0 pb-0"
            src={
              [currentEpisode.sources.sub, currentEpisode.sources.dub][
                trueStreamType
              ]
            }
            ref={player}
            autoPlay
          >
            <MediaProvider />
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
  currentEpisode: currEpisodeData;
  hasPreviousEpisode: boolean;
  hasNextEpisode: boolean;
  handlePreviousEpisode: () => void;
  handleNextEpisode: () => void;
  onProgress: (state: { playedSeconds: number }) => void;
  onDuration: (duration: number) => void;
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