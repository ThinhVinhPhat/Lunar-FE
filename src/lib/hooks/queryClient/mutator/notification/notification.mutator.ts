import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotification,
  CreateNotificationParams,
  deleteNotification,
  updateNotification,
  updateNotificationStatus,
} from "@/lib/api/service/notification.service";
import { UpdateNotificationParams } from "@/lib/api/service/notification.service";
import { enqueueSnackbar } from "notistack";

export const useCreateNotification = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (data: CreateNotificationParams) => createNotification(data),
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

export const useUpdateNotification = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateNotificationParams;
    }) => updateNotification(id, data),
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

export const useUpdateNotificationStatus = () => {
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
