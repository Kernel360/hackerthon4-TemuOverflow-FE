interface PaginationProps {
  currentPage: number
  totalPages: number
  handlePageChange: (pageNumber: number) => void
}

const Pagination = ({
  currentPage,
  totalPages,
  handlePageChange
}: PaginationProps) => {
  const pageNumbers = []

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <div className="mt-6 flex justify-center">
      <nav className="inline-flex rounded-md shadow">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
            currentPage === 1
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
          이전
        </button>

        {/* 페이지 번호 버튼 */}
        {pageNumbers.map(pageNum => (
          <button
            key={pageNum}
            onClick={() => handlePageChange(pageNum)}
            className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
              currentPage === pageNum
                ? 'bg-indigo-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}>
            {pageNum}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
            currentPage === totalPages
              ? 'cursor-not-allowed text-gray-300'
              : 'text-gray-700 hover:bg-gray-50'
          }`}>
          다음
        </button>
      </nav>
    </div>
  )
}

export default Pagination
