import { tamaguiPlugin } from "@tamagui/vite-plugin";
import { one } from "one/vite";
import type { UserConfig } from "vite";

export default {
  plugins: [
    one({
      web: {
        deploy: "vercel",
        defaultRenderMode: "ssg",
      },

      app: {
        key: "One",
      },
    }),

    tamaguiPlugin({
      optimize: true,
      components: ["tamagui"],
      config: "./config/tamagui.config.ts",
      outputCSS: "./code/styles/tamagui.css",
    }),
  ],
} satisfies UserConfig;
