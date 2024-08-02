/* eslint-disable prefer-const */
/* eslint-disable no-var */
import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"
import { AnimeData } from "../interfaces/AnimeData"
import { AdvancedSearch } from "../components/AdvancedSearch"
import { motion } from "framer-motion";

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

    const handleSearch = (search: string) => {
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    // Calculate the indices for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentAnime = anime.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(anime.length / itemsPerPage);

    // Generate page numbers
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

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
        if (term == "")
            term = ","

        console.log("Searched term : " + term.toString())

        var query = `{
                        Page(page: 1, perPage: 54) {
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
                title: item.title.romaji,
                title_english: item.title.english,
                image: item.coverImage.extraLarge
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
                    currentAnime.map((anime, index) => (
                        <motion.div
                            key={anime.mal_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <AnimeCard anime={anime} />
                        </motion.div>
                    ))
                }
            </Stack>
            <div className="flex justify-center mx-4 py-4 gap-2">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => handlePageClick(number)}
                        className={`bg-transparent text-center bg-opacity-50 text-white border border-gray-700 rounded-md px-2.5 py-1.5 font-anime cursor-pointer shadow-md hover:bg-info hover:scale-105 transform transition duration-150 ease-in-out ${currentPage === number ? 'bg-blue-500 text-white' : ''}`}
                    >
                        {number}
                    </button>
                ))}
            </div>
        </div>
    )
}

