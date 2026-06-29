/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  EmptyAvatarGroup,
  EmptyDemo,
  EmptyInputGroup,
  EmptyRtl,
  SpinnerEmpty,
} from './examples'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  emptyBaseClassName,
  emptyClassName,
  emptyContentBaseClassName,
  emptyDescriptionBaseClassName,
  emptyHeaderBaseClassName,
  emptyMediaBaseClassName,
  emptyMediaClassName,
  emptyMediaVariantClassNames,
  emptyTitleBaseClassName,
} from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewEmpty =
  (config: Parameters<typeof Empty<Message>>[0] = {}) =>
  (_model: Model): Html =>
    Empty<Message>(config)

describe('shadcn/empty class helpers', () => {
  test('exports the origin Empty root, header, and media class strings', () => {
    expect(emptyBaseClassName).toBe(
      'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance',
    )
    expect(emptyHeaderBaseClassName).toBe(
      'flex max-w-sm flex-col items-center gap-2',
    )
    expect(emptyMediaBaseClassName).toBe(
      'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
    )
  })

  test('exports the origin Empty title, description, and content class strings', () => {
    expect(emptyTitleBaseClassName).toBe(
      'cn-font-heading text-sm font-medium tracking-tight',
    )
    expect(emptyDescriptionBaseClassName).toBe(
      'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary',
    )
    expect(emptyContentBaseClassName).toBe(
      'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance',
    )
  })

  test('preserves media variants and class canonicalization', () => {
    expect(emptyMediaVariantClassNames.icon).toBe(
      "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
    )
    expect(emptyMediaClassName({ variant: 'icon' })).toContain('size-8')
    expect(emptyClassName({ className: 'custom p-6 p-8' })).toContain('p-8')
    expect(emptyClassName({ className: 'custom p-6 p-8' })).not.toContain(
      ' p-6 ',
    )
  })
})

describe('shadcn/empty view', () => {
  test('renders the origin slots and attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewEmpty({
            children: [
              EmptyHeader<Message>({
                children: [
                  EmptyMedia<Message>({
                    variant: 'icon',
                    children: ['icon'],
                  }),
                  EmptyTitle<Message>({ children: ['Title'] }),
                  EmptyDescription<Message>({ children: ['Description'] }),
                ],
              }),
              EmptyContent<Message>({ children: ['Content'] }),
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="empty"]')).toHaveAttr(
          'class',
          emptyClassName(),
        ),
        Scene.expect(Scene.selector('[data-slot="empty-header"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="empty-icon"]')).toHaveAttr(
          'data-variant',
          'icon',
        ),
        Scene.expect(Scene.selector('[data-slot="empty-title"]')).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="empty-description"]'),
        ).toExist(),
        Scene.expect(Scene.selector('[data-slot="empty-content"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('supports custom attributes, dir, and toView composition', () => {
    const h = html<Message>()

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewEmpty({
            dir: 'rtl',
            attributes: [h.Id('empty-custom')],
            toView: attributes => h.section([...attributes.empty], []),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('section')).toHaveAttr(
          'data-slot',
          'empty',
        ),
        Scene.expect(Scene.selector('section')).toHaveAttr('dir', 'rtl'),
        Scene.expect(Scene.selector('section')).toHaveAttr(
          'id',
          'empty-custom',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/empty examples', () => {
  test('renders the default demo with buttons and media', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => EmptyDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="empty"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="empty-icon"]')).toHaveAttr(
          'data-variant',
          'icon',
        ),
        Scene.expect(Scene.selector('[data-slot="button"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('renders avatar, input group, rtl, and spinner-backed examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => EmptyAvatarGroup() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="avatar"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => EmptyInputGroup() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="input-group"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="kbd"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => EmptyRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="empty"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        { update, view: () => SpinnerEmpty() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="spinner"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('exposes the installable source manifest paths', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/empty/item.json?raw')
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/empty/index.ts',
      'src/registry/shadcn/empty/examples.ts',
    ])
  })
})
