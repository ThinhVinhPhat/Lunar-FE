import instance from "..";

export const createPayment = async (orderId: string | undefined) => {
  const response = await instance.get(`/payment/${orderId}`);
  return response.data;
};

export const getSuccessPayment = async (
  orderId: string | null,
  sessionId: string | null
) => {
  const response = await instance.get(
    `/payment/success/checkout/session?order_id=${orderId}&session_id=${sessionId}`
  );
  return response.data;
};

export const getFailedPayment = async () => {
  const response = await instance.get(`/payment/failed/checkout/session`);
  return response.data;
};
