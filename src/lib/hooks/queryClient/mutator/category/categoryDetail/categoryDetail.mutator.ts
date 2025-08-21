import { enqueueSnackbar } from "notistack";
import {
  addCategoryDetail,
  CreateCategoryDetailInterface,
  deleteCategoryDetail,
  UpdateCategoryDetailInterface,
  updateCategoryDetail,
} from "@/lib/api/service/category.service";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/types";

export const useAddDetail = () => {
  const response = useMutation({
    mutationFn: async ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: CreateCategoryDetailInterface;
    }) => await addCategoryDetail(categoryId, data),
    onSuccess: () => {
      enqueueSnackbar("Category detail added successfully", {
        variant: "success",
      });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  return response;
};

export const useDeleteDetail = () => {
  const response = useMutation({
    mutationFn: async (id: string) => await deleteCategoryDetail(id),
    onSuccess: () => {
      enqueueSnackbar("Category detail deleted successfully", {
        variant: "success",
      });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  return response;
};

export const useEditDetail = () => {
  const response = useMutation({
    mutationFn: async ({
      categoryId,
      data,
    }: {
      categoryId: string;
      data: UpdateCategoryDetailInterface;
    }) => await updateCategoryDetail(categoryId, data),
    onSuccess: () => {
      enqueueSnackbar("Category detail updated successfully", {
        variant: "success",
      });
    },
    onError: (err: AxiosError<ErrorResponse>) => {
      const errorMessage = err.response?.data?.message?.message?.[0] || "Create comment failed";
      enqueueSnackbar(errorMessage, {
        variant: "error",
      });
    },
  });

  return response;
};
