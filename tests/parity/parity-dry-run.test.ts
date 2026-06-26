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
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/kbd',
      'shadcn/checkbox',
      'shadcn/label',
      'shadcn/input',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/slider',
      'shadcn/switch',
      'shadcn/skeleton',
      'shadcn/textarea',
      'shadcn/dialog',
      'shadcn/popover',
      'shadcn/radio-group',
      'shadcn/tabs',
      'shadcn/accordion',
      'shadcn/collapsible',
    ])

    expect(matchingItemIds('shadcn/')).toStrictEqual([
      'shadcn/aspect-ratio',
      'shadcn/alert',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/kbd',
      'shadcn/checkbox',
      'shadcn/label',
      'shadcn/input',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/slider',
      'shadcn/switch',
      'shadcn/skeleton',
      'shadcn/textarea',
      'shadcn/dialog',
      'shadcn/popover',
      'shadcn/radio-group',
      'shadcn/tabs',
      'shadcn/accordion',
      'shadcn/collapsible',
    ])
  })

  test('preserves scoped and item-id grep behavior', () => {
    expect(matchingItemIds('shadcn/button')).toStrictEqual(['shadcn/button'])
    expect(matchingItemIds('button')).toStrictEqual([
      'base-ui/button',
      'shadcn/button',
    ])
    expect(matchingItemIds('toggle')).toStrictEqual([
      'base-ui/toggle',
      'base-ui/toggle-group',
      'shadcn/toggle',
      'shadcn/toggle-group',
    ])
    expect(matchingItemIds('input')).toStrictEqual([
      'base-ui/input',
      'shadcn/input',
    ])
    expect(matchingItemIds('button-default')).toStrictEqual([])
  })

  test('matches number field by component grep', () => {
    expect(matchingItemIds('number-field')).toStrictEqual([
      'base-ui/number-field',
    ])
  })

  test('matches form by component grep', () => {
    expect(matchingItemIds('form')).toStrictEqual(['base-ui/form'])
  })

  test('matches popover slots with component grep', () => {
    expect(matchingItemIds('popover')).toStrictEqual([
      'base-ui/popover',
      'shadcn/popover',
    ])
  })

  test('derives shadcn case grep from namespace greps', () => {
    expect(shadcnCaseGrep('shadcn/button')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'shadcn')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'shadcn/')).toBe('button')
  })

  test('derives shadcn case grep from scoped and component greps', () => {
    expect(shadcnCaseGrep('shadcn/button', 'shadcn/button')).toBe('button')
    expect(shadcnCaseGrep('shadcn/button', 'button')).toBe('button')
    expect(shadcnCaseGrep('shadcn/input', 'input')).toBe('input-')
  })
})
