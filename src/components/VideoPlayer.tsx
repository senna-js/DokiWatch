import { currEpisodeData } from "../interfaces/CurrEpisodeData"
import { useState, useRef, useEffect } from "react";
import '@vidstack/react/player/styles/default/theme.css';
import '@vidstack/react/player/styles/default/layouts/video.css';
import { MediaPlayer, useMediaStore, useMediaRemote, type MediaPlayerInstance, MediaProvider, Track } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { CustomMenu } from "./VideoPlayerComponents/CustomMenu";
import { SkipButtons } from "./VideoPlayerComponents/SkipButtons";
import { EpisodeControlButtons } from "./VideoPlayerComponents/EpisodeControlButtons";

enum StreamType {
  sub,
  dub
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ currentEpisode, hasPreviousEpisode, hasNextEpisode, handlePreviousEpisode, handleNextEpisode }) => {

  const player = useRef<MediaPlayerInstance>(null);
  const remote = useMediaRemote(player);
  const { currentTime } = useMediaStore(player);
  const [streamType, setStreamType] = useState<StreamType>(StreamType.sub);
  const [trueStreamType, setTrueStreamType] = useState<StreamType>(streamType);

  useEffect(() => {
    console.log("Changing stream type to ", ["Sub", "Dub"][streamType]);
    if (streamType === StreamType.dub && !currentEpisode.sources.dub)
      setTrueStreamType(StreamType.sub);
    else
      setTrueStreamType(streamType);
  }, [streamType])

  useEffect(() => {
    console.log("Changing true stream type to ", ["Sub", "Dub"][trueStreamType]);
  }, [trueStreamType])

  const loadSkipButton: boolean = (currentTime > currentEpisode.intro.start && currentTime < currentEpisode.intro.end)
    || (currentTime > currentEpisode.outro.start && currentTime < currentEpisode.outro.end);

  const skipText: string = (currentTime > currentEpisode.intro.start && currentTime < currentEpisode.intro.end) ? "Skip Intro" : "Skip Outro";

  const handleSkip = () => {
    console.log("Skip button clicked");
    if (currentTime > currentEpisode.intro.start && currentTime < currentEpisode.intro.end) {
      remote.seek(currentEpisode.intro.end);
    }
    else if (currentTime > currentEpisode.outro.start && currentTime < currentEpisode.outro.end) {
      remote.seek(currentEpisode.outro.end);
    }
  }

  return (
    <div className="relative border border-white">
      {(currentEpisode) && <>
        <MediaPlayer className="mb-0 pb-0" src={[currentEpisode.sources.sub, currentEpisode.sources.dub][trueStreamType]} ref={player} autoPlay crossOrigin logLevel="debug">
          {(trueStreamType === StreamType.sub) ?
            currentEpisode.subtitles.map((subtitle) => (<Track src={subtitle.url} kind="subtitles" label={subtitle.lang} default={subtitle.lang === "English"} key={subtitle.lang} />))
            : currentEpisode.dubSubtitles?.map((subtitle) => (<Track src={subtitle.url} kind="subtitles" label={subtitle.lang} default={subtitle.lang === "English"} key={subtitle.lang} />))
          }
          <MediaProvider />
          <DefaultVideoLayout icons={defaultLayoutIcons}
            slots={{
              googleCastButton: null,
              settingsMenu: (<CustomMenu trueStreamType={trueStreamType} setStreamType={(streamType) => setStreamType(streamType)} hasDub={!!currentEpisode.sources.dub} />),
              afterEndTime: (<SkipButtons handleSkip={handleSkip} skipText={skipText} loadSkipButton={loadSkipButton} />),
              beforeCaptionButton: (<EpisodeControlButtons hasPreviousEpisode={hasPreviousEpisode} hasNextEpisode={hasNextEpisode} handlePreviousEpisode={handlePreviousEpisode} handleNextEpisode={handleNextEpisode} />),
            }}
          // thumbnails={[currentEpisode.thumbnailSrc,currentEpisode.dubThumbnailSrc][streamType]}
          />
        </MediaPlayer>
      </>}
    </div>
  )
}

interface VideoPlayerProps {
  currentEpisode: currEpisodeData;
  hasPreviousEpisode: boolean;
  hasNextEpisode: boolean;
  handlePreviousEpisode: () => void;
  handleNextEpisode: () => void;
}