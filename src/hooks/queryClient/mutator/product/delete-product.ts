import { useMutation } from "@tanstack/react-query";
import { deleteProduct } from "../../../../api/service/product.service";
import { enqueueSnackbar } from "notistack";

export const useDeleteProduct = () => {
  const response = useMutation({
    mutationFn: (id: string | undefined) => deleteProduct(id),
    onSuccess: () => {
      enqueueSnackbar("Product deleted successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to delete product", {
        variant: "error",
      });
    },
  });
  return response;
};
