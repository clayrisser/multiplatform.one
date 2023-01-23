import 'react-i18next';
import en from './i18n/locales/en/common.json';

const resources = {
  en: { translation: en },
} as const;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: typeof resources.en;
  }
}
