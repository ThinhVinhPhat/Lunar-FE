import { enqueueSnackbar } from "notistack";
import { login } from "../../../../api/service/auth.service";
import { ILogin } from "../../../../types/login";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";

export const useLogin = () => {
  const response = useMutation({
    mutationFn: async (data: ILogin) => await login(data.email, data.password),
    onSuccess: (data) => {
      Cookies.set("accessToken", data.accessToken, {
        expires: 60,
        secure: true,
        sameSite: "strict",
      });
      Cookies.set("refreshToken", data.refreshToken, {
        expires: 2592000,
        secure: true,
        sameSite: "strict",
      });
      enqueueSnackbar("Login successfully", {
        variant: "success",
      });
    },
    onError: (error) => {
      enqueueSnackbar("Invalid email or password", {
        variant: "error",
      });
      console.log(error);
    },
  });
  return {
    ...response,
    data: response.data || null,
  };
};
