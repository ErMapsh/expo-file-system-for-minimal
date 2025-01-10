import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "../../assets/i18n/en.json";
import hi from "../../assets/i18n/hi.json";
import mar from "../../assets/i18n/mar.json";

const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mar: { translation: mar },
};

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
