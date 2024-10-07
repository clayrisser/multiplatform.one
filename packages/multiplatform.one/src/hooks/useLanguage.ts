import i18n from "i18next";
import { useCallback, useEffect, useState } from "react";

export function useLanguage(): [string, (locale: string) => void] {
  const [language, setLanguage] = useState(i18n?.language || "en");
  useEffect(() => {
    i18n.on("languageChanged", setLanguage);
    return () => i18n.off("languageChanged", setLanguage);
  }, []);
  return [
    language,
    useCallback(
      (language) => i18n?.changeLanguage(language),
      [i18n?.changeLanguage],
    ),
  ];
}
