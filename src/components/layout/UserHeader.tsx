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
import { useContextProvider } from "../../hooks/useContextProvider";
import SearchModal from "../ui/Search";
import Cart from "../ui/Cart";
import { useGetUser } from "../../hooks/queryClient/query/user";
import { useAuthAction } from "../../hooks/useAuthAction";
import UserOptions from "./UserOptions";

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
        Free U.S. shipping over $99 & free returns*
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />
        <Navigation isOpen={isOpenSearch} setIsOpen={setIsOpenSearch} />

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
