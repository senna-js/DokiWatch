import React, { createContext, useContext, useState, useEffect } from 'react';

interface Anime {
    id: string;
    title: string;
    image: string;
    rating: number;
}

interface AnimeListContextProps {
    watching: Anime[];
    completed: Anime[];
    planToWatch: Anime[];
    addToWatching: (anime: Anime) => void;
    addToCompleted: (anime: Anime) => void;
    addToPlanToWatch: (anime: Anime) => void;
    rateAnime: (id: string, list: 'watching' | 'completed' | 'planToWatch', rating: number) => void;
    accessToken: string | null;
    setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
}

const AnimeListContext = createContext<AnimeListContextProps | undefined>(undefined);

export const AnimeListProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [watching, setWatching] = useState<Anime[]>([]);
    const [completed, setCompleted] = useState<Anime[]>([]);
    const [planToWatch, setPlanToWatch] = useState<Anime[]>([]);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    const addToWatching = (anime: Anime) => setWatching([...watching, anime]);
    const addToCompleted = (anime: Anime) => setCompleted([...completed, anime]);
    const addToPlanToWatch = (anime: Anime) => setPlanToWatch([...planToWatch, anime]);

    const rateAnime = (id: string, list: 'watching' | 'completed' | 'planToWatch', rating: number) => {
        const updateList = (list: Anime[]) => list.map(anime => anime.id === id ? { ...anime, rating } : anime);
        if (list === 'watching') setWatching(updateList(watching));
        if (list === 'completed') setCompleted(updateList(completed));
        if (list === 'planToWatch') setPlanToWatch(updateList(planToWatch));
    };

    useEffect(() => {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const token = hashParams.get("access_token");
        const user = JSON.parse(localStorage.getItem("user") as string);
        if (!user) return;
        user["access_token"] = token;
        localStorage.setItem("user", JSON.stringify(user));

        if (!token) {
            console.log("No access token found or it's expired, connect to Anilist");
        } else {
            setAccessToken(token);
        }
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            if (!accessToken) return;

            try {
                const query = `
                    query ($username: String) {
                        MediaListCollection(userName: $username, type: ANIME, status: CURRENT) {
                            lists {
                                entries {
                                    media {
                                        idMal
                                        title {
                                            romaji
                                            english
                                        }
                                        coverImage {
                                            extraLarge
                                        }
                                    }
                                }
                            }
                        }
                    }
                `;
                const response = await fetch('https://graphql.anilist.co', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`
                    },
                    body: JSON.stringify({ query, variables: { username: 'your_username' } })
                });
                const data = await response.json();
                const animeList = data.data.MediaListCollection.lists.flatMap((list: any) =>
                    list.entries.map((entry: any) => ({
                        id: entry.media.idMal,
                        title: entry.media.title.romaji,
                        image: entry.media.coverImage.extraLarge,
                        rating: 0
                    }))
                );
                setWatching(animeList); // Assuming you want to set this to the watching list
            } catch (error) {
                console.error("Error fetching anime list:", error);
            }
        };

        fetchData();
    }, [accessToken]);

    return (
        <AnimeListContext.Provider value={{ watching, completed, planToWatch, addToWatching, addToCompleted, addToPlanToWatch, rateAnime, accessToken, setAccessToken }}>
            {children}
        </AnimeListContext.Provider>
    );
};

export const useAnimeList = () => {
    const context = useContext(AnimeListContext);
    if (!context) {
        throw new Error('useAnimeList must be used within an AnimeListProvider');
    }
    return context;
};