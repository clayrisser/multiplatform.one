const path = require('path')
const webpack = require('webpack')
const transpileModules = ['electron-serve']

const esbuildOptions = {
  target: 'es2015',
  format: 'cjs'
}

// include logic copied from https://github.com/expo/expo-cli/blob/master/packages/webpack-config/src/loaders/createBabelLoader.ts

function getModule(name) {
  return path.join('node_modules', name);
}

function getBabelPlugins(options) {
  let reactNativeWeb = 'react-native-web';
  if (options.babelPlugins && Array.isArray(options.babelPlugins)) {
    return [reactNativeWeb, ...options.babelPlugins];
  }
  return [reactNativeWeb];
};


const DEFAULT_INCLUDES = [
  getModule('@expo'),
  getModule('@react'),
  getModule('@unimodules'),
  getModule('@use-expo'),
  getModule('expo'),
  getModule('native-base'),
  getModule('react-native'),
  getModule('react-navigation'),
  getModule('styled-components'),
  getModule('unimodules'),
];


const DEFAULT_EXCLUDES = [
  '/node_modules',
  '/bower_components',
  '/.expo/',
  '(webpack)',
];




function isInstalled(name) {
  try {
    console.log(`REQURE ${name}/package.json`)
    require(`${name}/package.json`);
    return true;
  } catch (er) {
    return false;
  }
};


function getRnPreset() {
  if (isInstalled('@react-native/babel-preset')) {
    console.log('Using @react-native/babel-preset');
    return 'module:@react-native/babel-preset';
  } else if (isInstalled('metro-react-native-babel-preset')) {
    console.log('Using metro-react-native-babel-preset');
    return 'module:metro-react-native-babel-preset';
  } else {
    throw new Error(
      "Couldn't find babel-preset-react-native or metro-react-native-babel-preset.",
    );
  }
};



function webpackFinal(config, options) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      __DEV__: process.env.NODE_ENV !== 'production' || true,
    }),
  );
  config.plugins.push(new webpack.DefinePlugin({ process: { env: {} } }));
  const babelPlugins = getBabelPlugins(options);
  const babelPresetReactOptions = options?.babelPresetReactOptions ?? {};
  const babelPresets = options?.babelPresets ?? [];
  const root = options.projectRoot ?? process.cwd();
  const userModules = options.modulesToTranspile?.map(getModule) ?? [];
  const modules = [...DEFAULT_INCLUDES, ...userModules];
  const userAliases = options.modulesToAlias ?? {};
  const babelPresetReactNativeOptions =
    options?.babelPresetReactNativeOptions ?? {};
  config.module.rules.push({
    test: /\.(js|jsx|ts|tsx)$/,
    loader: 'babel-loader',
    include(filename) {
      if (!filename) return false;
      for (const possibleModule of modules) {
        if (filename.includes(path.normalize(possibleModule))) {
          return true;
        }
      }
      if (filename.includes(root)) {
        for (const excluded of DEFAULT_EXCLUDES) {
          if (filename.includes(path.normalize(excluded))) {
            return false;
          }
        }
        return true;
      }
      return false;
    },
    options: {
      root,
      presets: [
        [
          getRnPreset(),
          {
            useTransformReactJSXExperimental: true,
            ...babelPresetReactNativeOptions,
          },
        ],
        [
          '@babel/preset-react',
          {
            runtime: 'automatic',
            ...babelPresetReactOptions,
          },
        ],
        ...babelPresets,
      ],
      plugins: [...babelPlugins],
    },
  });
  config.resolve.extensions = [
    '.web.js',
    '.web.jsx',
    '.web.ts',
    '.web.tsx',
    ...config.resolve.extensions,
  ];
  config.resolve.alias = {
    'react-native$': 'react-native-web',
    ...config.resolve.alias,
    ...userAliases,
  };
  return config;
};











module.exports = {
  mainSrcDir: 'main',
  rendererSrcDir: 'renderer',
  webpack(config, env) {
    return webpackFinal(config, {})
  },
}



