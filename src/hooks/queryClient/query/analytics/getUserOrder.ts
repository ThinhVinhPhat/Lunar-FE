import { useQuery } from "@tanstack/react-query";
import { getUserOrder } from "@/api/service/analytic.service";
import { OrderFilterEnum } from "@/types/analytic";

export const useGetUserOrder = (
  page: number,
  limit: number,
  sort: OrderFilterEnum
) => {
  const response = useQuery({
    queryKey: ["user-order", page, limit, sort],
    queryFn: () => getUserOrder(page, limit, sort),
  });
  return {
    ...response,
    data: response.data || [],
  };
};
