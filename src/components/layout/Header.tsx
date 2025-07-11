import React, { useState } from "react";
import Logo from "../ui/Logo";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import SearchModal from "../ui/Search/Search";
import { useContextProvider } from "@/hooks/useContextProvider";
import LanguageSelector from "../ui/LanguageSelector";
import Text from "../wrapper/Text";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsOpenSearch, isOpenSearch } = useContextProvider();
  const toggleSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      {/* <div className="admin-btn bg-gray-100 flex justify-start">
        <button onClick={() => navigate("/admin/login")}>Admin</button>
      </div> */}
      <div className="bg-[#C8A846] text-white underline py-2 text-center text-sm">
        <Text id="home.freeUSShippingOver99" />
      </div>

      <div className="container  mx-auto px-4 py-4 ml-[0px] flex items-center justify-between">
        <Logo />
        <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        <div className="flex min-w-[200px] items-center gap-4">
          <button
            onClick={toggleSearch}
            className="hidden md:block hover:text-[#C8A846]"
          >
            <FontAwesomeIcon icon={faSearch} />
          </button>
          <button onClick={() => navigate("/login")}>
            <Text id="auth.login" />
          </button>
          <LanguageSelector />
        </div>
      </div>

      <SearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
    </header>
  );
};
