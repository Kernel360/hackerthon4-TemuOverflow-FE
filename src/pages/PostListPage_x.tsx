// import React, { useState } from 'react'
// import { useNavigate } from 'react-router-dom'

// // 임시 데이터
// const DUMMY_POSTS: Post[] = [
//   {
//     id: 1,
//     title: 'React 컴포넌트 렌더링 문제',
//     author: '김개발',
//     date: '2025-03-09',
//     solved: true,
//     views: 120,
//     comments: 5
//   },
//   {
//     id: 2,
//     title: 'TypeScript 타입 에러: Property does not exist on type',
//     author: '이코딩',
//     date: '2025-03-08',
//     solved: false,
//     views: 85,
//     comments: 3
//   },
//   {
//     id: 3,
//     title: 'Spring Boot JPA 연관관계 매핑 오류',
//     author: '박백엔드',
//     date: '2025-03-07',
//     solved: true,
//     views: 210,
//     comments: 12
//   },
//   {
//     id: 4,
//     title: 'Tailwind CSS 반응형 디자인 적용 안됨',
//     author: '최디자인',
//     date: '2025-03-07',
//     solved: false,
//     views: 65,
//     comments: 2
//   },
//   {
//     id: 5,
//     title: 'REST API 404 에러 발생',
//     author: '정서버',
//     date: '2025-03-06',
//     solved: false,
//     views: 150,
//     comments: 8
//   },
//   {
//     id: 6,
//     title: 'Node.js 비동기 처리 문제',
//     author: '한자바스크립트',
//     date: '2025-03-05',
//     solved: true,
//     views: 95,
//     comments: 4
//   },
//   {
//     id: 7,
//     title: 'Docker 컨테이너 실행 오류',
//     author: '배데브옵스',
//     date: '2025-03-04',
//     solved: false,
//     views: 180,
//     comments: 10
//   },
//   {
//     id: 8,
//     title: 'MySQL 쿼리 최적화 문제',
//     author: '강데이터',
//     date: '2025-03-03',
//     solved: true,
//     views: 130,
//     comments: 7
//   },
//   {
//     id: 9,
//     title: 'webpack 설정 에러',
//     author: '신빌드',
//     date: '2025-03-02',
//     solved: false,
//     views: 110,
//     comments: 6
//   },
//   {
//     id: 10,
//     title: 'Git merge conflict 해결 방법',
//     author: '임버전',
//     date: '2025-03-01',
//     solved: true,
//     views: 220,
//     comments: 15
//   }
// ]

// const PostListPage: React.FC = () => {
//   const navigate = useNavigate()
//   const [searchTerm, setSearchTerm] = useState('')
//   const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all')
//   const [currentPage, setCurrentPage] = useState(1)
//   const postsPerPage = 10

//   // 검색 및 필터링 적용
//   const filteredPosts = DUMMY_POSTS.filter(post => {
//     const matchesSearch =
//       post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       post.author.toLowerCase().includes(searchTerm.toLowerCase())

//     if (filter === 'all') return matchesSearch
//     if (filter === 'solved') return matchesSearch && post.solved
//     if (filter === 'unsolved') return matchesSearch && !post.solved

//     return matchesSearch
//   })

//   // 페이지네이션 계산
//   const indexOfLastPost = currentPage * postsPerPage
//   const indexOfFirstPost = indexOfLastPost - postsPerPage
//   const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost)
//   const totalPages = Math.ceil(filteredPosts.length / postsPerPage)

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
//         <h1 className="text-3xl font-bold text-indigo-800">
//           개발자 에러 공유 게시판
//         </h1>
//         <button
//           onClick={handleNewPost}
//           className="bg-tumbleweed-500 hover:bg-tumbleweed-600 rounded-lg px-4 py-2 font-semibold text-white transition duration-200">
//           새 게시글 작성
//         </button>
//       </div>

//       {/* 검색 및 필터링 */}
//       <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
//         <div className="relative w-full sm:w-96">
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={e => setSearchTerm(e.target.value)}
//             placeholder="제목 또는 작성자 검색..."
//             className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
//           />
//           <svg
//             className="absolute top-2.5 right-3 h-5 w-5 text-gray-400"
//             xmlns="http://www.w3.org/2000/svg"
//             viewBox="0 0 20 20"
//             fill="currentColor">
//             <path
//               fillRule="evenodd"
//               d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//               clipRule="evenodd"
//             />
//           </svg>
//         </div>

//         <div className="flex gap-2">
//           <button
//             onClick={() => setFilter('all')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'all'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             전체
//           </button>
//           <button
//             onClick={() => setFilter('solved')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'solved'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             해결됨
//           </button>
//           <button
//             onClick={() => setFilter('unsolved')}
//             className={`rounded-lg px-4 py-2 font-medium transition duration-200 ${
//               filter === 'unsolved'
//                 ? 'bg-indigo-600 text-white'
//                 : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//             }`}>
//             미해결
//           </button>
//         </div>
//       </div>

//       {/* 게시글 목록 테이블 */}
//       <div className="overflow-x-auto rounded-lg bg-white shadow">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-indigo-50">
//             <tr>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 번호
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 상태
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 제목
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 작성자
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 작성일
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 조회
//               </th>
//               <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
//                 댓글
//               </th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-gray-200 bg-white">
//             {currentPosts.length > 0 ? (
//               currentPosts.map(post => (
//                 <tr
//                   key={post.id}
//                   onClick={() => handlePostClick(post.id)}
//                   className="cursor-pointer transition duration-150 hover:bg-indigo-50">
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     {post.id}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
//                         post.solved
//                           ? 'bg-green-100 text-green-800'
//                           : 'bg-red-100 text-red-800'
//                       }`}>
//                       {post.solved ? '해결됨' : '미해결'}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-indigo-900">
//                     {post.title}
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
//                     {post.author}
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     {post.date}
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     {post.views}
//                   </td>
//                   <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
//                     {post.comments}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td
//                   colSpan={7}
//                   className="px-6 py-4 text-center text-gray-500">
//                   검색 결과가 없습니다.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* 페이지네이션 */}
//       {filteredPosts.length > 0 && (
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
//             {[...Array(totalPages)].map((_, i) => (
//               <button
//                 key={i}
//                 onClick={() => handlePageChange(i + 1)}
//                 className={`relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
//                   currentPage === i + 1
//                     ? 'bg-indigo-50 text-indigo-600'
//                     : 'text-gray-700 hover:bg-gray-50'
//                 }`}>
//                 {i + 1}
//               </button>
//             ))}
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
//     </div>
//   )
// }

// export default PostListPage
