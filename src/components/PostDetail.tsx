import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Post {
  id: number;
  title: string;
  content: string;
  likeCount: number;
  likedByCurrentUser: boolean;
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
  likedByCurrentUser: boolean;
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
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [isEditingPost, setIsEditingPost] = useState<boolean>(false);
  const [editPostTitle, setEditPostTitle] = useState<string>("");
  const [editPostContent, setEditPostContent] = useState<string>("");

  const token = localStorage.getItem("access_token") || "";
  const DEFAULT_PROFILE_IMAGE = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

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

      setPost((prev) =>
        prev ? { 
          ...prev, 
          likeCount: prev.likeCount + (prev.likedByCurrentUser ? -1 : 1),
          likedByCurrentUser: !prev.likedByCurrentUser
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

      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId
            ? { 
                ...comment, 
                likeCount: comment.likeCount + (comment.likedByCurrentUser ? -1 : 1),
                likedByCurrentUser: !comment.likedByCurrentUser
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
        userProfileImageUrl: "/TemuFlow-GPT.png",
      };
      setComments([...comments, commentWithUserInfo]);
    } catch (error) {
      console.error("AI 답변 생성 오류:", error);
    } finally {
      setIsGeneratingAI(false);
    }
  }

  // ✅ 게시글 수정 함수
  async function handleEditPost() {
    if (!editPostTitle.trim() || !editPostContent.trim()) return;

    try {
      const response = await fetch(`http://13.125.174.224/api/article/${postId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: editPostTitle,
          content: editPostContent,
        }),
      });

      if (!response.ok) throw new Error("게시글을 수정할 수 없습니다.");

      const updatedPost = await response.json();
      setPost(updatedPost);
      setIsEditingPost(false);
    } catch (error) {
      console.error("게시글 수정 오류:", error);
    }
  }

  // ✅ 게시글 삭제 함수
  async function handleDeletePost() {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      const response = await fetch(`http://13.125.174.224/api/article/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("게시글을 삭제할 수 없습니다.");

      // 삭제 성공 시 목록 페이지로 이동
      window.location.href = "/";
    } catch (error) {
      console.error("게시글 삭제 오류:", error);
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
        <div className="flex-1">
          <p className="text-lg font-semibold">{post.userNickname || "Unknown User"}</p>
          <p className="text-sm text-gray-500">
            {new Date(post.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
        {currentUserId === post.userId && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setIsEditingPost(true);
                setEditPostTitle(post.title);
                setEditPostContent(post.content);
              }}
              className="px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
            >
              수정
            </button>
            <button
              onClick={handleDeletePost}
              className="px-4 py-2 text-red-500 hover:text-red-600 transition-colors"
            >
              삭제
            </button>
          </div>
        )}
      </div>

      {isEditingPost ? (
        <div className="mt-6">
          <input
            type="text"
            className="w-full p-3 text-3xl font-bold border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none"
            value={editPostTitle}
            onChange={(e) => setEditPostTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
          <textarea
            className="w-full p-3 min-h-[200px] text-lg border rounded-lg mb-4 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none font-mono"
            value={editPostContent}
            onChange={(e) => setEditPostContent(e.target.value)}
            placeholder="내용을 입력하세요. 코드 블록을 사용하려면 ```로 감싸주세요. 예시:
```javascript
console.log('Hello World');
```"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsEditingPost(false)}
              className="px-6 py-2 text-gray-500 hover:text-gray-600 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleEditPost}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              수정 완료
            </button>
          </div>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-bold text-indigo-600 mt-6">{post.title}</h1>
          <div className="mt-4 text-gray-700 text-lg leading-relaxed">
            <ReactMarkdown
              components={{
                code: (props: any) => {
                  const { inline, className, children } = props;
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </>
      )}

      <button 
        onClick={handleLikePost} 
        className={`mt-6 px-6 py-2 bg-gradient-to-r ${
          post.likedByCurrentUser
            ? 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
            : 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
        } text-white rounded-full transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg flex items-center gap-2 text-lg`}
      >
        <span className="text-2xl">{post.likedByCurrentUser ? '❤️' : '🤍'}</span> {post.likeCount}
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
                      comment.likedByCurrentUser
                        ? 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600' 
                        : 'from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600'
                    } text-white rounded-full transition-all duration-200 transform hover:scale-105 flex items-center gap-1`}
                  >
                    <span>{comment.likedByCurrentUser ? '❤️' : '🤍'}</span> {comment.likeCount}
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
