import { useProducts } from "./queryClient/query/product/products";
import { useGetCategories } from "./queryClient/query/category";
import { useGetUser } from "./queryClient/query/user";
import { useFavoriteProduct } from "./queryClient/mutator/product/favorite-product";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const useProductAction = (offset = 0, limit = 10, ...rest: any) => {
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { category } = rest;
  const { products, isLoading, refetch } = useProducts({
    offset,
    limit,
    userId: user?.id,
    category: category || [],
  });
  const { mutateAsync: favoriteProduct } = useFavoriteProduct();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories();

  const handleFavoriteProduct = async (id: string) => {
    if (user?.id) {
      await favoriteProduct(id);
      refetch();
    } else {
      enqueueSnackbar("Please login to favorite product", { variant: "error" });
      navigate("/login");
    }
  };

  return {
    products,
    isLoading,
    categories,
    isLoadingCategories,
    handleFavoriteProduct,
    refetch,
  };
};
