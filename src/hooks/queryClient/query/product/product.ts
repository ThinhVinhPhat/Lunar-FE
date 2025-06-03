import {
  getProduct,
  getProductBySuggestion,
} from "../../../../api/service/product.service";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

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
