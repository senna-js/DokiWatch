import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Content from "../components/ReadMore"
import { Button } from "@mui/material"

export const Anime = () => {
    const params = useParams()
    const navigate = useNavigate()
    const [animeData, setAnimeData] = useState<any>()
    const [englishTitle, setEnglishTitle] = useState(true)

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
            <div className="flex gap-6">
                <h1 className="text-4xl font-bold">{
                    englishTitle ? animeData?.title_english : animeData?.title
                }</h1>
                <button
                    onClick={() => setEnglishTitle(!englishTitle)}
                    className="text-sm bg-gray-800 text-white px-2 py-1 rounded-md">
                    {
                        englishTitle ? "Romaji" : "English"
                    }
                </button>
                <p className="bg-transparent rounded-md py-2 px-2 flex gap-1">{animeData?.score}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 m-auto">
                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
                    </svg>
                </p>
            </div>

            <hr className="my-4" />

            <div className="flex gap-4">
                <img src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
                <div className="flex flex-col gap-4">
                    <Content text={animeData?.synopsis} />
                    <div>
                        <Button variant="contained" color="primary" onClick={handleWatch}>Watch</Button>
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
            </div>

        </div>
    )
}