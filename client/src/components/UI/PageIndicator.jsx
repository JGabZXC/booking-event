export default function PageIndicator({
  data,
  page,
  isLoading,
  handlePageChange,
}) {
  const generatePageNumbers = () => {
    if (!data) return [];

    const pages = [];
    const totalPages = data.totalPages;
    const currentPage = page;

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis if needed
    if (startPage > 2) pages.push("...");

    // Add pages in range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages - 1) pages.push("...");

    // Always show last page if there is more than one page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  return (
    <>
      <div className="flex justify-center mt-10">
        <nav className="inline-flex items-center gap-1 rounded-lg shadow-sm bg-white px-2 py-1 border border-pink-200">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
            className={`px-3 py-2 rounded-l-lg font-medium transition-colors duration-150 ${
              page === 1 || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
            aria-label="Previous Page"
          >
            &larr;
          </button>

          {/* Page Numbers */}
          {generatePageNumbers().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={index} className="px-3 py-2 text-gray-400 select-none">
                ...
              </span>
            ) : (
              <button
                key={index}
                onClick={() => handlePageChange(pageNum)}
                disabled={isLoading}
                className={`px-3 py-2 font-medium transition-colors duration-150 ${
                  pageNum === page
                    ? "bg-pink-600 text-white shadow border border-pink-600"
                    : "bg-white text-pink-700 hover:bg-pink-100 border border-transparent"
                } rounded ${
                  pageNum === 1
                    ? "rounded-l-none"
                    : pageNum === data.totalPages
                    ? "rounded-r-none"
                    : ""
                }`}
                aria-current={pageNum === page ? "page" : undefined}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === data.totalPages || isLoading}
            className={`px-3 py-2 rounded-r-lg font-medium transition-colors duration-150 ${
              page === data.totalPages || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-pink-100 text-pink-700 hover:bg-pink-200"
            }`}
            aria-label="Next Page"
          >
            &rarr;
          </button>
        </nav>
      </div>
    </>
  );
}
