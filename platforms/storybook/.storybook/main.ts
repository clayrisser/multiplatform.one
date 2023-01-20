import path from "path";
import transpileModules from "../transpileModules";

const config = {
  stories: [
    "../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../app/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "../../../ui/**/*.stories.@(js|jsx|ts|tsx|mdx)",
  ],
  addons: [
    "@etchteam/storybook-addon-status",
    "@storybook/addon-a11y",
    "@storybook/addon-ie11",
    "@storybook/addon-links",
    "@storybook/addon-notes",
    "@storybook/addon-storyshots",
    "@storybook/addon-storysource",
    "addon-screen-reader",
    "storybook-addon-breakpoints",
    "storybook-addon-grid",
    "storybook-addon-paddings",
    "storybook-addon-themes",
    "storybook-color-picker",
    "storybook-dark-mode",
    "storybook-mobile",
    {
      name: "storybook-addon-next",
      options: {
        nextConfigPath: path.resolve(__dirname, "../../next/next.config.js"),
      },
    },
    {
      name: "@storybook/addon-react-native-web",
      options: {
        babelPlugins: [],
        modulesToTranspile: transpileModules,
      },
    },
    {
      name: "@storybook/addon-essentials",
      options: {
        actions: true,
        backgrounds: false,
        controls: true,
        docs: true,
        toolbars: true,
        viewport: true,
      },
    },
  ],
  core: {
    builder: "webpack5",
  },
  framework: "@storybook/react",
  features: {
    buildStoriesJson: false,
    postcss: false,
    storyStoreV7: false,
  },
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      allowSyntheticDefaultImports: false,
      esModuleInterop: false,
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
      propFilter: (prop) =>
        prop.parent
          ? !/node_modules\/(?!tamagui)/.test(prop.parent.fileName)
          : true,
    },
  },
  webpackFinal: async (config, { configType }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve?.fallback || []),
        fs: false,
        stream: false,
        os: false,
        util: false,
      },
    };
    return config;
  },
  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: "web",
  }),
};
export default config;
