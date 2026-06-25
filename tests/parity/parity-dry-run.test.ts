import { describe, expect, test } from 'vitest'

import {
  matchingParitySlots,
  shadcnCaseGrep,
} from '../../scripts/parity-dry-run'
import { paritySlots } from './slots'

const matchingItemIds = (grep?: string): ReadonlyArray<string> =>
  matchingParitySlots(paritySlots, grep).map(slot => slot.itemId)

describe('parity dry-run helpers', () => {
  test('matches every slot without grep', () => {
    expect(matchingItemIds()).toStrictEqual(
      paritySlots.map(slot => slot.itemId),
    )
  })

  test('matches all shadcn slots with namespace grep', () => {
    expect(matchingItemIds('shadcn')).toStrictEqual([
      'shadcn/aspect-ratio',
      'shadcn/alert',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/kbd',
      'shadcn/native-select',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/skeleton',
    ])

    expect(matchingItemIds('shadcn/')).toStrictEqual([
      'shadcn/aspect-ratio',
      'shadcn/alert',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/kbd',
      'shadcn/native-select',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/skeleton',
    ])
  })

  test('preserves scoped and item-id grep behavior', () => {
    expect(matchingItemIds('shadcn/button')).toStrictEqual(['shadcn/button'])
    expect(matchingItemIds('button')).toStrictEqual([
      'base-ui/button',
      'shadcn/button',
    ])
    expect(matchingItemIds('button-default')).toStrictEqual([])
  })

  test('derives shadcn case grep from namespace and scoped greps', () => {
    expect(shadcnCaseGrep('shadcn/button')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'shadcn')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'shadcn/')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'shadcn/button')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'button')).toBe('button')
  })
})
