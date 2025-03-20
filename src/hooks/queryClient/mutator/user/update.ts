import { UserService } from "../../../../api/service/user.service";
import { UserType } from "../../../../types/user";
import { useMutation } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const response = useMutation({
    mutationFn: (data: UserType) => UserService.updateUser(data),
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};
