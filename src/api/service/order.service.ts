import instance from "..";
import { CreateOrderProps } from "../../types/order";
import Cookies from "js-cookie";

export const getOrders = async () => {
  const response = await instance.get("/order", {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return response.data;
};
export const createOrder = async (order: CreateOrderProps) => {
  const response = await instance.post(
    "/order",
    {
      shippingAddress: order.shippingAddress,
      shipPhone: order.shipPhone,
      shippingFee: order.shippingFee,
      note: order.note,
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await instance.get(`/order/${id}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
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
    },
    {
      headers: {
        Authorization: `Bearer ${Cookies.get("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const deleteOrderDetail = async (orderId: string) => {
  const response = await instance.delete(`/order-detail/${orderId}`, {
    headers: {
      Authorization: `Bearer ${Cookies.get("accessToken")}`,
    },
  });
  return response.data;
};
