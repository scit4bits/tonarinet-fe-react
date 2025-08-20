import { useTranslation } from "react-i18next";
import Header from "../components/Header";

export default function TestPage() {
  const { t, i18n } = useTranslation();

  function clickHandler() {
    i18n.changeLanguage(i18n.language === "ko" ? "ja" : "ko");
  }

  return (
    <div>
      <Header />
      <p>{t("hello")}</p>
      <button onClick={clickHandler}>Hey</button>
    </div>
  );
}
