const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// export const signup = async (form: {
//   nickname: string
//   email: string
//   password: string
//   profileImage?: File
// }) => {
//   const formData = new FormData() // FormData 객체 생성

//   formData.append('nickname', form.nickname)
//   formData.append('email', form.email)
//   formData.append('password', form.password)

//   if (form.profileImage) {
//     formData.append('profileImage', form.profileImage) // 이미지 파일 추가
//   }

//   const response = await fetch(`${API_BASE_URL}/api/register`, {
//     method: 'POST',
//     // headers: { 'Content-Type': 'multipart/form-data' },
//     // body: JSON.stringify(form)
//     body: formData
//   })

//   if (!response.ok) {
//     const data = await response.json()
//     throw new Error(data.message || '회원가입 실패')
//   }

//   return response.json()
// }
export const signup = async (formData: FormData) => {
  const response = await fetch(`${API_BASE_URL}/api/register`, {
    method: 'POST',
    body: formData
  })

  const token = response.headers.get('Authorization')
  if (!response.ok || !token) {
    // if (!response.ok) {
    const data = await response.json()
    throw new Error(data.message || '회원가입 실패')
  }
  console.log('token:', token)

  localStorage.setItem('access_token', token)

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
    // credentials: 'include'
  })
  const token = response.headers.get('Authorization')
  if (!response.ok || !token) {
    throw new Error('로그인 실패')
  }
  localStorage.setItem('access_token', token)
  return response.json()
}

// 토큰 확인 함수
export const checkAuth = () => {
  const token = localStorage.getItem('access_token')
  if (!token) {
    // 토큰이 없으면 로그인 페이지로 리디렉션하거나 적절한 처리
    // navigate('/login');
    console.warn('인증 토큰이 없습니다. 로그인이 필요할 수 있습니다.')
  }
  return !!token
}

// 인증 토큰을 가져오는 함수
export const getAuthToken = (): string | null => {
  return localStorage.getItem('access_token')
}

// 인증 헤더 생성 함수
export const createAuthHeader = (): HeadersInit => {
  const token = getAuthToken()
  const headers: HeadersInit = {
    'Content-Type': 'application/json'
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}
