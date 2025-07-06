import { updateNotification } from "../../../../api/service/notification.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateNotification(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user"] });
      enqueueSnackbar("Notification updated successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to update notification", {
        variant: "error",
      });
    },
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};
