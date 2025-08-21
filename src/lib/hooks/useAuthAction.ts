import Cookies from "js-cookie";
import { useContextProvider } from "./useContextProvider";
import { useQueryClient } from "@tanstack/react-query";
export const useAuthAction = () => {
  const { setIsLogin, socketRef } = useContextProvider();
  const queryClient = useQueryClient();

  const handleLogout = () => {
    try {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        queryClient.clear();
        setIsLogin(false);
        socketRef.current?.disconnect();
      }
      alert("Logout successful");
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleLogout,
  };
};
