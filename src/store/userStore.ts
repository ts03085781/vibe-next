import { create } from "zustand";

export interface User {
  _id: string;
  username: string;
  email: string;
  nickname: string;
  avatar?: string;
  role: string;
  favorites: string[];
}

interface UserState {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>(set => ({
  user: null,
  token: null,
  login: (token, user) => {
    set({ token, user });
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
  },
  logout: () => {
    set({ token: null, user: null });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  setUser: user => set({ user }),
}));
