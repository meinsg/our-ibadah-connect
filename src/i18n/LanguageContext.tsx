import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Language, translations, languageNames } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  languageNames: Record<Language, string>;
}

const DEFAULT_LANGUAGE: Language = "en";
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("ouribadah-lang") as Language | null;
    return saved && (saved === "en" || saved === "ar" || saved === "fr") ? saved : DEFAULT_LANGUAGE;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem("ouribadah-lang", lang);
    setLanguageState(lang);
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: (key: string) => translations[language][key] || translations.en[key] || key,
    dir,
    languageNames,
  }), [language, dir]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
