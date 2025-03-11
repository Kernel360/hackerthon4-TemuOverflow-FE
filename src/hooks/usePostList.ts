import { useState, useEffect } from 'react'
import { Post } from '../types/Post'
import { fetchPosts, PostQueryParams } from '../api/post'
import { checkAuth } from '../api/auth'

const usePostList = () => {
  const [posts, setPosts] = useState<Post[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'all' | 'solved' | 'unsolved'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalElements, setTotalElements] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const postsPerPage = 10

  // 컴포넌트 마운트 시 인증 확인
  useEffect(() => {
    checkAuth()
  }, [])

  // 데이터 로딩 함수
  const loadPosts = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params: PostQueryParams = {
        page: currentPage - 1, // 서버는 0부터 시작하는 페이지 인덱스 사용
        size: postsPerPage,
        status: filter,
        keyword: searchTerm.trim() !== '' ? searchTerm : undefined
      }

      const result = await fetchPosts(params)
      setPosts(result.posts)
      setTotalPages(result.totalPages)
      setTotalElements(result.totalElements)
    } catch (err) {
      setError('로그인해주세요.')
      console.error('Error loading posts:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // 페이지, 필터, 검색어 변경 시 데이터 다시 로드
  useEffect(() => {
    loadPosts()
  }, [currentPage, filter])

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentPage(1) // 검색 시 첫 페이지로 이동
    loadPosts()
  }

  // 필터 변경 핸들러
  const handleFilterChange = (newFilter: 'all' | 'solved' | 'unsolved') => {
    setFilter(newFilter)
    setCurrentPage(1) // 필터 변경 시 첫 페이지로 이동
  }

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  return {
    posts,
    searchTerm,
    setSearchTerm,
    filter,
    currentPage,
    totalPages,
    totalElements,
    isLoading,
    error,
    handleSearch,
    handleFilterChange,
    handlePageChange
  }
}

export default usePostList
