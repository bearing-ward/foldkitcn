import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as RadioGroup from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
  lastReason: RadioGroup.RadioGroupChangeReason,
  lastFocusSelector: S.String,
  isFocused: S.Boolean,
  isBlurred: S.Boolean,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: 'a',
  lastReason: 'none',
  lastFocusSelector: '',
  isFocused: false,
  isBlurred: false,
}

// MESSAGE

const ChangedRadioGroup = m('ChangedRadioGroup', {
  value: S.String,
  reason: RadioGroup.RadioGroupChangeReason,
  focusSelector: S.optional(S.String),
})
const FocusedRadioGroup = m('FocusedRadioGroup')
const BlurredRadioGroup = m('BlurredRadioGroup')

const Message = S.Union([
  ChangedRadioGroup,
  FocusedRadioGroup,
  BlurredRadioGroup,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedRadioGroup: ({ value, reason, focusSelector }) => [
        evo(model, {
          value: () => value,
          lastReason: () => reason,
          lastFocusSelector: () => focusSelector ?? '',
        }),
        [],
      ],
      FocusedRadioGroup: () => [evo(model, { isFocused: () => true }), []],
      BlurredRadioGroup: () => [evo(model, { isBlurred: () => true }), []],
    }),
  )

// VIEW

const defaultItems: ReadonlyArray<RadioGroup.RadioGroupItemDescriptor> = [
  { id: 'radio-a', value: 'a' },
  { id: 'radio-b', value: 'b' },
  { id: 'radio-c', value: 'c' },
]

const viewRadioGroup =
  (config: Omit<ViewConfig<Message>, 'items' | 'toView' | 'value'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        RadioGroup.view<Message>({
          value: model.value,
          items: defaultItems,
          ...config,
          onValueChange: change => ChangedRadioGroup(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              attributes.items.flatMap(item => [
                h.span(
                  [
                    ...item.root,
                    h.Attribute('data-testid', `radio-${item.item.value}`),
                  ],
                  item.indicator.length > 0
                    ? [
                        h.span(
                          [
                            ...item.indicator,
                            h.Attribute(
                              'data-testid',
                              `indicator-${item.item.value}`,
                            ),
                          ],
                          [],
                        ),
                      ]
                    : [],
                ),
                h.input([...item.input]),
              ]),
            ),
        }),
        h.p([], [`Value ${model.value}`]),
        h.p([], [`Reason ${model.lastReason}`]),
        h.p([], [`Focus ${model.lastFocusSelector}`]),
      ],
    )
  }

