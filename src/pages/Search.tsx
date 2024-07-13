/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"
import { AnimeData } from "../interfaces/AnimeData"
import { AdvancedSearch } from "../components/AdvancedSearch"

const genres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"]

export const Search = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    const [searchTrigger, setSearchTrigger] = useState<boolean>(false);
    var genreTerm, genreNotTerm, term;
    const [anime, setAnime] = useState<AnimeData[]>([])
    const [genreSelections, setGenreSelections] = useState<number[]>(Array(genres.length).fill(0));
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search"));

    const handlegenreSelection = (index: number, set: number) => {
        console.log("Index: " + index + " Set: " + set, "Genre : " + genres[index])
        let newSelections = [...genreSelections];
        newSelections[index] = set;
        setGenreSelections(newSelections);
    }

    const handleSearch = (search : string) => {
        setSearchTerm(search);
        var genreString = "";
        var genreNotString = "";
        for (var i = 0; i < genreSelections.length; i++) {
            if (genreSelections[i] === 1) {
                genreString += genres[i] + ",";
            }
            else if (genreSelections[i] === -1) {
                genreNotString += genres[i] + ",";
            }
        }

        genreString = genreString.slice(0, -1);
        genreNotString = genreNotString.slice(0, -1);
        console.log("Search Term: " + searchTerm)
        console.log("Genre String: " + genreString)
        console.log("Genre Not String: " + genreNotString)

        const params = new URLSearchParams();
        params.append("search", search)
        params.append("genre", genreString);
        params.append("genreNot", genreNotString);
        if (searchTerm !== undefined && searchTerm !== "" && searchTerm !== null) {
            params.append("search", searchTerm);
        }

        setSearchParams(params);
        setSearchTrigger(!searchTrigger);
    }

    useEffect(() => {
        // if(searchParams.get("search"))
        //     setSearchTerm(searchParams.get("search"))
        console.log("Search Term: " + searchTerm)
        genreTerm = searchParams.get("genre")
        genreNotTerm = searchParams.get("genreNot")

        term = ""
        if (searchTerm) {
            term = `search: "${searchTerm}",`
        }
        if (genreTerm) {
            genreTerm = genreTerm.split(',').map(genre => `"${genre.trim()}"`);
            genreTerm = `[${genreTerm.join(',')}]`;
            term = term + `genre_in: ${genreTerm},`
        }
        if (genreNotTerm) {
            genreNotTerm = genreNotTerm.split(',').map(genre => `"${genre.trim()}"`);
            genreNotTerm = `[${genreNotTerm.join(',')}]`;
            term = term + `genre_not_in: ${genreNotTerm},`
        }
        if(term == "")
            term = ","

        console.log("Searched term : " + term.toString())

        var query = `{
                        Page(page: 1, perPage: 24) {
                            media(${term} sort: POPULARITY_DESC,type: ANIME) {
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
            setAnime(response.data.data.Page.media.map((item: any) => ({
                mal_id: item.idMal,
                title: {
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
    }, [searchTrigger])

    return (
        <div className="flex flex-col items-center justify-center">
            <AdvancedSearch genres={genres} handleGenreSelection={handlegenreSelection} handleSearch={handleSearch} />
            <Stack className="grid grid-cols-6 justify-center gap-4" direction="row" flexWrap="wrap">
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

