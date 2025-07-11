import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNotification } from "@/api/service/notification.service";
import { enqueueSnackbar } from "notistack";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (data: any) => createNotification(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user"] });
      enqueueSnackbar("Notification created successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to create notification", {
        variant: "error",
      });
    },
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};
