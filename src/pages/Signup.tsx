import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '@/api/auth'

const Signup = () => {
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    profile_image: ''
  })
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      let imageUrl = form.profile_image_url

      if (imageFile) {
        const formData = new FormData()
        formData.append('file', imageFile)

        const uploadResponse = await fetch('YOUR_IMAGE_UPLOAD_API_ENDPOINT', {
          method: 'POST',
          body: formData
        })

        if (!uploadResponse.ok) {
          throw new Error('이미지 업로드 실패')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.url
      }

      const data = await signup({ ...form, profile_image_url: imageUrl })
      localStorage.setItem('access_token', data.access_token)
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">회원가입</h2>
        {error && <p className="mb-2 text-red-500">{error}</p>}
        <input
          type="text"
          name="nickname"
          placeholder="닉네임"
          value={form.nickname}
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="이메일"
          value={form.email}
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          value={form.password}
          onChange={handleChange}
          className="mb-2 w-full rounded border p-2"
          required
        />
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mb-2 w-full rounded border p-2"
        />
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-400">
          회원가입
        </button>
      </form>
    </div>
  )
}

export default Signup
