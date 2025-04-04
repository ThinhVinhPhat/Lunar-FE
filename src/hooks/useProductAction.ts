import { useEffect } from "react";
import { useProducts } from "./queryClient/query/product/products";
import { useGetCategories } from "./queryClient/query/category";
import { useCreateOrder } from "./queryClient/mutator/order/order";
import { useContextProvider } from "./useContextProvider";
import { useGetUser } from "./queryClient/query/user";

export const useProductAction = () => {
  const { isLogin, setShouldFetchCart, setCart, shouldFetchCart } = useContextProvider();
  const { data: user } = useGetUser();
  const { products, isLoading } = useProducts();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories();
  const { data: order, mutate: mutateOrder } = useCreateOrder();

  useEffect(() => {
    const fetchCart = async () => {
      if (isLogin && user) {
        mutateOrder({
          shippingAddress: user?.address || "",
          shipPhone: user?.phone || "",
          shippingFee: 0,
          note: "",
        });
        setShouldFetchCart(false);
      }
    };
    fetchCart();
  }, [isLogin, mutateOrder, shouldFetchCart]);

  useEffect(() => {
    if (order) {
      setCart(order);
    }
  }, [order, shouldFetchCart]);

  return {
    products,
    isLoading,
    categories,
    isLoadingCategories,
    order,
  };
};
