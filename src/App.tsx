import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PostListPage from './pages/PostListPage.tsx'
import MainPage from './pages/MainPage.tsx'
import ChatComponent from './pages/ChatComponent.tsx'
import Navbar from './components/Navbar.tsx'
import PostCreatePage from './pages/PostCreatePage.tsx'
// import PostDetailPage from './pages/PostDetailPage';
// import NewPostPage from './pages/NewPostPage'

const Home = () => (
  <div>
    <MainPage />
  </div>
)

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
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
          <Route
            path="/chat"
            element={<ChatComponent />}
          />
          {/* 추후 구현할 다른 라우트들 */}
          {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
          {/* <Route path="/posts/new" element={<NewPostPage />} /> */}
          <Route
            path="/posts/new"
            element={<PostCreatePage />}
          />
        </Routes>
      </Router>
    </>
  )
}

export default App
