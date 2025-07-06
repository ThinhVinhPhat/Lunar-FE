import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateNotificationStatus } from "../../../../api/service/notification.service";
import { enqueueSnackbar } from "notistack";

export default function useUpdateNotificationStatus() {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (id: string) => updateNotificationStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "user"] });
    },
    onError: () => {
      enqueueSnackbar("Failed to update notification status", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
}
