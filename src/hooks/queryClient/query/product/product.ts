import { getProduct } from "../../../../api/service/product.service";
import { useQuery } from "@tanstack/react-query";

export const useProduct = (slug: string | undefined) => {
  const response = useQuery({
    queryKey: ["product" + slug],
    queryFn: () => getProduct(slug),
  });

  return {
    ...response,
    product: response.data?.data || null,
  };
};
