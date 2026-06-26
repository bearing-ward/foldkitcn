/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  ToggleDemo,
  ToggleDisabled,
  ToggleOutline,
  ToggleRtl,
  ToggleSizes,
  ToggleText,
} from './examples'
import * as Toggle from './index'
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

const viewToggle =
  (
    config: Omit<ViewConfig<Message>, 'isPressed' | 'toView'> &
      Readonly<{ isPressed?: boolean }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Toggle.view<Message>({
      isPressed: false,
      ...config,
      toView: attributes => h.button([...attributes.button], ['Toggle']),
    })
  }

describe('shadcn/toggle class helpers', () => {
  test('exports Effect Schema literals for variants and sizes', () => {
    expect(S.decodeUnknownSync(Toggle.ToggleVariant)('outline')).toBe('outline')
    expect(S.decodeUnknownSync(Toggle.ToggleSize)('sm')).toBe('sm')
  })

  test.each(Toggle.toggleVariantValues)(
    'includes %s variant classes',
    variant => {
      const className = Toggle.toggleVariants({ variant })

      expect(className).toContain(Toggle.variantClassNames[variant])
      expect(className).toContain('group/toggle')
    },
  )

  test.each(Toggle.toggleSizeValues)('includes %s size classes', size => {
    const className = Toggle.toggleVariants({ size })

    expect(className).toContain(Toggle.sizeClassNames[size].split(' ').at(0))
    expect(className).toContain('group/toggle')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      Toggle.toggleVariants({ className: 'custom-toggle h-4 h-5' }),
    ).toContain('custom-toggle')
    expect(
      Toggle.toggleVariants({ className: 'custom-toggle h-4 h-5' }),
    ).toContain('h-5')
  })

  test('uses the origin base class string', () => {
    expect(Toggle.baseClassName).toContain('aria-pressed:bg-muted')
    expect(Toggle.baseClassName).toContain(
      "[&_svg:not([class*='size-'])]:size-4",
    )
  })
})

describe('shadcn/toggle view', () => {
  test('adds the shadcn slot and passes pressed state through Base UI Toggle', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggle({
            isPressed: true,
            variant: 'outline',
            size: 'sm',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'data-slot',
          'toggle',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Toggle' })).toHaveAttr(
          'data-pressed',
        ),
      )
    }).not.toThrow()
  })

  test('examples render the shadcn Toggle demos without origin runtime dependencies', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ToggleDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Toggle bookmark' }),
        ).toHaveAttr('data-slot', 'toggle'),
        Scene.expect(
          Scene.role('button', { name: 'Toggle bookmark' }),
        ).toHaveText('Bookmark'),
      )
      Scene.scene(
        { update, view: () => ToggleDisabled() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Toggle disabled' }),
        ).toHaveAttr('disabled'),
        Scene.expect(
          Scene.role('button', { name: 'Toggle disabled' }),
        ).toHaveText('Disabled'),
      )
      Scene.scene(
        { update, view: () => ToggleOutline() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Toggle italic' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleSizes() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Toggle large' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleText() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Toggle italic' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/toggle installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/toggle',
      '@base-ui-components/react/toggle',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/toggle/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/toggle/index.ts',
      'src/registry/shadcn/toggle/examples.ts',
    ])
    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
