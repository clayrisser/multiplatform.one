import 'intl-pluralrules';
import i18n from 'i18next';
import locales from './locales';
import type { Resource, ResourceKey } from 'i18next';
import { MultiPlatform } from 'multiplatform.one';
import { defaultNamespace, defaultLocale, supportedLocales } from './config';
import { initReactI18next } from 'react-i18next';

const logger = console;


if (MultiPlatform.isNext && !MultiPlatform.isStatic) {
  logger.warn("next should not import 'app/i18n'");
}

export function i18nInit() {
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
}

export { supportedLocales, defaultLocale, defaultNamespace, i18n };
