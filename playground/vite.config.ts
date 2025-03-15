import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { ViteVueMcp } from '../src'

export default defineConfig({
  server: {
    port: 3456,
  },
  plugins: [
    vue(),
    ViteVueMcp(),
  ],
})
