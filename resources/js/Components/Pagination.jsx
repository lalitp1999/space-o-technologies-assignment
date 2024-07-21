import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, totalRecords, recordsPerPage }) => {
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            onPageChange(page);
        }
    };

    // Create a range of pages to display
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
    }

    // Calculate record range
    const startRecord = (currentPage - 1) * recordsPerPage + 1;
    const endRecord = Math.min(currentPage * recordsPerPage, totalRecords);

    return (
        <div className="flex flex-col items-center mt-4">
            <div className="mb-2 text-sm text-gray-600">
                Showing {startRecord} - {endRecord} of {totalRecords} records | Page {currentPage} of {totalPages}
            </div>
            <div className="flex">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                    className="p-2 bg-blue-500 text-white rounded mx-1 disabled:opacity-50"
                >
                    Previous
                </button>
                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        aria-label={`Page ${page}`}
                        className={`p-2 mx-1 ${currentPage === page ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'} rounded`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                    className="p-2 bg-blue-500 text-white rounded mx-1 disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default Pagination;
