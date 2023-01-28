import 'intl-pluralrules';
import i18n, { Resource, ResourceKey } from 'i18next';
import locales from './locales';
import { MultiPlatform } from 'multiplatform.one';
import { config } from 'app/config';
import { defaultNamespace, defaultLocale, supportedLocales } from './config';
import { initReactI18next } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

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

export function useLocale(): [string, (locale: string) => void] {
  const nextRouter = MultiPlatform.isNext() && config.get('NEXT_STATIC') !== '1' ? useRouter() : null;
  const [locale, setLocale] = useState(nextRouter?.locale || i18n?.language || 'en');

  useEffect(() => {
    if (!nextRouter?.locale) return;
    setLocale(nextRouter.locale);
  }, [nextRouter?.locale]);

  useEffect(() => {
    function handleLanguageChanged(lng: string) {
      setLocale(lng);
    }
    i18n.on('languageChanged', handleLanguageChanged);
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, []);

  let changeLocale = (locale: string) => {
    i18n?.changeLanguage(locale);
  };
  if (nextRouter) {
    changeLocale = (locale: string) => {
      const { pathname, asPath, query } = nextRouter;
      nextRouter.push({ pathname, query }, asPath, { locale });
    };
  }

  return [locale, changeLocale];
}

export { supportedLocales, defaultLocale, defaultNamespace };

export default i18n;
