import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostCreateForm from '../components/PostCreateForm'

const PostCreatePage = () => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      navigate('/login')
    }
  }, [navigate])

  return (
    <div className="mx-auto max-w-4xl p-6">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-indigo-800">글 작성하기</h1>
        </div>
        <PostCreateForm />
      </div>
    </div>
  )
}

export default PostCreatePage
