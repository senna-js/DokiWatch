import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"

export const Search = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    var searchTerm = searchParams.get("search")
    var genreTerm = searchParams.get("genre")

    var term = `?${searchTerm? `search=${searchTerm}` : ''}${genreTerm? `genre=${genreTerm}` : ''}`
    const [anime, setAnime] = useState<any[]>([])

    useEffect(() => {
        console.log(term.toString())
        
    }, [term])

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
