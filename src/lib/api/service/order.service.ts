  import { API_URL } from "@/lib/config/api.config";
import instance from "..";
import { CreateOrderProps } from "@/shared/types/order";

export const getOrders = async (page: number, limit: number) => {
  const response = await instance.get(API_URL.ORDERS.LIST(page, limit));
  return response.data;
};
export const createOrder = async (order: CreateOrderProps) => {
  const response = await instance.post(API_URL.ORDERS.CREATE, {
    shippingAddress: order.shippingAddress,
    shipPhone: order.shipPhone,
    shippingFee: order.shippingFee,
    note: order.note,
  });
  return response.data;
};

export const getOrderById = async (id: string | undefined) => {
  const response = await instance.get(API_URL.ORDERS.DETAIL(id as string));
  return response.data;
};

export const createOrderDetail = async (orderDetail: {
  productId: string;
  orderId: string;
  quantity: number;
}) => {
  const response = await instance.post(
    API_URL.ORDER_DETAILS.CREATE(orderDetail.productId, orderDetail.orderId),
    {
      quantity: orderDetail.quantity,
    }
  );
  return response.data;
};

export const deleteOrderDetail = async (orderId: string) => {
  const response = await instance.delete(API_URL.ORDER_DETAILS.DELETE(orderId));
  return response.data;
};

export const getOrdersByStatus = async (
  status: string,
  page: number,
  limit: number
) => {
  const response = await instance.get(
    API_URL.ORDERS.LIST_BY_STATUS(status, page, limit),
    {}
  );
  return response.data;
};

export const cancelOrder = async (orderId: string | undefined) => {
  const response = await instance.patch(API_URL.ORDERS.CANCEL(orderId as string), {
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
    API_URL.ORDER_DETAILS.UPDATE(orderDetailId, orderId, productId),
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
  const response = await instance.patch(API_URL.ORDERS.UPDATE_STATUS(orderId), {
    status: status,
    description: description,
  });
  return response.data;
};

export const deleteOrder = async (orderId: string) => {
  const response = await instance.delete(API_URL.ORDERS.DELETE(orderId));
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
  const response = await instance.post(API_URL.ORDERS.SHIPMENT(orderId), {
    estimateDate: data.estimateDate,
    deliveredDate: data.deliveredDate,
    shippingCarrier: data.shippingCarrier,
  });
  return response.data;
};

export const updateOrderAddress = async (orderId: string, address: string) => {
  const response = await instance.patch(API_URL.ORDERS.UPDATE_ADDRESS(orderId), {
    shippingAddress: address,
  });
  return response.data;
};
