import { fileURLToPath, URL } from 'url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        // Prevent vendor.js being created
        manualChunks: undefined,
        // chunkFileNames: "zzz-[name].js",
        // this got rid of the hash on style.css
        assetFileNames: 'assets/[name].[ext]',
      },
    },
  },
})
