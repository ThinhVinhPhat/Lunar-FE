import { useMutation } from "@tanstack/react-query";
import { addProduct } from "../../../../api/service/product.service";
import { enqueueSnackbar } from "notistack";

export const useAddProduct = () => {
  const response = useMutation({
    mutationFn: async (data: any) => await addProduct(data),
    onSuccess: () => {
      enqueueSnackbar("Product added successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to add product", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    isPending: response.isPending,
  };
};
