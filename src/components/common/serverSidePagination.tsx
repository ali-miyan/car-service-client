import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const ServerSidePagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      window.scrollTo(0, 0);
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      window.scrollTo(0, 0);
      onPageChange(currentPage + 1);
    }
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="inline-flex -space-x-px  text-base h-10">
        <li>
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`flex items-center justify-center lowercase px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-s-lg ${
              currentPage === 1
                ? "cursor-not-allowed text-gray-400"
                : "hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            Prev
          </button>
        </li>
        {pageNumbers.map((page) => (
          <li key={page}>
            <button
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`flex items-center justify-center px-4 h-10 leading-tight ${
                currentPage === page
                  ? "text-[#ab0000] bg-red-50 border border-gray-300"
                  : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }`}
            >
              {page}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center lowercase px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg ${
              currentPage === totalPages
                ? "cursor-not-allowed text-gray-400"
                : "hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default ServerSidePagination;
