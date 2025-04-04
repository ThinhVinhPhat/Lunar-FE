import { useMutation } from "@tanstack/react-query";
import { createOrder } from "../../../../api/service/order.service";
import { CreateOrderProps } from "../../../../types/order";

export const useCreateOrder = () => {
  const response = useMutation({
    mutationKey: ["create-order"],
    mutationFn: (order: CreateOrderProps) => createOrder(order),
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};
