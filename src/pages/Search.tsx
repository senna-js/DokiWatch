import { useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"

export const Search = () => {
    const params = useParams()
    const [anime, setAnime] = useState<any[]>([])
        useEffect(() => {
            axios.get(`https://api.jikan.moe/v4/anime?q=${params.term}`)
            .then((res) => {
                console.log(res.data.data)
                setAnime(res.data.data)
            })
            .then((err) => {
                console.log(err)
            })
        }, [params.term])

    return (
        <div>
            <Stack spacing={2} direction="row">
                {
                    anime.map((anime) => (
                        <div key={anime.mal_id}>
                            <AnimeCard
                                name={anime.title_english}
                                romaji={anime.title}
                                image={anime.images.jpg.image_url}
                                malID={anime.mal_id}
                            />
                        </div>
                    ))
                }
            </Stack>
        </div>
    )
}
