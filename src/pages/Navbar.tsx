// src/components/Navbar.tsx
import React from 'react'
import { Link } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import './Navbar.css'

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          style={{ textDecoration: 'none' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {/* 로고 이미지 */}
            <img
              src="/Temuflow-removebg-preview.png" // public 폴더 내 이미지 경로
              alt="Temu Overflow Logo"
              style={{ height: 40, marginRight: 10 }}
            />

            {/* 브랜드 텍스트 */}
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 'bold',
                color: '#48528b' /* indigo-800 */
              }}>
              Temu Overflow
            </Typography>
          </Box>
        </Link>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link
              to="/posts"
              className="nav-link">
              에러 공유 게시판
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/chat"
              className="nav-link">
              에러 해결 챗봇
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/todayError"
              className="nav-link">
              오늘의 에러
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/login"
              className="nav-button">
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
