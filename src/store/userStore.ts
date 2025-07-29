import { create } from "zustand";
import { apiPost } from "@/utils/api";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  nickname: string;
  avatar: string;
  createdDate: Date;
  updatedDate: Date;
  favorites?: string[];
}

interface UserState {
  user: User | null;
  accessToken: string | null;
  login: (accessToken: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshAccessToken: () => Promise<boolean>;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  accessToken: null,

  login: (accessToken, user) => {
    set({ accessToken, user });
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("user", JSON.stringify(user));
  },

  logout: () => {
    set({ accessToken: null, user: null });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    // 呼叫後端登出 API
    fetch("/api/auth/logout", { method: "POST" });
  },

  setUser: user => set({ user }),

  refreshAccessToken: async () => {
    try {
      const response = await apiPost("/api/auth/refresh", {});

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          set({ accessToken: data.data.accessToken });
          localStorage.setItem("accessToken", data.data.accessToken);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("refreshAccessToken error", error);
      return false;
    }
  },
}));
