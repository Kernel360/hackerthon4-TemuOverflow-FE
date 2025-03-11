// import React, { useState, useEffect } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { Post } from '../types/Post'
// import { fetchPosts, PostQueryParams } from '../api/post'

// const PostListPage = () => {
//   const navigate = useNavigate()
//   const [posts, setPosts] = useState<Post[]>([])
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const [totalPages, setTotalPages] = useState(1)
//   const [totalElements, setTotalElements] = useState(0)
//   const [isLoading, setIsLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)
//   const postsPerPage = 10

//   // 토큰 확인 함수
//   const checkAuth = () => {
//     const token = localStorage.getItem('access_token')
//     if (!token) {
//       // 토큰이 없으면 로그인 페이지로 리디렉션하거나 적절한 처리
//       navigate('/login')
//       console.warn('인증 토큰이 없습니다. 로그인이 필요할 수 있습니다.')
//     }
//   }

//   // 컴포넌트 마운트 시 인증 확인
//   useEffect(() => {
//     checkAuth()
//   }, [])

//   // 데이터 로딩 함수
//   const loadPosts = async () => {
//     setIsLoading(true)
//     setError(null)

//     try {
//       const params: PostQueryParams = {
//         page: currentPage - 1, // 서버는 0부터 시작하는 페이지 인덱스 사용
//         size: postsPerPage,
//         status: filter,
//         keyword: searchTerm.trim() !== '' ? searchTerm : undefined
//       }

//       const result = await fetchPosts(params)
//       setPosts(result.posts)
//       setTotalPages(result.totalPages)
//       setTotalElements(result.totalElements)
//     } catch (err) {
//       setError('게시글을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.')
//       console.error('Error loading posts:', err)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // 페이지, 필터, 검색어 변경 시 데이터 다시 로드
//   useEffect(() => {
//     loadPosts()
//   }, [currentPage, filter])

//   // 검색 핸들러
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     setCurrentPage(1) // 검색 시 첫 페이지로 이동
//     loadPosts()
//   }

//   // 필터 변경 핸들러
//   const handleFilterChange = (newFilter: 'all' | 'solved' | 'unsolved') => {
//     setFilter(newFilter)
//     setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
//   }

//   // 페이지 변경 핸들러
//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber)
//   }

//   // 게시글 클릭 핸들러
//   const handlePostClick = (postId: number) => {
//     navigate(`/posts/${postId}`)
//   }

//   // 새 게시글 작성 페이지로 이동
//   const handleNewPost = () => {
//     navigate('/posts/new')
//   }

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-6 flex items-center justify-between">
//         <h1 className="text-3xl font-bold text-indigo-800">테무오버플로우</h1>
//         <button
//           onClick={handleNewPost}
//           className="bg-tumbleweed-500 hover:bg-tumbleweed-600 rounded-lg px-4 py-2 font-semibold text-white transition duration-200">
//           새 게시글 작성
//         </button>
//       </div>

//       {/* 검색 및 필터링 */}
//       <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
//         <form
//           onSubmit={handleSearch}
//           className="relative w-full sm:w-96">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             placeholder="제목 또는 작성자 검색..."
//             className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//           <button
//             type="submit"
//             className="absolute top-2.5 right-3">
//             <svg
//               className="h-5 w-5 text-gray-400"
//               xmlns="http://www.w3.org/2000/svg"
//               viewBox="0 0 20 20"
//               fill="currentColor">
//               <path
//                 fillRule="evenodd"
//                 d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                 clipRule="evenodd"
//               />
//             </svg>
//           </button>
//         </form>

//         <div className="flex gap-2">
//           <button
//             onClick={() => handleFilterChange('all')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'all'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             전체
//           </button>
//           <button
//             onClick={() => handleFilterChange('solved')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'solved'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             해결됨
//           </button>
//           <button
//             onClick={() => handleFilterChange('unsolved')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'unsolved'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             미해결
//           </button>
//         </div>
//       </div>

//       {/* 에러 메시지 */}
//       {error && (
//         <div className="mb-4 rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700">
//           {error}
//         </div>
//       )}

//       {/* 로딩 인디케이터 */}
//       {isLoading && (
//         <div className="my-8 flex justify-center">
//           <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-indigo-500"></div>
//         </div>
//       )}

//       {/* 게시글 목록 테이블 */}
//       {!isLoading && (
//         <div className="overflow-x-auto rounded-lg bg-white shadow">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-indigo-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   번호
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   상태
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   제목
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   작성자
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   작성일
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   조회
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                   댓글
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-200 bg-white">
//               {posts.length > 0 ? (
//                 posts.map(post => (
//                   <tr
//                     key={post.id}
//                     onClick={() => handlePostClick(post.id)}
//                     className="cursor-pointer transition duration-150 hover:bg-indigo-50">
//                     <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                       {post.id}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
//                           post.solved
//                             ? 'bg-green-100 text-green-800'
//                             : 'bg-red-100 text-red-800'
//                         }`}>
//                         {post.solved ? '해결됨' : '미해결'}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-indigo-900">
//                       {post.title}
//                     </td>
//                     <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
//                       {post.author}
//                     </td>
//                     <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                       {post.date}
//                     </td>
//                     <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                       {post.views}
//                     </td>
//                     <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                       {post.comments}
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-6 py-4 text-center text-gray-500">
//                     {error ? '오류가 발생했습니다.' : '게시글이 없습니다.'}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* 페이지네이션 */}
//       {!isLoading && totalPages > 0 && (
//         <div className="mt-6 flex justify-center">
//           <nav className="inline-flex rounded-md shadow">
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}
//               className={`relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
//                 currentPage === 1
//                   ? 'cursor-not-allowed text-gray-300'
//                   : 'text-gray-700 hover:bg-gray-50'
//               }`}>
//               이전
//             </button>

//             {/* 페이지 번호 버튼 */}
//             {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
//               // 표시할 페이지 번호 계산 (현재 페이지 중심으로 최대 5개)
//               let pageNum
//               if (totalPages <= 5) {
//                 pageNum = i + 1
//               } else if (currentPage <= 3) {
//                 pageNum = i + 1
//               } else if (currentPage >= totalPages - 2) {
//                 pageNum = totalPages - 4 + i
//               } else {
//                 pageNum = currentPage - 2 + i
//               }

//               return (
//                 <button
//                   key={pageNum}
//                   onClick={() => handlePageChange(pageNum)}
//                   className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
//                     currentPage === pageNum
//                       ? 'bg-indigo-50 text-indigo-600'
//                       : 'text-gray-700 hover:bg-gray-50'
//                   }`}>
//                   {pageNum}
//                 </button>
//               )
//             })}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className={`relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium ${
//                 currentPage === totalPages
//                   ? 'cursor-not-allowed text-gray-300'
//                   : 'text-gray-700 hover:bg-gray-50'
//               }`}>
//               다음
//             </button>
//           </nav>
//         </div>
//       )}

//       {/* 총 게시물 수 표시 */}
//       {!isLoading && (
//         <div className="mt-4 text-center text-sm text-gray-600">
//           총 {totalElements}개의 게시물
//         </div>
//       )}
//     </div>
//   )
// }

// export default PostListPage
