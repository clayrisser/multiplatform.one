const tamaguiModules = require('./tamaguiModules');

process.env.TAMAGUI_TARGET = 'native';

const moduleResolutions = [
  'devlop',
  'estree-util-visit/do-not-use-color',
  'unist-util-visit-parents/do-not-use-color',
  'vfile/do-not-use-conditional-minpath',
  'vfile/do-not-use-conditional-minproc',
  'vfile/do-not-use-conditional-minurl',
];

module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root: ['../..'],
          alias: {
            app: '../../app',
            ui: '../../ui',
            ...moduleResolutions.reduce((acc, module) => ({ ...acc, [module]: require.resolve(module) }), {}),
          },
          extensions: ['.js', '.jsx', '.tsx', '.ios.js', '.android.js'],
        },
      ],
      'react-native-reanimated/plugin',
      ['@babel/plugin-proposal-private-methods', { loose: true }],
      ...(process.env.EAS_BUILD_PLATFORM === 'android'
        ? []
        : [
            // [
            //   '@tamagui/babel-plugin',
            //   {
            //     components: tamaguiModules,
            //     config: require.resolve('./tamagui.config.ts'),
            //   },
            // ],
          ]),
      [
        'transform-inline-environment-variables',
        {
          include: 'TAMAGUI_TARGET',
        },
      ],
    ],
  };
};
