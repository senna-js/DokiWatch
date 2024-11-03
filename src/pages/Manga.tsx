import { useState, useEffect } from 'react';

interface AltTitle {
    en?: string;
    [key: string]: string | undefined;
}

interface MangaResult {
    id: string;
    title: string;
    altTitles: AltTitle[];
    description: string;
    status: string;
    releaseDate: string | null;
    contentRating: string;
    lastVolume: string | null;
    lastChapter: string | null;
}

interface ApiResponse {
    results: MangaResult[];
}

const Manga = () => {
    const [mangaList, setMangaList] = useState<MangaResult[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchManga = async () => {
            try {
                const response = await fetch('https://consumet-deploy.vercel.app/manga/mangadex/info');
                if (!response.ok) {
                    throw new Error('Failed to fetch manga data');
                }
                const data: ApiResponse = await response.json();
                if (data.results && data.results.length > 0) {
                    setMangaList(data.results);
                    for (let i = 0; i < data.results.length; i++) {
                        console.log(data.results[i]);
                    }
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
                console.log("Manga data fetched", mangaList);
            }
        };

        fetchManga();
    }, []);

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-4 space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                <div className="h-40 bg-gray-200 rounded animate-pulse w-full"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                    Error: {error}
                </div>
            </div>
        );
    }

    // if (mangaList.length === 0) {
    //     return (
    //         <div className="max-w-4xl mx-auto p-4">
    //             <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
    //                 No manga data found
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <div className="max-w-4xl z-50 mx-auto p-4">
            {mangaList.length === 0 ? (
                <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg">
                    No manga data found
                </div>
            ) : (
                (
                    mangaList.map((manga) => (
                        <div key={manga.id} className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
                            {/* Header Section */}
                            <div className="p-6 border-b border-gray-200">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 mb-2">{manga.title}</h1>
                                        <p className="text-sm text-gray-500">ID: {manga.id}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 capitalize">
                                            {manga.status}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 capitalize">
                                            {manga.contentRating}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6 space-y-6">
                                {/* Alternative Titles */}
                                {manga.altTitles.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Alternative Titles</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {manga.altTitles.map((altTitle, index) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700"
                                                >
                                                    {Object.values(altTitle)[0]}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Description */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                                    <p className="text-gray-600 whitespace-pre-line">{manga.description}</p>
                                </div>

                                {/* Metadata Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                                    {manga.lastVolume && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700">Last Volume</h3>
                                            <p className="text-gray-600">{manga.lastVolume}</p>
                                        </div>
                                    )}
                                    {manga.lastChapter && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700">Last Chapter</h3>
                                            <p className="text-gray-600">{manga.lastChapter}</p>
                                        </div>
                                    )}
                                    {manga.releaseDate && (
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-700">Release Date</h3>
                                            <p className="text-gray-600">{manga.releaseDate}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )
            )}
        </div>
    );
};

export default Manga;