import { Match as M, Option, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as OTPField from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
  focusedIndex: S.Number,
  isFocused: S.Boolean,
  lastReason: OTPField.OTPFieldChangeReason,
  lastInvalidValue: S.String,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: '',
  focusedIndex: 0,
  isFocused: false,
  lastReason: 'none',
  lastInvalidValue: '',
}

// MESSAGE

const ChangedOTPField = m('ChangedOTPField', {
  value: S.String,
  reason: OTPField.OTPFieldChangeReason,
  index: S.Number,
  isComplete: S.Boolean,
  didRejectCharacters: S.Boolean,
  invalidValue: S.optional(S.String),
  focusSelector: S.optional(S.String),
})
const ChangedOTPFieldFocus = m('ChangedOTPFieldFocus', {
  focused: S.Boolean,
  index: S.Number,
  focusSelector: S.optional(S.String),
})

const Message = S.Union([
  ChangedOTPField,
  ChangedOTPFieldFocus,
  OTPField.CompletedFocusOTPFieldInput,
])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const focusCommands = (
  change: Pick<
    OTPField.OTPFieldValueChange | OTPField.OTPFieldFocusChange,
    'focusSelector'
  >,
): ReadonlyArray<Command.Command<Message>> =>
  Option.match(OTPField.commandForValueChange(change), {
    onNone: () => [],
    onSome: command => [command],
  })

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedOTPField: change => [
        evo(model, {
          value: () => change.value,
          lastReason: () => change.reason,
          lastInvalidValue: () => change.invalidValue ?? '',
        }),
        focusCommands(change),
      ],
      ChangedOTPFieldFocus: change => [
        evo(model, {
          focusedIndex: () => change.index,
          isFocused: () => change.focused,
        }),
        focusCommands(change),
      ],
      CompletedFocusOTPFieldInput: () => [model, []],
    }),
  )

// VIEW

const viewOTPField =
  (
    config: Omit<
      ViewConfig<Message>,
      'focusedIndex' | 'isFocused' | 'length' | 'toView' | 'value'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        h.label([h.Id('otp-label')], ['Verification code']),
        OTPField.view<Message>({
          id: 'otp',
          length: 6,
          value: model.value,
          focusedIndex: model.focusedIndex,
          isFocused: model.isFocused,
          ariaLabelledBy: 'otp-label',
          ...config,
          onValueChange: change => ChangedOTPField(change),
          onFocusChange: change => ChangedOTPFieldFocus(change),
          toView: attributes =>
            h.div(
              [...attributes.root],
              [
                ...attributes.slots.map(slot => h.input([...slot.input])),
                h.input([...attributes.hiddenInput]),
                h.p([], [`Value ${model.value}`]),
                h.p([], [`Reason ${model.lastReason}`]),
                h.p([], [`Invalid ${model.lastInvalidValue}`]),
              ],
            ),
        }),
      ],
    )
  }

describe('base-ui/otp-field source-port helpers', () => {
  test('normalizes, filters, and clamps values', () => {
    expect(OTPField.stripOTPWhitespace(' 12 3\t4\n5 ')).toBe('12345')
    expect(OTPField.normalizeOTPValue('1a 2b34c56', 4, 'numeric')).toBe('1234')
    expect(OTPField.normalizeOTPValue('1a 2b3C4', 6, 'alpha')).toBe('abC')
    expect(OTPField.normalizeOTPValue('A1-B2 c3!', 6, 'alphanumeric')).toBe(
      'A1B2c3',
    )
    expect(
      OTPField.normalizeOTPValue('ab-12 cd', 6, 'none', value =>
        value.replaceAll(/[^a-zA-Z0-9]/gu, '').toUpperCase(),
      ),
    ).toBe('AB12CD')
  })

  test('replaces and removes slot characters deterministically', () => {
    expect(OTPField.replaceOTPValue('123456', 2, '99', 6, 'numeric')).toBe(
      '129956',
    )
    expect(OTPField.replaceOTPValue('123456', 5, '9', 6, 'numeric')).toBe(
      '123459',
    )
    expect(OTPField.removeOTPCharacter('1234', 0)).toBe('234')
    expect(OTPField.removeOTPCharacter('1234', 3)).toBe('123')
  })

  test('projects slots from model-owned value state', () => {
    expect(
      OTPField.otpFieldSlots({
        id: 'otp',
        length: 4,
        value: '12a34',
      }).map(slot => ({
        id: slot.id,
        value: slot.value,
        active: slot.isActive,
      })),
    ).toStrictEqual([
      { id: 'otp', value: '1', active: false },
      { id: 'otp-2', value: '2', active: false },
      { id: 'otp-3', value: '3', active: false },
      { id: 'otp-4', value: '4', active: true },
    ])
  })
})

