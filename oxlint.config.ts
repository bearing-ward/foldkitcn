import { defineConfig } from 'oxlint'
import core from 'ultracite/oxlint/core'
import vitest from 'ultracite/oxlint/vitest'

const ignorePatterns = [
  ...core.ignorePatterns,
  'dist/',
  'node_modules/',
  'repos/',
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
    'typescript/consistent-type-assertions': [
      'error',
      { assertionStyle: 'never' },
    ],
    'typescript/no-explicit-any': 'error',
  },
})
