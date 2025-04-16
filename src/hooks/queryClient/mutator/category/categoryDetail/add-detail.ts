import { enqueueSnackbar } from "notistack"
import { addCategoryDetail } from "../../../../../api/service/category.service"
import { useMutation } from "@tanstack/react-query"

export const useAddDetail = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await addCategoryDetail(data),
    onSuccess: () => {
      enqueueSnackbar("Category detail added successfully", {
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
