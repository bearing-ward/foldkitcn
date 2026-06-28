import { describe, expect, test } from 'vitest'

import {
  canonicalAttributes,
  canonicalBoundingBox,
  canonicalClassTokens,
  canonicalColor,
  canonicalComputedStyleSummary,
  canonicalDimension,
  canonicalDomStructure,
} from '../../src/registry/parity/canonicalize'
import { paritySlots } from './slots'

describe('parity canonicalizers', () => {
  test('canonicalizes class tokens', () => {
    expect(
      canonicalClassTokens('px-2  text-sm px-2 inline-flex'),
    ).toStrictEqual(['inline-flex', 'px-2', 'text-sm'])
  })

  test('canonicalizes attributes', () => {
    expect(
      canonicalAttributes({
        disabled: true,
        id: ' demo-button ',
        hidden: false,
        'aria-label': '  Save   changes ',
      }),
    ).toStrictEqual([
      { name: 'aria-label', value: 'Save changes' },
      { name: 'disabled', value: '' },
      { name: 'id', value: 'demo-button' },
    ])
  })

  test('canonicalizes DOM structure summaries', () => {
    expect(
      canonicalDomStructure({
        tagName: 'BUTTON',
        attributes: { type: 'button' },
        text: '  Save   changes ',
        children: [{ tagName: 'SPAN', text: ' Icon ' }],
      }),
    ).toStrictEqual({
      tagName: 'button',
      attributes: [{ name: 'type', value: 'button' }],
      text: 'Save changes',
      children: [
        {
          tagName: 'span',
          attributes: [],
          text: 'Icon',
          children: [],
        },
      ],
    })
  })

  test('canonicalizes colors and dimensions', () => {
    expect(canonicalColor('#ff0000')).toBe('rgba(255, 0, 0, 1)')
    expect(canonicalColor('rgba(255, 0, 0, 0.5004)')).toBe(
      'rgba(255, 0, 0, 0.5)',
    )
    expect(canonicalDimension(10.12345)).toBe(10.123)
  })

  test('canonicalizes computed style summaries', () => {
    expect(
      canonicalComputedStyleSummary(
        {
          color: 'rgb(255, 0, 0)',
          width: '20.4444px',
          display: ' inline-flex ',
        },
        ['width', 'display', 'color'],
      ),
    ).toStrictEqual([
      { name: 'color', value: 'rgba(255, 0, 0, 1)' },
      { name: 'display', value: 'inline-flex' },
      { name: 'width', value: '20.444px' },
    ])
  })

  test('canonicalizes bounding boxes', () => {
    expect(
      canonicalBoundingBox({
        x: -0,
        y: 2.34567,
        width: 100.9999,
        height: 40.1111,
      }),
    ).toStrictEqual({
      x: 0,
      y: 2.346,
      width: 101,
      height: 40.111,
    })
  })

  test('discovers ready registry parity slots', () => {
    expect(paritySlots.map(slot => slot.itemId)).toStrictEqual([
      'shadcn/aspect-ratio',
      'base-ui/button',
      'base-ui/toggle',
      'base-ui/toggle-group',
      'base-ui/toolbar',
      'base-ui/avatar',
      'base-ui/progress',
      'base-ui/meter',
      'base-ui/fieldset',
      'base-ui/slider',
      'base-ui/scroll-area',
      'base-ui/number-field',
      'base-ui/field',
      'base-ui/form',
      'shadcn/alert',
      'shadcn/avatar',
      'shadcn/badge',
      'shadcn/button',
      'shadcn/toggle',
      'shadcn/toggle-group',
      'shadcn/kbd',
      'base-ui/input',
      'base-ui/otp-field',
      'base-ui/checkbox',
      'base-ui/checkbox-group',
      'shadcn/checkbox',
      'shadcn/label',
      'shadcn/input',
      'shadcn/input-otp',
      'shadcn/field',
      'shadcn/native-select',
      'base-ui/select',
      'shadcn/select',
      'base-ui/combobox',
      'base-ui/autocomplete',
      'shadcn/combobox',
      'base-ui/menu',
      'base-ui/menubar',
      'base-ui/navigation-menu',
      'base-ui/context-menu',
      'shadcn/dropdown-menu',
      'shadcn/navigation-menu',
      'shadcn/menubar',
      'shadcn/context-menu',
      'base-ui/separator',
      'shadcn/separator',
      'shadcn/progress',
      'shadcn/slider',
      'shadcn/scroll-area',
      'base-ui/switch',
      'shadcn/switch',
      'shadcn/skeleton',
      'shadcn/textarea',
      'base-ui/dialog',
      'shadcn/dialog',
      'base-ui/drawer',
      'shadcn/drawer',
      'base-ui/alert-dialog',
      'shadcn/alert-dialog',
      'base-ui/popover',
      'base-ui/tooltip',
      'base-ui/preview-card',
      'shadcn/popover',
      'shadcn/tooltip',
      'shadcn/hover-card',
      'base-ui/radio',
      'base-ui/radio-group',
      'shadcn/radio-group',
      'base-ui/tabs',
      'shadcn/tabs',
      'base-ui/accordion',
      'shadcn/accordion',
      'base-ui/collapsible',
      'shadcn/collapsible',
    ])
  })
})
