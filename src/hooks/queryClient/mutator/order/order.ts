import { useMutation } from "@tanstack/react-query";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  updateOrder,
  updateOrderStatus,
} from "../../../../api/service/order.service";
import { CreateOrderProps } from "../../../../types/order";
import { enqueueSnackbar } from "notistack";

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

export const useCancelOrder = () => {
  const response = useMutation({
    mutationFn: async (orderId: string | undefined) =>
      await cancelOrder(orderId),
    onSuccess: () => {
      enqueueSnackbar("Order cancelled successfully", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Order cancelled failed", {
        variant: "error",
      });
    },
  });
  return response;
};

interface UpdateOrderProps {
  orderDetailId: string;
  orderId: string;
  productId: string;
  quantity: number;
}

export const useUpdateOrder = () => {
  const response = useMutation({
    mutationFn: async (data: UpdateOrderProps) =>
      await updateOrder(
        data.orderDetailId,
        data.orderId,
        data.productId,
        data.quantity
      ),
    onSuccess: () => {
      enqueueSnackbar("Order updated successfully", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Order updated failed", {
        variant: "error",
      });
    },
  });
  return response;
};

export const useUpdateOrderStatus = () => {
  const response = useMutation({
    mutationFn: async (data: {
      orderId: string;
      status: string;
      description: string;
    }) => await updateOrderStatus(data.orderId, data.status, data.description),
    onSuccess: () => {
      enqueueSnackbar("Order status updated successfully", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Order status updated failed", {
        variant: "error",
      });
    },
  });
  return response;
};

export const useDeleteOrder = () => {
  const response = useMutation({
    mutationFn: async (orderId: string) => await deleteOrder(orderId),
    onSuccess: () => {
      enqueueSnackbar("Order deleted successfully", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Order deleted failed", {
        variant: "error",
      });
    },
  });
  return response;
};
