import React from 'react';
import { useAnimeList } from '../AnimeListContext';

interface AnimeListProps {
    title: string;
    list: 'watching' | 'completed' | 'planToWatch';
}

export const AnimeList: React.FC<AnimeListProps> = ({ title, list }) => {
    const { watching, completed, planToWatch, rateAnime } = useAnimeList();
    const animeList = list === 'watching' ? watching : list === 'completed' ? completed : planToWatch;

    console.log('Rendering AnimeList:', animeList);
    
    return (
        <div>
            <h2>{title}</h2>
            <ul>
                {animeList.map(anime => (
                    <li key={anime.id}>
                        <img src={anime.image} alt={anime.title} width="50" />
                        <span>{anime.title}</span>
                        <label htmlFor={`rating-${anime.id}`}>Rating:</label>
                        <input
                            id={`rating-${anime.id}`}
                            type="number"
                            min="0"
                            max="10"
                            value={anime.rating}
                            onChange={(e) => rateAnime(anime.id, list, parseInt(e.target.value))}
                            placeholder="Rate"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};

