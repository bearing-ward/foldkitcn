import { defineConfig } from 'oxlint'
import core from 'ultracite/oxlint/core'
import vitest from 'ultracite/oxlint/vitest'

const ignorePatterns = [
  ...core.ignorePatterns,
  'dist/',
  'node_modules/',
  'repos/',
  'repos/**',
  '**/repos/**',
  '.agents/skills/generate-program/**',
  '.agents/skills/improve/**',
  'plans/001-establish-registry-foundation.md',
  'plans/README.md',
  'src/main.ts',
  'src/scene.test.ts',
  'src/story.test.ts',
  '**/*.d.ts',
  'vite.config.ts',
  'vitest.config.ts',
  '**/*.config.js',
  '**/*.config.mjs',
]

export default defineConfig({
  categories: {
    correctness: 'off',
  },
  extends: [core, vitest],
  ignorePatterns,
  jsPlugins: [
    {
      name: 'foldkit',
      specifier: '@foldkit/oxlint-plugin',
    },
  ],
  plugins: ['typescript'],
  rules: {
    'foldkit/command-binding-matches-name': 'error',
    'foldkit/got-prefix-requires-submodel-payload': 'error',
    'foldkit/got-submodel-message-name': 'error',
    'foldkit/message-binding-matches-tag': 'error',
    'foldkit/no-empty-object-tagged-call': 'error',
    'foldkit/no-noop-message': 'error',
    'foldkit/prefer-callable-message-constructor': 'error',
    'no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
        destructuredArrayIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      },
    ],
    'sort-keys': 'off',
    'typescript/array-type': 'off',
    'typescript/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' },
    ],
    'typescript/no-explicit-any': 'error',
    'unicorn/no-array-reduce': 'off',
  },
})
