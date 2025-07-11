import { useMutation } from "@tanstack/react-query";
import { deleteCategory } from "@/api/service/category.service";
import { enqueueSnackbar } from "notistack";

export const useDeleteCategory = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await deleteCategory(data),
    onSuccess: () => {
      enqueueSnackbar("Category deleted successfully", {
        variant: "success",
      });
    },
    onError: (err: any) => {
      console.log(err);
      enqueueSnackbar(err.message, {
        variant: "error",
      });
    },
  });

  return response;
};
