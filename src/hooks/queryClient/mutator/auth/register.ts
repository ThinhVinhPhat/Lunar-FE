import { AuthType } from "@/types/user";
import { register } from "@/api/service/auth.service";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
export const useRegister = () => {
  const response = useMutation({
    mutationFn: (data: AuthType) => {
      if (data.password.length < 6) {
        enqueueSnackbar("Mật khẩu phải có ít nhất 6 ký tự!", {
          variant: "error",
        });
        throw new Error("Mật khẩu không khớp");
      }
      return register(
        data.email,
        data.password,
        data.firstName,
        data.lastName,
        "Customer"
      );
    },
    onSuccess: () => {
      enqueueSnackbar("Đăng ký thành công!", { variant: "success" });
    },
    onError: (error: any) => {
      enqueueSnackbar(error.response.data.message.message[0], {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data,
  };
};
