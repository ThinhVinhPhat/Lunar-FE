import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { OrderDetail } from "@/types/order";
import { Order } from "@/types/order";
import { UserType } from "@/types/user";
import { createContext, useEffect, useMemo, useRef, useState } from "react";
import Cookies from "js-cookie";
import { Socket, io } from "socket.io-client";
import { useCreateOrder } from "@/lib/hooks/queryClient/mutator/order/order";
import i18n from "@/i18n";
type ContextType = {
  isLogin: boolean | UserType;
  isAdmin: boolean;
  user: UserType | undefined;
  currentLanguage: string;
  isOpenSearch: boolean;
  isOpenCart: boolean;
  cart: Order | undefined;
  cartItems: OrderDetail[];
  socketRef: React.MutableRefObject<Socket | null>;
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
  const socketRef = useRef<Socket | null>(null);
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

  useEffect(() => {
    const socket = io("http://localhost:3100", {
      auth: { token: Cookies.get("accessToken") },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to server");
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Connect error:", err.message);
    });

    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const memorizedValue = useMemo(() => {
    return {
      isLogin,
      isAdmin,
      socketRef,
      isOpenSearch,
      isOpenCart,
      cart,
      cartItems,
      user,
      currentLanguage,
      setCurrentLanguage,
      setIsLogin,
      setIsAdmin,
      setIsOpenSearch,
      setIsOpenCart,
      setCart,
      setCartItems,
    };
     
  }, [
    isOpenSearch,
    isOpenCart,
    cart,
    cartItems,
    isLogin,
    user,
    socketRef,
    isAdmin,
    currentLanguage,
  ]);

  return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
};
