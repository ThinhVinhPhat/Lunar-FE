import { enqueueSnackbar } from "notistack";
import { login } from "../../../../api/service/auth.service";
import { ILogin } from "../../../../types/login";
import { useMutation } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRef } from "react";

export const useLogin = () => {
  const status = useRef(false);
  const response = useMutation({
    mutationFn: (data: ILogin) => login(data.email, data.password),
    onSuccess: (data) => {
      Cookies.set("accessToken", data.accessToken, {
        expires: 1,
        secure: true,
        sameSite: "strict",
      });
      enqueueSnackbar("Login successfully", {
        variant: "success",
      });
      status.current = true;
    },
    onError: (error) => {
      enqueueSnackbar("Invalid email or password", {
        variant: "error",
      });
      status.current = false;
      console.log(error);
    },
  });
  return {
    responseStatus: status.current,
    ...response,
    data: response.data || null,
  };
};
