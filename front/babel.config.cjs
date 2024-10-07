module.exports = {
  env: {
    test: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: [
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-runtime',
    [
      'module-resolver',
      {
        alias: {
          '#root': './src',
          '#assets': './src/assets',
          '#helpers': './src/helpers',
          '#api': './src/helpers/api',
          '#shared': './src/shared',
        },
      },
    ],
  ],
  presets: ['@babel/preset-env', '@babel/preset-react'],
};
