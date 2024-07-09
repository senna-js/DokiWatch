import { useParams } from "react-router-dom"
import axios from "axios"
import { useEffect, useState } from "react"
import Content from "../components/ReadMore"

export const Anime = () => {
    let params = useParams()
    const [animeData, setAnimeData] = useState<any>()
    const [englishTitle, setEnglishTitle] = useState(true)

    useEffect(() => {
        axios.get(`https://api.jikan.moe/v4/anime/${params.id}/full`)
            .then(res => {
                console.log(res.data)
                setAnimeData(res.data.data)
            })
    }, [params.id])


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
                <Content text={animeData?.synopsis} />
                {/* <p>{animeData?.synopsis}</p> */}
            </div>

        </div>
    )
}