import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
  },
  assetsInclude: ['logo', 'plugin.json'],
  publicDir: './src/assets/',
  base: './'
})
