/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { DirectionDemo, DirectionRtlCard } from './examples'
import * as Direction from './index'
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

const viewDirection =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Direction.DirectionProvider<Message>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [`Current direction: ${attributes.direction}`],
        ),
    })
  }

describe('shadcn/direction schema and helpers', () => {
  test('models ltr and rtl as Effect Schema literals', () => {
    expect(Direction.directionValues).toStrictEqual(['ltr', 'rtl'])
    expect(S.decodeUnknownSync(Direction.Direction)('ltr')).toBe('ltr')
    expect(S.decodeUnknownSync(Direction.Direction)('rtl')).toBe('rtl')
    expect(() => S.decodeUnknownSync(Direction.Direction)('ttb')).toThrow(
      /ttb/u,
    )
  })

  test('resolves the local default and detects RTL explicitly', () => {
    expect(Direction.defaultDirection).toBe('ltr')
    expect(Direction.resolvedDirection()).toBe('ltr')
    expect(Direction.resolvedDirection('rtl')).toBe('rtl')
    expect(Direction.isRtl('ltr')).toBeFalsy()
    expect(Direction.isRtl('rtl')).toBeTruthy()
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      Direction.directionClassName({ className: 'px-2 px-4 direction-root' }),
    ).toBe('px-4 direction-root')
  })
})

describe('shadcn/direction view', () => {
  test('passes explicit LTR direction attributes to the caller renderer', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDirection({ direction: 'ltr', lang: 'en' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-direction="ltr"]')).toHaveAttr(
          'dir',
          'ltr',
        ),
        Scene.expect(Scene.selector('[data-direction="ltr"]')).toHaveAttr(
          'lang',
          'en',
        ),
        Scene.expect(Scene.text('Current direction: ltr')).toExist(),
      )
    }).not.toThrow()
  })

  test('passes explicit RTL direction attributes and classes to the caller renderer', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewDirection({
            direction: 'rtl',
            lang: 'ar',
            className: 'direction-shell',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-direction="rtl"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-direction="rtl"]')).toHaveAttr(
          'lang',
          'ar',
        ),
        Scene.expect(Scene.selector('[data-direction="rtl"]')).toHaveAttr(
          'class',
          'direction-shell',
        ),
        Scene.expect(Scene.text('Current direction: rtl')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders the local direction-aware login examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => DirectionDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'data-direction',
          'ltr',
        ),
        Scene.expect(Scene.role('button', { name: 'Login' })).toHaveAttr(
          'data-slot',
          'button',
        ),
      )
      Scene.scene(
        { update, view: () => DirectionRtlCard() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'data-direction',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.text('تسجيل الدخول إلى حسابك')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/direction installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/direction-provider',
      '@radix-ui/react-direction',
      '@radix-ui/react-direction-provider',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova/ui/direction',
      '@/styles/base-nova/ui-rtl/direction',
      '@/styles/base-nova/ui-rtl/button',
      '@/styles/base-nova/ui-rtl/card',
      '@/styles/base-nova/ui-rtl/input',
      '@/styles/base-nova/ui-rtl/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/direction/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/direction/index.ts',
      'src/registry/shadcn/direction/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
