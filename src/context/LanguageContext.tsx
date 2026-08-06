import React, { createContext, useContext, useState, useEffect } from 'react';
import { i18n, Language } from '../services/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: any) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => i18n.t(key),
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage());

  useEffect(() => {
    const unsubscribe = i18n.subscribe((newLang) => {
      setLanguageState(newLang);
    });
    return unsubscribe;
  }, []);

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang);
  };

  const t = (key: any) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
