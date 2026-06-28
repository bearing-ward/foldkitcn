/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
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

type TestScrollAreaConfig = Omit<ViewConfig<Message>, 'toView'>

const viewScrollArea =
  (config: TestScrollAreaConfig) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return ScrollArea.view<Message>({
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root, h.Attribute('data-testid', 'root')],
          [
            h.div(
              [...attributes.viewport, h.Attribute('data-testid', 'viewport')],
              [
                h.div(
                  [
                    ...attributes.content,
                    h.Attribute('data-testid', 'content'),
                  ],
                  config.children ?? ['Scrollable content'],
                ),
              ],
            ),
            ...attributes.scrollbars.flatMap(scrollbar =>
              scrollbar.isMounted
                ? [
                    h.div(
                      [
                        ...scrollbar.root,
                        h.Attribute(
                          'data-testid',
                          `${scrollbar.orientation}-scrollbar`,
                        ),
                      ],
                      [
                        h.div(
                          [
                            ...scrollbar.thumb,
                            h.Attribute(
                              'data-testid',
                              `${scrollbar.orientation}-thumb`,
                            ),
                          ],
                          [],
                        ),
                      ],
                    ),
                  ]
                : [],
            ),
            ...(attributes.corner.isMounted
              ? [
                  h.div(
                    [
                      ...attributes.corner.root,
                      h.Attribute('data-testid', 'corner'),
                    ],
                    [],
                  ),
                ]
              : []),
          ],
        ),
    })
  }

describe('base-ui/scroll-area state helpers', () => {
  test('derive overflow edges, metrics, and thumb sizes from measurements', () => {
    const state = ScrollArea.scrollAreaStateFromMetrics({
      viewportWidth: 100,
      viewportHeight: 200,
      contentWidth: 300,
      contentHeight: 1000,
      scrollLeft: 50,
      scrollTop: 400,
      verticalTrackHeight: 200,
      horizontalTrackWidth: 100,
    })

    expect({
      hasOverflowX: state.hasOverflowX,
      hasOverflowY: state.hasOverflowY,
      overflowXStart: state.overflowXStart,
      overflowXEnd: state.overflowXEnd,
      overflowYStart: state.overflowYStart,
      overflowYEnd: state.overflowYEnd,
    }).toStrictEqual({
      hasOverflowX: true,
      hasOverflowY: true,
      overflowXStart: true,
      overflowXEnd: true,
      overflowYStart: true,
      overflowYEnd: true,
    })
    expect(state.overflowMetrics).toStrictEqual({
      xStart: 50,
      xEnd: 150,
      yStart: 400,
      yEnd: 400,
    })
    expect(state.thumbSize.width).toBeCloseTo(33.333333)
    expect(state.thumbSize.height).toBe(40)
  })

  test('respect numeric and per-edge overflow thresholds', () => {
    const state = ScrollArea.scrollAreaStateFromMetrics({
      viewportWidth: 100,
      viewportHeight: 100,
      contentWidth: 500,
      contentHeight: 500,
      scrollLeft: 15,
      scrollTop: 7,
      overflowEdgeThreshold: {
        xStart: 20,
        yStart: 5,
      },
    })

    expect({
      overflowXStart: state.overflowXStart,
      overflowYStart: state.overflowYStart,
    }).toStrictEqual({
      overflowXStart: false,
      overflowYStart: true,
    })
  })

  test('calculate deterministic track and thumb drag scroll offsets', () => {
    expect(
      ScrollArea.trackPressScrollOffset({
        orientation: 'vertical',
        pointerOffset: 160,
        thumbSize: 40,
        trackSize: 200,
        viewportSize: 200,
        contentSize: 1000,
      }),
    ).toBe(700)

    expect(
      ScrollArea.thumbDragScrollOffset({
        startScrollOffset: 0,
        pointerDelta: 20,
        thumbSize: 40,
        trackSize: 200,
        viewportSize: 200,
        contentSize: 1000,
      }),
    ).toBe(100)
  })
})

