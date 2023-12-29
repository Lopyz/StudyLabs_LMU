import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import LoadingScreen from '@/components/LoadingScreen';


type LanguageContextType = {
  language: string;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

type LanguageProviderProps = {
  children: ReactNode;
};

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Prüfe beim Initialisieren, ob ein Neuladen im Gange ist
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage.getItem('isReloading')) {
      window.localStorage.removeItem('isReloading');  // Entferne 'isReloading' aus dem localStorage
      setIsLoading(false);  // Setze isLoading nach dem Neuladen auf false
    }
  }, []);

  const [language, setLanguage] = useState(() => {
    if (typeof window !== "undefined") {
      const localLanguage = window.localStorage.getItem("language");
      return localLanguage || "DE";
    } else {
      return "DE";
    }
  });

  const toggleLanguage = () => {
    setIsLoading(true); // Setze isLoading sofort auf true
    if (typeof window !== "undefined") {
      window.localStorage.setItem('isReloading', 'true');  // Setze 'isReloading' im localStorage
      const newLang = language === "DE" ? "EN" : "DE";
      window.localStorage.setItem("language", newLang);
      window.location.reload();
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {isLoading ? <LoadingScreen /> : children}
    </LanguageContext.Provider>
  );
}


export const DynamicLanguageProvider = dynamic(() => Promise.resolve(LanguageProvider), {
  ssr: false,
});

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};