import { describe, expect, test } from 'vitest'

import { cn } from './cn'

describe(cn, () => {
  test('ignores falsy inputs', () => {
    expect(cn('inline-flex', false, undefined, null, '')).toBe('inline-flex')
  })

  test('canonicalizes duplicate class tokens', () => {
    expect(cn('rounded-md rounded-md', 'font-medium')).toBe(
      'rounded-md font-medium',
    )
  })

  test('resolves Tailwind padding conflicts', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4')
  })

  test('resolves Tailwind text color conflicts', () => {
    expect(cn('text-slate-900', 'text-red-600')).toBe('text-red-600')
  })
})
