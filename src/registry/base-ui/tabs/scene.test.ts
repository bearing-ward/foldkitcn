import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Tabs from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
  highlightedValue: S.String,
  lastDirection: Tabs.TabsActivationDirection,
  lastFocusSelector: S.String,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: 'overview',
  highlightedValue: 'overview',
  lastDirection: 'none',
  lastFocusSelector: '',
}

// MESSAGE

const ChangedTabs = m('ChangedTabs', {
  value: S.String,
  reason: Tabs.TabsChangeReason,
  activationDirection: Tabs.TabsActivationDirection,
  focusSelector: S.optional(S.String),
})
const HighlightedTabs = m('HighlightedTabs', {
  value: S.String,
  focusSelector: S.optional(S.String),
})

const Message = S.Union([ChangedTabs, HighlightedTabs])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedTabs: ({ value, activationDirection, focusSelector }) => [
        evo(model, {
          value: () => value,
          highlightedValue: () => value,
          lastDirection: () => activationDirection,
          lastFocusSelector: () => focusSelector ?? '',
        }),
        [],
      ],
      HighlightedTabs: ({ value, focusSelector }) => [
        evo(model, {
          highlightedValue: () => value,
          lastFocusSelector: () => focusSelector ?? '',
        }),
        [],
      ],
    }),
  )

// VIEW

const tabDescriptors: ReadonlyArray<Tabs.TabsTabDescriptor> = [
  { id: 'tab-overview', value: 'overview', label: 'Overview' },
  { id: 'tab-analytics', value: 'analytics', label: 'Analytics' },
  { id: 'tab-reports', value: 'reports', label: 'Reports' },
]

const panelDescriptors: ReadonlyArray<Tabs.TabsPanelDescriptor> = [
  { id: 'panel-overview', value: 'overview', label: 'Overview panel' },
  {
    id: 'panel-analytics',
    value: 'analytics',
    label: 'Analytics panel',
    keepMounted: true,
  },
  { id: 'panel-reports', value: 'reports', label: 'Reports panel' },
]

const viewTabs =
  (
    config: Omit<
      ViewConfig<Message>,
      'onHighlightChange' | 'onValueChange' | 'tabs' | 'toView' | 'value'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        Tabs.view<Message>({
          value: model.value,
          highlightedValue: model.highlightedValue,
          tabs: tabDescriptors,
          panels: panelDescriptors,
          ...config,
          onValueChange: change => ChangedTabs(change),
          onHighlightChange: change => HighlightedTabs(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              [
                h.div(
                  [...attributes.list],
                  attributes.tabs.map(tab =>
                    h.button([...tab.root], [tab.tab.label ?? tab.tab.value]),
                  ),
                ),
                ...(attributes.indicator.length > 0
                  ? [h.span([...attributes.indicator], [])]
                  : []),
                ...attributes.panels
                  .filter(panel => panel.isMounted)
                  .map(panel =>
                    h.div(
                      [...panel.root],
                      [panel.panel.label ?? panel.panel.value],
                    ),
                  ),
              ],
            ),
        }),
        h.p([], [`Value ${model.value}`]),
        h.p([], [`Highlighted ${model.highlightedValue}`]),
        h.p([], [`Direction ${model.lastDirection}`]),
        h.p([], [`Focus ${model.lastFocusSelector}`]),
      ],
    )
  }

