import { useGetUser } from "../hooks/queryClient/query/user";
import { OrderDetail } from "@/types/order";
import { Order } from "@/types/order";
import { UserType } from "@/types/user";
import { createContext, useEffect, useMemo, useState } from "react";

type ContextType = {
  isLogin: boolean | UserType;
  isOpenSearch: boolean;
  isOpenCart: boolean;
  cart: Order | undefined;
  cartItems: OrderDetail[];
  shouldFetchCart: boolean;
  setIsLogin: (value: boolean) => void;
  setIsOpenSearch: (value: boolean) => void;
  setIsOpenCart: (value: boolean) => void;
  setCart: (value: Order | undefined) => void;
  setCartItems: (value: OrderDetail[]) => void;
  setShouldFetchCart: (value: boolean) => void;
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
  const [cartItems, setCartItems] = useState<OrderDetail[]>([]);
  const [shouldFetchCart, setShouldFetchCart] = useState(true);
  const { data: user } = useGetUser();

  useEffect(() => {
    if (user) {
      setIsLogin(true);
    }
  }, [user]);

  const memorizedValue = useMemo(() => {
    return {
      isLogin,
      isOpenSearch,
      isOpenCart,
      cart,
      cartItems,
      shouldFetchCart,
      setIsLogin,
      setIsOpenSearch,
      setIsOpenCart,
      setCart,
      setCartItems,
      setShouldFetchCart,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpenSearch, isOpenCart, cart, cartItems, isLogin, shouldFetchCart]);

  return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
};
