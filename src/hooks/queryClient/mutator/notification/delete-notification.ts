import { deleteNotification } from "../../../../api/service/notification.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (id: string) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user"] });
      enqueueSnackbar("Notification deleted successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete notification", {
        variant: "error",
      });
    },
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};
