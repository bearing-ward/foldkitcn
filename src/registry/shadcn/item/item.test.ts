/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  ItemAvatar,
  ItemDemo,
  ItemDropdown,
  itemExampleViews,
} from './examples'
import * as ItemRegistry from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewOf =
  (body: Html) =>
  (_model: Model): Html =>
    body

describe('shadcn/item class helpers', () => {
  test('exports Effect Schema literals for variants, sizes, and media variants', () => {
    expect(S.decodeUnknownSync(ItemRegistry.ItemVariant)('outline')).toBe(
      'outline',
    )
    expect(S.decodeUnknownSync(ItemRegistry.ItemSize)('xs')).toBe('xs')
    expect(S.decodeUnknownSync(ItemRegistry.ItemMediaVariant)('image')).toBe(
      'image',
    )
  })

  test.each(ItemRegistry.itemVariantValues)(
    'includes %s item variant classes',
    variant => {
      const className = ItemRegistry.itemClassName({ variant })

      expect(className).toContain('group/item')
      expect(className).toContain(
        ItemRegistry.itemVariantClassNames[variant].split(' ').at(0),
      )
    },
  )

  test.each(ItemRegistry.itemSizeValues)(
    'includes %s item size classes',
    size => {
      const className = ItemRegistry.itemClassName({ size })

      expect(className).toContain('group/item')
      expect(className).toContain(
        ItemRegistry.itemSizeClassNames[size].split(' ').at(0),
      )
    },
  )

  test.each(ItemRegistry.itemMediaVariantValues)(
    'includes %s item media variant classes',
    variant => {
      const className = ItemRegistry.itemMediaClassName({ variant })

      expect(className).toContain('group-has-data-[slot=item-description]/item')
      expect(className).toContain(
        ItemRegistry.itemMediaVariantClassNames[variant].split(' ').at(0),
      )
    },
  )

  test('exports exact structural part class helpers', () => {
    expect({
      group: ItemRegistry.itemGroupClassName(),
      separatorIncludesBase: ItemRegistry.itemSeparatorClassName().includes(
        ItemRegistry.itemSeparatorBaseClassName,
      ),
      content: ItemRegistry.itemContentClassName(),
      title: ItemRegistry.itemTitleClassName(),
      description: ItemRegistry.itemDescriptionClassName(),
      actions: ItemRegistry.itemActionsClassName(),
      header: ItemRegistry.itemHeaderClassName(),
      footer: ItemRegistry.itemFooterClassName(),
    }).toStrictEqual({
      group: ItemRegistry.itemGroupBaseClassName,
      separatorIncludesBase: true,
      content: ItemRegistry.itemContentBaseClassName,
      title: ItemRegistry.itemTitleBaseClassName,
      description: ItemRegistry.itemDescriptionBaseClassName,
      actions: ItemRegistry.itemActionsBaseClassName,
      header: ItemRegistry.itemHeaderBaseClassName,
      footer: ItemRegistry.itemFooterBaseClassName,
    })
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      ItemRegistry.itemClassName({ className: 'px-2 px-8 custom-item' }),
    ).toContain('px-8')
    expect(
      ItemRegistry.itemMediaClassName({ className: 'size-4 size-12' }),
    ).toContain('size-12')
    expect(
      ItemRegistry.itemTitleClassName({ className: 'text-sm text-lg' }),
    ).toContain('text-lg')
    expect(
      ItemRegistry.itemSeparatorClassName({ className: 'my-1 my-6' }),
    ).toContain('my-6')
  })
})

