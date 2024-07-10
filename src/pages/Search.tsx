import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"
import { AnimeData } from "../interfaces/AnimeData"

export const Search = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    var searchTerm, genreTerm, term;
    const [anime, setAnime] = useState<AnimeData[]>([])

    useEffect(() => {
        searchTerm = searchParams.get("search")
        genreTerm = searchParams.get("genre")
        if (genreTerm) {
            genreTerm = genreTerm.split(',').map(genre => `"${genre.trim()}"`);
            genreTerm = `[${genreTerm.join(',')}]`;
        }

        if (searchTerm && genreTerm) {
            term = `search: "${searchTerm}", genre_in: ["${genreTerm}"]`
        } else if (searchTerm) {
            term = `search: "${searchTerm}"`
        }
        else if (genreTerm) {
            term = `genre: "${genreTerm}"`
        }
        else {
            term = ``
        }

        console.log(term.toString())

        var query = `{
                        Page(page: 1, perPage: 20) {
                            media(${term}, sort: POPULARITY_DESC,type: ANIME) {
                                idMal
                                title {
                                    romaji
                                    english
                                }
                                coverImage {
                                    extraLarge
                                    color
                                }
                            }
                        }
                    }`;

        // Define our query variables and values that will be used in the query request
        var variables = {};

        var url = 'https://graphql.anilist.co';

        axios.post(url, {
            query: query,
            variables: variables
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }
        }).then(response => {
            // Log the data to the console
            console.log(response.data);
            setAnime(response.data.data.Page.media.map((item:any) => ({
                mal_id: item.idMal,
                title : {
                    romaji: item.title.romaji,
                    english: item.title.english
                },
                image: {
                    large: item.coverImage.extraLarge,
                    color: item.coverImage.color
                }
              })));
        }).catch(error => {
            console.error(error);
        });
    }, [searchParams])

    return (
        <div>
            <Stack spacing={2} direction="row" flexWrap="wrap">
                {
                    anime.map((anime) => (
                        <div key={anime.mal_id}>
                            <AnimeCard
                                anime={anime}
                            />
                        </div>
                    ))
                }
            </Stack>
        </div>
    )
}

