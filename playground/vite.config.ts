import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import DevTools from 'vite-plugin-vue-devtools'
import { VueMcp } from '../src'

export default defineConfig({
  server: {
    port: 3456,
  },
  plugins: [
    vue(),
    VueMcp(),
    DevTools(),
  ],
})
