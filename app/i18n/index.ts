import 'intl-pluralrules';
import i18n, { Resource, ResourceKey } from 'i18next';
import locales from './locales';
import { MultiPlatform } from 'multiplatform.one';
import { initReactI18next } from 'react-i18next';
import { useRouter } from 'next/router';

const defaultNS = 'common';

i18n.use(initReactI18next).init({
  defaultNS,
  lng: 'en',
  resources: Object.entries(locales).reduce<Resource>((resources, [key, value]: [string, ResourceKey]) => {
    resources[key] = { [defaultNS]: value };
    return resources;
  }, {}),
  interpolation: {
    escapeValue: false,
  },
});

export const supportedLocales = Object.keys(locales);

export function useChangeLanguage() {
  if (MultiPlatform.isNext()) {
    const router = useRouter();
    return (locale: string) => {
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale });
    };
  }
  return (locale: string) => i18n.changeLanguage(locale);
}

export default i18n;
