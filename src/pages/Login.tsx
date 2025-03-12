import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '@/api/auth'

const Login = () => {
  const [form, setForm] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      await login(form)
      navigate('/')
    } catch (err) {
      setError(err instanceof Error ? err.message : '로그인 실패')
    }
  }

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">로그인</h2>
        {error && <p className="mb-2 text-red-500">{error}</p>}
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
        <button
          type="submit"
          className="w-full rounded bg-indigo-600 p-2 text-white hover:bg-indigo-400">
          로그인
        </button>
        <button
          type="button"
          onClick={() => navigate('/signup')}
          className="mt-4 w-full rounded bg-gray-600 p-2 text-white hover:bg-gray-400">
          회원가입
        </button>
      </form>
    </div>
  )
}

export default Login
