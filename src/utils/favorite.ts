export const addToFavorites = (mangaId: string) => {
  fetch(`/api/favorites`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mangaId }),
  })
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
  fetch(`/api/favorites`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mangaId }),
  })
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
