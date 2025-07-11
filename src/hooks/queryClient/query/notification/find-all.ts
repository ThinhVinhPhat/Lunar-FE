import { getAllNotification } from "@/api/service/notification.service";
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
