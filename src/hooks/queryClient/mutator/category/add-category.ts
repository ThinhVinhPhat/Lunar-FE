import { enqueueSnackbar } from "notistack";
import { addCategory } from "@/api/service/category.service";
import { useMutation } from "@tanstack/react-query";

export const useAddCategory = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await addCategory(data),
    onSuccess: () => {
      enqueueSnackbar("Category added successfully", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      console.log(error);
      enqueueSnackbar("Failed to add category", {
        variant: "error",
      });
    },
  });

  return response;
};
