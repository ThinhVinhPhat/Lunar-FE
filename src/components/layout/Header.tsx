import React, { useState } from "react";
import Logo from "../../shared/components/Logo";
import Navigation from "./Navigation";
import { useNavigate } from "react-router-dom";
import SearchModal from "../../shared/components/Search/Search";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import LanguageSelector from "../../shared/components/LanguageSelector";
import Text from "../../shared/components/wrapper/Text";

import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsOpenSearch, isOpenSearch } = useContextProvider();
  const toggleSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  const navigate = useNavigate();
  return (
    <AppBar position="fixed" sx={{ bgcolor: "white", boxShadow: 1 }}>
      <Box sx={{ bgcolor: "#C8A846", color: "white", py: 1, textAlign: "center" }}>
        <Typography variant="body2" sx={{ textDecoration: "underline" }}>
          <Text id="home.freeUSShippingOver99" />
        </Typography>
      </Box>

      <Toolbar
        sx={{
          justifyContent: "space-between",
          px: { xs: 2, md: 4 },
          display: "flex",
          alignItems: "center",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            order: { xs: 2, md: 0 },
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-start",
          }}
        >
          <Logo />
        </Box>
        <Box
          sx={{
            order: { xs: 1, md: 1 },
            flexGrow: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Navigation isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </Box>
        <Box
          sx={{
            order: { xs: 3, md: 5 },
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 2,
          }}
        >
          <IconButton
            onClick={toggleSearch}
            sx={{ color: "text.primary" }}
          >
            <SearchIcon />
          </IconButton>
          <Button
            onClick={() => navigate("/login")}
            className="text-sm text-primary transition-all duration-150 ease-in-out hover:scale-105 "
          >
            <Text id="auth.login" />
          </Button>
          <LanguageSelector />
        </Box>
      </Toolbar>

      <SearchModal
        isOpen={isOpenSearch}
        onClose={() => setIsOpenSearch(false)}
      />
    </AppBar>
  );
};


