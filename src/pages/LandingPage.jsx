import Logo from "../assets/logo.png";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const { t } = useTranslation();

  return (
    <div className="bg-sky-200 w-full min-h-screen">
      <title>{t("pages.landing.title")}</title>
      Welcome to the Landing Page
    </div>
  );
}
