import { CurrEpisodeData } from "../interfaces/CurrEpisodeData";
import { consumetZoro } from "./LoadBalancer";
import * as Realm from "realm-web";

// Initialize MongoDB
const initialiazeMongo = async () => {
  const app = new Realm.App({ id: "application-0-lrdgzin" });
  const user = await app.logIn(
    Realm.Credentials.apiKey(import.meta.env.VITE_MONGO_API_KEY)
  );
  return user.mongoClient("mongodb-atlas");
};
const mongo = initialiazeMongo();

// Helper functions for caching
const getCachedData = (cacheKey: string) => {
  const cached = sessionStorage.getItem(cacheKey);
  return cached ? JSON.parse(cached) : {};
};

const setCachedData = (cacheKey: string, cacheData: any) => {
  sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
};

// Function to get anime data with caching
export const getAnimeData = async (
  malId: number,
  name: string,
  forceRefresh = false // Add forceRefresh flag
): Promise<AnimeWatchData> => {
  const cacheKey = `animeCache`;
  const animeCache = getCachedData(cacheKey); // Retrieve anime cache object

  // Check if cached data exists and forceRefresh is false
  if (!forceRefresh && animeCache[malId]) {
    console.log("Returning cached anime data for malId:", malId);
    return animeCache[malId]; // Return cached data
  }

  const zoroId = await getZoroId(malId, name);

  const response = await consumetZoro(`info?id=${zoroId}`);
  const animeResponse: AnimeWatchData = response.data;

  // Update the cache with new data
  animeCache[malId] = animeResponse;
  setCachedData(cacheKey, animeCache); // Store the updated animeCache

  return animeResponse;
};

// Function to get current episode data with caching
export const getCurrentEpisodeData = async (
  id: string,
  hasDub: boolean,
  forceRefresh = false // Add forceRefresh flag
): Promise<CurrEpisodeData> => {
  const cacheKey = `episodeCache`;
  const episodeCache = getCachedData(cacheKey); // Retrieve episode cache object

  // Check if cached data exists and forceRefresh is false
  if (!forceRefresh && episodeCache[id]) {
    console.log("Returning cached episode data for id:", id);
    return episodeCache[id]; // Return cached data
  }

  // Original logic to fetch sub and dub episode data
  const subResponse = consumetZoro(`watch?episodeId=${id}`);
  const dubResponse = hasDub
    ? consumetZoro(`watch?episodeId=${id.replace(/(\$both|\$sub)$/, "$dub")}`)
    : null;

  const results = await Promise.allSettled([subResponse, dubResponse]);

  let subData = results[0].status === "fulfilled" ? results[0].value : null;
  const dubData =
    dubResponse && results[1].status === "fulfilled" ? results[1].value : null;

  if (!subData || !subData.data) {
    console.log("Converting episode id");
    const newId = id.includes("$both")
      ? id.replace("$both", "$sub")
      : id.replace("$sub", "$both");
    subData = await consumetZoro(`watch?episodeId=${newId}`);
  }

  if (!subData && !dubData) {
    throw new Error("Sub data not found, Dubdata not found");
  }

  if (subData && subData.data) {
    const thumbSrcObj = subData.data.subtitles
      ? subData.data.subtitles.find((sub: any) => sub.lang === "Thumbnails")
      : null;
    const dubThumbSrcObj =
      dubData && dubData.data && dubData.data.subtitles
        ? subData.data.subtitles.find((sub: any) => sub.lang === "Thumbnails")
        : null;
    const subtitlesList = subData.data.subtitles
      ? subData.data.subtitles.filter((sub: any) => sub.lang !== "Thumbnails")
      : null;

    const episodeData: CurrEpisodeData = {
      zoroId: id,
      intro: subData.data.intro,
      outro: subData.data.outro,
      sources: {
        sub: subData.data.sources[0].url.replace(
          /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
          "/api-$1"
        ),
        dub: (dubData && dubData.data) ?
         dubData?.data.sources[0].url.replace(
                /https?:\/\/e([abcdef]).netmagcdn.com:2228\/hls-playback/,
                "/api-$1"
              )
            : null,
      },
      thumbnailSrc: thumbSrcObj
        ? thumbSrcObj.url.replace(
            "https://s.megastatics.com/thumbnails",
            "/api-thumb"
          )
        : null,
      dubThumbnailSrc: dubThumbSrcObj
        ? dubThumbSrcObj
            .find((sub: any) => sub.lang === "Thumbnails")
            .url.replace("https://s.megastatics.com/thumbnails", "/api-thumb")
        : null,
      subtitles: subtitlesList
        ? subtitlesList.map((sub: any) => ({
            url: sub.url.replace(
              "https://s.megastatics.com/subtitle",
              "/api-sub"
            ),
            lang: sub.lang,
          }))
        : null,
      dubSubtitles: dubData && dubData.data && dubData && dubData.data.subtitles
        ? dubData?.data.subtitles
            .filter((sub: any) => sub.lang !== "Thumbnails")
            .map((sub: any) => ({
              url: sub.url.replace(
                "https://s.megastatics.com/subtitle",
                "/api-sub"
              ),
              lang: sub.lang,
            }))
        : null,
    };

    // Remove duplicate subtitles
    if (episodeData.subtitles) {
      episodeData.subtitles = episodeData.subtitles.filter(
        (sub, index, self) =>
          index === self.findIndex((t) => t.lang === sub.lang)
      );
    }
    episodeData.dubSubtitles = episodeData.dubSubtitles?.filter(
      (sub, index, self) => index === self.findIndex((t) => t.lang === sub.lang)
    );

    // Update the cache with new data
    episodeCache[id] = episodeData;
    setCachedData(cacheKey, episodeCache); // Store the updated episodeCache

    return episodeData;
  }

  throw new Error("Sub data not found, Dubdata found");
};

// Function to get Zoro ID from MongoDB or search for it
const getZoroId = async (malId: number, name: string): Promise<string> => {
  const anime = await (await mongo)
    .db("Zoro")
    .collection("mappings")
    .findOne({ mal_id: malId });

  if (!anime) {
    return searchZoroId(malId, name);
  }
  return anime.zoro_id;
};

// Function to search for Zoro ID and store it in MongoDB
const searchZoroId = async (malId: number, name: string): Promise<string> => {
  const animeResponses: any = (await consumetZoro(name)).data.results;
  console.log(name);
  for (let i = 0; i < animeResponses.length; i++) {
    const anime = animeResponses[i];

    const response = await consumetZoro(`info?id=${anime.id}`);

    if (response.data.malID == malId) {
      const newAnime: mongoAnime = {
        mal_id: response.data.malID,
        al_id: response.data.alID,
        zoro_id: response.data.id,
      };

      const databaseAnime = await (await mongo)
        .db("Zoro")
        .collection("mappings")
        .findOne({ mal_id: response.data.malID });

      if (!databaseAnime) {
        console.log("Inserting new anime into database", newAnime);
        await (await mongo)
          .db("Zoro")
          .collection("mappings")
          .insertOne(newAnime);
      }
      return response.data.id;
    }
  }
  throw new Error("Anime not found in Zoro");
};

export interface AnimeWatchData {
  id: string;
  title: string;
  malID: number;
  alID: number;
  image: string;
  description: string;
  totalEpisodes: number;
  hasSub: boolean;
  hasDub: boolean;
  episodes: Episode[];
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
