import { config } from "multiplatform.one";
import { Text } from "tamagui";

export default function Home() {
  return <Text color="red">{JSON.stringify(config.get())}</Text>;
}
