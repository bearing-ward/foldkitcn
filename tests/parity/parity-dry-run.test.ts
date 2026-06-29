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
      'shadcn/button-group',
      'shadcn/card',
      'shadcn/item',
      'shadcn/input-group',
      'shadcn/spinner',
      'shadcn/breadcrumb',
      'shadcn/pagination',
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/kbd',
      'shadcn/checkbox',
      'shadcn/label',
      'shadcn/input',
      'shadcn/input-otp',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/select',
      'shadcn/combobox',
      'shadcn/dropdown-menu',
      'shadcn/navigation-menu',
      'shadcn/menubar',
      'shadcn/context-menu',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/slider',
      'shadcn/scroll-area',
      'shadcn/switch',
      'shadcn/skeleton',
      'shadcn/table',
      'shadcn/textarea',
      'shadcn/dialog',
      'shadcn/drawer',
      'shadcn/direction',
      'shadcn/sheet',
      'shadcn/alert-dialog',
      'shadcn/popover',
      'shadcn/tooltip',
      'shadcn/hover-card',
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
      'shadcn/button-group',
      'shadcn/card',
      'shadcn/item',
      'shadcn/input-group',
      'shadcn/spinner',
      'shadcn/breadcrumb',
      'shadcn/pagination',
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/kbd',
      'shadcn/checkbox',
      'shadcn/label',
      'shadcn/input',
      'shadcn/input-otp',
      'shadcn/field',
      'shadcn/native-select',
      'shadcn/select',
      'shadcn/combobox',
      'shadcn/dropdown-menu',
      'shadcn/navigation-menu',
      'shadcn/menubar',
      'shadcn/context-menu',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/slider',
      'shadcn/scroll-area',
      'shadcn/switch',
      'shadcn/skeleton',
      'shadcn/table',
      'shadcn/textarea',
      'shadcn/dialog',
      'shadcn/drawer',
      'shadcn/direction',
      'shadcn/sheet',
      'shadcn/alert-dialog',
      'shadcn/popover',
      'shadcn/tooltip',
      'shadcn/hover-card',
      'shadcn/radio-group',
      'shadcn/tabs',
      'shadcn/accordion',
      'shadcn/collapsible',
    ])
  })

  test('preserves scoped and item-id grep behavior', () => {
    expect(matchingItemIds('shadcn/button')).toStrictEqual([
      'shadcn/button',
      'shadcn/button-group',
    ])
    expect(matchingItemIds('button')).toStrictEqual([
      'base-ui/button',
      'shadcn/button',
      'shadcn/button-group',
    ])
    expect(matchingItemIds('toggle')).toStrictEqual([
      'base-ui/toggle',
      'base-ui/toggle-group',
      'shadcn/toggle',
      'shadcn/toggle-group',
    ])
    expect(matchingItemIds('input')).toStrictEqual([
      'shadcn/input-group',
      'base-ui/input',
      'shadcn/input',
      'shadcn/input-otp',
    ])
    expect(matchingItemIds('button-default')).toStrictEqual([])
  })

  test('matches breadcrumb by component grep', () => {
    expect(matchingItemIds('breadcrumb')).toStrictEqual(['shadcn/breadcrumb'])
  })

  test('matches pagination by component grep', () => {
    expect(matchingItemIds('pagination')).toStrictEqual(['shadcn/pagination'])
  })

  test('matches OTP slots with component grep', () => {
    expect(matchingItemIds('otp')).toStrictEqual([
      'base-ui/otp-field',
      'shadcn/input-otp',
    ])
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

  test('matches combobox slots with component grep', () => {
    expect(matchingItemIds('combobox')).toStrictEqual([
      'base-ui/combobox',
      'shadcn/combobox',
    ])
  })

  test('matches autocomplete slots with component grep', () => {
    expect(matchingItemIds('autocomplete')).toStrictEqual([
      'base-ui/autocomplete',
    ])
  })

  test('matches preview card and hover card slots with component grep', () => {
    expect(matchingItemIds('preview-card')).toStrictEqual([
      'base-ui/preview-card',
    ])
    expect(matchingItemIds('hover-card')).toStrictEqual(['shadcn/hover-card'])
  })

  test('matches context menu slots with component grep', () => {
    expect(matchingItemIds('context-menu')).toStrictEqual([
      'base-ui/context-menu',
      'shadcn/context-menu',
    ])
  })

  test('matches menubar slots with component grep', () => {
    expect(matchingItemIds('menubar')).toStrictEqual([
      'base-ui/menubar',
      'shadcn/menubar',
    ])
  })

  test('matches alert dialog slots with component grep', () => {
    expect(matchingItemIds('alert-dialog')).toStrictEqual([
      'base-ui/alert-dialog',
      'shadcn/alert-dialog',
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
    expect(shadcnCaseGrep('shadcn/card', 'card')).toBe('card-')
    expect(shadcnCaseGrep('shadcn/context-menu', 'context-menu')).toBe(
      'context-menu',
    )
  })
})
