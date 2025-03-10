import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PostListPage from './pages/PostListPage'

const Home = () => (
  <div className="flex h-screen items-center justify-center">
    <h1 className="text-3xl font-bold">홈 페이지</h1>
  </div>
)

const App = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home />}
        />
        <Route
          path="/signup"
          element={<Signup />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/"
          element={<PostListPage />}
        />
        <Route
          path="/posts"
          element={<PostListPage />}
        />
        {/* 추후 구현할 다른 라우트들 */}
        {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
        {/* <Route path="/posts/new" element={<NewPostPage />} /> */}
      </Routes>
    </Router>
  )
}

export default App
