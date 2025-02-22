import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { MediaListStatus, AnilistUserAnimeData, MediaStatus } from "./interfaces/AnilistAnimeData";

interface AnilistUser {
  id: number;
  name: string;
  avatar: string;
  token: string;
}

type UnAuthenticatedUser = {
  user: null
  authState: "unauthenticated" | "loading"
}
type AuthenticatedUser = {
  user: AnilistUser
  authState: "authenticated"
}

type MediaListSort = "SCORE_DESC" | "PROGRESS" | "PROGRESS_DESC" | "MEDIA_POPULARITY_DESC" |
 "UPDATED_TIME_DESC" | "ADDED_TIME_DESC" | "FINISHED_ON_DESC" | "STARTED_ON_DESC"

interface BaseAnilistContext {
  authenticate: () => void;
  unAuthenticate: () => void;
  addToList: (mediaId: number, status: MediaListStatus) => Promise<Boolean>;
  getList: (status: MediaListStatus, page: number, perPage: number, sort: MediaListSort) => Promise<AnilistUserAnimeData[]>;
}

type AuthUnion = AuthenticatedUser | UnAuthenticatedUser

type AnilistContext = BaseAnilistContext & AuthUnion

// Create the context
const AnilistAuthContext = createContext<AnilistContext | undefined>(undefined);

export const useAnilistContext = (): AnilistContext => {
  const context = useContext(AnilistAuthContext);
  if (!context) {
    throw new Error("useAnilistAuth must be used within an AnilistAuthProvider");
  }
  return context;
};

// Provider component for Anilist Authentication
export const AnilistAuthProvider: React.FC<{ children: React.ReactNode, storageKey: string }> = ({ children, storageKey }) => {
  const [authUnion, setAuthUnion] = useState<AuthUnion>({ user: null, authState: "loading" });

  const unAuthenticate = () => {
    localStorage.removeItem(storageKey);
    setAuthUnion({ user: null, authState: "unauthenticated" });
  };

  const isUser = (user: unknown): user is AnilistUser => {
    if (typeof user !== "object" || user === null) return false; // Check for null and type of object
    if (!("id" in user) || typeof user.id !== "number") return false;
    if (!("name" in user) || typeof user.name !== "string") return false;
    if (!("avatar" in user) || typeof user.avatar !== "string") return false;
    if (!("token" in user) || typeof user.token !== "string") return false;
    return true;
  };


  const setAnilistUser = async (token?: string): Promise<Boolean> => {
    if (authUnion.user) {
      console.log("User already set");
      return true;
    }
    setAuthUnion({ user: null, authState: "loading" });

    const retrievedUser = localStorage.getItem(storageKey);

    if (!retrievedUser) {
      if (!token) {
        console.log("No token and no user", token);
        unAuthenticate();
        return false;
      }
      const query = `
        query Viewer {
          Viewer {
            id
            name
            avatar {
              large
            }
          }
        }`;

      const response = await anilistQuery(query, {}, token);

      const fetchedUser: AnilistUser = {
        id: response.data.Viewer.id,
        name: response.data.Viewer.name,
        avatar: response.data.Viewer.avatar.large,
        token: token,
      };
      console.log("Fetched user", fetchedUser);
      localStorage.setItem(storageKey, JSON.stringify(fetchedUser));
      setAuthUnion({ user: fetchedUser, authState: "authenticated" });
      return true;
    }

    const parsedUser: unknown = JSON.parse(retrievedUser);
    if (!isUser(parsedUser)) {
      console.log("Invalid user data in localStorage", parsedUser);
      unAuthenticate();
      return false;
    }
    const decodedToken: any = jwtDecode(parsedUser.token);

    if (!decodedToken.exp || decodedToken.exp < Date.now() / 1000) {
      console.log("Token expired");
      unAuthenticate();
      return false;
    }

    if (!decodedToken.sub || parseInt(decodedToken.sub) !== parsedUser.id) {
      console.log("Token ID does not match user ID");
      unAuthenticate();
      return false;
    }

    setAuthUnion({ user: parsedUser, authState: "authenticated" });
    return true;
  };

  const authenticate = () => {
    const clientId = import.meta.env.PROD ? 21555 : 19786;
    const anilink = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
    window.location.href = anilink;
  };

  const getAuth = async () => {
    if (await setAnilistUser()) {
      return;
    }
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const token = params.get("access_token");
    if (!token) return;

    setAnilistUser(token)
    window.history.replaceState(null, "", window.location.pathname)
  };

  const addToList = async (mediaId: number, status: MediaListStatus): Promise<Boolean> => {
    if (authUnion.authState !== "authenticated") {
      console.log("Not authenticated");
      return false;
    }
    const query = `
    mutation Mutation($mediaId: Int, $status: MediaListStatus) {
      SaveMediaListEntry(mediaId: $mediaId, status: $status) {
        status
      }
    }`;
    const variables = {
      mediaId: mediaId,
      status: status,
    };
    const response = await anilistQuery(query, variables, authUnion.user.token);

    if (response.errors) {
      console.error("Error adding to list", response.errors);
      return false;
    }
    return true;
  }

  const getList = async (status: MediaListStatus, page: number, perPage: number, sort: MediaListSort): Promise<AnilistUserAnimeData[]> => {
    if (authUnion.authState !== "authenticated") {
      console.log("Not authenticated");
      return [];
    }

    const query = `query MediaListCollection($page: Int, $perPage: Int, $userId: Int, $type: MediaType, $status: MediaListStatus, $sort: [MediaListSort]) {
                    Page(page: $page, perPage: $perPage) {
                      mediaList(userId: $userId, type: $type, status: $status, sort: $sort) {
                        media {
                          id
                          idMal
                          title {
                            romaji
                            english
                          }
                          description
                          coverImage {
                            large
                            color
                          }
                          status
                          episodes
                          genres
                          nextAiringEpisode {
                            episode
                            timeUntilAiring
                            airingAt
                          }
                          bannerImage
                        }
                        progress
                      }
                    }
                  }`
    const variables = {
      page,
      perPage,
      userId: authUnion.user.id,
      type: "ANIME",
      status,
      sort
    }

    const response = await anilistQuery(query, variables, authUnion.user.token);

    const mediaList = response.data.Page.mediaList;

    const fetchedAnimeData: AnilistUserAnimeData[] = mediaList.map((media: any) => {
      const runningStatus: MediaStatus = media.media.status;
      const currentEpisode: number = runningStatus === 'RELEASING' ? (media.media.nextAiringEpisode?.episode - 1)
        : (runningStatus === 'NOT_YET_RELEASED' ? 0 : media.media.episodes)//last episode if finished or cancelled

      const anime: AnilistUserAnimeData = {
        id: media.media.id,
        idMal: media.media.idMal,
        title: media.media.title,
        image: media.media.coverImage.large,
        color: media.media.coverImage.color,
        description: media.media.description,
        runningStatus: runningStatus,
        userStatus: status,
        totalEpisodes: media.media.episodes || null,
        currentEpisode: currentEpisode,
        nextAiringEpisode: media.media.nextAiringEpisode,
        bannerImage: media.media.bannerImage,
        genres: media.media.genres,
        progress: media.progress,
      };
      return anime;
    });

    return fetchedAnimeData;
  }

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AnilistAuthContext.Provider value={{ ...authUnion, authenticate, unAuthenticate, addToList, getList }}>
      {children}
    </AnilistAuthContext.Provider>
  );
};

