import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

const AnimeListContext = createContext<AnimeListContextProps | undefined>(undefined);

export const AnimeListProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [watching, setWatching] = useState<Anime[]>([]);
    const [completed, setCompleted] = useState<Anime[]>([]);
    const [planToWatch, setPlanToWatch] = useState<Anime[]>([]);

    const addToWatching = (anime: Anime) => {
        console.log('Adding to watching:', anime);
        setWatching([...watching, anime]);
    }
    const addToCompleted = (anime: Anime) => {
        console.log('Adding to completed:', anime);
        setCompleted([...completed, anime]);
    }
    const addToPlanToWatch = (anime: Anime) => {
        console.log('Adding to plan to watch:', anime);
        setPlanToWatch([...planToWatch, anime]);
    }

    const rateAnime = (id: string, list: 'watching' | 'completed' | 'planToWatch', rating: number) => {
        const updateList = (list: Anime[]) => list.map(anime => anime.id === id ? { ...anime, rating } : anime);
        if (list === 'watching') setWatching(updateList(watching));
        if (list === 'completed') setCompleted(updateList(completed));
        if (list === 'planToWatch') setPlanToWatch(updateList(planToWatch));
    };

    return (
        <AnimeListContext.Provider value={{ watching, completed, planToWatch, addToWatching, addToCompleted, addToPlanToWatch, rateAnime }}>
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