import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

interface AnilistUser {
  id: number;
  name: string;
  avatar: string;
}

interface AnilistAuth {
  user: AnilistUser | null;
  authState: "loading" | "authenticated" | "unauthenticated";
  authenticate: () => void;
  getAuth: () => void;
}

export const useAnilistAuth = (): AnilistAuth => {
  const [user, setUser] = useState<AnilistUser | null>(null);
  const [authState, setAuthState] = useState<
    "loading" | "authenticated" | "unauthenticated"
  >("loading");

  const setAnilistUser = async (): Promise<void> => {
    setAuthState("loading");
    const retrievedUser = localStorage.getItem("anilist_user");
    const retrievedToken = localStorage.getItem("anilist_token");

    if (retrievedUser && retrievedToken) {
      const decodedToken = jwtDecode(retrievedToken);

      if (decodedToken && decodedToken.exp && decodedToken.exp < Date.now() / 1000) {
        localStorage.removeItem("anilist_user");
        localStorage.removeItem("anilist_token");
        setUser(null);
        setAuthState("unauthenticated");
        return;
      }

      console.log(decodedToken);
      setUser(JSON.parse(retrievedUser));
      setAuthState("authenticated");
      return;
    }

    if (!retrievedToken) {
      localStorage.removeItem("anilist_user");
      setUser(null);
      setAuthState("unauthenticated");
      return;
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
          }
          `;
    const variables = {};
    const response = await anilistQuery(query, variables, true);
    const user: AnilistUser = {
      id: response.data.Viewer.id,
      name: response.data.Viewer.name,
      avatar: response.data.Viewer.avatar.large,
    };
    localStorage.setItem("anilist_user", JSON.stringify(user));
    setUser(user);
    setAuthState("authenticated");
  };

  useEffect(() => {
    setAnilistUser();
  }, []);

  const authenticate = () => {
    const clientId = import.meta.env.PROD ? 21555 : 19786;
    const anilink = `https://anilist.co/api/v2/oauth/authorize?client_id=${clientId}&response_type=token`;
    window.location.href = anilink;
  };

  const getAuth = () => {
    const fragment = window.location.hash.substring(1);
    const params = new URLSearchParams(fragment);
    const token = params.get("access_token");
    if (!token) return;
    console.log(params);
    localStorage.setItem("anilist_token", token);
    window.history.replaceState(null, "", window.location.pathname);

    setAnilistUser();
  };

  return { user, authState, authenticate, getAuth };
};
//6561632

export const anilistQuery = async (
  query: string,
  variables: any,
  authenticated: boolean
) => {
  const headers: any = {
    "Content-Type": "application/json",
  };
  if (authenticated) {
    const token = localStorage.getItem("anilist_token");
    if (!token)
      throw new Error(
        "No access token found for authenticated anilist request"
      );

    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = "https://graphql.anilist.co",
    options = {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    };

  // console.log(query, variables);
  const response = await fetch(url, options);
  return response.json();
};
export const addToAnilist = async (mediaId: number, status: string) => {
  const query = `
    mutation AddMediaListEntry($mediaId: Int, $status: MediaListStatus) {
      SaveMediaListEntry(mediaId: $mediaId, status: $status) {
        id
        status
      }
    }`;
  const variables = { mediaId, status };
  return anilistQuery(query, variables, true);
};
