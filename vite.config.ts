import { foldkit } from '@foldkit/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

const normalizeBasePath = (basePath: string): string => {
  if (basePath === '/') {
    return '/'
  }

  if (!basePath.startsWith('/') || !basePath.endsWith('/')) {
    throw new Error(`Invalid FOLDKITCN_BASE_PATH: ${basePath}`)
  }

  return basePath
}

const basePath = normalizeBasePath(process.env.FOLDKITCN_BASE_PATH ?? '/')

export default defineConfig({
  base: basePath,
  plugins: [tailwindcss(), foldkit({ devToolsMcpPort: 9988 })],
  optimizeDeps: {
    entries: ['src/entry.ts'],
  },
})
