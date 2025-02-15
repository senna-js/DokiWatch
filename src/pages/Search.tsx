import { useSearchParams } from "react-router-dom"
import { useState, useEffect } from "react"
import axios from "axios"
import { Stack } from "@mui/material"
import { AnimeCard } from "../components/AnimeCard"
import { AnimeCardData } from "../components/AnimeCard"
import { AdvancedSearch } from "../components/AdvancedSearch"
import Pagination from "../components/Pagination"
import { motion } from "framer-motion";

const genres = ["Action", "Adventure", "Comedy", "Drama", "Ecchi", "Fantasy", "Horror", "Mahou Shoujo", "Mecha", "Music", "Mystery", "Psychological", "Romance", "Sci-Fi", "Slice of Life", "Sports", "Supernatural", "Thriller"]

export const Search = () => {
    let [searchParams, setSearchParams] = useSearchParams();
    var genreTerm, genreNotTerm, term;
    const [anime, setAnime] = useState<AnimeCardData[]>([])
    const [genreSelections, setGenreSelections] = useState<number[]>(Array(genres.length).fill(0));
    const [searchTerm, setSearchTerm] = useState(searchParams.get("search"));
    const [loading, setLoading] = useState(true);

    // Pagination states
    const [totalPagesApi, setTotalPagesApi] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState(currentPage.toString());
    const itemsPerPage = 18;

    // Reset current page when search parameters change
    useEffect(() => {
        setPageInput(currentPage.toString());
    }, [currentPage]);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page when search term changes
        const search = searchParams.get('search')
        if (search) {
            setSearchTerm(search)
        }
    }, [searchParams])

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
    }



    // const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setPageInput(e.target.value);
    // };

    // const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     if (e.key === 'Enter') {
    //         const pageNumber = Number(pageInput);
    //         if (pageNumber >= 1 && pageNumber <= totalPagesApi) {
    //             setCurrentPage(pageNumber);
    //         } else {
    //             // Reset to the current page if the input is invalid
    //             setPageInput(currentPage.toString());
    //         }
    //     }
    // };

    // Calculate the indices for the current page
    // const indexOfLastItem = currentPage * itemsPerPage;
    // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    // const currentAnime = anime.slice(indexOfFirstItem, indexOfLastItem);

    // const pageNumbers = Array.from({ length: totalPagesApi }, (_, i) => i + 1);

    // Calculate total pages
    // const totalPages = Math.ceil(anime.length / itemsPerPage);

    // Generate page numbers
    // const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    const handlePageClick = (pageNumber: number) => {
        // Ensure the page number is within valid range
        if (pageNumber >= 1 && pageNumber <= totalPagesApi) {
            setCurrentPage(pageNumber);
        }
    };

    // const handlePageInputBlur = () => {
    //     const pageNumber = Number(pageInput);
    //     if (pageNumber >= 1 && pageNumber <= totalPagesApi) {
    //         setCurrentPage(pageNumber);
    //     } else {
    //         setPageInput(currentPage.toString());
    //     }
    // };


    useEffect(() => {
        setLoading(true);
        // setCurrentPage(1);
        // if(searchParams.get("search"))
        //     setSearchTerm(searchParams.get("search"))
        console.log("Search Term: " + searchTerm)
        genreTerm = searchParams.get("genre")
        genreNotTerm = searchParams.get("genreNot")

        term = ""
        if (searchTerm) {
            term += `search: "${searchTerm}",`
        }
        if (genreTerm) {
            const genresIn = genreTerm.split(',').map((genre) => `"${genre.trim()}"`);
            term += `genre_in: [${genresIn.join(',')}], `;
        }
        if (genreNotTerm) {
            const genresNotIn = genreNotTerm.split(',').map((genre) => `"${genre.trim()}"`);
            term += `genre_not_in: [${genresNotIn.join(',')}], `;
        }
        // Remove trailing comma and space if present
        if (term.endsWith(', ')) {
            term = term.slice(0, -2);
        }

        console.log("Searched term : " + term.toString())

        var query = `{
            Page(page: ${currentPage}, perPage: ${itemsPerPage}) {
              pageInfo {
                total
                currentPage
                lastPage
                hasNextPage
                perPage
              }
              media(${term}${term ? ',' : ''} sort: POPULARITY_DESC, type: ANIME) {
                id
                idMal
                title {
                romaji
                english
                }
                description
                coverImage {
                    extraLarge
                    color
                }
                bannerImage
                genres
                status
                episodes
                nextAiringEpisode {
                    episode
                    timeUntilAiring
                    airingAt
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
            const animeData: AnimeCardData[] = response.data.data.Page.media.map((item: any) => {
                if (!item.idMal) {
                    return null;
                }
                const returnData: AnimeCardData = {
                    id: item.id,
                    idMal: item.idMal,
                    title: item.title,
                    image: item.coverImage.extraLarge,
                    color: item.coverImage.color,
                    status: item.status,
                    genres: item.genres,
                    totalEpisodes: item.episodes,
                    description: item.description,
                    currentEpisode: item.nextAiringEpisode ? item.nextAiringEpisode.episode : null,
                    bannerImage: item.bannerImage,
                    progress: 0,
                    episodes: ""
                };
                return returnData;
            });
            setAnime(animeData.filter((item: AnimeCardData) => item !== null));

            // Update total pages from API response
            const pageInfo = response.data.data.Page.pageInfo;
            setTotalPagesApi(pageInfo.lastPage);

            setLoading(false);
        }).catch(error => {
            console.error(error);
            setLoading(false);
        });
    }, [searchParams, currentPage]);

    return (
        <div className="flex flex-col items-center justify-center">
            <AdvancedSearch genres={genres} handleGenreSelection={handlegenreSelection} handleSearch={handleSearch} />
            <div className="relative container   bg-doki-light-grey rounded-[16px] m-10 flex flex-col">
                <span className="text-start font-lato text-2xl sm:text-4xl ml-8 mt-4">
                    {searchTerm ? (
                        <>
                            <span className=" text-doki-purple">Results - </span>
                            <span className="text-doki-white font-semibold">{searchTerm}</span>
                        </>
                    ) : (
                        <span className="text-doki-purple">Suggestions</span>
                    )}
                </span>
                <hr className="border border-doki-purple mb-4 mt-6 m-6" />
                {loading ? (
                    // Render skeletons when loading
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 m-6">
                        {Array.from({ length: itemsPerPage }).map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="h-64 bg-doki-dark-grey rounded-[22px] m-2"></div>
                                <div className="h-6 bg-doki-dark-grey rounded-[12px] mt-4 m-2"></div>
                            </div>
                        ))}
                    </div>
                ) : anime.length === 0 ? (
                    // Display 'No Results Found' when there are no search results
                    <div className="flex justify-center items-center h-64">
                        <span className="text-doki-white font-lato text-2xl sm:text-4xl">No Results Found</span>
                    </div>
                ) : (
                    <Stack className="grid grid-cols-6 justify-center gap-4" direction="row" flexWrap="wrap">
                        {
                            anime.map((animeItem, index) => (
                                <motion.div
                                    key={animeItem.idMal}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                >
                                    <AnimeCard anime={animeItem} />
                                </motion.div>
                            ))
                        }
                    </Stack>
                )}
            </div>
            {!loading && totalPagesApi > 1 && (
                // <div className="flex justify-center items-center mx-4 py-4 gap-4">
                //     <button
                //         onClick={() => handlePageClick(currentPage - 1)}
                //         disabled={currentPage === 1}
                //         className="text-center bg-opacity-50 text-white border border-gray-700 rounded-[12px] px-3 py-2 font-lato cursor-pointer shadow-md hover:bg-doki-light-grey hover:scale-105 transform transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                //     >
                //         Prev
                //     </button>
                //     <div className="flex items-center gap-2">
                //         <input
                //             type="number"
                //             value={pageInput}
                //             onChange={handlePageInputChange}
                //             onKeyDown={handlePageInputKeyDown}
                //             onBlur={handlePageInputBlur}
                //             className="w-12 relative text-center bg-doki-dark-grey text-white rounded-md px-1 py-1 outline-none"
                //             min={1}
                //             max={totalPagesApi}
                //         />
                //         <span className="text-white relative font-hpSimplifiedbold">
                //             / {totalPagesApi}
                //         </span>
                //     </div>
                //     <button
                //         onClick={() => handlePageClick(currentPage + 1)}
                //         disabled={currentPage === totalPagesApi}
                //         className="rounded-[12px] text-center bg-opacity-50 text-white border border-gray-700 px-3 py-2 font-lato cursor-pointer shadow-md hover:bg-doki-light-grey hover:scale-105 transform transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                //     >
                //         Next
                //     </button>
                // </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPagesApi}
                    onPageChange={handlePageClick}
                />
            )}
        </div>
    )
}