describe('shadcn/item view helpers', () => {
  test('renders all origin slots with expected attributes', () => {
    const h = html<Message>()
    const view = viewOf(
      ItemRegistry.ItemGroup<Message>({
        children: [
          ItemRegistry.Item<Message>({
            variant: 'muted',
            size: 'xs',
            children: [
              ItemRegistry.ItemHeader<Message>({ children: ['Header'] }),
              ItemRegistry.ItemMedia<Message>({
                variant: 'icon',
                children: [h.span([], ['i'])],
              }),
              ItemRegistry.ItemContent<Message>({
                children: [
                  ItemRegistry.ItemTitle<Message>({ children: ['Title'] }),
                  ItemRegistry.ItemDescription<Message>({
                    children: ['Description'],
                  }),
                ],
              }),
              ItemRegistry.ItemActions<Message>({ children: ['Action'] }),
              ItemRegistry.ItemFooter<Message>({ children: ['Footer'] }),
            ],
          }),
          ItemRegistry.ItemSeparator<Message>(),
        ],
      }),
    )

    expect(() => {
      Scene.scene(
        { update, view },
        Scene.with(initialModel),
        Scene.expect(Scene.role('list')).toHaveAttr('data-slot', 'item-group'),
        Scene.expect(Scene.selector('[data-slot="item"]')).toHaveAttr(
          'data-variant',
          'muted',
        ),
        Scene.expect(Scene.selector('[data-slot="item"]')).toHaveAttr(
          'data-size',
          'xs',
        ),
        Scene.expect(Scene.selector('[data-slot="item-media"]')).toHaveAttr(
          'data-variant',
          'icon',
        ),
        Scene.expect(Scene.selector('[data-slot="item-header"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="item-content"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="item-title"]')).toHaveText(
          'Title',
        ),
        Scene.expect(
          Scene.selector('[data-slot="item-description"]'),
        ).toHaveText('Description'),
        Scene.expect(Scene.selector('[data-slot="item-actions"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="item-footer"]')).toExist(),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-slot',
          'item-separator',
        ),
      )
    }).not.toThrow()
  })

  test('supports anchor rendering through toView', () => {
    const h = html<Message>()
    const view = viewOf(
      ItemRegistry.Item<Message>({
        variant: 'outline',
        toView: (attributes, children) =>
          h.a(
            [
              ...attributes.item,
              h.Href('/docs'),
              h.Attribute('target', '_blank'),
              h.Rel('noopener noreferrer'),
            ],
            children,
          ),
        children: [
          ItemRegistry.ItemContent<Message>({
            children: [ItemRegistry.ItemTitle<Message>({ children: ['Docs'] })],
          }),
        ],
      }),
    )

    expect(() => {
      Scene.scene(
        { update, view },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('a[data-slot="item"]')).toHaveAttr(
          'href',
          '/docs',
        ),
        Scene.expect(Scene.selector('a[data-slot="item"]')).toHaveAttr(
          'rel',
          'noopener noreferrer',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/item examples', () => {
  test('exports every origin item example', () => {
    expect(itemExampleViews.map(example => example.id)).toStrictEqual([
      'item-demo',
      'item-avatar',
      'item-dropdown',
      'item-group',
      'item-header',
      'item-icon',
      'item-image',
      'item-link',
      'item-rtl',
      'item-size',
      'item-variant',
    ])
  })

  test('renders demo, avatar, and dropdown structures', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewOf(ItemDemo()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="item"]')).toExist(),
        Scene.expect(Scene.text('Basic Item')).toExist(),
        Scene.expect(Scene.selector('a[data-slot="item"]')).toExist(),
      )
    }).not.toThrow()

    expect(() => {
      Scene.scene(
        { update, view: viewOf(ItemAvatar()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="avatar"]')).toExist(),
        Scene.expect(Scene.text('No Team Members')).toExist(),
      )
    }).not.toThrow()

    expect(() => {
      Scene.scene(
        { update, view: viewOf(ItemDropdown()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="button"]')).toHaveAttr(
          'aria-haspopup',
          'menu',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/item manifest and installable source', () => {
  test('keeps manifest examples aligned with exported examples', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/item/item.json?raw')
    const manifest: {
      readonly examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    } = JSON.parse(manifestModule.default)

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      itemExampleViews.map(example => `shadcn/${example.id}`),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      itemExampleViews.map(example => example.title),
    )
  })

  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react',
      '@base-ui-components/react',
      '@/components/language-selector',
      '@/styles/base-nova/ui/item',
      '@/styles/base-nova/ui-rtl/item',
      'class-variance-authority',
      'lucide-react',
      'next/image',
      'react',
      'react-dom',
      'repos/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/item/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/item/index.ts',
      'src/registry/shadcn/item/examples.ts',
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
