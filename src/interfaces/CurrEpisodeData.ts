export interface CurrEpisodeData {
  zoroId:string
  sources: {
    sub: string;
    dub?: string;
  };
  subtitles: {
    url: string;
    lang: string;
  }[];
  dubSubtitles?: {
    url: string;
    lang: string;
  }[];
  thumbnailSrc?: string;
  dubThumbnailSrc?: string;
  intro: {
    start: number;
    end: number;
  };
  outro: {
    start: number;
    end: number;
  };
}
