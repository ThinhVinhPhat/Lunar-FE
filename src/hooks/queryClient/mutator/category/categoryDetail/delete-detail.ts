import { deleteCategoryDetail } from "../../../../../api/service/category.service";
import { useMutation } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useDeleteDetail = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await deleteCategoryDetail(data),
    onSuccess: () => {
      enqueueSnackbar("Category detail deleted successfully", {
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
