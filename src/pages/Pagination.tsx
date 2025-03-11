import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  handlePageChange: (pageNumber: number) => void
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  handlePageChange
}) => {
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
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
          // 표시할 페이지 번호 계산 (현재 페이지 중심으로 최대 5개)
          let pageNum
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
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
          )
        })}

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
