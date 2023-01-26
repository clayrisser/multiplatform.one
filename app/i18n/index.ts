import 'intl-pluralrules';
import i18n, { Resource, ResourceKey } from 'i18next';
import locales from './locales';
import { MultiPlatform } from 'multiplatform.one';
import { config } from 'app/config';
import { defaultNamespace, defaultLocale, supportedLocales } from './config';
import { initReactI18next } from 'react-i18next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

i18n.use(initReactI18next).init({
  defaultNS: defaultNamespace,
  lng: defaultLocale,
  resources: Object.entries(locales).reduce<Resource>((resources, [key, value]: [string, ResourceKey]) => {
    resources[key] = { [defaultNamespace]: value };
    return resources;
  }, {}),
  interpolation: {
    escapeValue: false,
  },
});

export function useLanguage(): [string, (locale: string) => void] {
  const nextRouter = MultiPlatform.isNext() && config.get('NEXT_STATIC') !== '1' ? useRouter() : null;
  const [language, setLanguage] = useState(nextRouter?.locale || i18n?.language || 'en');

  useEffect(() => {
    if (!nextRouter?.locale) return;
    setLanguage(nextRouter.locale);
  }, [nextRouter?.locale]);

  useEffect(() => {
    function handleLanguageChanged(lng: string) {
      setLanguage(lng);
    }
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  let changeLanguage = (locale: string) => {
    i18n?.changeLanguage(locale);
  };
  if (nextRouter) {
    changeLanguage = (locale: string) => {
      const { pathname, asPath, query } = nextRouter;
      nextRouter.push({ pathname, query }, asPath, { locale });
      return language;
    };
  }

  return [language, changeLanguage];
}

export { supportedLocales, defaultLocale, defaultNamespace };

export default i18n;
