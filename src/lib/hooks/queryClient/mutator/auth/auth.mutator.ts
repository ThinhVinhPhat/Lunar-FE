import { useMutation } from "@tanstack/react-query";
import {
  forgotPassword,
  ForgotPasswordInterface,
  login,
  LoginInterface,
  register,
  RegisterInterface,
  UpdatePasswordInterface,
  verifyRegister,
  VerifyRegisterInterface,
} from "@/lib/api/service/auth.service";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";
import { updatePassword } from "@/lib/api/service/user.service";
import { AxiosError } from "axios";
import Cookies from "js-cookie";
import { ErrorResponse } from "@/types";

export const useForgotPassword = () => {
  const status = useRef(true);
  const response = useMutation({
    mutationFn: (data: ForgotPasswordInterface) => forgotPassword(data),
    onSuccess: () => {
      enqueueSnackbar("Password reset email sent", {
        variant: "success",
      });
      console.log("success");

      status.current = true;
    },
    onError: () => {
      enqueueSnackbar("Failed to send password reset email", {
        variant: "error",
      });
      console.log("error");
      status.current = false;
    },
  });
  return {
    statusResponse: status.current,
    ...response,
    data: response.data || null,
  };
};

export const useLogin = () => {
  const response = useMutation({
    mutationFn: async (data: LoginInterface) => await login(data),
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

export const useRegister = () => {
  const response = useMutation({
    mutationFn: (data: RegisterInterface) => {
      if (data.password.length < 6) {
        enqueueSnackbar("Mật khẩu phải có ít nhất 6 ký tự!", {
          variant: "error",
        });
        throw new Error("Mật khẩu không khớp");
      }
      return register(data);
    },
    onSuccess: () => {
      enqueueSnackbar("Đăng ký thành công!", { variant: "success" });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data,
  };
};

export const useUpdatePassword = () => {
  const status = useRef(false);
  const response = useMutation({
    mutationFn: (data: UpdatePasswordInterface) =>
      updatePassword(data.email, data.code, data.password),
    onSuccess: () => {
      enqueueSnackbar("Password updated successfully", {
        variant: "success",
      });
      status.current = true;
    },
    onError: () => {
      enqueueSnackbar("Failed to update password", {
        variant: "error",
      });
      status.current = false;
    },
  });
  return {
    statusResponse: status.current,
    ...response,
    data: response.data || null,
  };
};

export const useVerifyRegister = () => {
  const response = useMutation({
    mutationFn: (data: VerifyRegisterInterface) => verifyRegister(data),
    onSuccess: () => {
      enqueueSnackbar("Verification successful", {
        variant: "success",
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });
  return response;
};
