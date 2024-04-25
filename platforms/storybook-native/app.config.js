const publicConfig = require('app/config/public');

module.exports = {
  expo: {
    name: 'app',
    slug: 'app',
    scheme: 'app',
    version: '0.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.example.app',
      jsEngine: 'jsc',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#FFFFFF',
      },
      package: 'com.example.app',
    },
    web: {
      favicon: './assets/favicon.png',
    },
    extra: {
      ...publicConfig,
    },
    jsEngine: 'hermes',
    plugins: [['expo-router', { root: './app' }]],
  },
};
