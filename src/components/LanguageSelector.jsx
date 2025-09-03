import { IconButton, Menu, MenuItem } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export default function LanguageSelector() {
  const { i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <LanguageIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        disableScrollLock={true}
      >
        <MenuItem onClick={() => handleLanguageChange("ko")}>한국어</MenuItem>
        <MenuItem onClick={() => handleLanguageChange("ja")}>日本語</MenuItem>
      </Menu>
    </>
  );
}
