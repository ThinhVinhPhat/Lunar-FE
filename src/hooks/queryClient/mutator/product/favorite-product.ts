import { useMutation } from "@tanstack/react-query";
import { favoriteProduct } from "@/api/service/product.service";
import { useQueryClient } from "@tanstack/react-query";
import { enqueueSnackbar } from "notistack";

export const useFavoriteProduct = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (productId: string | undefined) => favoriteProduct(productId),
    onSuccess: (variables) => {
      enqueueSnackbar("Product added to favorite", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.refetchQueries({ queryKey: ["product", variables] });
    },
    onError: (error) => {
      console.log(error);
      enqueueSnackbar("Failed to add product to favorite", {
        variant: "error",
      });
    },
  });

  return response;
};
