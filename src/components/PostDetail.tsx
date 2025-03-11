import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("accessToken") || "";  // ✅ 로컬스토리지에서 가져오기

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        const response = await fetch(`http://13.125.174.224/api/article/${postId}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ 토큰 추가
            "Content-Type": "application/json"
          }
        });

        if (!response.ok) throw new Error("게시글을 불러올 수 없습니다.");
        const data: Post = await response.json();
        setPost(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [postId]);

  if (loading) return <p className="text-center text-gray-500">로딩 중...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!post) return <p className="text-center text-gray-500">게시글이 없습니다.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-indigo-600">{post.title}</h1>
      <hr className="my-4 border-gray-300" />
      <p className="mt-4 text-gray-700 text-lg leading-relaxed">{post.content}</p>
    </div>
  );
}
