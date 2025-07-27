import React, { useEffect, useState } from "react";
import { IComment } from "@/models/Comment";

interface CommentBoardProps {
  mangaId: string;
  currentUser?: {
    userId: string;
    username: string;
    nickname: string;
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
          nickname: currentUser?.nickname,
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

  // 按讚/取消讚
  const handleLike = async (commentId: string) => {
    if (!currentUser) return;
    try {
      const res = await fetch(`/api/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments =>
          comments.map(c =>
            c._id === commentId
              ? ({
                  ...c,
                  likes: data.liked
                    ? [...c.likes, currentUser.userId]
                    : c.likes.filter((id: string) => id !== currentUser.userId),
                } as IComment)
              : c
          )
        );
      }
    } catch (e) {
      // 可加上錯誤提示
    }
  };

  // 編輯留言
  const handleEdit = (commentId: string, content: string) => {
    setEditingId(commentId);
    setEditContent(content);
  };
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };
  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: editContent }),
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments =>
          comments.map(c =>
            c._id === commentId
              ? ({
                  _id: String(c._id),
                  mangaId: c.mangaId,
                  userId: c.userId,
                  username: c.username,
                  content: editContent,
                  createdDate: c.createdDate,
                  updatedDate: new Date(),
                  likes: c.likes,
                } as IComment)
              : c
          )
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (e) {}
  };

  // 刪除留言
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("確定要刪除這則留言嗎？")) return;
    setDeletingId(commentId);
    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${currentUser?.token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setComments(comments => comments.filter(c => c._id !== commentId));
      }
    } catch (e) {}
    setDeletingId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-8">
      <h2 className="text-xl font-bold mb-4 text-orange-600">留言板</h2>
      {currentUser ? (
        <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
          <textarea
            className="flex-1 border rounded px-2 py-1 text-gray-700"
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
        {comments.map(comment => {
          const liked = currentUser && comment.likes.includes(currentUser.userId);
          const canEditOrDelete =
            currentUser && (comment.userId === currentUser.userId || currentUser.role === "admin");
          return (
            <div key={String(comment._id)} className="border-b pb-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-gray-700">{comment.nickname}</span>
                <span className="text-xs text-gray-400">{`(${comment.username})`}</span>
                <span className="text-xs text-gray-400">
                  {new Date(comment.createdDate).toLocaleString()}
                </span>
              </div>
              {editingId === String(comment._id) ? (
                <div className="flex gap-2 mt-1 mb-1">
                  <input
                    className="flex-1 border rounded px-2 py-1"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    disabled={deletingId === String(comment._id)}
                  />
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded disabled:opacity-50"
                    onClick={() => handleEditSubmit(String(comment._id))}
                    disabled={!editContent.trim() || deletingId === String(comment._id)}
                  >
                    儲存
                  </button>
                  <button
                    className="bg-gray-300 text-gray-700 px-3 py-1 rounded"
                    onClick={handleEditCancel}
                    disabled={deletingId === String(comment._id)}
                  >
                    取消
                  </button>
                </div>
              ) : (
                <div className="text-gray-800 mt-1 mb-1">{comment.content}</div>
              )}
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <button
                  className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${liked ? "bg-orange-100 text-orange-600" : "hover:bg-gray-100"}`}
                  disabled={!currentUser}
                  onClick={() => handleLike(String(comment._id))}
                  title={currentUser ? (liked ? "取消讚" : "按讚") : "請先登入"}
                >
                  <span>{liked ? "👍" : "👍🏻"}</span>
                  <span>{comment.likes.length}</span>
                </button>
                {canEditOrDelete && editingId !== String(comment._id) && (
                  <>
                    <button
                      className="text-blue-500 hover:underline px-2"
                      onClick={() => handleEdit(String(comment._id), comment.content)}
                      disabled={deletingId === String(comment._id)}
                    >
                      編輯
                    </button>
                    <button
                      className="text-red-500 hover:underline px-2"
                      onClick={() => handleDelete(String(comment._id))}
                      disabled={deletingId === String(comment._id)}
                    >
                      {deletingId === String(comment._id) ? "刪除中..." : "刪除"}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
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
