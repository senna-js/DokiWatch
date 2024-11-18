import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AnimeCardData } from "./components/AnimeCard";

interface AnilistUser {
  id: number;
  name: string;
  avatar: string;
  token: string;
}

interface AnilistAuth {
  user: AnilistUser | null;
  authState: "loading" | "authenticated" | "unauthenticated";
  authenticate: () => void;
  getAuth: () => void;
  addToList: (mediaId: number, status: MediaListStatus) => Promise<Boolean>;
  getList: (status: MediaListStatus) => Promise<AnimeCardData[]>;
}

export type MediaListStatus = "CURRENT" | "PLANNING" | "COMPLETED" | "DROPPED" | "PAUSED" | "REPEATING";

// Create the context
const AnilistAuthContext = createContext<AnilistAuth | undefined>(undefined);

export const useAnilistAuth = (): AnilistAuth => {
  const context = useContext(AnilistAuthContext);
  if (!context) {
    throw new Error("useAnilistAuth must be used within an AnilistAuthProvider");
  }
  return context;
};

// Provider component for Anilist Authentication
export const AnilistAuthProvider: React.FC<{ children: React.ReactNode, storageKey: string }> = ({ children, storageKey }) => {
  const [user, setUser] = useState<AnilistUser | null>(null);
  const [authState, setAuthState] = useState<"loading" | "authenticated" | "unauthenticated">("loading");

  const setAnilistUser = async (token?: string): Promise<Boolean> => {
    if (user) {
      console.log("User already set");
      return true;
    }
    const unAuthenticate = () => {
      localStorage.removeItem(storageKey);
      setAuthState("unauthenticated");
      setUser(null);
    };
    setAuthState("loading");

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
      setUser(fetchedUser);
      setAuthState("authenticated");
      return true;
    }

    const parsedUser: AnilistUser = JSON.parse(retrievedUser);
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

    console.log("Setting user from local storage", parsedUser);
    setAuthState("authenticated");
    setUser(parsedUser);
    return true;
  };

  const authenticate = () => {
    const clientId = import.meta.env.PROD ? 21555 : 19786;
    const anilink = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
    window.location.href = anilink;
  };

  const getAuth = async () => {
    if (await setAnilistUser()) {
      console.log("found in local storage or already set")
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
    if (authState !== "authenticated") {
      console.log("Not authenticated");
      return false;
    }
    if (!user) {
      console.log("Invalid authState");
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
    const response = await anilistQuery(query, variables, user.token);

    if (response.errors) {
      console.error("Error adding to list", response.errors);
      return false;
    }
    return true;
  }

  const getList = async (status: MediaListStatus): Promise<AnimeCardData[]> => {
    if (authState !== "authenticated") {
      console.log("Not authenticated");
      return [];
    }
    if (!user) {
      console.log("Invalid authState");
      return [];
    }

    const query = `
    query MediaListCollection($page: Int, $perPage: Int, $userId: Int, $type: MediaType, $status: MediaListStatus) {
      Page(page: $page, perPage: $perPage) {
        mediaList(userId: $userId, type: $type, status: $status) {
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
            bannerImage
            status
            episodes
            nextAiringEpisode {
              episode
              timeUntilAiring
              airingAt
            }
          }
        }
      }
    }`;
    const variables = {
      page: 1,
      perPage: 50,
      userId: user.id,
      type: "ANIME",
      status: status,
    }

    const response = await anilistQuery(query, variables, user.token);

    const mediaList = response.data.Page.mediaList;

    const fetchedAnimeData: AnimeCardData[] = mediaList.map((media: any) => {
      const anime: AnimeCardData = {
        id: media.media.id,
        idMal: media.media.idMal,
        title: media.media.title,
        image: media.media.coverImage.large,
        color: media.media.coverImage.color,
        description: media.media.description,
        status: media.media.status,
        totalEpisodes: media.media.episodes || null,
        currentEpisode: (media.media.nextAiringEpisode?.episode - 1) || media.media.episodes,
        nextAiringEpisode: media.media.nextAiringEpisode,
        bannerImage: media.media.bannerImage,
      };
      return anime;
    });

    return fetchedAnimeData;
  }

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <AnilistAuthContext.Provider value={{ user, authState, authenticate, getAuth, addToList, getList }}>
      {children}
    </AnilistAuthContext.Provider>
  );
};

//fix the cache and make it more robust
/**
 * @param deps dependencies for the cache, if any of the dependencies change, the cache will be invalidated,
 * empty array to always use cache, dont define to never use cache. 
 */
export const anilistQuery = async (query: string, variables: any, accessToken?: string, deps?: any[]): Promise<any> => {
  const setStorage = (key: string, value: any) => {
    if (!deps) return;
    const obj = { value, deps };
    sessionStorage.setItem(key, JSON.stringify(obj));
  }

  const getStorage = (key: string): { value: any, deps: any[] } | null => {
    if (!deps) return null;
    const retrievedObject = sessionStorage.getItem(key);
    if (retrievedObject) {
      return JSON.parse(retrievedObject);
    }
    return null;
  }

  const storedData = getStorage(query);

  if (storedData && deps) {
    console.log("Found in cache", storedData);

    if (deps.some((dep, i) => dep !== storedData.deps[i])) {
      console.log("Cache mismatch", deps, storedData.deps);
    }

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
    json.then(data => setStorage(query, data));
  }
  return json;
};