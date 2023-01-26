import 'intl-pluralrules';
import i18n, { Resource, ResourceKey } from 'i18next';
import locales from './locales';
import { MultiPlatform } from 'multiplatform.one';
import { config } from 'app/config';
import { defaultNamespace, defaultLocale, supportedLocales } from './config';
import { initReactI18next } from 'react-i18next';
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

export function useChangeLanguage() {
  if (MultiPlatform.isNext() && config.get('NEXT_STATIC') !== '1') {
    const router = useRouter();
    return (locale: string) => {
      const { pathname, asPath, query } = router;
      router.push({ pathname, query }, asPath, { locale });
    };
  }
  return (locale: string) => i18n.changeLanguage(locale);
}

export { supportedLocales, defaultLocale, defaultNamespace };

export default i18n;
