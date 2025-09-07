import { enqueueSnackbar } from "notistack";
import {
  addCategory,
  CreateCategoryInterface,
  deleteCategory,
} from "@/lib/api/service/category.service";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/shared/types";

export const useAddCategory = () => {
  const response = useMutation({
    mutationFn: async (data: CreateCategoryInterface) =>
      await addCategory(data),
    onSuccess: () => {
      enqueueSnackbar("Category added successfully", {
        variant: "success",
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      enqueueSnackbar("Failed to add category", {
        variant: "error",
      });
    },
  });

  return response;
};

export const useDeleteCategory = () => {
  const response = useMutation({
    mutationFn: async (id: string) => await deleteCategory(id),
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully", {
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
