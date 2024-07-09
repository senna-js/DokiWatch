import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Content from "../components/ReadMore"

export const Anime = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [animeData, setAnimeData] = useState<any>()

    useEffect(() => {
        axios.get(`https://api.jikan.moe/v4/anime/${params.id}/full`)
            .then(res => {
                console.log(res.data)
                setAnimeData(res.data.data)
            })
    }, [params.id])

    const handleWatch = () => {
        const romajiName = animeData?.title.toLowerCase().replace(/\s+/g, '-');
        const navString = `/watch/${romajiName}-episode-1`
        navigate(navString)
    }

    return (
        <div className="flex flex-col gap-6 mx-24 my-6">
            <div className="flex items-center justify-between gap-2">
                <div>
                    <h1 className="text-4xl font-bold">
                        {animeData?.title_english}
                    </h1>
                    <h2 className="mt-2 text-xl font-semibold text-gray-500">
                        {animeData?.title}
                    </h2>
                </div>
                <span className="bg-transparent rounded-md py-2 px-2 flex gap-1 items-center">
                    {animeData?.score}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 m-auto">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.960-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                </span>
            </div>

            <hr />

            <div className="flex gap-4">
                <div className="relative group h-auto">
                    <img src={animeData?.images.jpg.large_image_url} alt={animeData?.title} className="rounded-lg shadow-xl mx-auto my-2 w-full h-auto object-cover" />
                    <div className=" rounded-lg absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 flex justify-center items-center transition-opacity duration-300 ease-in-out"></div>
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
                        <Content text={animeData?.synopsis.replace(/\[Written by MAL Rewrite\]/g, '').trim()} />
                    </div>
                    <div className="flex gap-2">
                        {animeData?.genres.map((genre: any) => (
                            <span key={genre.mal_id} className="bg-gray-800 text-white px-2 py-1 rounded-md">
                                {genre.name}
                            </span>
                        ))}
                    </div>
                </div>

            </div>
            <div className="video-container" style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                <iframe
                    src={animeData?.trailer.embed_url}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    )
}