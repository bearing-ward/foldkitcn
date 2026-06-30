/// <reference types="vite/client" />

import { Match as M, Schema as S } from 'effect'
import { Scene, Story } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  ResizableDemo,
  ResizableHandleDemo,
  ResizableRtl,
  ResizableVertical,
} from './examples'
import * as Resizable from './index'
import type { ResizablePanelConfig, ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  resizable: Resizable.ResizableState,
})
type Model = typeof Model.Type

const panels: ReadonlyArray<ResizablePanelConfig<Message>> = [
  { id: 'sidebar', defaultSize: 25, minSize: 20, children: ['Sidebar'] },
  { id: 'content', defaultSize: 75, minSize: 40, children: ['Content'] },
]

const initialModel = (
  options: Readonly<{
    dir?: Resizable.ResizableDirection
    orientation?: Resizable.ResizableOrientation
  }> = {},
): Model => ({
  resizable: Resizable.resizableState({
    orientation: options.orientation,
    dir: options.dir,
    panels,
  }),
})

// MESSAGE

const GotResizableMessage = m('GotResizableMessage', {
  message: Resizable.ResizableMessage,
})
const Message = S.Union([GotResizableMessage])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      GotResizableMessage: ({ message: resizableMessage }) => {
        const [resizable] = Resizable.update(model.resizable, resizableMessage)

        return [evo(model, { resizable: () => resizable }), []]
      },
    }),
  )

// VIEW

const viewResizable =
  (config: Omit<ViewConfig<Message>, 'panels' | 'state' | 'toMessage'> = {}) =>
  (model: Model): Html =>
    Resizable.view<Message>({
      state: model.resizable,
      panels,
      toMessage: message => GotResizableMessage({ message }),
      ...config,
    })

type StaticModel = Record<string, never>
type StaticMessage = never

const staticModel: StaticModel = {}
const staticUpdate = (
  model: StaticModel,
  _message: StaticMessage,
): readonly [StaticModel, ReadonlyArray<Command.Command<StaticMessage>>] => [
  model,
  [],
]

const staticView = (renderedHtml: Html) => (): Html => renderedHtml

describe('shadcn/resizable state helpers', () => {
  test('normalizes panel sizes and preserves constraints', () => {
    const state = Resizable.resizableState({
      panels: [
        { id: 'one', defaultSize: 30, minSize: 20 },
        { id: 'two', defaultSize: 30, minSize: 20 },
      ],
    })

    expect(state.panels.map(panel => panel.size)).toStrictEqual([50, 50])
    expect(state.panels[0]?.minSize).toBe(20)
    expect(state.panels[1]?.maxSize).toBe(100)
  })

  test('resizes adjacent panels while respecting min and max constraints', () => {
    const state = Resizable.resizableState({
      panels: [
        { id: 'one', defaultSize: 50, minSize: 25, maxSize: 80 },
        { id: 'two', defaultSize: 50, minSize: 30, maxSize: 75 },
      ],
    })

    expect(
      Resizable.resizedState(state, 0, 20).panels.map(panel => panel.size),
    ).toStrictEqual([70, 30])
    expect(
      Resizable.resizedState(state, 0, 50).panels.map(panel => panel.size),
    ).toStrictEqual([70, 30])
    expect(
      Resizable.resizedState(state, 0, -50).panels.map(panel => panel.size),
    ).toStrictEqual([25, 75])
  })

  test('supports collapsible panels', () => {
    const state = Resizable.resizableState({
      panels: [
        {
          id: 'sidebar',
          defaultSize: 25,
          minSize: 20,
          collapsible: true,
          collapsedSize: 0,
        },
        { id: 'content', defaultSize: 75, minSize: 40 },
      ],
    })
    const collapsed = Resizable.collapsedPanelState(state, 0)

    expect(collapsed.panels[0]?.size).toBe(0)
    expect(collapsed.panels[0]?.collapsed).toBeTruthy()
  })
})

