import { useEffect, useState } from 'react';
import { AnimeCard } from './AnimeCard';
import { AnimeData } from "../interfaces/AnimeData";

const TopAiringAnimeStack = () => {
    const [topAiringAnime, setTopAiringAnime] = useState<AnimeData[]>([]);

    useEffect(() => {
        const fetchTopAiringAnime = async () => {
            try {
                const response = await fetch('https://consumnetapieshan.vercel.app/anime/gogoanime/top-airing');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTopAiringAnime(data);
            } catch (error) {
                console.error("Error fetching top airing anime:", error);
            }
        };

        fetchTopAiringAnime();
    }, []); // Empty dependency array means this effect runs once after the initial render

    return (
        <div className="top-airing-anime-stack">
            <h2>Top Airing Anime</h2>
            <div className="anime-cards-container">
                {topAiringAnime.map((anime) => (
                    <AnimeCard key={anime?.mal_id} anime={anime} />
                ))}
            </div>
        </div>
    );
};

export default TopAiringAnimeStack;