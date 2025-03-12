import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography } from '@mui/material'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('access_token')
  )
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="flex items-center text-indigo-800 no-underline">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/Temuflow-removebg-preview.png" // public 폴더 내 이미지 경로
              alt="Temu Overflow Logo"
              className="mr-2 h-10"
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#48528b' /* indigo-800 */
              }}>
              TemuOverflow
            </Typography>
          </Box>
        </Link>
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/posts"
              className="text-gray-700 hover:text-indigo-800">
              에러 공유 게시판
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="text-gray-700 hover:text-indigo-800">
              에러 해결 챗봇
            </Link>
          </li>
          <li>
            <Link
              to="/todayError"
              className="text-gray-700 hover:text-indigo-800">
              오늘의 에러
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                로그인
              </Link>
            )}
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
