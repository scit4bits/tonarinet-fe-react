import taxios from "../../utils/taxios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import CountryData from "../../data/country.json";
import { useTranslation } from "react-i18next";
import useAuth from "../../hooks/useAuth";

export default function AuthTestPage({}) {
  const [t, i18n] = useTranslation();
  const { user } = useAuth();

  return (
    <>
      <title>{t("pages.auth.authTest.title")}</title>
      <div className="text-left">
        <p>{user?.name || "NO!!!"}</p>
      </div>
    </>
  );
}
