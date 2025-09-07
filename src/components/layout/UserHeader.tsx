import React, { useState, useEffect, useRef } from "react";
import Logo from "../../shared/components/Logo";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import SearchModal from "../../shared/components/Search/Search";
import Cart from "../cart/Cart";
import { useGetUser } from "@/lib/hooks/queryClient/query/user/user.query";
import { useAuthAction } from "@/shared/hooks/useAuthAction";
import UserOptions from "./UserOptions";
import LanguageSelector from "../../shared/components/LanguageSelector";
import Text from "../../shared/components/wrapper/Text";
import { useContextProvider } from "@/shared/hooks/useContextProvider";

import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  Badge,
} from "@mui/material";
import { Button } from "@/shared/components/Button";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";

export const UserHeader: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);
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

  const handleButtonClick = () => {
    setAnchorEl(anchorEl ? null : document.getElementById('profile-button'));
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    handleLogout();
    handleProfileMenuClose();
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setAnchorEl(null);
      }
    };

    if (anchorEl) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [anchorEl]);

  return (
    <AppBar position="fixed" sx={{ bgcolor: "white", boxShadow: 1 }}>
      <Box sx={{ bgcolor: "#C8A846", color: "white", py: 1, textAlign: "center" }}>
        <Typography variant="body2" sx={{ textDecoration: "underline" }}>
          <Text id="home.freeUSShippingOver99" />
        </Typography>
      </Box>

      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, md: 2 } }}>
        <Box sx={{ flex: 1, display: "flex", alignItems: "center" }}>
          <Logo />
        </Box>
        
        <Box sx={{ flex: 2, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
          <Navigation isOpen={isOpenSearch} setIsOpen={setIsOpenSearch} />
        </Box>

        <Box sx={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2 }}>
          <IconButton
            onClick={() => setIsOpenSearch(!isOpenSearch)}
            sx={{ display: { xs: "none", md: "block" }, color: "text.primary" }}
          >
            <SearchIcon />
          </IconButton>
          {isLogin && (
            <Box sx={{ position: "relative" }} ref={profileMenuRef}>
              <div>
                <Button
                  onClick={handleButtonClick}
                  variant="profile"
                  icon={<div className="mt-[-2px]">
                  <AccountCircle />
                  </div>}
                  size="medium"
                  iconPosition="left"
                  id="profile-button"
                >
                  {me?.firstName + " " + me?.lastName}
                </Button>
              </div>
              <UserOptions
                isProfileOpen={Boolean(anchorEl)}
                setIsProfileOpen={handleProfileMenuClose}
                navigate={navigate}
                handleSignOut={handleSignOut}
              />
            </Box>
          )}
          <IconButton
            onClick={() => setIsOpenCart(!isOpenCart)}
            sx={{ color: "text.primary" }}
          >
            <Badge badgeContent={cart?.orderDetails?.length || 0} color="error">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <LanguageSelector />
          </Box>
        </Box>
      </Toolbar>

      <SearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
      <Cart isOpen={isOpenCart} onClose={() => setIsOpenCart(false)} />
    </AppBar>
  );
};


