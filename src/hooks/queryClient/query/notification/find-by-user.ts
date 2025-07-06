import { getNotificationByUser } from "../../../../api/service/notification.service";
import { useQuery } from "@tanstack/react-query";

export const useGetNotificationByUser = (
  offset: number = 0,
  limit: number = 5
) => {
  const response = useQuery({
    queryKey: ["notifications", "user"],
    queryFn: () => getNotificationByUser(offset, limit),
  });

  return {
    ...response,
    data: response?.data || null,
  };
};
