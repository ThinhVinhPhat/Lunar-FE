import { useQuery } from "@tanstack/react-query";
import { getOrderById } from "../../../../api/service/order.service";

export const useGetOrderDetail = (id: string) => {
  const response = useQuery({
    queryKey: ["order-detail", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  return {
    ...response,
    data: response?.data?.data || null,
  };
};
