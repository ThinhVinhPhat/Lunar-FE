import { getProduct, getProducts, getFavoriteProducts, getProductBySuggestion } from "@/lib/api/service/product.service";
import { Product, FavoriteProductInterface } from "@/shared/types/product";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type DataProp = {
    category?: string[];
    page?: number;
    limit?: number;
    userId?: string;
  };

export const useGetFavoriteProducts = () => {
  const response = useQuery({
    queryKey: ["favorite"],
    queryFn: () => getFavoriteProducts(),
  });
  return {
    ...response,
    data: response.data?.data as FavoriteProductInterface[] || [],
  };
};

export const useProduct = (slug: string | undefined, userId?: string) => {
    const queryClient = useQueryClient();
    const response = useQuery({
      queryKey: ["product", slug, userId],
      queryFn: () => getProduct(slug, userId),
      enabled: !!slug,
    });
  
    if (response.data) {
      queryClient.invalidateQueries({ queryKey: ["summary"] });
    }
  
    return {
      ...response,
      product: response.data?.data as Product || null,
    };
  };
  
  export const useProductBySuggestion = (suggestion: string, page?: number, limit?: number) => {
    const response = useQuery({
      queryKey: ["product-suggestion", suggestion, page, limit],
      queryFn: () => getProductBySuggestion({ suggestion, page: page ?? 1, limit: limit ?? 20 }),
      enabled: !!suggestion,
    });
    return {
      ...response,
      products: response.data?.data as Product[] || [],
    };
  };
  
  
  export const useProducts = (data?: DataProp) => {
    const response = useQuery({
      queryKey: [
        "products",
        data?.category?.join(","),
        data?.page ?? 1,
        data?.limit ?? 20,
        data?.userId,
      ],
      queryFn: () =>
        getProducts({ category: data?.category, page: data?.page ?? 1, limit: data?.limit ?? 20, userId: data?.userId }),
    });
  
    return {
      ...response,
      products: response.data?.data as Product[] || [],
      total: response.data?.meta.total || 0,
    };
  };