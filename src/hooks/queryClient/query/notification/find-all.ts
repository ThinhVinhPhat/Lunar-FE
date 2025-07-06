import { getAllNotification } from "../../../../api/service/notification.service";
import { useQuery } from "@tanstack/react-query";

export const useGetAllNotification = (
  name: string = "",
  offset: number = 0,
  limit: number = 5,
  roles: string[] = []
) => {
  const response = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getAllNotification(name, offset, limit, roles),
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};
