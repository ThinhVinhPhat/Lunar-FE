import { enqueueSnackbar } from "notistack";
import { UserService } from "../../../../api/service/user.service";
import { UserType } from "../../../../types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (data: UserType) => UserService.updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      enqueueSnackbar("User updated successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to update user", {
        variant: "error",
      });
    },
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};
