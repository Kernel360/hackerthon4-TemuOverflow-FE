import { Post } from '../types/Post'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
// 페이지네이션 및 필터링을 위한 파라미터 타입
export interface PostQueryParams {
  page: number
  size?: number
  status?: 'all' | 'solved' | 'unsolved'
  keyword?: string
}

// 게시글 목록 조회 API
export const fetchPosts = async (
  params: PostQueryParams
): Promise<{
  posts: Post[]
  totalPages: number
  totalElements: number
}> => {
  try {
    // URL 파라미터 구성
    const queryParams = new URLSearchParams()
    queryParams.append('page', params.page.toString())
    if (params.size) queryParams.append('size', params.size.toString())
    if (params.keyword) queryParams.append('keyword', params.keyword)
    if (params.status && params.status !== 'all') {
      queryParams.append(
        'status',
        params.status === 'solved' ? 'true' : 'false'
      )
    }

    // API 요청
    const response = await fetch(
      `${API_BASE_URL}/post?${queryParams.toString()}`
    )

    if (!response.ok) {
      throw new Error('서버에서 데이터를 가져오는데 실패했습니다.')
    }

    const data = await response.json()
    return {
      posts: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    }
  } catch (error) {
    console.error('게시글 목록 조회 중 오류 발생:', error)
    throw error
  }
}

// 게시글 상세 조회 API
export const fetchPostById = async (postId: number): Promise<Post> => {
  try {
    const response = await fetch(`${API_BASE_URL}/post/${postId}`)

    if (!response.ok) {
      throw new Error('게시글을 가져오는데 실패했습니다.')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error(`게시글 ID ${postId} 조회 중 오류 발생:`, error)
    throw error
  }
}
