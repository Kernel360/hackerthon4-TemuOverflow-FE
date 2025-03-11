import React from 'react'
import { Post } from '@/types/Post'

interface PostTableProps {
  posts: Post[]
  error: string | null
  handlePostClick: (postId: number) => void
}

const PostTable: React.FC<PostTableProps> = ({
  posts,
  error,
  handlePostClick
}) => {
  return (
    <div className="overflow-x-auto rounded-lg bg-white shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-indigo-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              번호
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              상태
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              제목
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              작성자
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              작성일
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              조회
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium tracking-wider text-indigo-800 uppercase">
              댓글
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {posts.length > 0 ? (
            posts.map(post => (
              <tr
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="cursor-pointer transition duration-150 hover:bg-indigo-50">
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {post.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex rounded-full px-2 text-xs leading-5 font-semibold ${
                      post.solved
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                    {post.solved ? '해결됨' : '미해결'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium whitespace-nowrap text-indigo-900">
                  {post.title}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-700">
                  {post.author}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {post.date}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {post.views}
                </td>
                <td className="px-6 py-4 text-sm whitespace-nowrap text-gray-500">
                  {post.comments}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={7}
                className="px-6 py-4 text-center text-gray-500">
                {error ? '오류가 발생했습니다.' : '게시글이 없습니다.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default PostTable
