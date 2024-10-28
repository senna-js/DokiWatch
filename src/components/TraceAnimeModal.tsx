import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface TraceAnimeModalProps {
    traceRef: React.RefObject<HTMLDialogElement>;
    isModalDisplayed: boolean;
    closeModal: () => void;
}

interface TraceResult {
    filename: string;
    episode: number;
    similarity: number;
    video: string;
    image: string;
}

const TraceAnimeModal: React.FC<TraceAnimeModalProps> = ({ traceRef, isModalDisplayed, closeModal }) => {
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [results, setResults] = useState<TraceResult[]>([]);
    const [loading, setLoading] = useState(false);

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
            setResults(response.data.result);
        } catch (error) {
            console.error('Error tracing anime scene:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isModalDisplayed && traceRef.current) {
            traceRef.current.showModal();
        } else if (traceRef.current) {
            traceRef.current.close();
        }
    }, [isModalDisplayed, traceRef]);

    const extractAnimeName = (filename: string) => {
        // Remove '-Raws' if it appears within the first '[]'
        const rawsPattern = /^\[.*?-Raws.*?\]/;
        if (rawsPattern.test(filename)) {
            filename = filename.replace(rawsPattern, '').trim();
        }
        let animeName = '';
        // Remove only the specific brackets ([], (), {}) containing 'AAC'
        filename = filename.replace(/\[(?:[^\[\]]*(AAC|FLAC)[^\[\]]*)\]|\((?:[^\(\)]*(AAC|FLAC)[^\(\)]*)\)|\{(?:[^\{\}]*(AAC|FLAC)[^\{\}]*)\}/g, '').trim();
        animeName = filename.replace(/\.mkv$|\.mp4$/g, '').trim(); // Remove any trailing '.mkv' or '.mp4' from the anime_name itself

        return animeName;
    };

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
                    <input type="file" className="file-input bg-doki-purple w-full max-w-xs" onChange={handleFileChange} />
                    <button className="btn w-full font-semibold font-anime text-doki-white hover:text-doki-purple border border-doki-light-grey hover:border-none rounded-[16px] bg-doki-purple hover:bg-doki-light-grey mt-4" onClick={handleTrace} disabled={loading}>
                        {loading ? 'Tracing...' : 'Trace'}
                    </button>
                    {results.length > 0 && (
                        <div className="mt-4">
                            <h3 className="font-bold ml-1 font-lato text-lg">Results</h3>
                            {results.slice(0, 5).map((result, index) => (
                                <div key={index} className="card bg-doki-light-grey shadow-xl mt-4">
                                    <div className="card-body">
                                        <h2 className="card-title">{extractAnimeName(result.filename)}</h2>
                                        <p>Episode: {result.episode}</p>
                                        <p>Similarity: {(result.similarity * 100).toFixed(2)}%</p>
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
                                            <p className='mt-2.5'>Watch Video</p>
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