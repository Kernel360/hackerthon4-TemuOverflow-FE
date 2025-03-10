const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const signup = async (form: {
  nickname: string
  email: string
  password: string
  profile_image_url?: string
}) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form)
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || '회원가입 실패')
  }

  return response.json()
}

export const login = async (credentials: {
  email: string
  password: string
}) => {
  const response = await fetch(`${API_BASE_URL}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })

  if (!response.ok) {
    throw new Error('로그인 실패')
  }

  return response.json()
}