describe('base-ui/otp-field view', () => {
  test('renders root, slot inputs, hidden form input, and data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewOTPField({
            name: 'verification',
            isRequired: true,
          }),
        },
        Scene.with({
          ...initialModel,
          value: '123456',
          isFocused: true,
        }),
        Scene.expect(Scene.role('group')).toHaveAttr('data-complete'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-filled'),
        Scene.expect(Scene.selector('#otp')).toHaveAttr(
          'autocomplete',
          'one-time-code',
        ),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('maxLength', '6'),
        Scene.expect(Scene.selector('#otp-2')).toHaveAttr(
          'autocomplete',
          'off',
        ),
        Scene.expect(Scene.selector('input[name="verification"]')).toHaveAttr(
          'value',
          '123456',
        ),
        Scene.expect(Scene.selector('input[name="verification"]')).toHaveAttr(
          'minLength',
          '6',
        ),
      )
    }).not.toThrow()
  })

  test('typing and paste emit normalized value facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewOTPField({ validationType: 'numeric' }) },
        Scene.with(initialModel),
        Scene.type(Scene.selector('#otp'), '12a34'),
        Scene.expect(Scene.text('Value 1234')).toExist(),
        Scene.expect(Scene.text('Reason input-change')).toExist(),
        Scene.expect(Scene.text('Invalid 12a34')).toExist(),
        Scene.Command.resolve(
          OTPField.FocusOTPFieldInput,
          OTPField.CompletedFocusOTPFieldInput(),
        ),
      )
    }).not.toThrow()

    const pasteChange = OTPField.otpFieldPasteChange(
      { id: 'otp', length: 6, value: '12' },
      2,
      '34 5x6',
    )

    expect(pasteChange.value).toBe('123456')
    expect(pasteChange.reason).toBe('input-paste')
    expect(pasteChange.didRejectCharacters).toBeTruthy()
    expect(pasteChange.isComplete).toBeTruthy()
  })

  test('keyboard deletion and focus movement are exposed as facts and commands', () => {
    const keyboardChange = OTPField.otpFieldKeyboardValueChange(
      { id: 'otp', length: 6, value: '1234' },
      1,
      'Backspace',
      { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false },
    )

    expect(Option.getOrThrow(keyboardChange)).toMatchObject({
      value: '134',
      reason: 'keyboard',
      focusSelector: '#otp',
    })

    expect(() => {
      Scene.scene(
        { update, view: viewOTPField({}) },
        Scene.with({
          ...initialModel,
          value: '1234',
          focusedIndex: 1,
          isFocused: true,
        }),
        Scene.keydown(Scene.selector('#otp-2'), 'ArrowRight'),
        Scene.expect(Scene.selector('#otp-3')).toHaveAttr('tabIndex', '0'),
        Scene.keydown(Scene.selector('#otp-3'), 'Backspace'),
        Scene.expect(Scene.text('Value 124')).toExist(),
        Scene.Command.resolve(
          OTPField.FocusOTPFieldInput,
          OTPField.CompletedFocusOTPFieldInput(),
        ),
      )
    }).not.toThrow()
  })

  test('disabled state suppresses interaction handlers and marks inputs', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewOTPField({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.selector('#otp')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.selector('#otp')).not.toHaveHandler('input'),
        Scene.expect(Scene.selector('#otp')).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })
})
