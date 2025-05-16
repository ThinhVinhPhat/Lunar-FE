import { useMutation } from "@tanstack/react-query";
import { updateUserAdmin } from "../../../../api/service/user.service";
import { enqueueSnackbar } from "notistack";

export const useUpdateUserAdmin = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await updateUserAdmin(data),
    onSuccess: () => {
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

  return response;
};
