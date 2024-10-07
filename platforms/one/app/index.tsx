import { config } from "multiplatform.one";
import { useTranslation } from "react-i18next";
import { Text } from "tamagui";

export default function Home() {
  const { t } = useTranslation();
  return <Text color="red">{t("common.ok")}</Text>;
}
