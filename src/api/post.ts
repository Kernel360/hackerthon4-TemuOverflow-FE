import { Post } from '@/types/Post'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 페이지네이션 및 필터링을 위한 파라미터 타입
export interface PostQueryParams {
  page: number
  size?: number
  status?: 'all' | 'solved' | 'unsolved' // TODO isSolved로 변경
  keyword?: string
}

// 인증 토큰을 가져오는 함수
const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token')
}

// 인증 헤더 생성 함수
const createAuthHeader = (): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  return headers
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
      // `${API_BASE_URL}/article?${queryParams.toString()}`, // TODO query parameter
      `${API_BASE_URL}/api/article`,
      {
        method: 'GET',
        headers: createAuthHeader()
      }
    )

    if (!response.ok) {
      throw new Error('서버에서 데이터를 가져오는데 실패했습니다.')
    }

    const data = await response.json()

    // 받은 데이터가 배열 형태로 변경되었으므로 그에 맞게 데이터 변환
    if (Array.isArray(data)) {
      // 배열 형태의 응답을 적절히 처리
      const transformedPosts = data.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        author: item.userId.toString(), // 사용자 ID를 author로 사용
        date: new Date(item.createdAt).toLocaleDateString(),
        views: 0, // API에서 제공하지 않으므로 기본값 사용
        comments: 0, // API에서 제공하지 않으므로 기본값 사용
        solved: item.isSolved
      }))
      return {
        posts: transformedPosts,
        totalPages: 1, // 페이지 정보가 없으므로 기본값 설정
        totalElements: data.length
      }
    }
    return {
      posts: data.content || [],
      totalPages: data.totalPages || 1,
      totalElements: data.totalElements || 0
    }
  } catch (error) {
    console.error('게시글 목록 조회 중 오류 발생:', error)
    throw error
  }
}

// 게시글 상세 조회 API
export const fetchPostById = async (postId: number): Promise<Post> => {
  try {
    const response = await fetch(`${API_BASE_URL}/article/${postId}`, {
      method: 'GET',
      headers: createAuthHeader()
    })

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
