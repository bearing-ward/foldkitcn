import { defineConfig } from 'oxfmt'
import ultracite from 'ultracite/oxfmt'

const ignorePatterns = [
  ...(ultracite.ignorePatterns ?? []),
  'node_modules',
  'dist',
  'repos',
  '.agents/skills/generate-program/**',
  '.agents/skills/improve/**',
  'plans/001-establish-registry-foundation.md',
  'plans/artifacts/128-public-component-parity/public-component-matrix.json',
  'plans/README.md',
  'src/main.ts',
  '*.tsbuildinfo',
  'pnpm-lock.yaml',
]

export default defineConfig({
  ...ultracite,
  arrowParens: 'avoid',
  ignorePatterns,
  printWidth: 80,
  semi: false,
  singleQuote: true,
  sortImports: {
    groups: [
      'external',
      { newlinesBetween: true },
      ['internal', 'subpath'],
      { newlinesBetween: true },
      ['parent', 'sibling', 'index'],
      'style',
      'unknown',
    ],
    ignoreCase: true,
    newlinesBetween: true,
    order: 'asc',
  },
  trailingComma: 'all',
})
