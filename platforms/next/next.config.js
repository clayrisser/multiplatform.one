const { withTamagui } = require("@tamagui/next-plugin");
const { join } = require("path");
const withImages = require("next-images");
const withTM = require("next-transpile-modules"); // pass the modules you would like to see transpiled
const transpileModules = require("./transpileModules");

process.env.IGNORE_TS_CONFIG_PATHS = "true";
process.env.TAMAGUI_TARGET = "web";
process.env.TAMAGUI_DISABLE_WARN_DYNAMIC_LOAD = "1";

const boolVals = {
  true: true,
  false: false,
};

const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ??
  process.env.NODE_ENV === "development";

if (disableExtraction) {
  console.log("Disabling static extraction in development mode for better HMR");
}

const plugins = [
  withTM(transpileModules),
  withImages,
  withTamagui({
    config: "./tamagui.config.ts",
    components: ["ui", "tamagui"],
    importsWhitelist: ["constants.js", "colors.js"],
    logTimings: true,
    disableExtraction,
    shouldExtract: (path) => {
      if (path.includes(join("packages", "app"))) {
        return true;
      }
    },
    useReactNativeWebLite: false, // if enabled dont need excludeReactNativeWebExports
    excludeReactNativeWebExports: [
      "Switch",
      "ProgressBar",
      "Picker",
      "CheckBox",
      "Touchable",
    ],
  }),
];

module.exports = function () {
  /** @type {import('next').NextConfig} */
  let config = {
    i18n: {
      defaultLocale: "en",
      locales: ["en", "de", "fr"],
    },
    typescript: {
      ignoreBuildErrors: true,
    },
    images: {
      disableStaticImages: true,
    },
    // transpilePackages: transpilePackages,
    experimental: {
      scrollRestoration: true,
      legacyBrowsers: false,
    },
  };
  for (const plugin of plugins) {
    config = {
      ...config,
      ...plugin(config),
    };
  }
  return config;
};
