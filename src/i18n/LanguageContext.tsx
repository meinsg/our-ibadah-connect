import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Language, translations, languageNames } from "./translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'ltr' | 'rtl';
  languageNames: Record<Language, string>;
}

const LANGUAGE_STORAGE_KEY = 'ouribadah-language';
const DEFAULT_LANGUAGE: Language = 'en';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(LANGUAGE_STORAGE_KEY) : null;
    const nextLanguage: Language = saved === 'ar' || saved === 'fr' || saved === 'en' ? saved : DEFAULT_LANGUAGE;
    setLanguageState(nextLanguage);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  }, []);

  const t = useCallback((key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  }, [language]);

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = dir;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, languageNames }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
