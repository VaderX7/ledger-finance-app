'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Language, getT, translations } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  t: ReturnType<typeof getT>;
  setLang: (l: Language) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  t: translations.en,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>('en');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('ledger_user');
      if (raw) {
        const user = JSON.parse(raw);
        if (user?.language) setLangState(user.language as Language);
      }
    } catch {}
  }, []);

  const setLang = (l: Language) => {
    setLangState(l);
    try {
      const raw = localStorage.getItem('ledger_user');
      const user = raw ? JSON.parse(raw) : {};
      localStorage.setItem('ledger_user', JSON.stringify({ ...user, language: l }));
    } catch {}
  };

  return (
    <LanguageContext.Provider value={{ lang, t: getT(lang), setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}