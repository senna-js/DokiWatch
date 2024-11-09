import { useState, useEffect } from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) => {
    const [visiblePages, setVisiblePages] = useState<(string | number)[]>([]);

    useEffect(() => {
        // Calculate visible page numbers
        const getVisiblePages = () => {

            // Determine screen width
            const screenWidth = window.innerWidth;

            // Set delta based on screen width
            const delta = screenWidth <= 640 ? 0 : 1; // Adjust delta for mobile
            const range: (number | string)[] = [];

            const left = Math.max(2, currentPage - delta);
            const right = Math.min(totalPages - 1, currentPage + delta);

            // Always include first page
            range.push(1);

            // Add dots if needed
            if (left > 2) {
                range.push('...');
            }

            // Add page numbers between left and right
            for (let i = left; i <= right; i++) {
                range.push(i);
            }

            // Add dots if needed
            if (right < totalPages - 1) {
                range.push('...');
            }

            // Always include last page if totalPages > 1
            if (totalPages > 1) {
                range.push(totalPages);
            }

            setVisiblePages(range);
        };

        getVisiblePages();
        // Update visible pages on window resize
        window.addEventListener('resize', getVisiblePages);
        return () => {
            window.removeEventListener('resize', getVisiblePages);
        };
    }, [currentPage, totalPages]);

    return (
        <div className="flex flex-wrap relative items-center justify-center gap-2 sm:gap-4 mx-2 py-4">
            {/* First page */}
            <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center bg-doki-light-grey text-doki-white disabled:opacity-50 hover:bg-doki-dark-grey disabled:cursor-not-allowed hover:scale-105 transform transition duration-150 ease-in-out disabled:hidden"
            >
                «
            </button>

            {/* Previous page */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center bg-doki-light-grey text-doki-white disabled:opacity-50 hover:bg-doki-dark-grey disabled:cursor-not-allowed hover:scale-105 transform transition duration-150 ease-in-out disabled:hidden"
            >
                ‹
            </button>

            {/* Page numbers */}
            <div className="flex flex-wrap items-center justify-center gap-2">
                {visiblePages.map((page, index) => (
                    <button
                        key={index}
                        onClick={() => typeof page === 'number' ? onPageChange(page) : null}
                        disabled={page === '...'}
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full font-hpSimplifiedbold flex items-center justify-center hover:scale-105 transform transition duration-150 ease-in-out ${page === currentPage
                            ? 'bg-doki-white text-doki-purple'
                            : page === '...'
                                ? 'bg-transparent text-doki-white cursor-default'
                                : 'bg-doki-dark-grey text-doki-white hover:bg-doki-light-grey'
                            }`}
                    >
                        {page}
                    </button>
                ))}
            </div>

            {/* Next page */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center bg-doki-light-grey text-doki-white disabled:opacity-50 hover:bg-doki-dark-grey hover:scale-105 transform transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:hidden"
            >
                ›
            </button>

            {/* Last page */}
            <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full font-bold flex items-center justify-center bg-doki-light-grey text-doki-white disabled:opacity-50 hover:bg-doki-dark-grey hover:scale-105 transform transition duration-150 ease-in-out disabled:cursor-not-allowed disabled:hidden"
            >
                »
            </button>
        </div>
    );
};

export default Pagination;