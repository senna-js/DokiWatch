import axios, { AxiosResponse } from "axios";

const endpoints: string[] = import.meta.env.VITE_CONSUMET_API_ENDPOINTS.split(
  ","
);

export const LoadBalance = async (
  query: string | null
): Promise<AxiosResponse<any, any>> => {
  if (!query) {
    throw new Error("No query provided");
  }
  const endpointsCopy = [...endpoints];

  for (let i = 0; i < endpointsCopy.length; i++) {
    const randomIndex = Math.floor(Math.random() * endpointsCopy.length);
    const randomEndpoint = endpointsCopy.splice(randomIndex, 1)[0];
    const url = `${randomEndpoint}${query}`;

    try {
      const response = await axios.get(url);
      return response;
    } catch (error) {
      if (i === endpointsCopy.length - 1) {
        throw new Error("All endpoints failed");
      }
    }
  }

  return {} as AxiosResponse<any, any>;
};

export const consumetZoro = async (
  query: string | null
): Promise<AxiosResponse<any, any>> => {
  const loadBalancingQuery = query ? `/anime/zoro/${query}` : null;

  return LoadBalance(loadBalancingQuery);
};

export const consumetAnilistSearch = async (
  params: ConsumetAnilistSearchParams
): Promise<AxiosResponse<any, any>> => {
  const searchParams = new URLSearchParams();

  Object.keys(params).forEach((key) => {
    const value = params[key as keyof ConsumetAnilistSearchParams];
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        searchParams.append(key, JSON.stringify(value));
      } else {
        searchParams.append(key, value as string);
      }
    }
  });
  const query = "/meta/anilist/advanced-search?" + searchParams.toString();

  return LoadBalance(query);
};
export interface ConsumetAnilistSearchParams {
  query?: string;
  type?: "ANIME" | "MANGA";
  page?: number;
  perPage?: number;
  season?: "WINTER" | "SPRING" | "SUMMER" | "FALL";
  format?: "TV" | "TV_SHORT" | "OVA" | "ONA" | "MOVIE" | "SPECIAL" | "MUSIC";
  sort?: (
    | "POPULARITY_DESC"
    | "POPULARITY"
    | "TRENDING_DESC"
    | "TRENDING"
    | "UPDATED_AT_DESC"
    | "UPDATED_AT"
    | "START_DATE_DESC"
    | "START_DATE"
    | "END_DATE_DESC"
    | "END_DATE"
    | "FAVOURITES_DESC"
    | "FAVOURITES"
    | "SCORE_DESC"
    | "SCORE"
    | "TITLE_ROMAJI_DESC"
    | "TITLE_ROMAJI"
    | "TITLE_ENGLISH_DESC"
    | "TITLE_ENGLISH"
    | "TITLE_NATIVE_DESC"
    | "TITLE_NATIVE"
    | "EPISODES_DESC"
    | "EPISODES"
    | "ID"
    | "ID_DESC"
  )[];
  genres?: (
    | "Action"
    | "Adventure"
    | "Comedy"
    | "Drama"
    | "Fantasy"
    | "Horror"
    | "Mahou Shoujo"
    | "Mecha"
    | "Music"
    | "Mystery"
    | "Psychological"
    | "Romance"
    | "Sci-Fi"
    | "Slice of Life"
    | "Sports"
    | "Supernatural"
    | "Thriller"
  )[];
  id?: string;
  year?: string;
  status?:
    | "RELEASING"
    | "NOT_YET_RELEASED"
    | "FINISHED"
    | "CANCELLED"
    | "HIATUS";
}
