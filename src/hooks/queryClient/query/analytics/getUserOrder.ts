import { useQuery } from "@tanstack/react-query";
import { getUserOrder } from "../../../../api/service/analytic.service";
import { OrderFilterEnum } from "../../../../types/analytic";

export const useGetUserOrder = (
  offset: number,
  limit: number,
  sort: OrderFilterEnum
) => {
  const response = useQuery({
    queryKey: ["user-order", offset, limit, sort],
    queryFn: () => getUserOrder(offset, limit, sort),
  });
  return {
    ...response,
    data: response.data?.data || [],
  };
};
