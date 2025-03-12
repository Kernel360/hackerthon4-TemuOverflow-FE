import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Box, Typography, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    setIsLoggedIn(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    setIsLoggedIn(false)
    navigate('/')
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link
          to="/"
          className="flex items-center text-indigo-800 no-underline">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="/Temuflow-removebg-preview.png"
              alt="Temu Overflow Logo"
              className="mr-2 h-8 md:h-10"
            />
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#48528b',
                fontSize: { xs: '1rem', md: '1.25rem' }
              }}>
              TemuOverflow
            </Typography>
          </Box>
        </Link>

        {/* 모바일 메뉴 버튼 */}
        <div className="md:hidden">
          <IconButton onClick={toggleMenu} size="large">
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </div>

        {/* 데스크톱 메뉴 */}
        <ul className="hidden space-x-4 md:flex">
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

      {/* 모바일 메뉴 */}
      <div
        className={`${
          isMenuOpen ? 'block' : 'hidden'
        } md:hidden border-t border-gray-200`}>
        <ul className="flex flex-col space-y-4 p-4">
          <li>
            <Link
              to="/posts"
              className="block text-gray-700 hover:text-indigo-800"
              onClick={toggleMenu}>
              에러 공유 게시판
            </Link>
          </li>
          <li>
            <Link
              to="/chat"
              className="block text-gray-700 hover:text-indigo-800"
              onClick={toggleMenu}>
              에러 해결 챗봇
            </Link>
          </li>
          <li>
            <Link
              to="/todayError"
              className="block text-gray-700 hover:text-indigo-800"
              onClick={toggleMenu}>
              오늘의 에러
            </Link>
          </li>
          <li>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout()
                  toggleMenu()
                }}
                className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                로그아웃
              </button>
            ) : (
              <Link
                to="/login"
                onClick={toggleMenu}
                className="block w-full rounded bg-indigo-600 px-4 py-2 text-center text-white hover:bg-indigo-700">
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
