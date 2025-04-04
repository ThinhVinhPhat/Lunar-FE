import { useLogin } from "../hooks/queryClient/mutator/auth/login";
import Cookies from "js-cookie";
import { useRegister } from "../hooks/queryClient/mutator/auth/register";
import { useForgotPassword } from "../hooks/queryClient/mutator/auth/forgot";
import { useUpdatePassword } from "../hooks/queryClient/mutator/auth/update-password";
import { useContextProvider } from "./useContextProvider";
import { IRegister } from "@/types/register";

export const useAuthAction = () => {
  const {setIsLogin} = useContextProvider();
  const { isPending: isPendingLogin, mutate: mutateLogin } = useLogin();
  const { isPending: isPendingRegister, mutate: mutateRegister } =
    useRegister();
  const { mutate: mutateForgotPassword, statusResponse: statusForgotPassword } =
    useForgotPassword();
  const { mutate: mutateUpdatePassword, statusResponse: statusUpdatePassword } =
    useUpdatePassword();


  
    const handleLogin = async (email: string, password: string) => {
      try {
        await mutateLogin({ email, password });
        return true;
      } catch (error: any) {
        if (error.response?.data.statusCode === 401) {
          console.log(error);
          return false;
        }
      }
    };
  
    const handleRegister = async (formData: IRegister) => {
      try {
        await mutateRegister(formData);
        return true;
      } catch (error: any) {
        console.log(error);
        if (error.response?.data.statusCode === 401) {
          console.log(error);
          return false;
        }
      }
    };
  
    const handleLogout = () => {
      try {
        const confirmLogout = confirm("Are you sure you want to logout?");
        if (confirmLogout) {
          Cookies.remove("accessToken");
          Cookies.remove("refreshToken");
          setIsLogin(false);
        }
        alert("Logout successful");
      } catch (error) {
        console.log(error);
      }
    };
  
    const handleForgotPassword = async (email: string) => {
      try {
        await mutateForgotPassword(email);
        return statusForgotPassword;
      } catch (error) {
        console.log(error);
        return statusForgotPassword;
      }
    };
  
    const handleUpdatePassword = async (
      email: string,
      code: string,
      password: string
    ) => {
      try {
        await mutateUpdatePassword({ email, code, password });
        return statusUpdatePassword;
      } catch (error) {
        console.log(error);
        return statusUpdatePassword;
      }
    };
  return {
    handleLogin,
    handleRegister,
    handleLogout,
    handleForgotPassword,
    handleUpdatePassword,
    isPendingLogin,
    isPendingRegister,
  }
};