describe('base-ui/scroll-area view', () => {
  test('renders root, viewport, content, scrollbars, thumbs, and corner attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewScrollArea({
            id: 'area',
            metrics: {
              viewportWidth: 100,
              viewportHeight: 100,
              contentWidth: 300,
              contentHeight: 500,
            },
            scrollbars: [
              { orientation: 'vertical' },
              { orientation: 'horizontal' },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="root"]')).toHaveAttr(
          'role',
          'presentation',
        ),
        Scene.expect(Scene.selector('[data-testid="root"]')).toHaveAttr(
          'data-has-overflow-x',
        ),
        Scene.expect(Scene.selector('[data-testid="viewport"]')).toHaveAttr(
          'tabindex',
          '0',
        ),
        Scene.expect(Scene.selector('[data-testid="content"]')).toHaveAttr(
          'role',
          'presentation',
        ),
        Scene.expect(
          Scene.selector('[data-testid="vertical-scrollbar"]'),
        ).toHaveAttr('data-orientation', 'vertical'),
        Scene.expect(
          Scene.selector('[data-testid="horizontal-scrollbar"]'),
        ).toHaveAttr('data-orientation', 'horizontal'),
        Scene.expect(
          Scene.selector('[data-testid="vertical-thumb"]'),
        ).toHaveAttr('data-orientation', 'vertical'),
        Scene.expect(Scene.selector('[data-testid="corner"]')).toHaveAttr(
          'style',
          'position: absolute; bottom: 0; inset-inline-end: 0; width: 0px; height: 0px;',
        ),
      )
    }).not.toThrow()
  })

  test('keeps non-overflowing viewport out of tab order and mounts kept scrollbars', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewScrollArea({
            metrics: {
              viewportWidth: 200,
              viewportHeight: 200,
              contentWidth: 100,
              contentHeight: 100,
            },
            scrollbars: [
              { orientation: 'vertical', keepMounted: true },
              { orientation: 'horizontal', keepMounted: true },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="viewport"]')).toHaveAttr(
          'tabindex',
          '-1',
        ),
        Scene.expect(
          Scene.selector('[data-testid="vertical-scrollbar"]'),
        ).not.toHaveAttr('data-has-overflow-y'),
        Scene.expect(
          Scene.selector('[data-testid="horizontal-scrollbar"]'),
        ).not.toHaveAttr('data-has-overflow-x'),
      )
    }).not.toThrow()
  })

  test('applies scrolling and hover state to the relevant orientation', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewScrollArea({
            state: {
              hasOverflowX: true,
              hasOverflowY: true,
              scrollingY: true,
              isHovering: true,
              thumbSize: { width: 30, height: 40 },
            },
            scrollbars: [
              { orientation: 'vertical' },
              { orientation: 'horizontal' },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-testid="vertical-scrollbar"]'),
        ).toHaveAttr('data-scrolling'),
        Scene.expect(
          Scene.selector('[data-testid="vertical-scrollbar"]'),
        ).toHaveAttr('data-hovering'),
        Scene.expect(
          Scene.selector('[data-testid="horizontal-scrollbar"]'),
        ).not.toHaveAttr('data-scrolling'),
        Scene.expect(
          Scene.selector('[data-testid="vertical-thumb"]'),
        ).toHaveAttr(
          'style',
          'height: var(--scroll-area-thumb-height); transform: translate3d(0px, 0px, 0px);',
        ),
      )
    }).not.toThrow()
  })
})

describe('base-ui/scroll-area installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/scroll-area',
      '@base-ui-components/react/scroll-area',
      'react',
      'react-dom',
    ]
    const [manifestModule, indexModule] = await Promise.all([
      import('../../../../registry-src/base-ui/scroll-area/item.json?raw'),
      import('./index.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/base-ui/scroll-area/index.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        indexModule.default.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
