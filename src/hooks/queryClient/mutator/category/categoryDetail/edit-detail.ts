import { useMutation } from "@tanstack/react-query";
import { updateCategoryDetail } from "../../../../../api/service/category.service";
import { enqueueSnackbar } from "notistack";

export const useEditDetail = () => {
  const response = useMutation({
    mutationFn: (data: any) => updateCategoryDetail(data),
    onSuccess: () => {
      enqueueSnackbar("Category detail updated successfully", {
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
