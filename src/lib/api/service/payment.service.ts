import { API_URL } from "@/lib/config/api.config";
import instance from "..";

export const createPayment = async (orderId: string | undefined) => {
  const response = await instance.get(
    API_URL.PAYMENTS.CREATE(orderId as string)
  );
  return response.data;
};

export const getSuccessPayment = async (
  orderId: string | null,
  sessionId: string | null
) => {
  const response = await instance.get(
    API_URL.PAYMENTS.SUCCESS(orderId as string, sessionId as string)
  );
  return response.data;
};

export const getFailedPayment = async () => {
  const response = await instance.get(API_URL.PAYMENTS.FAILED);
  return response.data;
};
