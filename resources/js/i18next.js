import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import HttpBackend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en/translation.json"
import fr from "./locales/fr/translation.json"
i18n
  .use(HttpBackend) // Load translations from backend
  .use(LanguageDetector) // Detect user language
  .use(initReactI18next) // Initialize react-i18next
  .init({
    resources: {
      en: {translation: en},
      fr: {translation: fr}
    },
    fallbackLng: "fr", // Default language
    debug: false, // Set to true for debugging
    detection: {
      order: ["localStorage", "navigator"], // Detect from localStorage or browser
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false, // React already prevents XSS
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // Load translations dynamically
    },
  });

export default i18n;
