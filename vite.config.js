// vite.config.js
import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'packages/core/index.ts'),
      name: 'Pika',
      fileName: 'pika',
    },
  },
})
