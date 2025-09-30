import { useQuery } from "@tanstack/react-query";
import { 
  getProductVariants, 
  getProductVariantById, 
  getProductVariantByProductId, 
  getProductVariantBySlug,
  GetProductVariantsParams
} from "@/lib/api/service/product.variant.service";
import { ProductVariantResponse } from "@/shared/types/product-varitant";

export const useProductVariants = ( params?: GetProductVariantsParams ) => {
  const response = useQuery({
    queryKey: ["product-variants"],
    queryFn: () => getProductVariants(params),
  });
  return {
    ...response,
    data: response.data?.data as ProductVariantResponse[] || [],
    total: response.data?.total,
  };
};

export const useProductVariantById = (id: string) => {
  return useQuery<ProductVariantResponse>({
    queryKey: ["product-variant", id],
    queryFn: () => getProductVariantById(id),
    enabled: !!id,
  });
};

export const useProductVariantByProductId = (productId: string) => {
  const response = useQuery({
    queryKey: ["product-variants", "product", productId],
    queryFn: () => getProductVariantByProductId(productId),
    enabled: !!productId,
  });
  return {
    ...response,
    data: response.data?.data as ProductVariantResponse[] || [],
  };
};

export const useProductVariantBySlug = (slug: string) => {
  const response = useQuery({
    queryKey: ["product-variant", "slug", slug],
    queryFn: () => getProductVariantBySlug(slug),
    enabled: !!slug,
  });
  return {
    ...response,
    data: response.data?.data as ProductVariantResponse || null,
  };
};
  
