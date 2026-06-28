/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as ScrollArea from './index'
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

const viewScrollArea =
  (config: ViewConfig<Message>) =>
  (_model: Model): Html =>
    ScrollArea.view<Message>({
      metrics: {
        viewportWidth: 100,
        viewportHeight: 100,
        contentWidth: 100,
        contentHeight: 400,
      },
      children: ['Scrollable content'],
      ...config,
    })

describe('shadcn/scroll-area class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(ScrollArea.scrollAreaBaseClassName).toBe('relative')
    expect(ScrollArea.scrollAreaViewportBaseClassName).toBe(
      'size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 base-ui-disable-scrollbar',
    )
    expect(ScrollArea.scrollAreaScrollbarBaseClassName).toBe(
      'flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent',
    )
    expect(ScrollArea.scrollAreaThumbBaseClassName).toBe(
      'relative flex-1 rounded-full bg-border',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      ScrollArea.scrollAreaClassName({ className: 'relative custom-root' }),
    ).toContain('custom-root')
    expect(
      ScrollArea.scrollAreaViewportClassName({
        className: 'outline-none custom-viewport',
      }),
    ).toContain('custom-viewport')
    expect(
      ScrollArea.scrollAreaScrollbarClassName({
        className: 'p-1 p-2 custom-scrollbar',
      }),
    ).toContain('custom-scrollbar')
    expect(
      ScrollArea.scrollAreaThumbClassName({
        className: 'bg-red-500 bg-blue-500',
      }),
    ).toContain('bg-blue-500')
  })
})

describe('shadcn/scroll-area view', () => {
  test('adds shadcn slots and composes the default vertical structure', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewScrollArea({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="scroll-area"]')).toHaveAttr(
          'class',
          ScrollArea.scrollAreaClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="scroll-area-viewport"]'),
        ).toHaveAttr('class', ScrollArea.scrollAreaViewportClassName()),
        Scene.expect(
          Scene.selector('[data-slot="scroll-area-scrollbar"]'),
        ).toHaveAttr('data-orientation', 'vertical'),
        Scene.expect(
          Scene.selector('[data-slot="scroll-area-thumb"]'),
        ).toHaveAttr('class', ScrollArea.scrollAreaThumbClassName()),
      )
    }).not.toThrow()
  })

  test('renders the horizontal ScrollBar composition when requested', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewScrollArea({
            metrics: {
              viewportWidth: 100,
              viewportHeight: 100,
              contentWidth: 400,
              contentHeight: 100,
            },
            scrollbars: [
              { orientation: 'vertical' },
              { orientation: 'horizontal' },
            ],
            horizontalScrollbarClassName: 'custom-horizontal',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-orientation="horizontal"]'),
        ).toHaveAttr(
          'class',
          ScrollArea.scrollAreaScrollbarClassName({
            className: 'custom-horizontal',
          }),
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI direction and custom classes through the wrapper', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewScrollArea({
            dir: 'rtl',
            className: 'h-72 w-48',
            viewportClassName: 'custom-viewport',
            thumbClassName: 'custom-thumb',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="scroll-area"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="scroll-area"]')).toHaveAttr(
          'class',
          ScrollArea.scrollAreaClassName({ className: 'h-72 w-48' }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="scroll-area-viewport"]'),
        ).toHaveAttr(
          'class',
          ScrollArea.scrollAreaViewportClassName({
            className: 'custom-viewport',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="scroll-area-thumb"]'),
        ).toHaveAttr(
          'class',
          ScrollArea.scrollAreaThumbClassName({ className: 'custom-thumb' }),
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/scroll-area installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/scroll-area',
      '@base-ui-components/react/scroll-area',
      'next/image',
      '@/components/language-selector',
      'react',
      'react-dom',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/scroll-area/item.json?raw'),
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
      'src/registry/shadcn/scroll-area/index.ts',
      'src/registry/shadcn/scroll-area/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
