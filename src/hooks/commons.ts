import { useUserStore } from "@/store/userStore";

// 檢查並返回當前狀態是登入還是登出
export const useIsLogin = () => {
  const { user, token } = useUserStore();
  return user !== null && token !== null;
};
