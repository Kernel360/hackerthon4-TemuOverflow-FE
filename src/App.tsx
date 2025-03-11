import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import PostListPage from './pages/PostListPage.tsx'
import PostCreatePage from './pages/PostCreatePage.tsx'
import Navbar from './components/Navbar.tsx'
import PostPage from "./pages/PostPage";
// import PostDetailPage from './pages/PostDetailPage';
// import NewPostPage from './pages/NewPostPage'
import MainPage from './pages/MainPage'
import ChatComponent from './pages/ChatComponent.tsx'
import TodayError from './pages/TodayError.tsx'

const Home = () => (
  //   <h1 className="text-3xl font-bold">Home</h1>
  // <div className="flex h-screen items-center justify-center">
  <div>
    <MainPage />
  </div>
)

const App = () => {
  return (
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
          path="/post/:postId"
          element={<PostPage />} 
        />
        {/* 추후 구현할 다른 라우트들 */}
        {/* <Route path="/posts/:id" element={<PostDetailPage />} /> */}
        {/* <Route path="/posts/new" element={<NewPostPage />} /> */}
        <Route
          path="/post/new"
          element={<PostCreatePage />}
        />
        <Route
          path="/chat"
          element={<ChatComponent />}
        />
        <Route
          path="/todayError"
          element={<TodayError />}
        />

      </Routes>
    </Router>
  )
}

export default App
