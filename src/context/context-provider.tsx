import { useGetUser } from "../hooks/queryClient/query/user";
import { OrderDetail } from "@/types/order";
import { Order } from "@/types/order";
import { UserType } from "@/types/user";
import { createContext, useEffect, useMemo, useState } from "react";
import { useCreateOrder } from "../hooks/queryClient/mutator/order/order";
import i18n from "../i18n";
type ContextType = {
  isLogin: boolean | UserType;
  isAdmin: boolean;
  currentLanguage: string;
  isOpenSearch: boolean;
  isOpenCart: boolean;
  cart: Order | undefined;
  cartItems: OrderDetail[];
  setIsLogin: (value: boolean) => void;
  setIsAdmin: (value: boolean) => void;
  setCurrentLanguage: (value: string) => void;
  setIsOpenSearch: (value: boolean) => void;
  setIsOpenCart: (value: boolean) => void;
  setCart: (value: Order | undefined) => void;
  setCartItems: (value: OrderDetail[]) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpenCart, setIsOpenCart] = useState(false);
  const [cart, setCart] = useState<Order>();
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [cartItems, setCartItems] = useState<OrderDetail[]>([]);
  const { data: user } = useGetUser();
  const { data: order, mutateAsync: mutateOrder } = useCreateOrder();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language);
  useEffect(() => {
    if (user?.firstName && user?.lastName) {
      setIsLogin(true);
    }
    if (user?.role === "admin") {
      setIsAdmin(true);
    }
  }, [user]);

  useEffect(() => {
    const fetchCart = async () => {
      if (isLogin && user) {
        await mutateOrder({
          shippingAddress: user?.address || "",
          shipPhone: user?.phone || "",
          shippingFee: 0,
          note: "",
        });
      }
    };
    fetchCart();
  }, [isLogin, mutateOrder, user]);

  useEffect(() => {
    if (order) {
      setCart(order);
    }
  }, [order]);

  const memorizedValue = useMemo(() => {
    return {
      isLogin,
      isAdmin,
      isOpenSearch,
      isOpenCart,
      cart,
      cartItems,
      currentLanguage,
      setCurrentLanguage,
      setIsLogin,
      setIsAdmin,
      setIsOpenSearch,
      setIsOpenCart,
      setCart,
      setCartItems,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpenSearch,
    isOpenCart,
    cart,
    cartItems,
    isLogin,
    isAdmin,
    currentLanguage,
  ]);

  return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
};
