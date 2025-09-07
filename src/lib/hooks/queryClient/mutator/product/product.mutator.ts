import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct, CreateProductParams, deleteProduct, favoriteProduct, updateProduct, UpdateProductParams } from "@/lib/api/service/product.service";
import { enqueueSnackbar } from "notistack";

export const useAddProduct = () => {
  const response = useMutation({
    mutationFn: async (data: CreateProductParams) => await addProduct(data),
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


export const useUpdateProduct = () => {
  const response = useMutation({
    mutationFn: async (data: UpdateProductParams) => await updateProduct(data),
    onSuccess: () => {
      enqueueSnackbar("Product updated successfully", {
        variant: "success",
      });
    },
    onError: () => {
      enqueueSnackbar("Failed to update product", {
        variant: "error",
      });
    },
  });
  return {
    ...response,
    isPending: response.isPending,
  };
};


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
  return {
    ...response,
  };
};



export const useFavoriteProduct = () => {
  const queryClient = useQueryClient();
  const response = useMutation({
    mutationFn: (productId: string | undefined) => favoriteProduct(productId),
    onSuccess: () => {
      enqueueSnackbar("Product added to favorite", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
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
