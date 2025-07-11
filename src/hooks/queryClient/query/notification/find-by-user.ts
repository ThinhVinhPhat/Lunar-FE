import { getNotificationByUser } from "@/api/service/notification.service";
import { useQuery } from "@tanstack/react-query";

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
