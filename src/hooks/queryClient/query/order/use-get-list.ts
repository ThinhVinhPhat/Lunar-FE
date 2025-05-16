import { getOrdersByStatus } from "../../../../api/service/order.service";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderList = (
  status: string,
  offset: number,
  limit: number
) => {
  const response = useQuery({
    queryKey: ["order", status, offset, limit],
    queryFn: () => getOrdersByStatus(status, offset, limit),
  });
  return {
    ...response,
    data: response?.data?.data || [],
  };
};
