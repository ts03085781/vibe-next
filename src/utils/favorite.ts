import { apiDelete, apiPost } from "@/utils/api";

export const addToFavorites = (mangaId: string) => {
  apiPost(`/api/favorites`, { mangaId })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("加入收藏成功");
      } else {
        alert("加入收藏失敗");
      }
    })
    .catch(err => {
      alert("加入收藏失敗");
    });
};

export const removeFromFavorites = (mangaId: string) => {
  apiDelete(`/api/favorites?mangaId=${mangaId}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("移除收藏成功");
      } else {
        alert("移除收藏失敗");
      }
    })
    .catch(err => {
      alert("移除收藏失敗");
    });
};
