import React, { useState } from "react";
import Logo from "../ui/Logo";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContextProvider } from "@/lib/hooks/useContextProvider";
import SearchModal from "../ui/Search/Search";
import Cart from "../ui/Cart";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useAuthAction } from "@/lib/hooks/useAuthAction";
import UserOptions from "./UserOptions";
import LanguageSelector from "../ui/LanguageSelector";
import Text from "../wrapper/Text";
export const UserHeader: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { data: me } = useGetUser();
  const navigate = useNavigate();
  const {
    setIsOpenSearch,
    isOpenSearch,
    setIsOpenCart,
    isOpenCart,
    cart,
    isLogin,
  } = useContextProvider();
  const { handleLogout } = useAuthAction();

  const handleSignOut = () => {
    handleLogout();
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="bg-[#C8A846] text-white underline py-2 text-center text-sm">
        <Text id="home.freeUSShippingOver99" />
      </div>

      <div className="container mx-auto px-2 py-4 flex items-center justify-between">
        <Logo />
        <div className="hidden md:block ml-16">
          <Navigation isOpen={isOpenSearch} setIsOpen={setIsOpenSearch} />
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setIsOpenSearch(!isOpenSearch)}
            className="hidden md:block hover:text-[#C8A846]"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          {isLogin && (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 hover:text-[#C8A846]"
              >
                <FontAwesomeIcon icon={faUser} />
                <span className="text-sm">
                  {me?.firstName + " " + me?.lastName}
                </span>
              </button>

              <UserOptions
                isProfileOpen={isProfileOpen}
                setIsProfileOpen={setIsProfileOpen}
                navigate={navigate}
                handleSignOut={handleSignOut}
              />
            </div>
          )}
          <button
            onClick={() => setIsOpenCart(!isOpenCart)}
            className="relative hover:text-[#C8A846]"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="absolute -top-2 -right-2 bg-[#C8A846] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cart?.orderDetails?.length || 0}
            </span>
          </button>
          <div className="hidden md:block mt-[-10px]">
            <LanguageSelector />
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
      <Cart isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} />
    </header>
  );
};
