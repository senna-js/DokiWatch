import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Define the shape of the query response
interface MediaTitle {
    romaji: string;
    english: string;
    native: string;
}

interface CoverImage {
    extraLarge: string;
    color: string;
}

interface Media {
    id: number;
    title: MediaTitle;
    coverImage: CoverImage;
    description: string;
    chapters: number;
    averageScore: number;
    genres: string[];
    volumes: number;
    status: string;
    startDate: {
        year: number;
        month: number;
        day: number;
    };
}

interface QueryResponse {
    data: {
        Page: {
            media: Media[];
        };
    };
}

// Define our query as a multi-line string
// var query = `
// {
//   Page(page: 1, perPage: 24) {
//     media(sort: POPULARITY_DESC, type: MANGA) {
//       id
//       title {
//         romaji
//         english
//         native
//       }
//       coverImage {
//         extraLarge
//         color
//       }
//       description
//       chapters
//       averageScore
//       genres
//       volumes
//       status
//       startDate {
//         year
//         month
//         day
//       }
//     }
//   }
// }
// `;

// Define our query variables and values that will be used in the query request
// var variables = {};

// Define the config we'll need for our API request
// const url = 'https://graphql.anilist.co';
// const options: RequestInit = {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//     },
//     body: JSON.stringify({
//         query: query,
//         variables: variables
//     })
// };

// Function to handle the API response
// const handleResponse = (response: Response): Promise<QueryResponse> => {
//     return response.json().then((json) => {
//         return response.ok ? json : Promise.reject(json);
//     });
// };

// Function to handle the data
// const handleData = (data: QueryResponse) => {
//     console.log(data);
// };

// Function to handle errors
// const handleError = (error: any) => {
//     alert('Error, check console');
//     console.error(error);
// };

const Manga = () => {
    const [mangas, setMangas] = useState<Media[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const itemsPerPage = 24;



    // Handle page change
    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
    };
    useEffect(() => {
        const fetchMangas = async () => {
            let allMangas: Media[] = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const query = `
                {
                  Page(page: ${page}, perPage: ${itemsPerPage}) {
                    media(sort: POPULARITY_DESC, type: MANGA) {
                      id
                      title {
                        romaji
                        english
                        native
                      }
                      coverImage {
                        extraLarge
                        color
                      }
                      description
                      chapters
                      averageScore
                      genres
                      volumes
                      status
                      startDate {
                        year
                        month
                        day
                      }
                    }
                  }
                }
                `;
                //TODO:@karan8404: Optimise the api calls to fix the cors error
                const url = 'https://graphql.anilist.co';
                const options = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ query })
                };

                try {
                    const response = await fetch(url, options);
                    const data = await response.json();
                    const fetchedMangas = data.data.Page.media;

                    if (fetchedMangas.length > 0) {
                        allMangas = [...allMangas, ...fetchedMangas];
                        page++;
                    } else {
                        hasMore = false;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                    hasMore = false;
                }
            }
            setMangas(allMangas);
            setIsLoading(false);
        };
        fetchMangas();
    }, []);

    // Calculate the total number of pages
    const totalPages = Math.ceil(mangas.length / itemsPerPage);

    // Get the items for the current page
    const currentItems = mangas.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div>
            {isLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <div className="loader">Loading...</div>
                </div>
            ) : (
                <>
                    <Stack className="grid grid-cols-6 justify-center gap-4 my-4" direction="row" flexWrap="wrap">
                        {currentItems.map((manga) => (
                            <motion.div key={manga.id} className='w-[201px] h-[280px] m-4'
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 10, duration: 0.5 }}>
                                <div className='cursor-pointer relative group rounded-sm transition-transform duration-300 ease-in-out hover:scale-110'>
                                    <img src={manga.coverImage.extraLarge} alt={manga.title.romaji} className='rounded-sm shadow-xl mx-auto object-cover w-48 h-[268px]' />
                                    <h3 className='text-md text-[#f5f5f5] font-semibold text-center truncate mx-2 pt-2 font-poppins'>{manga.title.english}</h3>
                                    <div className="rounded-sm mx-auto object-cover absolute top-0 right-0 left-0 w-48 h-[268px] bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300 ease-in-out">
                                        <button className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.2s ease-in-out" }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="h-12 w-12 text-white">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                            </svg>
                                            <span className='text-anime font-semibold'>READ</span>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </Stack>
                    <div className="flex justify-center my-4">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-4 py-2 mx-2 bg-gray-500 text-white border border-gray-700 rounded-full cursor-pointer shadow-md inline-block hover:bg-gray-300 hover:scale-105 transform transition duration-150 ease-in-out disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <span className="px-4 py-2 mx-2 font-anime">{currentPage} / {totalPages}</span>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 mx-2 bg-gray-500 text-white border border-gray-700 rounded-full cursor-pointer shadow-md inline-block hover:bg-gray-300 hover:scale-105 transform transition duration-150 ease-in-out disabled:opacity-50"
                        >
                            <FontAwesomeIcon icon={faChevronRight} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Manga;