import { getProducts } from "../../../../api/service/product.service";
import { useQuery } from "@tanstack/react-query";

type DataProp = {
  category?: string[];
  offset?: number;
  limit?: number;
  userId?: string;
};

export const useProducts = (data?: DataProp) => {
  const response = useQuery({
    queryKey: [
      "products",
      data?.category,
      data?.offset,
      data?.limit,
      data?.userId,
    ],
    queryFn: () =>
      getProducts(data?.category, data?.offset, data?.limit, data?.userId),
  });

  return {
    ...response,
    products: response.data?.data || [],
    total: response.data?.total || 0,
  };
};
