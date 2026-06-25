/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  BadgeVariant,
  badgeVariantValues,
  badgeVariants,
  baseClassName,
  variantClassNames,
  view as Badge,
} from './index'
import type { ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

type ElementKind = 'span' | 'a'

type TestBadgeConfig = Omit<ViewConfig<Message>, 'toView'> &
  Readonly<{
    elementKind?: ElementKind
  }>

const viewBadge =
  (config: TestBadgeConfig) =>
  (_model: Model): Html => {
    const h = html<Message>()
    const { elementKind = 'span', ...badgeConfig } = config

    return Badge<Message>({
      ...badgeConfig,
      toView: attributes =>
        elementKind === 'span'
          ? h.span([...attributes.badge], ['Badge'])
          : h.a([...attributes.badge, h.Href('#link')], ['Badge']),
    })
  }

describe('shadcn/badge class helper', () => {
  test('exports Effect Schema literals for variants', () => {
    expect(S.decodeUnknownSync(BadgeVariant)('secondary')).toBe('secondary')
  })

  test('returns the base class and default variant class by default', () => {
    const className = badgeVariants()

    expect(className).toContain(baseClassName)
    expect(className).toContain(variantClassNames.default)
  })

  test.each(badgeVariantValues)(
    'maps %s to the exact origin variant class string',
    variant => {
      expect(badgeVariants({ variant })).toContain(variantClassNames[variant])
    },
  )

  test('preserves custom className through local cn canonicalization', () => {
    const className = badgeVariants({
      className: 'custom-badge px-1 px-3',
    })

    expect(className).toContain('custom-badge')
    expect(className).toContain('px-3')
    expect(className).not.toContain('px-1')
  })
})

describe('shadcn/badge view', () => {
  test('adds the shadcn data slot and expected classes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewBadge({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('span')).toHaveAttr('data-slot', 'badge'),
        Scene.expect(Scene.selector('span')).toHaveAttr(
          'class',
          badgeVariants(),
        ),
      )
    }).not.toThrow()
  })

  test('toView can render an anchor for link-style examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewBadge({ elementKind: 'a', variant: 'link' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('a')).toHaveAttr('href', '#link'),
        Scene.expect(Scene.selector('a')).toHaveAttr('data-slot', 'badge'),
        Scene.expect(Scene.selector('a')).toHaveAttr(
          'class',
          badgeVariants({ variant: 'link' }),
        ),
      )
    }).not.toThrow()
  })
})
