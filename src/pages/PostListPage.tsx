import { useNavigate } from 'react-router-dom'
import usePostList from '@/hooks/usePostList'
import PostFilters from './PostFilters'
import PostTable from './PostTable'
import Pagination from './Pagination'

const PostListPage = () => {
  const navigate = useNavigate()
  const {
    posts,
    totalPages,
    totalElements,
    isLoading,
    error,
    filter,
    searchTerm,
    setSearchTerm,
    handleFilterChange,
    handleSearch,
    handlePageChange,
    currentPage
  } = usePostList()

  // 게시글 클릭 핸들러
  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`)
  }

  // 새 게시글 작성 페이지로 이동
  const navigateToCreatePost = () => {
    navigate('/posts/new')
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-800">
            개발자 에러 공유 게시판
          </h1>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <PostFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filter={filter}
            handleFilterChange={handleFilterChange}
            handleSearch={handleSearch}
          />
          <button
            onClick={navigateToCreatePost}
            className="hover:bg-primary-dark h-10 rounded bg-indigo-600 p-2 text-white">
            새 글 작성
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {/* 로딩 인디케이터 */}
        {isLoading && (
          <div className="my-8 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        )}

        {/* 게시글 목록 테이블 */}
        {!isLoading && (
          <PostTable
            posts={posts}
            error={error}
            handlePostClick={handlePostClick}
          />
        )}

        {/* 페이지네이션 */}
        {!isLoading && totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
          />
        )}

        {/* 총 게시물 수 표시 */}
        {!isLoading && (
          <div className="mt-4 text-center text-sm text-gray-600">
            총 {totalElements}개의 게시물
          </div>
        )}
      </div>
    </div>
  )
}

export default PostListPage
