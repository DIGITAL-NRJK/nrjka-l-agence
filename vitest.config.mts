import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  // Le tsconfig exclut `tests/`, donc vite-tsconfig-paths n'applique pas les alias
  // aux fichiers de test → on les déclare explicitement ici.
  resolve: {
    alias: [
      { find: '@payload-config', replacement: path.resolve(dirname, 'src/payload.config.ts') },
      { find: /^@\//, replacement: path.resolve(dirname, 'src') + '/' },
    ],
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['tests/int/**/*.int.spec.ts'],
  },
})
