import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import ko from "./locales/ko.json";
import ja from "./locales/ja.json";
import en from "./locales/en.json";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ko: { translation: ko },
  ja: { translation: ja },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .use(I18nextBrowserLanguageDetector)
  .init({
    resources: resources,
    fallbackLng: "ko",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
