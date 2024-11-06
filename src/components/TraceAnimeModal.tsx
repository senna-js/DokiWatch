import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface TraceAnimeModalProps {
    traceRef: React.RefObject<HTMLDialogElement>;
    isModalDisplayed: boolean;
    closeModal: () => void;
    toggleSidebar: () => void;
}

interface TraceResult {
    filename: string;
    episode: number;
    similarity: number;
    video: string;
    image: string;
    anilist: number;
}

interface AniListAnime {
    title: {
        romaji: string;
        english: string;
    };
    coverImage: {
        extraLarge: string;
    };
    idMal: number;
}

const TraceAnimeModal: React.FC<TraceAnimeModalProps> = ({ traceRef, isModalDisplayed, closeModal, toggleSidebar }) => {
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [results, setResults] = useState<TraceResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [animeData, setAnimeData] = useState<{ [key: number]: AniListAnime }>({});
    const navigate = useNavigate();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setScreenshot(e.target.files[0]);
        }
    };

    const handleTrace = async () => {
        if (!screenshot) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('image', screenshot);

        try {
            const response = await axios.post('https://api.trace.moe/search', formData);
            const traceResults = response.data.result;
            setResults(traceResults);

            // Fetch anime data from AniList
            const dataPromises = traceResults.map((result: TraceResult) =>
                fetchAniListData(result.anilist)
            );
            const data = await Promise.all(dataPromises);
            const dataMap = data.reduce((acc, anime, index) => {
                acc[traceResults[index].anilist] = anime;
                return acc;
            }, {} as { [key: number]: AniListAnime });
            setAnimeData(dataMap);
        } catch (error) {
            console.error('Error tracing anime scene:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAniListData = async (anilistId: number): Promise<AniListAnime> => {
        const query = `
            query ($id: Int) {
                Media(id: $id, type: ANIME) {
                    title {
                        romaji
                        english
                    }
                    coverImage {
                        extraLarge
                    }
                        idMal
                }
            }
        `;

        const variables = { id: anilistId };

        try {
            const response = await axios.post('https://graphql.anilist.co', {
                query,
                variables,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            });

            // const data: AniListAnime = response.data.data.Media;
            // console.log(`Fetched AniList poster for anime ID ${anilistId}: : `, response.data.data.Media);
            return response.data.data.Media;
        } catch (error) {
            console.error(`Error fetching AniList poster for ID ${anilistId}`, error);
            return {
                title: {
                    romaji: '',
                    english: '',
                },
                coverImage: {
                    extraLarge: '',
                },
                idMal: 0,
            };
        }
    };

    const handleCardClick = (malId: number) => {
        closeModal();
        toggleSidebar();
        navigate(`/anime/${malId}`);
    };


    useEffect(() => {
        if (isModalDisplayed && traceRef.current) {
            traceRef.current.showModal();
        } else if (traceRef.current) {
            traceRef.current.close();
        }
    }, [isModalDisplayed, traceRef]);

    // const extractAnimeName = (filename: string) => {
    //     // Remove '-Raws' if it appears within the first '[]'
    //     const rawsPattern = /^\[.*?-Raws.*?\]/;
    //     if (rawsPattern.test(filename)) {
    //         filename = filename.replace(rawsPattern, '').trim();
    //     }
    //     let animeName = '';
    //     // Remove only the specific brackets ([], (), {}) containing 'AAC'
    //     filename = filename.replace(/\[(?:[^\[\]]*(AAC|FLAC)[^\[\]]*)\]|\((?:[^\(\)]*(AAC|FLAC)[^\(\)]*)\)|\{(?:[^\{\}]*(AAC|FLAC)[^\{\}]*)\}/g, '').trim();
    //     animeName = filename.replace(/\.mkv$|\.mp4$/g, '').trim(); // Remove any trailing '.mkv' or '.mp4' from the anime_name itself

    //     return animeName;
    // };

    return (
        <dialog
            id="trace_anime_modal"
            className="modal modal-bottom sm:modal-middle"
            ref={traceRef}
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    closeModal();
                }
            }}
        >
            <div className="modal-box bg-doki-dark-grey backdrop-blur-lg rounded-[22px]">
                <h3 className="font-lato text-lg text-doki-purple">Trace Anime Scene</h3>
                <hr className="bg-doki-purple rounded-md h-[2px] border-0 mt-2" />
                <div className="py-4">
                    <p className='font-lato text-sm text-doki-light-grey mb-2'>Please upload a screenshot of any anime scene:</p>
                    <input type="file" className="file-input bg-doki-purple w-full max-w-xs" onChange={handleFileChange} />
                    <button className="btn w-full font-semibold font-anime text-doki-white hover:text-doki-purple border border-doki-light-grey hover:border-none rounded-[16px] bg-doki-purple hover:bg-doki-light-grey mt-4" onClick={handleTrace} disabled={loading}>
                        {loading ? 'Tracing...' : 'Trace'}
                    </button>
                    {results.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold ml-1 font-lato text-lg">Results</h3>
                            {results.slice(0, 5).map((result, index) => (
                                <div
                                    key={index}
                                    className="card relative text-doki-white rounded-[12px] 
                                        border-[3px] border-doki-purple shadow-lg hover:shadow-xl 
                                        transition-shadow duration-300 bg-cover bg-center 
                                        bg-no-repeat mb-4 hover:animate-scroll cursor-pointer"
                                    style={{
                                        backgroundImage: `url(${animeData[result.anilist]?.coverImage.extraLarge})`,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                    }}
                                    onClick={() => handleCardClick(animeData[result.anilist]?.idMal)}
                                >
                                    <div className="card-body inset-0 backdrop-blur-lg bg-black opacity-70 rounded-lg p-4">
                                        <div className="absolute text-doki-white bottom-2 right-2">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6 text-doki-white transform -rotate-45"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                />
                                            </svg>
                                        </div>
                                        <h2 className="card-title text-doki-light-grey font-lato">{animeData[result.anilist]?.title.english || animeData[result.anilist]?.title.romaji}</h2>
                                        <p className='font-lato text-doki-white'>Episode: {result.episode}</p>
                                        <p className='font-lato text-doki-white'>Similarity: {(result.similarity * 100).toFixed(2)}%</p>
                                        <a href={result.video} target="_blank" rel="noopener noreferrer" className="flex flex-shrink-0 gap-2 font-lato text-doki-purple">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-12 w-12 text-doki-dark-grey"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 10v4a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <p className='mt-2.5 font-lato text-doki-white'>Watch Video</p>
                                        </a>
                                        {/* <img src={result.image} alt="Anime Scene" className="mt-4" onError={(e) => {
                                            console.error(`Error loading image: ${result.image}`, e);
                                            e.currentTarget.src = 'https://via.placeholder.com/150'; // Set a fallback image URL
                                        }} /> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div className="modal-action bg-transparent 
                bg-opacity-50 text-doki-purple border border-doki-purple 
                rounded-[12px] p-2.5 font-anime font-bold cursor-pointer 
                shadow-md hover:bg-doki-purple hover:scale-105 transform 
                hover:text-doki-white transition duration-150 ease-in-out">
                    <button className="w-full rounded-lg" onClick={closeModal}>
                        Close
                    </button>
                </div>
            </div>
        </dialog >
    );
};

export default TraceAnimeModal;