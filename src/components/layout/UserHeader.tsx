import React, { useState } from "react";
import Logo from "../ui/Logo";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faUser,
  faSignOut,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useContextProvider } from "../../hooks/useContextProvider";
import SearchModal from "../ui/Search";

export const UserHeader: React.FC = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();
  const { handleLogout, currentUser, setIsOpenSearch, isOpenSearch } =
    useContextProvider();

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

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 hover:text-[#C8A846]"
            >
              <FontAwesomeIcon icon={faUser} />
              <span className="text-sm">
                {currentUser?.firstName + " " + currentUser?.lastName}
              </span>
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                <button
                  onClick={() => navigate("/profile")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Profile
                </button>
                <button
                  onClick={() => navigate("/orders")}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  My Orders
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faSignOut} className="mr-2" />
                  Sign Out
                </button>
              </div>
            )}
          </div>

          <button className="relative hover:text-[#C8A846]">
            <FontAwesomeIcon icon={faShoppingCart} />
            <span className="absolute -top-2 -right-2 bg-[#C8A846] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>

      <SearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
    </header>
  );
};
