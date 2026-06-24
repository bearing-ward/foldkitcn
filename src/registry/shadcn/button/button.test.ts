import { Schema as S } from 'effect'
import { describe, expect, test } from 'vitest'

import {
  ButtonSize,
  ButtonVariant,
  baseClassName,
  buttonSizeValues,
  buttonVariantValues,
  buttonVariants,
  linkClassName,
  sizeClassNames,
  variantClassNames,
} from './index'

describe('shadcn/button class helper', () => {
  test('exports Effect Schema literals for variants and sizes', () => {
    expect(S.decodeUnknownSync(ButtonVariant)('outline')).toBe('outline')
    expect(S.decodeUnknownSync(ButtonSize)('icon-sm')).toBe('icon-sm')
  })

  test.each(buttonVariantValues)('includes %s variant classes', variant => {
    const className = buttonVariants({ variant })

    expect(className).toContain(variantClassNames[variant].split(' ').at(0))
    expect(className).toContain('group/button')
  })

  test.each(buttonSizeValues)('includes %s size classes', size => {
    const className = buttonVariants({ size })

    expect(className).toContain(sizeClassNames[size].split(' ').at(0))
    expect(className).toContain('group/button')
  })

  test('preserves custom className through local cn', () => {
    expect(buttonVariants({ className: 'rounded-full px-8' })).toContain(
      'rounded-full px-8',
    )
  })

  test('uses the origin base class string', () => {
    expect(baseClassName).toContain('focus-visible:ring-ring/50')
    expect(baseClassName).toContain("[&_svg:not([class*='size-'])]:size-4")
  })

  test('exports link styling for plain anchors', () => {
    expect(linkClassName()).toContain('text-primary')
    expect(linkClassName({ size: 'sm' })).toContain('h-7')
  })
})
