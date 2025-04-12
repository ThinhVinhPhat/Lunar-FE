import instance from "..";
import { CreateOrderProps } from "../../types/order";

export const getOrders = async () => {
  const response = await instance.get("/order", {});
  return response.data;
};
export const createOrder = async (order: CreateOrderProps) => {
  const response = await instance.post("/order", {
    shippingAddress: order.shippingAddress,
    shipPhone: order.shipPhone,
    shippingFee: order.shippingFee,
    note: order.note,
  });
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await instance.get(`/order/${id}`, {});
  return response.data;
};

export const createOrderDetail = async (orderDetail: {
  productId: string;
  orderId: string;
  quantity: number;
}) => {
  const response = await instance.post(
    `/order-detail?productId=${orderDetail.productId}&orderId=${orderDetail.orderId}`,
    {
      quantity: orderDetail.quantity,
    }
  );
  return response.data;
};

export const deleteOrderDetail = async (orderId: string) => {
  const response = await instance.delete(`/order-detail/${orderId}`, {});
  return response.data;
};

export const getOrdersByStatus = async (
  status: string,
  offset: number,
  limit: number
) => {
  const response = await instance.get(
    `/order?status=${status}&offset=${offset}&limit=${limit}`,
    {}
  );
  return response.data;
};

