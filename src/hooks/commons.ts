import { useUserStore } from "@/store/userStore";

// 檢查並返回當前狀態是登入還是登出
export const useIsLogin = () => {
  const { user, accessToken } = useUserStore();
  return user !== null && accessToken !== null;
};
