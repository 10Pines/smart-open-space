import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHtmlPlugin } from 'vite-plugin-html';

const root = resolve(__dirname, './src');

const htmlPlugin = createHtmlPlugin({
  entry: 'main.jsx',
  template: 'index.html',
});

export default ({ mode }) => {
  //TODO: use 'mode' for build prod or dev
  return defineConfig({
    root,
    build: {
      outDir: resolve(__dirname, './dist'),
      emptyOutDir: true,
    },
    resolve: {
      alias: {
        '@': root,
        '#root': root,
        '#assets': root + '/assets',
        '#helpers': root + '/helpers',
        '#api': root + '/helpers/api',
        '#shared': root + '/shared',
        '#app': root + '/App',
        '#model': root + '/App/model',
      },
    },
    plugins: [htmlPlugin, react()],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: [],
      coverage: {},
    },
  });
};
