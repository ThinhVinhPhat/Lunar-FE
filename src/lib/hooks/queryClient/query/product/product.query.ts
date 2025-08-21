import { getFavoriteProducts, getProduct, getProductBySuggestion, getProducts } from "@/lib/api/service/product.service";
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
    data: response.data?.data || [],
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
      product: response.data?.data || null,
    };
  };
  
  export const useProductBySuggestion = (suggestion: string) => {
    const response = useQuery({
      queryKey: ["product-suggestion", suggestion],
      queryFn: () => getProductBySuggestion(suggestion),
      enabled: !!suggestion,
    });
    return response;
  };
  
  
  export const useProducts = (data?: DataProp) => {
    const response = useQuery({
      queryKey: [
        "products",
        data?.category,
        data?.page,
        data?.limit,
        data?.userId,
      ],
      queryFn: () =>
        getProducts(data?.category, data?.page, data?.limit, data?.userId),
    });
  
    return {
      ...response,
      products: response.data?.data || [],
      total: response.data?.meta.total || 0,
    };
  };