interface AnilistQueryCacheObject {
  value: any;
  deps: any[];
}

//fix the cache and make it more robust
/**
 * @param deps dependencies for the cache, if any of the dependencies change, the cache will be invalidated,
 * empty array to always use cache, dont define to never use cache. 
 */
export const anilistQuery = async (query: string, variables: any, accessToken?: string, deps?: any[]): Promise<any> => {

  const clearCache = (key: string) => {
    sessionStorage.removeItem(key);
  }

  const getAnilistQueryCacheList = (key: string): AnilistQueryCacheObject[] | null => {
    const retrievedObject = sessionStorage.getItem(key);

    if (!retrievedObject) return null;
    const parsedList = JSON.parse(retrievedObject);

    if (!Array.isArray(parsedList)) {
      clearCache(key);
      return null;
    }

    const AnilistQueryCacheList = parsedList as AnilistQueryCacheObject[];
    return AnilistQueryCacheList;
  }

  const setStorage = (key: string, value: any, deps?: any[]) => {
    if (!deps) return;
    const cachedObject = getStorage(key, deps);
    if (cachedObject) return;
    const obj: AnilistQueryCacheObject = { value, deps };

    const AnilistQueryCacheList = getAnilistQueryCacheList(key) || [];
    AnilistQueryCacheList.push(obj);
    sessionStorage.setItem(key, JSON.stringify(AnilistQueryCacheList));
  }

  const getStorage = (key: string, deps?: any[]): { value: any, deps: any[] } | null => {
    if (!deps) return null;
    const AnilistQueryCacheList = getAnilistQueryCacheList(key);
    if (!AnilistQueryCacheList) return null;

    for (const cacheObj of AnilistQueryCacheList) {
      if (deps.every((dep, index) => dep === cacheObj.deps[index])) {
        console.log("Found cache", cacheObj);
        return cacheObj;
      }
    }

    return null;
  }

  const storedData = getStorage(query, deps);
  if (storedData) {
    return storedData.value;
  }

  const headers: any = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }
  const response = await fetch("https://graphql.anilist.co", {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = response.json();
  if (response.ok) {
    json.then(data => setStorage(query, data, deps));
  }
  return json;
};