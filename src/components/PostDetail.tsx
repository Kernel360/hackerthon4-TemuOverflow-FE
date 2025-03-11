import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  isLiked: boolean;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Comment {
  id: number;
  content: string;
  likeCount: number;
  isLiked: boolean;
  userId: number;
  userNickname: string;
  userProfileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState<string>("");
  const [editingComment, setEditingComment] = useState<number | null>(null);
  const [editContent, setEditContent] = useState<string>("");
  const [isGeneratingAI, setIsGeneratingAI] = useState<boolean>(false); // AI 생성 로딩 상태
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const token = localStorage.getItem("access_token") || "";
  const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  // 좋아요 상태 초기화
  useEffect(() => {
    const savedLikedPosts = localStorage.getItem('likedPosts');
    const savedLikedComments = localStorage.getItem('likedComments');
    
    if (savedLikedPosts) {
      setLikedPosts(new Set(JSON.parse(savedLikedPosts)));
    }
    if (savedLikedComments) {
      setLikedComments(new Set(JSON.parse(savedLikedComments)));
    }
  }, []);

  // 좋아요 상태 저장
  const saveLikeStates = (posts: Set<number>, comments: Set<number>) => {
    localStorage.setItem('likedPosts', JSON.stringify([...posts]));
    localStorage.setItem('likedComments', JSON.stringify([...comments]));
  };

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const response = await fetch("http://13.125.174.224/api/user-info", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          setCurrentUserId(userData.id);
        }
      } catch (error) {
        console.error("사용자 정보 가져오기 실패:", error);
      }
    }
    fetchCurrentUser();
  }, [token]);

  useEffect(() => {
    async function fetchPostAndComments() {
      try {
        setLoading(true);

        // 📌 게시글 가져오기
        const postResponse = await fetch(`http://13.125.174.224/api/article/${postId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!postResponse.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const postData: Post = await postResponse.json();
        console.log("받아온 게시글 데이터:", postData);
        setPost(postData);

        // 📌 댓글 가져오기
        const commentsResponse = await fetch(`http://13.125.174.224/api/reply/post/${postId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!commentsResponse.ok) throw new Error("댓글을 불러올 수 없습니다.");
        const commentsData: Comment[] = await commentsResponse.json();
        console.log("받아온 댓글 데이터:", commentsData);
        setComments(commentsData);

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchPostAndComments();
  }, [postId]);

  // ✅ 댓글 작성 함수
  async function handleAddComment() {
    if (!newComment.trim()) return;

    try {
      const response = await fetch("http://13.125.174.224/api/reply", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: Number(postId),
          content: newComment,
        }),
      });

      if (!response.ok) throw new Error("댓글을 작성할 수 없습니다.");

      const addedComment: Comment = await response.json();
      setComments([...comments, addedComment]);
      setNewComment("");
    } catch (error) {
      console.error("댓글 작성 오류:", error);
    }
  }

  // ✅ 댓글 삭제 함수
  async function handleDeleteComment(commentId: number) {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`http://13.125.174.224/api/reply/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("댓글을 삭제할 수 없습니다.");

      setComments(comments.filter((comment) => comment.id !== commentId)); // ✅ 삭제된 댓글 제거
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  }

  // ✅ 댓글 수정 함수
  async function handleEditComment(commentId: number) {
    if (!editContent.trim()) return;

    try {
      const response = await fetch(`http://13.125.174.224/api/reply/${commentId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: Number(postId),
          content: editContent, // ❌ userId 제거
        }),
      });

      if (!response.ok) throw new Error("댓글을 수정할 수 없습니다.");

      const updatedComments = comments.map((comment) =>
        comment.id === commentId ? { ...comment, content: editContent } : comment
      );
      setComments(updatedComments);
      setEditingComment(null); // ✅ 수정 모드 종료
    } catch (error) {
      console.error("댓글 수정 오류:", error);
    }
  }

  // ✅ 게시글 좋아요 버튼 클릭
  async function handleLikePost() {
    try {
      const response = await fetch(`http://13.125.174.224/api/like/article`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objectId: Number(postId) }),
      });

      if (!response.ok) throw new Error("좋아요 요청 실패");

      const newLikedPosts = new Set(likedPosts);
      const isCurrentlyLiked = newLikedPosts.has(Number(postId));

      if (isCurrentlyLiked) {
        newLikedPosts.delete(Number(postId));
      } else {
        newLikedPosts.add(Number(postId));
      }

      setLikedPosts(newLikedPosts);
      saveLikeStates(newLikedPosts, likedComments);

      setPost((prev) =>
        prev ? { 
          ...prev, 
          likeCount: prev.likeCount + (isCurrentlyLiked ? -1 : 1)
        } : prev
      );
    } catch (error) {
      console.error("게시글 좋아요 오류:", error);
    }
  }

  // ✅ 댓글 좋아요 버튼 클릭
  async function handleLikeComment(commentId: number) {
    try {
      const response = await fetch(`http://13.125.174.224/api/like/reply`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ objectId: commentId }),
      });

      if (!response.ok) throw new Error("좋아요 요청 실패");

      const newLikedComments = new Set(likedComments);
      const isCurrentlyLiked = newLikedComments.has(commentId);

      if (isCurrentlyLiked) {
        newLikedComments.delete(commentId);
      } else {
        newLikedComments.add(commentId);
      }

      setLikedComments(newLikedComments);
      saveLikeStates(likedPosts, newLikedComments);

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { 
                ...comment, 
                likeCount: comment.likeCount + (isCurrentlyLiked ? -1 : 1)
              }
            : comment
        )
      );
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
    }
  }

  // ✅ AI 답변 생성 함수
  async function handleAIComment() {
    try {
      setIsGeneratingAI(true);
      const response = await fetch(`http://13.125.174.224/api/reply/ai/${postId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("AI 답변을 생성할 수 없습니다.");

      const aiComment = await response.json();
      const commentWithUserInfo = {
        ...aiComment,
        userNickname: "TemuFlow GPT",
        userProfileImageUrl: "https://cdn-icons-png.flaticon.com/512/4616/4616734.png",
      };
      setComments([...comments, commentWithUserInfo]);
    } catch (error) {
      console.error("AI 답변 생성 오류:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  }

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-gray-500">게시글이 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* 📌 게시글 정보 */}
      <div className="flex items-center gap-4 border-b pb-4">
        <img 
          src={post.userProfileImageUrl || DEFAULT_PROFILE_IMAGE} 
          alt="프로필" 
          className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = DEFAULT_PROFILE_IMAGE;
          }}
        />
        <div>
          <p className="text-lg font-semibold">{post.userNickname || "Unknown User"}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold text-indigo-600 mt-6">{post.title}</h1>
      <p className="mt-4 text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">{post.content}</p>

      <button 
        onClick={handleLikePost} 
        className={`mt-6 px-6 py-2 bg-gradient-to-r ${
          likedPosts.has(Number(postId))
            ? 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
        } text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 text-lg`}
      >
        <span className="text-2xl">{likedPosts.has(Number(postId)) ? '❤️' : '🤍'}</span> {post.likeCount}
      </button>

      {/* 📌 댓글 섹션 */}
      <div className="mt-8 border-t pt-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <span>댓글</span>
          <span className="text-sm font-normal text-gray-500">({comments.length})</span>
        </h2>

        {/* 📌 댓글 리스트 */}
        <div className="mt-4 space-y-4">
          {comments.length === 0 ? (
            <p className="text-gray-500 text-center py-8 bg-gray-50 rounded-lg">아직 댓글이 없습니다.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                {/* 댓글 작성자 정보 */}
                <div className="flex items-center gap-3 mb-2">
                  <img 
                    src={comment.userProfileImageUrl || DEFAULT_PROFILE_IMAGE} 
                    alt="프로필" 
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = DEFAULT_PROFILE_IMAGE;
                    }}
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{comment.userNickname || "Unknown User"}</p>
                    <p className="text-sm text-gray-500">
                      {comment.updatedAt === "-999999999-01-01T00:00:00"
                        ? new Date(comment.createdAt).toLocaleString('ko-KR')
                        : `수정됨: ${new Date(comment.updatedAt).toLocaleString('ko-KR')}`}
                    </p>
                  </div>
                  <button 
                    onClick={() => handleLikeComment(comment.id)} 
                    className={`ml-auto px-3 py-1 bg-gradient-to-r ${
                      likedComments.has(comment.id)
                        ? 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                        : 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                    } text-white rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-1`}
                  >
                    <span>{likedComments.has(comment.id) ? '❤️' : '🤍'}</span> {comment.likeCount}
                  </button>
                </div>

                {/* 댓글 내용 */}
                {editingComment === comment.id ? (
                  <div className="mt-2 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 p-2 border rounded bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button
                      onClick={() => handleEditComment(comment.id)}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition-colors"
                    >
                      수정 완료
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-700 mt-1 ml-11 whitespace-pre-wrap">{comment.content}</p>
                )}

                {/* 삭제 & 수정 버튼 */}
                <div className="flex gap-2 mt-2 ml-11">
                  {currentUserId === comment.userId && (
                    <>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-sm text-red-500 hover:text-red-600 transition-colors"
                      >
                        삭제
                      </button>
                      <button
                        onClick={() => {
                          setEditingComment(comment.id);
                          setEditContent(comment.content);
                        }}
                        className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                      >
                        수정
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* AI 답변 생성 버튼 */}
        <div className="mt-6 flex justify-center">
          <button 
            onClick={handleAIComment} 
            disabled={isGeneratingAI}
            className={`px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 ${isGeneratingAI ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isGeneratingAI ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                답변 생성 중...
              </>
            ) : (
              'TemuFlow GPT 답변 생성하기'
            )}
          </button>
        </div>

        {/* 댓글 입력 */}
        <div className="mt-6">
          <div className="flex gap-2 bg-gray-50 p-4 rounded-lg">
            <input
              type="text"
              className="flex-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none transition-all"
              placeholder="댓글을 입력하세요..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddComment();
                }
              }}
            />
            <button 
              onClick={handleAddComment} 
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>💬</span> 작성
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
