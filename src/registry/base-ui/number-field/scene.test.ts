import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as NumberField from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.Union([S.Number, S.Null]),
  textValue: S.String,
  lastReason: NumberField.NumberFieldChangeReason,
  valueState: NumberField.NumberFieldValueState,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: 100,
  textValue: '100',
  lastReason: 'none',
  valueState: NumberField.NumberFieldParsed({
    value: 100,
    textValue: '100',
  }),
}

// MESSAGE

const ChangedNumberField = m('ChangedNumberField', {
  value: S.Union([S.Number, S.Null]),
  textValue: S.String,
  state: NumberField.NumberFieldValueState,
  reason: NumberField.NumberFieldChangeReason,
})
const FocusedNumberField = m('FocusedNumberField')
const BlurredNumberField = m('BlurredNumberField')

const Message = S.Union([
  ChangedNumberField,
  FocusedNumberField,
  BlurredNumberField,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedNumberField: ({ value, textValue, state, reason }) => [
        evo(model, {
          value: () => value,
          textValue: () => textValue,
          valueState: () => state,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedNumberField: () => [model, []],
      BlurredNumberField: () => [model, []],
    }),
  )

// VIEW

const viewNumberField =
  (config: Omit<ViewConfig<Message>, 'textValue' | 'toView' | 'value'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        NumberField.view<Message>({
          id: 'amount',
          inputId: 'amount-input',
          labelId: 'amount-label',
          name: 'amount',
          value: model.value,
          textValue: model.textValue,
          ...config,
          onValueChange: change => ChangedNumberField(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              [
                h.div(
                  [...attributes.scrubArea],
                  [
                    h.label(
                      [h.Id('amount-label'), h.For('amount-input')],
                      ['Amount'],
                    ),
                    h.span([...attributes.scrubAreaCursor], ['cursor']),
                  ],
                ),
                h.div(
                  [...attributes.group],
                  [
                    h.button([...attributes.decrement], ['-']),
                    h.input([...attributes.input]),
                    h.button([...attributes.increment], ['+']),
                  ],
                ),
                h.input([...attributes.hiddenInput]),
                h.p([], [`Value ${model.value ?? 'empty'}`]),
                h.p([], [`Text ${model.textValue}`]),
                h.p([], [`Reason ${model.lastReason}`]),
                h.p([], [`State ${model.valueState._tag}`]),
              ],
            ),
        }),
      ],
    )
  }

describe('base-ui/number-field source-port helpers', () => {
  test('parses localized numeric text deterministically', () => {
    expect(NumberField.parseNumber('１，２３４．５６')).toBe(1234.56)
    expect(NumberField.parseNumber('一,二三四.五六')).toBe(1234.56)
    expect(NumberField.parseNumber('12%')).toBe(0.12)
    expect(NumberField.parseNumber('12‰')).toBe(0.012)
    expect(NumberField.parseNumber('1.234,56', 'de-DE')).toBe(1234.56)
  })

  test('rejects infinity-like numeric text', () => {
    expect(NumberField.parseNumber('Infinity')).toBeNull()
  })

  test('represents empty, invalid, and parsed text with Schema states', () => {
    expect(NumberField.valueStateFromText('')._tag).toBe('Empty')
    expect(NumberField.valueStateFromText('abc')._tag).toBe('Invalid')
    expect(NumberField.valueStateFromText('123')._tag).toBe('Parsed')
  })

  test('clamps typed values unless out-of-range entry is allowed', () => {
    expect(
      NumberField.numberFieldInputChange('200', {
        min: 0,
        max: 120,
      }).value,
    ).toBe(120)
    expect(
      NumberField.numberFieldInputChange('200', {
        min: 0,
        max: 120,
        allowOutOfRange: true,
      }).value,
    ).toBe(200)
  })

  test('steps from empty state and cleans floating point arithmetic', () => {
    const state = NumberField.numberFieldState({
      value: 0.2,
      textValue: '0.2',
      step: 0.1,
    })

    expect(
      NumberField.numberFieldStepChange(state, {}, 1, 'increment-press').value,
    ).toBe(0.3)

    expect(
      NumberField.numberFieldStepChange(
        NumberField.numberFieldState({ value: null, textValue: '' }),
        { min: 5, max: 10 },
        1,
        'increment-press',
      ).value,
    ).toBe(5)
  })
})

