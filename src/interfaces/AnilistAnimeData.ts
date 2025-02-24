export type MediaStatus = "RELEASING" | "FINISHED" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS";

export interface AnilistAnimeData {
  id: number;
  idMal: number;
  title: {
    romaji: string;
    english?: string;
  };
  image: string;
  color: string;
  description: string;
  runningStatus: MediaStatus;
  totalEpisodes: number;
  currentEpisode: number;
  nextAiringEpisode?: {
    episode: number;
    timeUntilAiring: number;
    airingAt: number;
  };
  bannerImage: string;
  genres?: string[];
}

export type MediaListStatus = "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";

export interface AnilistUserAnimeData extends AnilistAnimeData {
    progress: number;
    userStatus: MediaListStatus;
}