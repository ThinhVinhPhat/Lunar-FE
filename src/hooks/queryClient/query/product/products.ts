import { getProducts } from "@/api/service/product.service";
import { useQuery } from "@tanstack/react-query";

type DataProp = {
  category?: string[];
  page?: number;
  limit?: number;
  userId?: string;
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
