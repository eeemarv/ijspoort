import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import native from 'vite-plugin-native';
import electron from 'vite-plugin-electron';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    plugins: [svelte()]
  },
  /*
  plugins: [
    native({
      // Enable Webpack
      webpack: {},
    })
  ],
  */
  plugins: [
    electron({
      entry: 'src/main/index.js',
      vite: {
        build: {
          rollupOptions: {
            // Here are some C/C++ modules them can't be built properly
            external: [
              'nfc-pcsc',
              'rpio',
            ],
          },
        },
      },
    }),
  ],
})
