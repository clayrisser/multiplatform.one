import path from "node:path";
import {
  lookupTamaguiModules,
  resolveConfig,
} from "@multiplatform.one/utils/build";
import { tamaguiPlugin } from "@tamagui/vite-plugin";
import dotenv from "dotenv";
import { one } from "one/vite";
import type { UserConfig } from "vite";
import i18nextLoader from "vite-plugin-i18next-loader";
import { public as publicConfigKeys } from "../../app/config.json";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });
process.env.VITE_MP_CONFIG = JSON.stringify(resolveConfig(publicConfigKeys));

export default {
  plugins: [
    one({
      web: {
        deploy: "node",
        defaultRenderMode: "spa",
      },
      app: {
        key: "One",
      },
    }),
    tamaguiPlugin({
      optimize: true,
      components: lookupTamaguiModules([__dirname]),
      config: "./config/tamagui.config.ts",
      outputCSS: "./code/styles/tamagui.css",
    }),
    i18nextLoader({ paths: ["../../app/i18n"] }),
  ],
} satisfies UserConfig;