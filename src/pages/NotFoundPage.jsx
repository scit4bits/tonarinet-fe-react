import React from "react";
import { useTranslation } from "react-i18next";

const NotFoundPage = () => {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col items-center justify-center text-center flex-1">
      <title>{t("pages.notFound.title")}</title>
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-8">{t("common.pageNotFound")}</p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {t("common.goHome")}
      </a>
    </div>
  );
};

export default NotFoundPage;
