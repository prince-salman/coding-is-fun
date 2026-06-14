import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Cast menghindari bentrok tipe lintas-versi Vite (rolldown) vs Vite bawaan Vitest.
  plugins: [react() as never],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
