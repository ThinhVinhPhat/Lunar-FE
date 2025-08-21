import { createPayment } from "@/lib/api/service/payment.service";
import { useQuery } from "@tanstack/react-query";

export const useCreatePayment = (orderId: string | undefined) => {
  const response = useQuery({
    queryKey: ["create-payment"],
    queryFn: () => createPayment(orderId),
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};