describe('base-ui/number-field view', () => {
  test('renders root, scrub area, group, input, steppers, and hidden form input', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNumberField({ min: 0, max: 200, step: 5 }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('id', 'amount'),
        Scene.expect(Scene.selector('#amount-label')).toHaveText('Amount'),
        Scene.expect(Scene.role('group')).toExist(),
        Scene.expect(Scene.label('Amount')).toHaveAttr(
          'aria-roledescription',
          'Number field',
        ),
        Scene.expect(Scene.label('Amount')).toHaveAttr('inputmode', 'numeric'),
        Scene.expect(Scene.label('Amount')).toHaveValue('100'),
        Scene.expect(Scene.selector('#amount-input-hidden-input')).toHaveAttr(
          'type',
          'number',
        ),
        Scene.expect(Scene.selector('#amount-input-hidden-input')).toHaveAttr(
          'name',
          'amount',
        ),
        Scene.expect(Scene.selector('#amount-input-hidden-input')).toHaveAttr(
          'value',
          '100',
        ),
      )
    }).not.toThrow()
  })

  test('typing emits parsed text facts owned by the consuming model', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNumberField({ min: 0, max: 120 }) },
        Scene.with(initialModel),
        Scene.type(Scene.label('Amount'), '130'),
        Scene.expect(Scene.text('Value 120')).toExist(),
        Scene.expect(Scene.text('Text 130')).toExist(),
        Scene.expect(Scene.text('Reason input-change')).toExist(),
        Scene.expect(Scene.text('State Parsed')).toExist(),
      )
    }).not.toThrow()
  })

  test('invalid input preserves text and emits an invalid parse state', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNumberField({}) },
        Scene.with(initialModel),
        Scene.type(Scene.label('Amount'), 'abc'),
        Scene.expect(Scene.text('Value empty')).toExist(),
        Scene.expect(Scene.text('Text abc')).toExist(),
        Scene.expect(Scene.text('State Invalid')).toExist(),
      )
    }).not.toThrow()
  })

  test('keyboard and stepper controls emit normalized change facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNumberField({ min: 0, max: 200, step: 5 }) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Increase' })),
        Scene.expect(Scene.text('Value 105')).toExist(),
        Scene.expect(Scene.text('Reason increment-press')).toExist(),
        Scene.keydown(Scene.label('Amount'), 'ArrowDown'),
        Scene.expect(Scene.text('Value 100')).toExist(),
        Scene.expect(Scene.text('Reason keyboard')).toExist(),
        Scene.click(Scene.role('button', { name: 'Decrease' })),
        Scene.expect(Scene.text('Value 95')).toExist(),
        Scene.expect(Scene.text('Reason decrement-press')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled state suppresses value-changing handlers and marks parts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewNumberField({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.label('Amount')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.role('button', { name: 'Increase' })).toHaveAttr(
          'disabled',
          'true',
        ),
        Scene.expect(Scene.label('Amount')).not.toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('read-only input remains focusable but has no value-changing handlers', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNumberField({
            isReadOnly: true,
            onFocus: FocusedNumberField(),
            onBlur: BlurredNumberField(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Amount')).toHaveAttr('readOnly', 'true'),
        Scene.expect(Scene.label('Amount')).toHaveHandler('focus'),
        Scene.expect(Scene.label('Amount')).toHaveHandler('blur'),
        Scene.expect(Scene.label('Amount')).not.toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('field state data attributes mirror supplied control facts', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewNumberField({
            isRequired: true,
            isFieldInvalid: true,
            isDirty: true,
            isTouched: true,
            isFilled: true,
            isFocused: true,
            isScrubbing: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-required'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-touched'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-filled'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-focused'),
        Scene.expect(Scene.selector('#amount')).toHaveAttr('data-scrubbing'),
      )
    }).not.toThrow()
  })
})
