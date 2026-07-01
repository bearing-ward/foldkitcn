/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  BubbleAlignmentDemo,
  BubbleCollapsibleDemo,
  BubbleDemo,
  BubbleGroupDemo,
  BubbleLinkButtonDemo,
  BubbleMarkdownDemo,
  BubblePopoverDemo,
  BubbleReactionsDemo,
  BubbleTooltipDemo,
  BubbleVariantsDemo,
} from './examples'
import * as Bubble from './index'
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

const viewBubble =
  (config: ViewConfig<Message>) =>
  (_model: Model): Html =>
    Bubble.view<Message>(config)

const viewBubbleReactions =
  (config: Bubble.BubbleReactionsConfig<Message>) =>
  (_model: Model): Html =>
    Bubble.BubbleReactions<Message>(config)

describe('shadcn/bubble class helpers', () => {
  test('exports Effect Schema literals for bubble variants and layout', () => {
    expect(S.decodeUnknownSync(Bubble.BubbleVariant)('tinted')).toBe('tinted')
    expect(S.decodeUnknownSync(Bubble.BubbleAlign)('end')).toBe('end')
    expect(S.decodeUnknownSync(Bubble.BubbleReactionSide)('top')).toBe('top')
    expect(S.decodeUnknownSync(Bubble.BubbleReactionAlign)('start')).toBe(
      'start',
    )
  })

  test('exports the variant and alignment values arrays', () => {
    expect(Bubble.bubbleVariantValues).toStrictEqual([
      'default',
      'secondary',
      'muted',
      'tinted',
      'outline',
      'ghost',
      'destructive',
    ])
    expect(Bubble.bubbleAlignValues).toStrictEqual(['start', 'end'])
    expect(Bubble.bubbleReactionSideValues).toStrictEqual(['top', 'bottom'])
    expect(Bubble.bubbleReactionAlignValues).toStrictEqual(['start', 'end'])
  })

  test('canonicalizes bubble root, content, reactions, and group classes', () => {
    expect(
      Bubble.bubbleClassName({
        className: 'custom-bubble w-full',
        variant: 'ghost',
      }),
    ).toContain('group/bubble')
    expect(
      Bubble.bubbleClassName({
        className: 'custom-bubble',
        variant: 'ghost',
      }),
    ).toContain('data-[variant=ghost]:max-w-full')
    expect(
      Bubble.bubbleContentClassName({
        className: 'custom-content px-2 px-3',
      }),
    ).toContain('custom-content')
    expect(
      Bubble.bubbleReactionsClassName({
        className: 'custom-reactions',
        side: 'top',
        align: 'start',
      }),
    ).toContain('custom-reactions')
    expect(Bubble.bubbleGroupClassName()).toContain('flex min-w-0 flex-col')
  })
})

describe('shadcn/bubble view', () => {
  test('adds origin bubble slots and root data attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewBubble({ align: 'end', variant: 'muted' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="bubble"]')).toHaveAttr(
          'data-align',
          'end',
        ),
        Scene.expect(Scene.selector('[data-slot="bubble"]')).toHaveAttr(
          'data-variant',
          'muted',
        ),
        Scene.expect(Scene.selector('[data-slot="bubble"]')).toHaveAttr(
          'class',
          Bubble.bubbleClassName({ align: 'end', variant: 'muted' }),
        ),
      )
    }).not.toThrow()
  })

  test('adds bubble group, content, and reactions slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Bubble.BubbleGroup<Message>({
              children: [
                Bubble.Bubble<Message>({
                  children: [
                    Bubble.BubbleContent<Message>({
                      children: ['Grouped message'],
                    }),
                  ],
                }),
              ],
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="bubble-group"]')).toHaveAttr(
          'class',
          Bubble.bubbleGroupClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="bubble-content"]')).toHaveAttr(
          'class',
          Bubble.bubbleContentClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('supports custom bubble content and reaction renderers', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            Bubble.BubbleContent<Message>({
              toView: attributes => {
                const h = html<Message>()

                return h.button(
                  [...attributes.content, h.Type('button')],
                  ['Open bubble'],
                )
              },
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Open bubble' })).toHaveAttr(
          'data-slot',
          'bubble-content',
        ),
      )
      Scene.scene(
        {
          update,
          view: viewBubbleReactions({
            side: 'top',
            align: 'start',
            children: ['👍'],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="bubble-reactions"]'),
        ).toHaveAttr('data-side', 'top'),
        Scene.expect(
          Scene.selector('[data-slot="bubble-reactions"]'),
        ).toHaveAttr('data-align', 'start'),
      )
    }).not.toThrow()
  })

  test('examples render the implemented bubble demos', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => BubbleDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Sure. Hit me with your best demo.')).toExist(),
        Scene.expect(
          Scene.role('img', { name: 'Reaction: thumbs up' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Find the bug and fix it.')).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleVariantsDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text('This is the default primary bubble.'),
        ).toExist(),
        Scene.expect(
          Scene.text('We can also use an outlined variant.'),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleAlignmentDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text(
            'This bubble is aligned to the end. Use this for user messages.',
          ),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleLinkButtonDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'I forgot my password' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleReactionsDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Yes, run it' })).toExist(),
        Scene.expect(
          Scene.role('img', { name: 'Reactions: eyes, rocket, and 2 more' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleCollapsibleDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Show more' })).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleTooltipDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Read on Jan 5, 2026 at 4:32 PM' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubblePopoverDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Show error details' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => BubbleMarkdownDemo() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.text(
            'Ghost bubbles work for assistant text, bold emphasis, and other content that should not be framed.',
          ),
        ).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/bubble installable source', () => {
  test('keeps forbidden origin runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/merge-props',
      '@base-ui/react/use-render',
      "from 'class-variance-authority'",
      "from 'lucide-react'",
      "from 'react'",
      "from 'react-dom'",
      "from 'sonner'",
      '@/components/markdown',
      'repos/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/bubble/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/bubble/index.ts',
      'src/registry/shadcn/bubble/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(
        specifier =>
          indexModule.default.includes(specifier) ||
          examplesModule.default.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
