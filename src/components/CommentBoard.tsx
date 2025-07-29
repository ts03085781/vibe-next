import React, { useEffect, useState } from "react";
import { IComment } from "@/models/Comment";
import { useIsLogin } from "@/hooks/commons";
import { useRouter } from "next/navigation";
import { FiThumbsUp } from "react-icons/fi";
import { FiEdit } from "react-icons/fi";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdOutlineCancel } from "react-icons/md";
import { IoIosSend } from "react-icons/io";

import dayjs from "dayjs";
import { apiDelete, apiGet, apiPost, apiPut } from "@/utils/api";

interface CommentBoardProps {
  mangaId: string;
  currentUser?: {
    userId: string;
    username: string;
    avatar?: string;
    nickname: string;
    role: string;
  };
}

enum SORT_TYPE {
  LATEST = "latest",
  POPULAR = "popular",
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
  const [sort, setSort] = useState<SORT_TYPE>(SORT_TYPE.LATEST);
  const isLogin = useIsLogin();
  const router = useRouter();

  // 取得留言
  const fetchComments = async (reset = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await apiGet(
        `/api/comments?mangaId=${mangaId}&page=${page}&pageSize=${PAGE_SIZE}&sort=${sort}`
      );
      const data = await res.json();
      if (data.success) {
        setComments(reset ? data.data : [...comments, ...data.data]);
        setTotal(data.total);
      } else {
        setError(data.error || "載入失敗");
      }
    } catch (err) {
      console.error("載入失敗:", err);
      setError("載入失敗");
    }
    setLoading(false);
  };

  // 載入初始留言
  useEffect(() => {
    setPage(1);
    fetchComments(true);
    // eslint-disable-next-line
  }, [mangaId, sort]);

  // 載入更多留言
  useEffect(() => {
    if (page === 1) return;
    fetchComments();
    // eslint-disable-next-line
  }, [page]);

  // 新增留言
  const handleSubmit = async (e: React.FormEvent) => {
    // 阻止預設行為
    e.preventDefault();

    // 如果留言內容為空，則不提交
    if (!newContent.trim()) return;

    // 提交留言
    setSubmitting(true);
    try {
      const res = await apiPost("/api/comments", {
        mangaId,
        content: newContent,
        username: currentUser?.username,
        nickname: currentUser?.nickname,
      });
      const data = await res.json();
      if (data.success) {
        setComments([data.data, ...comments]);
        setNewContent("");
        setTotal(total + 1);
      } else {
        setError(data.error || "留言失敗");
      }
    } catch (err) {
      console.error("留言失敗:", err);
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
    preCheckLogIn();
    if (!currentUser) return;
    try {
      const res = await apiPost(`/api/comments/${commentId}/like`, {
        commentId,
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
    } catch (err) {
      console.error("按讚失敗:", err);
    }
  };

  // 編輯留言
  const handleEdit = (commentId: string, content: string) => {
    setEditingId(commentId);
    setEditContent(content);
  };

  // 取消編輯留言
  const handleEditCancel = () => {
    setEditingId(null);
    setEditContent("");
  };

  // 編輯留言
  const handleEditSubmit = async (commentId: string) => {
    if (!editContent.trim()) return;
    try {
      const res = await apiPut(`/api/comments/${commentId}`, {
        content: editContent,
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
    } catch (err) {
      console.error("編輯留言失敗:", err);
    }
  };

  // 刪除留言
  const handleDelete = async (commentId: string) => {
    if (!window.confirm("確定要刪除這則留言嗎？")) return;
    setDeletingId(commentId);
    try {
      const res = await apiDelete(`/api/comments/${commentId}`);
      const data = await res.json();
      if (data.success) {
        setComments(comments => comments.filter(c => c._id !== commentId));
      }
    } catch (err) {
      console.error("刪除留言失敗:", err);
    }
    setDeletingId(null);
  };

  // 預檢登入
  const preCheckLogIn = () => {
    // 如果未登入，則跳轉到登入頁面
    if (!isLogin) {
      alert("請先登入才能留言或按讚");
      router.push("/login");
    }
  };

  // 排序留言
  const handleSort = (sort: SORT_TYPE) => {
    setSort(sort);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-8">
      <h2 className="text-xl font-bold mb-4 text-orange-600">留言板</h2>

      {/* 新增留言 */}
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2 relative">
        <textarea
          id="newContent"
          name="newContent"
          className="flex-1 border border-gray-300 rounded px-2 py-1 text-gray-700 px-4 py-3 h-[140px]"
          value={newContent}
          onChange={e => setNewContent(e.target.value)}
          onFocus={preCheckLogIn}
          placeholder={isLogin ? "發表你的留言..." : "登入留下留言"}
          disabled={submitting}
          maxLength={1000}
        />
        <span className="text-base text-gray-400 absolute right-22 bottom-3">
          {newContent.length}/1000
        </span>
        <button
          type="submit"
          className="text-xl bg-orange-500 text-white px-4 py-1.5 rounded disabled:opacity-50 absolute right-4 bottom-3 flex items-center gap-1 cursor-pointer"
          disabled={submitting || !newContent.trim()}
        >
          <IoIosSend />
        </button>
      </form>

      {/* 留言排序 */}
      <div className="flex items-center gap-3 text-gray-500 text-sm border-b border-gray-300 mb-4">
        <button
          className={`cursor-pointer text-base font-bold leading-[40px] px-4 ${sort === SORT_TYPE.LATEST ? "text-orange-600 border-b-3 border-orange-600" : ""}`}
          onClick={() => handleSort(SORT_TYPE.LATEST)}
        >
          最新留言
        </button>
        <button
          className={`cursor-pointer text-base font-bold leading-[40px] px-4 ${sort === SORT_TYPE.POPULAR ? "text-orange-600 border-b-3 border-orange-600" : ""}`}
          onClick={() => handleSort(SORT_TYPE.POPULAR)}
        >
          熱門留言
        </button>
      </div>

      {error && <div className="text-red-500 mb-2">{error}</div>}

      {/* 留言列表 */}
      <div className="space-y-4">
        {comments.map(comment => {
          const liked = currentUser && comment.likes.includes(currentUser.userId);
          const canEditOrDelete =
            currentUser && (comment.userId === currentUser.userId || currentUser.role === "admin");
          return (
            <div key={String(comment._id)} className="border-b pb-3 px-3 border-gray-300">
              {/* 留言者與留言時間 */}
              <div className="flex flex-col gap-0.5">
                <div className="flex gap-1.5 items-center">
                  <span className="font-semibold text-base text-gray-700">{comment.nickname}</span>
                  <span className="text-xs text-gray-400">{`(${comment.username})`}</span>
                </div>
                <span className="text-xs text-gray-400">
                  {dayjs(comment.createdDate).format("YYYY年M月D日")}
                </span>
              </div>

              {/* 編輯與留言內容 */}
              {editingId === String(comment._id) ? (
                // 編輯留言
                <div className="flex gap-2 mt-1 mb-1 relative">
                  <textarea
                    className="flex-1 border border-gray-300 rounded px-2 py-1 text-gray-700 px-4 py-3 h-[140px]"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    disabled={deletingId === String(comment._id)}
                    rows={3}
                    maxLength={1000}
                  />
                  <span className="text-base text-gray-400 absolute right-38 bottom-3">
                    {editContent.length}/1000
                  </span>
                  <button
                    className="text-xl bg-orange-500 text-white px-4 py-1.5 rounded disabled:opacity-50 absolute right-20 bottom-3 cursor-pointer"
                    onClick={() => handleEditSubmit(String(comment._id))}
                    disabled={!editContent.trim() || deletingId === String(comment._id)}
                  >
                    <IoIosSend />
                  </button>
                  <button
                    className="text-xl bg-gray-400 text-white px-4 py-1.5 rounded disabled:opacity-50 absolute right-4 bottom-3 cursor-pointer"
                    onClick={handleEditCancel}
                    disabled={deletingId === String(comment._id)}
                  >
                    <MdOutlineCancel />
                  </button>
                </div>
              ) : (
                // 留言內容
                <div className="text-gray-800 mt-3 mb-3">{comment.content}</div>
              )}

              {/* 按讚 */}
              <div className="flex items-center gap-4 justify-between text-xs text-gray-500">
                <button
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded transition-colors cursor-pointer ${liked ? "bg-orange-100 hover:bg-orange-200 text-orange-600" : "bg-gray-100 hover:bg-gray-200"}`}
                  onClick={() => handleLike(String(comment._id))}
                  title={currentUser ? (liked ? "取消讚" : "按讚") : "請先登入"}
                >
                  <span className="text-base">{liked ? <FiThumbsUp /> : <FiThumbsUp />}</span>
                  <span>{comment.likes.length}</span>
                </button>

                {/* 編輯或刪除 */}
                {canEditOrDelete && editingId !== String(comment._id) && (
                  <div className="flex items-center gap-2">
                    {/* 編輯留言 */}
                    <button
                      className="text-sm text-gray-500 px-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 px-3 py-2"
                      onClick={() => handleEdit(String(comment._id), comment.content)}
                      disabled={deletingId === String(comment._id)}
                    >
                      <FiEdit className="text-base" />
                    </button>
                    {/* 刪除留言 */}
                    <button
                      className="text-sm text-gray-500 px-2 cursor-pointer border border-gray-300 rounded-md hover:bg-gray-100 px-3 py-2"
                      onClick={() => handleDelete(String(comment._id))}
                      disabled={deletingId === String(comment._id)}
                    >
                      <RiDeleteBin2Line className="text-base" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 載入更多 */}
      {loading && <div className="text-center text-gray-400 mt-4">載入中...</div>}

      {/* 載入更多 */}
      {!loading && comments.length < total && (
        <button
          className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-600 py-2 rounded"
          onClick={handleLoadMore}
        >
          載入更多
        </button>
      )}

      {/* 沒有留言 */}
      {!loading && comments.length === 0 && (
        <div className="text-center text-gray-400 mt-4">目前沒有留言</div>
      )}
    </div>
  );
};

export default CommentBoard;
