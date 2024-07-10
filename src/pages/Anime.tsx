import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Content from "../components/ReadMore"

export const Anime = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [animeData, setAnimeData] = useState<any>()
    const [userRating, setUserRating] = useState(0);

    const handleRating = (ratingValue: number) => {
        setUserRating(ratingValue);
        // Here you can add a function to update the rating in your database or state management system
    };

    useEffect(() => {
        axios.get(`https://api.jikan.moe/v4/anime/${params.id}/full`)
            .then(res => {
                console.log(res.data)
                setAnimeData(res.data.data)
            })
    }, [params.id])

    const handleWatch = () => {
        const romajiName = animeData?.title.replace(/\s*-\s*/g, '-').toLowerCase().replace(/\s+/g, '-').replace(/:/g, '').replace(/,/g, '');
        const navString = `/watch/${romajiName}-episode-1`
        navigate(navString)
    }

    const handleGenreClick = (e: any) => {
        const genreName = e.target.innerText.toLowerCase()
        const navString = `/genre/${genreName}`
        navigate(navString)
    }

    return (
        <div className="flex flex-col gap-6 mx-24 my-6">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-4xl flex font-bold">
                        {animeData?.title_english || animeData?.title || 'Title Not Available'}
                    </h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-500">
                        {animeData?.title}
                    </h2>
                </div>
                <div className="flex-none w-auto bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg text-white">
                    <div className="flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20" width="24" height="24" className="text-yellow-400">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.37 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.785.57-1.84-.197-1.54-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.782-.57-.38-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z" />
                        </svg>
                        <span>{animeData?.score}</span>
                    </div>
                    <div className="flex justify-center mt-2">
                        {[...Array(5)].map((_, index) => {
                            const ratingValue = index + 1;
                            return (
                                <button
                                    key={ratingValue}
                                    className={ratingValue <= userRating ? 'text-yellow-500' : 'text-gray-300'}
                                    onClick={() => handleRating(ratingValue)}
                                >
                                    <span className="text-lg leading-none">&#9733;</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <hr />

            <div className="flex gap-4">
                <div className="relative group h-auto">
                    <img src={animeData?.images.jpg.large_image_url} alt={animeData?.title} className="rounded-lg shadow-xl mx-auto my-2 h-full w-full object-cover" />
                    <div className=" rounded-lg mx-auto my-2 absolute top-0 left-0 w-full h-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out"></div>
                    <div className="text-center">
                        <button onClick={handleWatch} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                            style={{ transition: 'opacity 0.2s ease-in-out' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            WATCH NOW
                        </button>
                    </div>

                </div>
                <div className="flex flex-col gap-4">

                    <div className="flex items-center justify-center font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg p-4 rounded-lg font-semibold text-md text-white">
                        <Content text={animeData?.synopsis?.replace(/\[Written by MAL Rewrite\]/g, '').trim()} />
                    </div>
                    <hr />
                    <div className="ml-2 items-center flex gap-2">
                        {animeData?.genres.map((genre: any) => (
                            <span onClick={handleGenreClick} key={genre.mal_id} className="bg-red-500 font-poppins bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                                {genre.name}
                            </span>
                        ))}

                    </div>
                    <div className="ml-2 flex gap-2">
                        {animeData?.studios.map((studio: any) => (
                            <span key={studio.mal_id} className="bg-transparent font-poppins bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                                {studio.name}
                            </span>
                        ))}
                    </div>
                    <div className="ml-2 flex gap-2">
                        <span className="font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                            Episodes: {animeData?.episodes || "To be decided"}
                        </span>
                        <span className="font-poppins bg-green-500 bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                            {animeData?.year}
                        </span>
                    </div>
                    <div className="ml-2 flex gap-2">
                        <span className="font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                            Duration: {animeData?.duration}
                        </span>
                        <span className="font-poppins bg-transparent bg-opacity-50 backdrop-filter backdrop-blur-lg text-white px-2 py-1 rounded-md">
                            {animeData?.status}
                        </span>
                    </div>


                </div>

            </div>
            {(animeData?.trailer && animeData?.trailer.embed_url) &&
                (<div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                    <iframe
                        src={animeData?.trailer.embed_url}
                        className="absolute top-0 left-0 w-full h-full"
                        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>)
            }
        </div>
    )
}