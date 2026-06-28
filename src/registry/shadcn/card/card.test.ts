/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  CardDemo,
  CardEdgeToEdge,
  CardImage,
  CardRtl,
  CardSmall,
  CardSpacing,
} from './examples'
import * as Card from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const view = (html: Html) => (): Html => html

const cardWithParts = (): Html =>
  Card.Card<never>({
    className: 'custom-card py-2 py-8',
    size: 'sm',
    children: [
      Card.CardHeader<never>({
        children: [
          Card.CardTitle<never>({ children: ['Title'] }),
          Card.CardDescription<never>({ children: ['Description'] }),
          Card.CardAction<never>({ children: ['Action'] }),
        ],
      }),
      Card.CardContent<never>({ children: ['Content'] }),
      Card.CardFooter<never>({ children: ['Footer'] }),
    ],
  })

describe('shadcn/card class helpers', () => {
  test('exports Effect Schema literals for sizes', () => {
    expect(S.decodeUnknownSync(Card.CardSize)('sm')).toBe('sm')
    expect(Card.cardSizeValues).toStrictEqual(['default', 'sm'])
  })

  test('returns the exact base-nova root class and canonicalizes overrides', () => {
    const className = Card.cardClassName({
      className: 'custom-card py-2 py-8',
    })

    expect(Card.cardClassName()).toBe(Card.cardBaseClassName)
    expect(className).toContain('custom-card')
    expect(className).toContain('py-8')
    expect(className).not.toContain('py-2')
    expect(className).not.toContain('py-(--card-spacing)')
  })

  test('exports header, title, and description class helpers', () => {
    expect(Card.cardHeaderClassName()).toBe(Card.cardHeaderBaseClassName)
    expect(Card.cardTitleClassName()).toContain('cn-font-heading')
    expect(Card.cardDescriptionClassName()).toContain('text-muted-foreground')
  })

  test('exports action, content, and footer class helpers', () => {
    expect(Card.cardActionClassName()).toContain('justify-self-end')
    expect(Card.cardContentClassName()).toBe('px-(--card-spacing)')
    expect(Card.cardFooterClassName()).toContain('bg-muted/50')
  })
})

describe('shadcn/card view', () => {
  test('renders root size, slots, and class composition', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(cardWithParts()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'data-size',
          'sm',
        ),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'class',
          Card.cardClassName({ className: 'custom-card py-2 py-8' }),
        ),
        Scene.expect(Scene.selector('[data-slot="card-header"]')).toHaveAttr(
          'class',
          Card.cardHeaderClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="card-title"]')).toHaveText(
          'Title',
        ),
        Scene.expect(
          Scene.selector('[data-slot="card-description"]'),
        ).toHaveText('Description'),
        Scene.expect(Scene.selector('[data-slot="card-action"]')).toHaveText(
          'Action',
        ),
        Scene.expect(Scene.selector('[data-slot="card-content"]')).toHaveText(
          'Content',
        ),
        Scene.expect(Scene.selector('[data-slot="card-footer"]')).toHaveText(
          'Footer',
        ),
      )
    }).not.toThrow()
  })

  test('examples render the documented card structures', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(CardDemo()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card-title"]')).toHaveText(
          'Login to your account',
        ),
        Scene.expect(Scene.selector('[data-slot="input"]')).toHaveAttr(
          'type',
          'email',
        ),
      )
      Scene.scene(
        { update, view: view(CardEdgeToEdge()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card-footer"]')).toHaveText(
          'DeclineAccept',
        ),
      )
      Scene.scene(
        { update, view: view(CardImage()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('img')).toHaveAttr('alt', 'Event cover'),
        Scene.expect(Scene.selector('[data-slot="badge"]')).toHaveText(
          'Featured',
        ),
      )
      Scene.scene(
        { update, view: view(CardRtl()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        { update, view: view(CardSmall()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-size="sm"]')).toExist(),
      )
      Scene.scene(
        { update, view: view(CardSpacing()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="toggle-group"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="card"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/card installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui',
      '@radix-ui',
      'class-variance-authority',
      'lucide-react',
      'next/link',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/',
      '@/lib/utils',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/card/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/card/index.ts',
      'src/registry/shadcn/card/examples.ts',
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