describe('base-ui/tabs', () => {
  test('root, list, tab, and panel attributes preserve ARIA relationships', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('tablist')).toHaveAttr('role', 'tablist'),
        Scene.expect(Scene.role('tab', { name: 'Overview' })).toHaveAttr(
          'aria-selected',
          'true',
        ),
        Scene.expect(Scene.role('tab', { name: 'Overview' })).toHaveAttr(
          'aria-controls',
          'panel-overview',
        ),
        Scene.expect(Scene.selector('#panel-overview')).toHaveAttr(
          'aria-labelledby',
          'tab-overview',
        ),
        Scene.expect(Scene.selector('#panel-analytics')).toHaveAttr('hidden'),
      )
    }).not.toThrow()
  })

  test('clicking a tab emits a model-owned value change', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('tab', { name: 'Analytics' })),
        Scene.expect(Scene.text('Value analytics')).toExist(),
        Scene.expect(Scene.text('Direction right')).toExist(),
        Scene.expect(Scene.text('Focus #tab-analytics')).toExist(),
        Scene.expect(Scene.role('tab', { name: 'Analytics' })).toHaveAttr(
          'data-active',
        ),
      )
    }).not.toThrow()
  })

  test('manual activation roves the highlighted tab without changing selection', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({ activationMode: 'manual' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value overview')).toExist(),
        Scene.expect(Scene.text('Highlighted analytics')).toExist(),
        Scene.expect(Scene.text('Focus #tab-analytics')).toExist(),
        Scene.keydown(Scene.role('tab', { name: 'Analytics' }), 'Enter'),
        Scene.expect(Scene.text('Value analytics')).toExist(),
      )
    }).not.toThrow()
  })

  test('automatic activation selects the roved tab', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({ activationMode: 'automatic' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value analytics')).toExist(),
        Scene.expect(Scene.text('Direction right')).toExist(),
      )
    }).not.toThrow()
  })

  test('vertical orientation uses vertical arrow keys and loopFocus=false', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTabs({
            activationMode: 'automatic',
            orientation: 'vertical',
            loopFocus: false,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('tablist')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value overview')).toExist(),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowDown'),
        Scene.expect(Scene.text('Value analytics')).toExist(),
        Scene.expect(Scene.text('Direction down')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled tabs remain roving targets and suppress activation', () => {
    const disabledTabs: ReadonlyArray<Tabs.TabsTabDescriptor> = [
      { id: 'tab-overview', value: 'overview', label: 'Overview' },
      {
        id: 'tab-analytics',
        value: 'analytics',
        label: 'Analytics',
        isDisabled: true,
      },
      { id: 'tab-reports', value: 'reports', label: 'Reports' },
    ]
    const viewDisabledTabs = (model: Model): Html => {
      const h = html<Message>()

      return h.div(
        [],
        [
          Tabs.view<Message>({
            value: model.value,
            highlightedValue: model.highlightedValue,
            tabs: disabledTabs,
            activationMode: 'automatic',
            onValueChange: change => ChangedTabs(change),
            onHighlightChange: change => HighlightedTabs(change),
            toView: attributes =>
              h.div(
                [...attributes.root],
                [
                  h.div(
                    [...attributes.list],
                    attributes.tabs.map(tab =>
                      h.button([...tab.root], [tab.tab.label ?? tab.tab.value]),
                    ),
                  ),
                ],
              ),
          }),
          h.p([], [`Value ${model.value}`]),
          h.p([], [`Highlighted ${model.highlightedValue}`]),
        ],
      )
    }

    expect(() => {
      Scene.scene(
        { update, view: viewDisabledTabs },
        Scene.with(initialModel),
        Scene.expect(Scene.role('tab', { name: 'Analytics' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value overview')).toExist(),
        Scene.expect(Scene.text('Highlighted analytics')).toExist(),
        Scene.keydown(Scene.role('tab', { name: 'Analytics' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value reports')).toExist(),
        Scene.expect(Scene.text('Highlighted reports')).toExist(),
      )
    }).not.toThrow()
  })

  test('modifier arrow keys pass through without changing highlight or value', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({ activationMode: 'automatic' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight', {
          shiftKey: true,
        }),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight', {
          ctrlKey: true,
        }),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight', {
          altKey: true,
        }),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowRight', {
          metaKey: true,
        }),
        Scene.expect(Scene.text('Value overview')).toExist(),
        Scene.expect(Scene.text('Highlighted overview')).toExist(),
      )
    }).not.toThrow()
  })

  test('rtl horizontal orientation reverses left and right arrow direction', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({ activationMode: 'automatic', dir: 'rtl' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('tab', { name: 'Overview' }), 'ArrowLeft'),
        Scene.expect(Scene.text('Value analytics')).toExist(),
        Scene.expect(Scene.text('Direction right')).toExist(),
        Scene.keydown(Scene.role('tab', { name: 'Analytics' }), 'ArrowRight'),
        Scene.expect(Scene.text('Value overview')).toExist(),
        Scene.expect(Scene.text('Direction left')).toExist(),
      )
    }).not.toThrow()
  })

  test('indicator exposes orientation, activation direction, and geometry variables', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTabs({
            indicatorGeometry: {
              left: 4,
              right: 12,
              top: 2,
              bottom: 6,
              width: 80,
              height: 32,
            },
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[role="presentation"]')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('[role="presentation"]')).toHaveStyle(
          '--active-tab-width',
          '80px',
        ),
      )
    }).not.toThrow()
  })
})
