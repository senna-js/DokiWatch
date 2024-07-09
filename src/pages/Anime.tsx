import { useParams,useNavigate } from "react-router-dom"
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
        const navString=`/watch/${romajiName}-episode-1`
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
                    className="text-sm bg-gray-800 text-white px-2 py-1 rounded-md"
                >
                    {
                        englishTitle ? "Romaji" : "English"
                    }
                </button>
            </div>

            <hr className="my-4" />

            <div className="flex gap-4">
                <img src={animeData?.images.jpg.large_image_url} alt={animeData?.title} />
                <div className="flex flex-col gap-4">
                    <Content text={animeData?.synopsis} />
                    <div>
                        <Button variant="contained" color="primary" onClick={handleWatch}>Watch</Button>
                    </div>
                </div>
                {/* <p>{animeData?.synopsis}</p> */}
            </div>

        </div>
    )
}