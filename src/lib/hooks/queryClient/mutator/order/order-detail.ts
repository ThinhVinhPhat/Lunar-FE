import { useMutation } from "@tanstack/react-query";
import { createOrderDetail } from "@/lib/api/service/order.service";

export const useOrderDetail = () => {
  const response = useMutation({
    mutationKey: ["order-detail"],
    mutationFn: (orderDetail: {
      orderId: string;
      productId: string;
      quantity: number;
    }) => createOrderDetail(orderDetail),
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};
