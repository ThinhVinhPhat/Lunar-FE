import { login } from "../../../../api/service/auth.service";
import { ILogin } from "../../../../types/login";
import { useMutation } from "@tanstack/react-query";


export const useLogin = () => {
  const response = useMutation({
    mutationFn: (data: ILogin) => login(data.email, data.password),
  })
  return {
    ...response,
    data: response.data,
  }
};