describe('base-ui/radio-group', () => {
  test('root, items, and indicator expose group and checked state attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({ keepIndicatorMounted: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr('role', 'radiogroup'),
        Scene.expect(Scene.selector('[data-testid="radio-a"]')).toHaveAttr(
          'aria-checked',
          'true',
        ),
        Scene.expect(Scene.selector('[data-testid="radio-a"]')).toHaveAttr(
          'data-checked',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator-a"]')).toHaveAttr(
          'data-checked',
        ),
        Scene.expect(Scene.selector('[data-testid="radio-b"]')).toHaveAttr(
          'aria-checked',
          'false',
        ),
        Scene.expect(Scene.selector('[data-testid="radio-b"]')).toHaveAttr(
          'data-unchecked',
        ),
      )
    }).not.toThrow()
  })

  test('clicking an item emits a value change payload owned by the consuming model', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Value a')).toExist(),
        Scene.click(Scene.selector('[data-testid="radio-b"]')),
        Scene.expect(Scene.text('Value b')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
        Scene.expect(Scene.text('Focus #radio-b')).toExist(),
        Scene.expect(Scene.selector('[data-testid="radio-b"]')).toHaveAttr(
          'aria-checked',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('arrow keys move to the next enabled item and wrap by default', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({}) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('[data-testid="radio-a"]'), 'ArrowDown'),
        Scene.expect(Scene.text('Value b')).toExist(),
        Scene.expect(Scene.text('Focus #radio-b')).toExist(),
        Scene.keydown(Scene.selector('[data-testid="radio-b"]'), 'ArrowLeft'),
        Scene.expect(Scene.text('Value a')).toExist(),
        Scene.keydown(Scene.selector('[data-testid="radio-a"]'), 'ArrowUp'),
        Scene.expect(Scene.text('Value c')).toExist(),
      )
    }).not.toThrow()
  })

  test('arrow keys skip disabled items and respect loop=false at the edge', () => {
    const items: ReadonlyArray<RadioGroup.RadioGroupItemDescriptor> = [
      { id: 'radio-a', value: 'a' },
      { id: 'radio-b', value: 'b', isDisabled: true },
      { id: 'radio-c', value: 'c' },
    ]
    const viewWithDisabledItem = (model: Model): Html => {
      const h = html<Message>()

      return h.div(
        [],
        [
          RadioGroup.view<Message>({
            value: model.value,
            items,
            loop: false,
            onValueChange: change => ChangedRadioGroup(change),
            toView: attributes =>
              h.div(
                [...attributes.root],
                attributes.items.flatMap(item => [
                  h.span(
                    [
                      ...item.root,
                      h.Attribute('data-testid', `radio-${item.item.value}`),
                    ],
                    [],
                  ),
                  h.input([...item.input]),
                ]),
              ),
          }),
          h.p([], [`Value ${model.value}`]),
          h.p([], [`Focus ${model.lastFocusSelector}`]),
        ],
      )
    }

    expect(() => {
      Scene.scene(
        { update, view: viewWithDisabledItem },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('[data-testid="radio-a"]'), 'ArrowDown'),
        Scene.expect(Scene.text('Value c')).toExist(),
        Scene.expect(Scene.text('Focus #radio-c')).toExist(),
        Scene.keydown(Scene.selector('[data-testid="radio-c"]'), 'ArrowDown'),
        Scene.expect(Scene.text('Value c')).toExist(),
      )
    }).not.toThrow()
  })

  test('shift arrow keys pass through without changing selection', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({}) },
        Scene.with(initialModel),
        Scene.keydown(Scene.selector('[data-testid="radio-a"]'), 'ArrowDown', {
          shiftKey: true,
        }),
        Scene.expect(Scene.text('Value a')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled and read-only groups suppress item activation', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.selector('[data-testid="radio-a"]')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-testid="radio-a"]'),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('input[type="radio"]')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: viewRadioGroup({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-readonly',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-testid="radio-a"]'),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })

  test('required, invalid, orientation, and field state map to ARIA and data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadioGroup({
            orientation: 'horizontal',
            isRequired: true,
            isInvalid: true,
            isFieldInvalid: true,
            isDirty: true,
            isTouched: true,
            isFilled: true,
            isFocused: true,
            isValid: true,
            keepIndicatorMounted: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-required',
          'true',
        ),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-invalid',
          'true',
        ),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr('data-required'),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.selector('[data-testid="radio-a"]')).toHaveAttr(
          'data-focused',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator-a"]')).toHaveAttr(
          'data-valid',
        ),
      )
    }).not.toThrow()
  })

  test('radio inputs preserve native form value semantics', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadioGroup({
            name: 'density',
            form: 'settings',
            isRequired: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#radio-a-input')).toHaveAttr(
          'name',
          'density',
        ),
        Scene.expect(Scene.selector('#radio-a-input')).toHaveAttr(
          'form',
          'settings',
        ),
        Scene.expect(Scene.selector('#radio-a-input')).toHaveAttr('value', 'a'),
        Scene.expect(Scene.selector('#radio-a-input')).toHaveAttr(
          'checked',
          'true',
        ),
        Scene.expect(Scene.selector('#radio-a-input')).toHaveAttr(
          'required',
          'true',
        ),
        Scene.expect(Scene.selector('#radio-b-input')).not.toHaveAttr(
          'checked',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('Space selection is attached on keyup while Enter keydown does not change value', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="radio-b"]')).toHaveHandler(
          'keyup',
        ),
        Scene.keydown(Scene.selector('[data-testid="radio-b"]'), 'Enter'),
        Scene.expect(Scene.text('Value a')).toExist(),
      )
    }).not.toThrow()
  })

  test('focus and blur messages are optional group event attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadioGroup({
            onFocus: FocusedRadioGroup(),
            onBlur: BlurredRadioGroup(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveHandler('focus'),
        Scene.expect(Scene.role('radiogroup')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
