import { useTranslation } from "react-i18next";
import Logo from "../assets/logo.png";
import { Link } from "react-router";
import { Button, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import LanguageSelector from "./LanguageSelector";
import AccountMenu from "./AccountMenu";

export default function Header() {
  const { t } = useTranslation();

  return (
    <header className="w-full p-3 h-[100px] self-center max-w-[1200px] flex items-center flex-row gap-10">
      <img src={Logo} alt="TonarinetLogo" className="h-full" />
      <div className="flex w-full gap-10 text-[20px]">
        <Link to="/">{t("home")}</Link>
        <Link to="/">{t("localReview")}</Link>
        <Link to="/">{t("community")}</Link>
      </div>
      <div className="flex gap-2">
        <IconButton>
          <ChatIcon />
        </IconButton>
        <IconButton>
          <NotificationsIcon />
        </IconButton>
        <AccountMenu />
        <LanguageSelector />
      </div>
    </header>
  );
}
