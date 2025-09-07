import React, { useState } from "react";
import { useContextProvider } from "@/shared/hooks/useContextProvider";
import i18n from "@/i18n";
import { Menu, MenuItem, IconButton, Avatar } from "@mui/material";

const LanguageSelector = () => {
  const { currentLanguage, setCurrentLanguage } = useContextProvider();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectLanguage = (language: string) => {
    setCurrentLanguage(language);
    i18n.changeLanguage(language);
    handleClose();
  };

  return (
    <>
      <IconButton
        aria-label="language-selector"
        aria-controls={open ? 'language-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{
          background: 'linear-gradient(to right, #C8A846, #897334)',
          color: 'white',
          '&:hover': {
            background: 'linear-gradient(to right, #897334, #C8A846)',
          },
        }}
      >
        <Avatar
          src={currentLanguage === "en" ? "/img/eng.jpg" : "/img/vi.jpg"}
          alt="Language Flag"
          sx={{ width: 24, height: 24 }}
        />
      </IconButton>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'language-selector',
        }}
      >
        <MenuItem onClick={() => handleSelectLanguage("en")}>
          <Avatar src="/img/eng.jpg" alt="English Flag" sx={{ width: 24, height: 24, mr: 1 }} />
          English
        </MenuItem>
        <MenuItem onClick={() => handleSelectLanguage("vi")}>
          <Avatar src="/img/vi.jpg" alt="Vietnamese Flag" sx={{ width: 24, height: 24, mr: 1 }} />
          Vietnamese
        </MenuItem>
      </Menu>
    </>
  );
};

export default LanguageSelector;


