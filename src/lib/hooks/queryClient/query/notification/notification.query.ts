import { getAllNotification, getNotificationByUser } from "@/lib/api/service/notification.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllNotification = (
  name: string = "",
  page: number = 1,
  limit: number = 5,
  roles: string[] = []
) => {
  const response = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotification(name, page, limit, roles),
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};

export const useGetNotificationByUser = (
    page: number = 1,
    limit: number = 5
  ) => {
    const response = useQuery({
      queryKey: ["notifications", "user"],
      queryFn: () => getNotificationByUser(page, limit),
    });
  
    return {
      ...response,
      data: response?.data || null,
    };
  };
  