import { getOrderById } from "../../../../api/service/order.service";
import { useQuery } from "@tanstack/react-query";

export const useGetOrderById = (id: string | undefined) => {
  const response = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
  });

  return {
    ...response,
    data: response.data?.data || null,
  };
};
