import { Card, CardMedia } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // Assuming you're using react-router for navigation
import { AnimeData } from '../interfaces/AnimeData';

export const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
    const navigate = useNavigate();

    const navigateToPage = () => {
        navigate(`/anime/${anime?.mal_id}`); // Update the path as needed
    };

    return (
        <div className="text-white my-10 mx-6 w-[300px] h-[400px]">
            <Card>
                <div className="relative group">
                    <CardMedia
                        component="img"
                        image={anime?.image.large}
                        alt={anime?.title.english}
                        className="rounded-xl shadow-xl mx-auto object-cover w-[225px] h-[400px]"
                    />
                    <div className="rounded-xl mx-auto absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out"></div>
                    <button
                        onClick={navigateToPage}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                        style={{ transition: 'opacity 0.2s ease-in-out' }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                </div>
            </Card>
            {
                anime?.title.romaji ? (
                    <div className="text-lg text-white font-bold text-center truncate mx-2 pt-2 font-poppins">
                        {anime?.title.romaji}
                    </div>
                ) : (
                    <div className="text-lg text-white font-bold text-center truncate mx-2 pt-2 font-poppins">
                        {anime?.title.english}
                    </div>
                )
            }
        </div>
    )
}

interface AnimeCardProps {
    anime: AnimeData;
}