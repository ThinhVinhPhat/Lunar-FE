import { getOrdersByStatus } from "@/api/service/order.service";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderList = (
  status: string,
  page: number,
  limit: number
) => {
  const response = useQuery({
    queryKey: ["order", status, page, limit],
    queryFn: () => getOrdersByStatus(status, page, limit),
  });
  return {
    ...response,
    data: response?.data?.data || [],
    total: response?.data?.meta?.total || 0,
    totalPage: response?.data?.meta?.totalPages || 0,
  };
};
