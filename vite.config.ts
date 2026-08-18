import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: './test/setupTests.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      // Los tests viven en test/, no en src/, así que hay que decirle a la
      // cobertura explícitamente qué archivos de src/ mirar -- si no, solo
      // reporta los archivos que los tests tocaron, sin marcar como "0%"
      // los que ningún test importa todavía.
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/main.tsx', 'src/vite-env.d.ts', 'src/**/*.d.ts'],
    },
  },
})