describe('shadcn/resizable update', () => {
  test('keyboard resizing updates the owning state', () => {
    Story.story(
      Resizable.update,
      Story.with(
        Resizable.resizableState({
          panels: [
            { id: 'one', defaultSize: 50, minSize: 20 },
            { id: 'two', defaultSize: 50, minSize: 20 },
          ],
        }),
      ),
      Story.message(
        Resizable.PressedResizableKey({
          handleIndex: 0,
          key: 'ArrowRight',
          shiftKey: false,
        }),
      ),
      Story.Command.expectNone(),
      Story.model(model => {
        expect(model.panels.map(panel => panel.size)).toStrictEqual([60, 40])
      }),
    )
  })

  test('pointer drag uses the recorded starting sizes', () => {
    Story.story(
      Resizable.update,
      Story.with(
        Resizable.resizableState({
          panels: [
            { id: 'one', defaultSize: 50, minSize: 20 },
            { id: 'two', defaultSize: 50, minSize: 20 },
          ],
        }),
      ),
      Story.message(
        Resizable.StartedResizableDrag({
          handleIndex: 0,
          screenX: 100,
          screenY: 0,
          groupSizePx: 400,
        }),
      ),
      Story.message(
        Resizable.MovedResizablePointer({
          screenX: 200,
          screenY: 0,
        }),
      ),
      Story.model(model => {
        expect(model.panels.map(panel => panel.size)).toStrictEqual([75, 25])
      }),
      Story.message(Resizable.EndedResizableDrag()),
      Story.model(model => {
        expect(model.maybeActiveDrag._tag).toBe('None')
      }),
    )
  })
})

describe('shadcn/resizable view', () => {
  test('renders origin slots, aria orientation, separators, and panel sizes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewResizable({ withHandle: true }) },
        Scene.with(initialModel()),
        Scene.expect(
          Scene.selector('[data-slot="resizable-panel-group"]'),
        ).toHaveAttr('aria-orientation', 'horizontal'),
        Scene.expectAll(
          Scene.all.selector('[data-slot="resizable-panel"]'),
        ).toHaveCount(2),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr('aria-valuenow', '25'),
        Scene.expect(
          Scene.selector('[data-slot="resizable-panel"]'),
        ).toHaveAttr('style', 'flex: 25 1 0px; overflow: hidden;'),
        Scene.expect(
          Scene.selector('[data-slot="resizable-handle"] div'),
        ).toHaveAttr('class', Resizable.resizableHandleIconClassName()),
      )
    }).not.toThrow()
  })

  test('keyboard interaction updates panel styles', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewResizable() },
        Scene.with(initialModel()),
        Scene.keydown(Scene.role('separator'), 'ArrowRight'),
        Scene.expect(
          Scene.selector('[data-slot="resizable-panel"]'),
        ).toHaveAttr('style', 'flex: 35 1 0px; overflow: hidden;'),
      )
    }).not.toThrow()
  })

  test('external pointer tracking keeps handle start and delegates document moves', () => {
    const h = html<Message>()

    Resizable.view<Message>({
      state: initialModel().resizable,
      panels,
      pointerTracking: 'external',
      toMessage: message => GotResizableMessage({ message }),
      toView: attributes => {
        const rootTags = attributes.root.map(attribute => attribute._tag)
        const handleTags = attributes.handles[0]?.root.map(
          attribute => attribute._tag,
        )

        expect(rootTags).not.toContain('OnPointerMove')
        expect(handleTags).toContain('OnKeyDownPreventDefault')
        expect(handleTags).toContain('OnPointerDown')

        return h.div([], [])
      },
    })
  })

  test('vertical and RTL examples preserve origin structure', () => {
    expect(() => {
      Scene.scene(
        { update: staticUpdate, view: staticView(ResizableVertical()) },
        Scene.with(staticModel),
        Scene.expect(
          Scene.selector('[data-slot="resizable-panel-group"]'),
        ).toHaveAttr('aria-orientation', 'vertical'),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()

    expect(() => {
      Scene.scene(
        { update: staticUpdate, view: staticView(ResizableRtl()) },
        Scene.with(staticModel),
        Scene.expect(
          Scene.selector('[data-slot="resizable-panel-group"]'),
        ).toHaveAttr('dir', 'rtl'),
      )
    }).not.toThrow()
  })

  test('origin examples render without requiring React runtime dependencies', () => {
    const h = html<StaticMessage>()

    expect(() => {
      Scene.scene(
        {
          update: staticUpdate,
          view: staticView(
            h.div(
              [],
              [ResizableDemo(), ResizableHandleDemo(), ResizableVertical()],
            ),
          ),
        },
        Scene.with(staticModel),
        Scene.expectAll(
          Scene.all.selector('[data-slot="resizable-panel-group"]'),
        ).toHaveCount(4),
      )
    }).not.toThrow()
  })
})

describe('shadcn/resizable installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      'react',
      'react-dom',
      'react-resizable-panels',
      '@/components/language-selector',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/resizable/item.json?raw'),
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
      'src/registry/shadcn/resizable/index.ts',
      'src/registry/shadcn/resizable/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
