module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@contexts': './src/contexts',
          '@hooks': './src/hooks',
          '@navigations': './src/navigations',
          '@screens': './src/screens',
          '@services': './src/services',
          '@store': './src/store',
          '@styles': './src/styles',
          '@utils': './src/utils',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
  env: {
    production: {
      plugins: ['react-native-paper/babel'],
    },
  },
};
