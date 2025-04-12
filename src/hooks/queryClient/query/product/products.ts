import { getProducts } from "../../../../api/service/product.service";
import { useQuery } from "@tanstack/react-query";

type DataProp = {
  category?: string[];
  offset?: number;
  limit?: number;
};

export const useProducts = (data?: DataProp) => {
  const response = useQuery({
    queryKey: ["products", data?.category, data?.offset, data?.limit],
    queryFn: () => getProducts(data?.category, data?.offset, data?.limit),
  });

  return {
    ...response,
    products: response.data?.data || [],
  };
};
