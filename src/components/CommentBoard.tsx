import React, { useEffect, useState } from "react";
import { IComment } from "@/models/Comment";

interface CommentBoardProps {
  mangaId: string;
  currentUser?: {
    userId: string;
    username: string;
    role: string;
    token: string;
  };
}

const PAGE_SIZE = 10;

const CommentBoard: React.FC<CommentBoardProps> = ({ mangaId, currentUser }) => {
  const [comments, setComments] = useState<IComment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 取得留言
  const fetchComments = async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `/api/comments?mangaId=${mangaId}&page=${page}&pageSize=${PAGE_SIZE}`
      );
      const data = await res.json();
      if (data.success) {
        setComments(reset ? data.data : [...comments, ...data.data]);
        setTotal(data.total);
      } else {
        setError(data.error || "載入失敗");
      }
    } catch (e) {
      setError("載入失敗");
    }
    setLoading(false);
  };

  useEffect(() => {
    setPage(1);
    fetchComments(true);
    // eslint-disable-next-line
  }, [mangaId]);

  useEffect(() => {
    if (page === 1) return;
    fetchComments();
    // eslint-disable-next-line
  }, [page]);

  // 新增留言
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mangaId,
          content: newContent,
          username: currentUser?.username,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewContent("");
        setTotal(total + 1);
      } else {
        setError(data.error || "留言失敗");
      }
    } catch (e) {
      setError("留言失敗");
    }
    setSubmitting(false);
  };

  // 載入更多
  const handleLoadMore = () => {
    if (comments.length < total) {
      setPage(page + 1);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-8">
      <h2 className="text-lg font-bold mb-4 text-orange-600">留言板</h2>
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <input
            className="flex-1 border rounded px-2 py-1"
            value={newContent}
            onChange={e => setNewContent(e.target.value)}
            placeholder="發表你的留言..."
            disabled={submitting}
          />
          <button
            type="submit"
            className="bg-orange-500 text-white px-4 py-1 rounded disabled:opacity-50"
            disabled={submitting || !newContent.trim()}
          >
            留言
          </button>
        </form>
      ) : (
        <div className="mb-4 text-gray-400">請先登入才能留言</div>
      )}
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <div className="space-y-4">
        {comments.map(comment => (
          <div key={String(comment._id)} className="border-b pb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-gray-700">{comment.username}</span>
              <span className="text-xs text-gray-400">
                {new Date(comment.createdDate).toLocaleString()}
              </span>
            </div>
            <div className="text-gray-800 mt-1 mb-1">{comment.content}</div>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>讚 {comment.likes.length}</span>
              {/* 之後可加上按讚、編輯、刪除按鈕 */}
            </div>
          </div>
        ))}
      </div>
      {loading && <div className="text-center text-gray-400 mt-4">載入中...</div>}
      {!loading && comments.length < total && (
        <button
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded"
          onClick={handleLoadMore}
        >
          載入更多
        </button>
      )}
      {!loading && comments.length === 0 && (
        <div className="text-center text-gray-400 mt-4">目前沒有留言</div>
      )}
    </div>
  );
};

export default CommentBoard;
