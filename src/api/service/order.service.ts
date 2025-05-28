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

export const getOrderById = async (id: string | undefined) => {
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

export const cancelOrder = async (orderId: string | undefined) => {
  const response = await instance.patch(`/order/${orderId}`, {
    status: "Rejected",
  });
  return response.data;
};

export const updateOrder = async (
  orderDetailId: string,
  orderId: string,
  productId: string,
  quantity: number
) => {
  const response = await instance.patch(
    `/order-detail/${orderDetailId}?orderId=${orderId}&productId=${productId}`,
    {
      quantity: quantity,
    }
  );
  return response.data;
};

export const updateOrderStatus = async (
  orderId: string,
  status: string,
  description: string
) => {
  const response = await instance.patch(`/order/update-status/${orderId}`, {
    status: status,
    description: description,
  });
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await instance.delete(`/order/${orderId}`);
  return response.data;
};

export const createOrderShipment = async (
  orderId: string,
  data: {
    estimateDate: string;
    deliveredDate: string;
    shippingCarrier: string;
  }
) => {
  const response = await instance.post(`/order/shipment/${orderId}`, {
    estimateDate: data.estimateDate,
    deliveredDate: data.deliveredDate,
    shippingCarrier: data.shippingCarrier,
  });
  return response.data;
};

export const updateOrderAddress = async (orderId: string, address: string) => {
  const response = await instance.patch(`/order/update-address/${orderId}`, {
    shippingAddress: address,
  });
  return response.data;
};
