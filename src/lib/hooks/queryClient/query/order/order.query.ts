import { useQuery } from "@tanstack/react-query";
import { getOrderById, getOrdersByStatus } from "@/lib/api/service/order.service";

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
  