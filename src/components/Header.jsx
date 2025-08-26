import { useTranslation } from "react-i18next";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { Button, IconButton, AppBar, Toolbar, Box } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import LanguageSelector from "./LanguageSelector";
import AccountMenu from "./AccountMenu";

export default function Header() {
  const { t } = useTranslation();

  return (
    <AppBar color="inherit" elevation={1} className="relative">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Link to="/">
            <img src={Logo} alt="logo" style={{ height: 50 }} />
          </Link>
          <Link to="/">{t("home")}</Link>
          <Link to="/">{t("localReview")}</Link>
          <Link to="/">{t("community")}</Link>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <AccountMenu />
          <LanguageSelector />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
