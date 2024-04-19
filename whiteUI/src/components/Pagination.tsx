import React from "react";

interface PaginationProps {
  nPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  nPages,
  currentPage,
  setCurrentPage,
}) => {
  const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

  const goToNextPage = () => {
    if (currentPage !== nPages) setCurrentPage(currentPage + 1);
  };
  const goToPrevPage = () => {
    if (currentPage !== 1) setCurrentPage(currentPage - 1);
  };
  return (
    <nav className="flex justify-center pt-10 py-2">
      <ul className="flex space-x-4">
        <li>
          <a
            onClick={goToPrevPage}
            href="#"
            className="px-2 py-1 bg-blue-500 rounded-md"
          >
            Previous
          </a>
        </li>
        {pageNumbers.map((pgNumber) => (
          <li key={pgNumber}>
            <a
              onClick={() => setCurrentPage(pgNumber)}
              href="#"
              className={`px-2 py-1 rounded-md ${
                currentPage === pgNumber ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {pgNumber}
            </a>
          </li>
        ))}
        <li>
          <a
            onClick={goToNextPage}
            href="#"
            className="px-2 py-1 bg-blue-500 rounded-md"
          >
            Next
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;