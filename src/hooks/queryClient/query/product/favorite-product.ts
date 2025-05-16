import { getFavoriteProducts } from "../../../../api/service/product.service";
import { useQuery } from "@tanstack/react-query";

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
