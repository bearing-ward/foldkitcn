import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as ToggleGroup from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.Array(S.String),
  highlightedValue: S.String,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: [],
  highlightedValue: '',
}

// MESSAGE

const ChangedValue = m('ChangedValue', { value: S.Array(S.String) })
const HighlightedItem = m('HighlightedItem', { value: S.String })

const Message = S.Union([ChangedValue, HighlightedItem])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedValue: ({ value }) => [evo(model, { value: () => value }), []],
      HighlightedItem: ({ value }) => [
        evo(model, { highlightedValue: () => value }),
        [],
      ],
    }),
  )

// VIEW

const alignmentItems: ReadonlyArray<ToggleGroup.ToggleGroupItemDescriptor> = [
  { id: 'align-left', value: 'left', label: 'Left' },
  { id: 'align-center', value: 'center', label: 'Center' },
  { id: 'align-right', value: 'right', label: 'Right' },
]

const viewToggleGroup =
  (
    config: Omit<ViewConfig<Message>, 'items' | 'toView' | 'value'> &
      Readonly<{
        items?: ReadonlyArray<ToggleGroup.ToggleGroupItemDescriptor>
      }>,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { items = alignmentItems, ...toggleGroupConfig } = config

    return ToggleGroup.view<Message>({
      value: model.value,
      highlightedValue:
        model.highlightedValue.length === 0
          ? undefined
          : model.highlightedValue,
      items,
      onValueChange: change => ChangedValue({ value: change.value }),
      onHighlightChange: change => HighlightedItem({ value: change.value }),
      ...toggleGroupConfig,
      toView: attributes =>
        h.div(
          [...attributes.root],
          attributes.items.map(item =>
            h.button([...item.root], [item.item.label ?? item.item.value]),
          ),
        ),
    })
  }

describe('base-ui/toggle-group', () => {
  test('renders a group and single selection aria-pressed state', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToggleGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('role', 'group'),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('group')).not.toHaveAttr('aria-orientation'),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
        Scene.click(Scene.role('button', { name: 'Center' })),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'data-pressed',
        ),
        Scene.click(Scene.role('button', { name: 'Right' })),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
        Scene.expect(Scene.role('button', { name: 'Right' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('supports multiple pressed items', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggleGroup({ selectionMode: 'multiple' }),
        },
        Scene.with({ value: ['left'], highlightedValue: '' }),
        Scene.expect(Scene.role('group')).toHaveAttr('data-multiple'),
        Scene.expect(Scene.role('button', { name: 'Left' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.click(Scene.role('button', { name: 'Center' })),
        Scene.expect(Scene.role('button', { name: 'Left' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.click(Scene.role('button', { name: 'Left' })),
        Scene.expect(Scene.role('button', { name: 'Left' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
      )
    }).not.toThrow()
  })

  test('disabled groups and items suppress activation', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggleGroup({
            items: [
              { id: 'align-left', value: 'left', label: 'Left' },
              {
                id: 'align-center',
                value: 'center',
                label: 'Center',
                isDisabled: true,
              },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Center' }),
        ).not.toHaveHandler('click'),
      )
      Scene.scene(
        { update, view: viewToggleGroup({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.role('button', { name: 'Left' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('roves focus metadata across horizontal and vertical orientations', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToggleGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#align-left')).toHaveAttr('tabIndex', '0'),
        Scene.keydown(Scene.selector('#align-left'), 'ArrowRight'),
        Scene.expect(Scene.selector('#align-center')).toHaveAttr(
          'tabIndex',
          '0',
        ),
        Scene.keydown(Scene.selector('#align-center'), 'End'),
        Scene.expect(Scene.selector('#align-right')).toHaveAttr(
          'tabIndex',
          '0',
        ),
      )
      Scene.scene(
        { update, view: viewToggleGroup({ orientation: 'vertical' }) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('#align-left'), 'ArrowRight'),
        Scene.expect(Scene.selector('#align-left')).toHaveAttr('tabIndex', '0'),
        Scene.keydown(Scene.selector('#align-left'), 'ArrowDown'),
        Scene.expect(Scene.selector('#align-center')).toHaveAttr(
          'tabIndex',
          '0',
        ),
      )
    }).not.toThrow()
  })
})
