import { useProducts } from "../../lib/hooks/queryClient/query/product/product.query";
import { useGetCategories } from "../../lib/hooks/queryClient/query/category/category.query";
import { useGetUser } from "../../lib/hooks/queryClient/query/user/user.query";
import { useFavoriteProduct } from "../../lib/hooks/queryClient/mutator/product/product.mutator";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

export const useProductAction = (page = 1, limit = 10, category: string | null = null) => {
  const { data: user } = useGetUser();
  const navigate = useNavigate();
  const { products, isLoading, refetch, total } = useProducts({
    page,
    limit,
    userId: user?.id,
    category: category ? [category] : undefined,
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
    total,
  };
};


