import { useMutation } from "@tanstack/react-query";
import { deleteUser } from "../../../../api/service/user.service";
import { enqueueSnackbar } from "notistack";

export const useDeleteUser = () => {
  const response = useMutation({
    mutationFn: async (id: string) => await deleteUser(id),
    onSuccess: () => {
      enqueueSnackbar("User deleted successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete user", {
        variant: "error",
      });
    },
  });
  return response;
};
