import React from 'react'

interface PostFiltersProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  filter: 'all' | 'solved' | 'unsolved'
  handleFilterChange: (filter: 'all' | 'solved' | 'unsolved') => void
  handleSearch: (e: React.FormEvent) => void
}

const PostFilters: React.FC<PostFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filter,
  handleFilterChange,
  handleSearch
}) => {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
      <form
        onSubmit={handleSearch}
        className="relative w-full sm:w-96">
        <input
          type="text"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          placeholder="제목 또는 작성자 검색..."
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        <button
          type="submit"
          className="absolute top-2.5 right-3">
          <svg
            className="h-5 w-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </form>

      <div className="flex gap-2">
        <button
          onClick={() => handleFilterChange('all')}
          className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
            filter === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>
          전체
        </button>
        <button
          onClick={() => handleFilterChange('solved')}
          className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
            filter === 'solved'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>
          해결됨
        </button>
        <button
          onClick={() => handleFilterChange('unsolved')}
          className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
            filter === 'unsolved'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}>
          미해결
        </button>
      </div>
    </div>
  )
}

export default PostFilters
