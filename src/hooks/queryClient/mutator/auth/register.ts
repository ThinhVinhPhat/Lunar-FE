import { register } from "../../../../../src/api/service/auth.service";
import { IRegister } from "@/src/types/register";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";
import { useRef } from "react";
export const useRegister = () => {
  const status = useRef(false);
  const response =  useMutation({
    mutationFn: (data: IRegister) => {
      if(data.password.length < 6) {
        enqueueSnackbar('Mật khẩu phải có ít nhất 6 ký tự!', { variant: 'error' });
        throw new Error("Mật khẩu không khớp");
      }
      return register(data.email, data.password, data.first_name, data.last_name);
    },
    onSuccess: () => {
      enqueueSnackbar('Đăng ký thành công!', { variant: 'success' });
      status.current = true;
    },
    onError: (error) => {
      enqueueSnackbar('Đăng ký thất bại do email đã tồn tại!', { variant: 'error' });
      console.log(error);
      status.current = false;
    },
  });
  return {
    responseStatus: status.current,
    ...response,
    data: response.data,
  }
};  