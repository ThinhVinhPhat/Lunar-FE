import { createContext, useEffect, useMemo, useState } from "react";
import { useProducts } from "../hooks/queryClient/query/product/products";
import { useLogin } from "../hooks/queryClient/mutator/auth/login";
import Cookies from "js-cookie";
import { ProductType } from "../types/product";
import { IRegister } from "../types/register";
import { useRegister } from "../hooks/queryClient/mutator/auth/register";
import { useGetUser } from "../hooks/queryClient/query/user";
import { UserType } from "../types/user";
import { useGetCategories } from "../hooks/queryClient/query/category";
import { Category } from "../types/category";
import { useForgotPassword } from "../hooks/queryClient/mutator/auth/forgot";
import { useUpdatePassword } from "../hooks/queryClient/mutator/auth/update-password";
type ContextType = {
  products: ProductType[] | null;
  isLoading: boolean;
  handleRegister: (formData: IRegister) => Promise<boolean>;
  handleLogin: (email: string, password: string) => Promise<boolean>;
  isPendingRegister: boolean;
  isPendingLogin: boolean;
  currentUser: UserType | null;
  handleLogout: () => void;
  categories: Category[] | null;
  isLoadingCategories: boolean;
  handleForgotPassword: (email: string) => Promise<boolean>;
  handleUpdatePassword: (
    email: string,
    code: string,
    password: string
  ) => Promise<boolean>;
  isOpenSearch: boolean;
  setIsOpenSearch: (value: boolean) => void;
};

export const Context = createContext<ContextType | undefined>(undefined);

export const ContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isOpenSearch, setIsOpenSearch] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const {
    isPending: isPendingLogin,
    mutate: mutateLogin,
    responseStatus: responseStatusLogin,
  } = useLogin();
  const {
    isPending: isPendingRegister,
    mutate: mutateRegister,
    responseStatus: responseStatusRegister,
  } = useRegister();
  const { mutate: mutateForgotPassword, statusResponse: statusForgotPassword } =
    useForgotPassword();
  const { products, isLoading } = useProducts();
  const { data: user } = useGetUser();
  const { data: categories, isLoading: isLoadingCategories } =
    useGetCategories();
  const { mutate: mutateUpdatePassword, statusResponse: statusUpdatePassword } =
    useUpdatePassword();

  useEffect(() => {
    if (user) {
      setCurrentUser(user);
    }
  }, [user]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await mutateLogin({ email, password });
      return responseStatusLogin;
    } catch (error) {
      console.log(error);
      return responseStatusLogin;
    }
  };

  const handleRegister = async (formData: IRegister) => {
    try {
      await mutateRegister(formData);
      return responseStatusRegister;
    } catch (error) {
      console.log(error);
      return responseStatusRegister;
    }
  };

  const handleLogout = () => {
    try {
      const confirmLogout = confirm("Are you sure you want to logout?");
      if (confirmLogout) {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setCurrentUser(null);
      }
      alert("Logout successful");
    } catch (error) {
      console.log(error);
    }
  };

  const handleForgotPassword = async (email: string) => {
    try {
      await mutateForgotPassword(email);
      return statusForgotPassword;
    } catch (error) {
      console.log(error);
      return statusForgotPassword;
    }
  };

  const handleUpdatePassword = async (
    email: string,
    code: string,
    password: string
  ) => {
    try {
      await mutateUpdatePassword({ email, code, password });
      return statusUpdatePassword;
    } catch (error) {
      console.log(error);
      return statusUpdatePassword;
    }
  };

  const memorizedValue = useMemo(() => {
    return {
      isOpenSearch,
      setIsOpenSearch,
      products,
      categories,
      isLoading,
      isLoadingCategories,
      handleRegister,
      handleLogin,
      isPendingRegister,
      isPendingLogin,
      currentUser,
      handleLogout,
      handleForgotPassword,
      handleUpdatePassword,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isOpenSearch,
    products,
    isLoading,
    isPendingRegister,
    isPendingLogin,
    currentUser,
    categories,
    isLoadingCategories,
  ]);

  return <Context.Provider value={memorizedValue}>{children}</Context.Provider>;
};
