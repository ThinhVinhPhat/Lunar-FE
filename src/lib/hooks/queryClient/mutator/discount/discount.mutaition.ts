import { useMutation } from "@tanstack/react-query";
import {
  createDiscount,
  deleteDiscount,
  applyDiscountForUser,
  updateDiscount,
  applyDiscount,
  deleteDiscountFromOrder,
  CreateDiscountInterface,
} from "@/lib/api/service/discount.service";
import { enqueueSnackbar } from "notistack";

export const useCreateDiscount = () => {
  const response = useMutation({
    mutationFn: (data: CreateDiscountInterface) => createDiscount(data),
    onSuccess: () => {
      enqueueSnackbar("Tạo mã giảm giá thành công", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Tạo mã giảm giá thất bại", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useUpdateDiscount = () => {
  const response = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      updateDiscount(id, data),
    onSuccess: () => {
      enqueueSnackbar("Cập nhật mã giảm giá thành công", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Cập nhật mã giảm giá thất bại", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useDeleteDiscount = () => {
  const response = useMutation({
    mutationFn: (id: string) => deleteDiscount(id),
    onSuccess: () => {
      enqueueSnackbar("Xóa mã giảm giá thành công", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Xóa mã giảm giá thất bại", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useApplyDiscountForUser = () => {
  const response = useMutation({
    mutationFn: (slug: string) => applyDiscountForUser(slug),
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useApplyDiscount = () => {
  const response = useMutation({
    mutationFn: ({
      discountId,
      orderId,
    }: {
      discountId: string;
      orderId: string;
    }) => applyDiscount(discountId, orderId),
    onSuccess: () => {
      enqueueSnackbar("Áp dụng mã giảm giá thành công", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Áp dụng mã giảm giá thất bại", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};

export const useDeleteDiscountFromOrder = () => {
  const response = useMutation({
    mutationFn: ({
      discountId,
      orderId,
    }: {
      discountId: string;
      orderId: string;
    }) => deleteDiscountFromOrder(discountId, orderId),
    onSuccess: () => {
      enqueueSnackbar("Xóa mã giảm giá thành công", {
        variant: "success",
      });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Xóa mã giảm giá thất bại", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    data: response.data?.data || null,
  };
};
