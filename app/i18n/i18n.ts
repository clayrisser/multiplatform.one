import de from "./locales/de.json";
import en from "./locales/en.json";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const resources = {
  en: {
    translation: en,
  },
  de: {
    translation: de,
  },
};

export const defaultNS = "translation";

i18n.use(initReactI18next).init({
  defaultNS,
  lng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export const changeLanguage = (str: string) => i18n.changeLanguage(str);

export default i18n;
