import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import uzLang from "./locales/uz.json";
import enLang from "./locales/en.json";
import ruLang from "./locales/ru.json";

const resources = {
    uz: {
        translation: uzLang,
    },
    ru: {
        translation: ruLang,
    },
    en: {
        translation: enLang,
    },
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        lng: localStorage.getItem("language") || "en",
        interpolation: {
            escapeValue: false,
        }
    });

export default i18n;
