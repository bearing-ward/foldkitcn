import { Match as M, Option, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as CheckboxGroup from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.Array(S.String),
  lastChangedValue: S.String,
  lastCheckedState: CheckboxGroup.CheckboxGroupValueChange.fields.checkedState,
  lastReason: CheckboxGroup.CheckboxGroupChangeReason,
  isFocused: S.Boolean,
  isBlurred: S.Boolean,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: [],
  lastChangedValue: '',
  lastCheckedState: 'unchecked',
  lastReason: 'none',
  isFocused: false,
  isBlurred: false,
}

// MESSAGE

const ChangedCheckboxGroup = m('ChangedCheckboxGroup', {
  value: S.Array(S.String),
  checkedState: CheckboxGroup.CheckboxGroupValueChange.fields.checkedState,
  reason: CheckboxGroup.CheckboxGroupChangeReason,
  changedValue: S.optional(S.String),
})
const FocusedCheckboxGroup = m('FocusedCheckboxGroup')
const BlurredCheckboxGroup = m('BlurredCheckboxGroup')

const Message = S.Union([
  ChangedCheckboxGroup,
  FocusedCheckboxGroup,
  BlurredCheckboxGroup,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedCheckboxGroup: ({ value, checkedState, reason, changedValue }) => [
        evo(model, {
          value: () => value,
          lastChangedValue: () => changedValue ?? '',
          lastCheckedState: () => checkedState,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedCheckboxGroup: () => [evo(model, { isFocused: () => true }), []],
      BlurredCheckboxGroup: () => [evo(model, { isBlurred: () => true }), []],
    }),
  )

// VIEW

const defaultItems: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor> = [
  { id: 'apple-fuji', value: 'fuji-apple' },
  { id: 'apple-gala', value: 'gala-apple' },
  { id: 'apple-granny', value: 'granny-smith-apple' },
]

const selectedText = (value: ReadonlyArray<string>): string =>
  `Selected ${value.length === 0 ? 'none' : value.join('|')}`

const renderCheckboxGroup = (
  h: ReturnType<typeof html<Message>>,
  attributes: CheckboxGroup.CheckboxGroupAttributes<Message>,
): Html =>
  h.div(
    [...attributes.root],
    [
      ...Option.match(attributes.parent, {
        onNone: () => [],
        onSome: parent => [
          h.span(
            [...parent.root, h.Attribute('data-testid', 'parent')],
            parent.indicator.length > 0
              ? [
                  h.span(
                    [
                      ...parent.indicator,
                      h.Attribute('data-testid', 'parent-indicator'),
                    ],
                    [],
                  ),
                ]
              : [],
          ),
          h.input([...parent.input]),
        ],
      }),
      ...attributes.items.flatMap(item => [
        h.span(
          [
            ...item.root,
            h.Attribute('data-testid', `checkbox-${item.item.value}`),
          ],
          item.indicator.length > 0
            ? [
                h.span(
                  [
                    ...item.indicator,
                    h.Attribute('data-testid', `indicator-${item.item.value}`),
                  ],
                  [],
                ),
              ]
            : [],
        ),
        h.input([...item.input]),
      ]),
    ],
  )

const viewCheckboxGroup =
  (
    config: Omit<ViewConfig<Message>, 'items' | 'toView' | 'value'> &
      Readonly<{
        items?: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor>
      }>,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        h.p([h.Id('fruit-label')], ['Apples']),
        CheckboxGroup.view<Message>({
          id: 'apples',
          ariaLabelledBy: 'fruit-label',
          value: model.value,
          items: defaultItems,
          ...config,
          onValueChange: change => ChangedCheckboxGroup(change),
          toView: attributes => renderCheckboxGroup(h, attributes),
        }),
        h.p([], [selectedText(model.value)]),
        h.p([], [`Changed ${model.lastChangedValue || 'group'}`]),
        h.p([], [`Checked ${model.lastCheckedState}`]),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/checkbox-group', () => {
  test('root and items expose group labeling, checked state, and data attributes', () => {
    const model: Model = {
      ...initialModel,
      value: ['fuji-apple'],
    }

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckboxGroup({
            isRequired: true,
            isFieldInvalid: true,
            keepIndicatorMounted: true,
          }),
        },
        Scene.with(model),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'aria-labelledby',
          'fruit-label',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr('data-required'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-invalid'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
        ).toHaveAttr('aria-checked', 'true'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
        ).toHaveAttr('data-checked'),
        Scene.expect(
          Scene.selector('[data-testid="indicator-fuji-apple"]'),
        ).toHaveAttr('data-checked'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-gala-apple"]'),
        ).toHaveAttr('aria-checked', 'false'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-gala-apple"]'),
        ).toHaveAttr('data-unchecked'),
      )
    }).not.toThrow()
  })

  test('pointer and keyboard selection emit canonical value-change facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckboxGroup({}) },
        Scene.with(initialModel),
        Scene.click(Scene.selector('[data-testid="checkbox-gala-apple"]')),
        Scene.expect(Scene.text('Selected gala-apple')).toExist(),
        Scene.expect(Scene.text('Changed gala-apple')).toExist(),
        Scene.expect(Scene.text('Checked checked')).toExist(),
        Scene.keydown(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
          ' ',
        ),
        Scene.expect(Scene.text('Selected fuji-apple|gala-apple')).toExist(),
        Scene.click(Scene.selector('[data-testid="checkbox-gala-apple"]')),
        Scene.expect(Scene.text('Selected fuji-apple')).toExist(),
        Scene.expect(Scene.text('Checked unchecked')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled groups and disabled items suppress activation and preserve form input attributes', () => {
    const items: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor> = [
      { id: 'apple-fuji', value: 'fuji-apple' },
      { id: 'apple-gala', value: 'gala-apple', isDisabled: true },
    ]

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckboxGroup({
            items,
            name: 'apple',
            form: 'settings',
            isRequired: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#apple-fuji-input')).toHaveAttr(
          'name',
          'apple',
        ),
        Scene.expect(Scene.selector('#apple-fuji-input')).toHaveAttr(
          'form',
          'settings',
        ),
        Scene.expect(Scene.selector('#apple-fuji-input')).toHaveAttr(
          'value',
          'fuji-apple',
        ),
        Scene.expect(Scene.selector('#apple-fuji-input')).toHaveAttr(
          'required',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-gala-apple"]'),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-gala-apple"]'),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#apple-gala-input')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: viewCheckboxGroup({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })

  test('read-only groups suppress activation while preserving readonly attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckboxGroup({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('aria-readonly', 'true'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-readonly'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
        ).toHaveAttr('aria-readonly', 'true'),
        Scene.expect(
          Scene.selector('[data-testid="checkbox-fuji-apple"]'),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })

  test('parent checkbox controls child values and becomes mixed after partial selection', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckboxGroup({
            hasParent: true,
            allValues: ['fuji-apple', 'gala-apple', 'granny-smith-apple'],
            keepIndicatorMounted: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'aria-controls',
          'apple-fuji apple-gala apple-granny',
        ),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'aria-checked',
          'false',
        ),
        Scene.click(Scene.selector('[data-testid="parent"]')),
        Scene.expect(
          Scene.text('Selected fuji-apple|gala-apple|granny-smith-apple'),
        ).toExist(),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'aria-checked',
          'true',
        ),
        Scene.click(Scene.selector('[data-testid="checkbox-gala-apple"]')),
        Scene.expect(
          Scene.text('Selected fuji-apple|granny-smith-apple'),
        ).toExist(),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'data-indeterminate',
        ),
      )
    }).not.toThrow()
  })

  test('parent checkbox preserves checked disabled children when toggling all values off', () => {
    const items: ReadonlyArray<CheckboxGroup.CheckboxGroupItemDescriptor> = [
      { id: 'permission-a', value: 'a', isDisabled: true },
      { id: 'permission-b', value: 'b' },
      { id: 'permission-c', value: 'c' },
    ]
    const model: Model = { ...initialModel, value: ['a'] }

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckboxGroup({
            id: 'permissions',
            hasParent: true,
            items,
            allValues: ['a', 'b', 'c'],
          }),
        },
        Scene.with(model),
        Scene.expect(Scene.selector('[data-testid="parent"]')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
        Scene.click(Scene.selector('[data-testid="parent"]')),
        Scene.expect(Scene.text('Selected a|b|c')).toExist(),
        Scene.click(Scene.selector('[data-testid="parent"]')),
        Scene.expect(Scene.text('Selected a')).toExist(),
        Scene.expect(Scene.selector('[data-testid="checkbox-a"]')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.selector('#permission-a-input')).toHaveAttr(
          'checked',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('focus and blur messages are optional group event attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckboxGroup({
            onFocus: FocusedCheckboxGroup(),
            onBlur: BlurredCheckboxGroup(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveHandler('focus'),
        Scene.expect(Scene.role('group')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
