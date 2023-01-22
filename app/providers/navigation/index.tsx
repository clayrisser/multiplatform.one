import { NavigationContainer } from "@react-navigation/native";
import * as Linking from "expo-linking";
import { useMemo } from "react";
import { ProviderProps } from "../types";
import { routeMaps } from "../../navigation/native";

const initialRouteName = Object.entries(routeMaps).reduce(
  (initialRouteName: string, [key, value]: [string, string]) => {
    if (initialRouteName !== "") return initialRouteName;
    if (value === "") initialRouteName = key;
    return initialRouteName;
  },
  ""
);
const domain = "multiplatform.one";

export function NavigationProvider({ children }: ProviderProps) {
  return (
    <NavigationContainer
      linking={
        useMemo(
          () => ({
            prefixes: [
              Linking.createURL("/"),
              `https://${domain}/`,
              `https://*.${domain}/`,
              `http://${domain}/`,
              `http://*.${domain}/`,
            ],
            config: {
              initialRouteName,
              screens: routeMaps,
            },
          }),
          []
        ) as any
      }
    >
      {children}
    </NavigationContainer>
  );
}
