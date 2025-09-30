import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  createProductVariant, 
  updateProductVariant, 
  deleteProductVariant, 
  updateProductVariantFavorite
} from "@/lib/api/service/product.variant.service";
import { enqueueSnackbar } from "notistack";
import { AddVariantForm } from "@/pages/admin/product/modals/AddVariant";
export const useCreateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<AddVariantForm>) => createProductVariant(data as AddVariantForm),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      enqueueSnackbar("Product variant created successfully!", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to create product variant", {
        variant: "error",
      });
    },
  });
};

export const useUpdateProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<AddVariantForm> }) => 
      updateProductVariant(id, data as AddVariantForm),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["product-variant", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      enqueueSnackbar("Product variant updated successfully!", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to update product variant", {
        variant: "error",
      });
    },
  });
};

export const useDeleteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProductVariant(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      enqueueSnackbar("Product variant deleted successfully!", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to delete product variant", {
        variant: "error",
      });
    },
  });
};

export const useFavoriteProductVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => updateProductVariantFavorite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["product-variants"] });
      queryClient.invalidateQueries({ queryKey: ["product-variant"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["favorite"] });
      enqueueSnackbar("Product variant favorited successfully!", {
        variant: "success",
      });
    },
    onError: (error: any) => {
      enqueueSnackbar(error?.response?.data?.message || "Failed to favorite product variant", {
        variant: "error",
      });
    },
  });
}