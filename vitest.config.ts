import { defineConfig } from 'vitest/config'

const reposIgnoreGlob = '**/repos/**'

export default defineConfig({
  server: {
    watch: {
      ignored: [reposIgnoreGlob],
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      exclude: [reposIgnoreGlob],
    },
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/build/**',
      reposIgnoreGlob,
      '**/tests/e2e/**',
    ],
    setupFiles: ['./src/vitest-setup.ts'],
    server: {
      deps: {
        inline: ['foldkit', '@foldkit/ui', '@foldkit/devtools'],
      },
    },
  },
})
