import { useProducts } from "./queryClient/query/product/products";
import { useGetCategories } from "./queryClient/query/category";

export const useProductAction = () => {
  const { products, isLoading } = useProducts({
    offset: 0,
    limit: 10,
  });
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories();


  return {
    products,
    isLoading,
    categories,
    isLoadingCategories,
  };
};
