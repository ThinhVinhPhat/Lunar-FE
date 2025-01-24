import React, { useState } from "react";
import Logo from "../ui/Logo";
import Navigation from "./Navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <header className="fixed top-0 left-0 right-0 bg-white z-50 shadow-sm">
      <div className="bg-gray-100 py-2 text-center text-sm">
        Free U.S. shipping over $99 & free returns*
      </div>

      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Logo />

        <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

        <div className="flex items-center gap-4">
          <button className="hidden md:block">Search</button>
          <button onClick={() => navigate("/login")}>Login</button>
          <FontAwesomeIcon icon={faShoppingCart} />
        </div>
      </div>
    </header>
  );
};
