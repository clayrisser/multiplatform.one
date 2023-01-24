import 'intl-pluralrules';
import locales from './locales';
import i18n, { Resource, ResourceKey } from 'i18next';
import { initReactI18next } from 'react-i18next';

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

export const changeLanguage = (str: string) => i18n.changeLanguage(str);

export default i18n;
