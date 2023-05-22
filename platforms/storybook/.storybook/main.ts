import path from 'path';
import publicConfig from 'app/config/public';
import tamaguiModules from '../tamaguiModules';
import transpileModules from '../transpileModules';
import type { StorybookConfig } from '@storybook/nextjs';
import webpack from 'webpack';

// import publicConfig from 'app/config/public';
const config: StorybookConfig = {
  stories: [
    '../../../app/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../../../ui/src/**/*.stories.@(js|jsx|ts|tsx|mdx)',
    '../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)',
  ],
  addons: [
    '@etchteam/storybook-addon-status',
    '@storybook/addon-a11y',
    '@storybook/addon-links',
    '@storybook/addon-notes',
    '@storybook/addon-storyshots',
    '@storybook/addon-storysource',
    'addon-screen-reader',
    'storybook-addon-breakpoints',
    'storybook-addon-paddings',
    'storybook-color-picker',
    'storybook-dark-mode',
    'storybook-mobile',
    // TODO: wait for plugins to work on v7
    // 'storybook-addon-themes',
    // 'storybook-addon-grid',
    {
      name: '@storybook/addon-react-native-web',
      options: {
        babelPlugins: [],
        modulesToTranspile: transpileModules,
      },
    },
    {
      name: '@storybook/addon-essentials',
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
    disableTelemetry: true,
  },
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
  features: {
    buildStoriesJson: false,
    storyStoreV7: false,
  },
  docs: {
    autodocs: 'tag',
  },
  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: 'web',
    ...(publicConfig as Record<string, string>),
  }),
  typescript: {
    check: false,
    checkOptions: {},
    reactDocgen: 'react-docgen-typescript',
    skipBabel: false,
    reactDocgenTypescriptOptions: {
      propFilter: (prop) => (prop.parent ? !/node_modules\/(?!tamagui)/.test(prop.parent.fileName) : true),
      shouldExtractLiteralValuesFromEnum: true,
      shouldRemoveUndefinedFromOptional: true,
    },
  },
  webpackFinal: async (config) => ({
    ...config,
    resolve: {
      ...config.resolve,
      alias: {
        ...(config.resolve?.alias || {}),
        buffer: require.resolve('buffer/'),
        stream: require.resolve('stream-browserify'),
        zlib: require.resolve('browserify-zlib'),
      },
      fallback: {
        ...(config.resolve?.fallback || []),
        fs: false,
        os: false,
        path: false,
        util: false,
      },
    },
    module: {
      ...config.module,
      rules: [
        ...(config.module?.rules || [
          {
            loader: 'tamagui-loader',
            options: {
              components: tamaguiModules,
              config: path.resolve(__dirname, '../tamagui.config.ts'),
              exclude: /node_modules/,
            },
          },
        ]),
      ],
    },
    plugins: [
      ...(config.plugins || []),
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      }),
    ],
  }),
  babelDefault: (config, _options) => ({
    ...config,
    presets: [...(config.presets || []), '@babel/preset-typescript'],
    plugins: ['react-native-reanimated/plugin'],
  }),
};
export default config;
