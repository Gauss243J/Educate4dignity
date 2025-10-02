import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from './Button';

const LS_KEY = 'e4d_lang';

export const LanguageSelector: React.FC = () => {
  const { i18n } = useTranslation();
  React.useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) {
      if (saved !== i18n.language) i18n.changeLanguage(saved);
    } else {
      // Force default to English if nothing stored
      if (i18n.language !== 'en') i18n.changeLanguage('en');
      localStorage.setItem(LS_KEY, 'en');
    }
  }, [i18n]);
  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'fr' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem(LS_KEY, newLang);
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="min-w-[60px]"
    >
      {i18n.language === 'en' ? '🇫🇷 FR' : '🇬🇧 EN'}
    </Button>
  );
};
