import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Input from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
  lastReason: Input.InputChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: '',
  lastReason: 'none',
}

// MESSAGE

const ChangedInput = m('ChangedInput', {
  value: S.String,
  reason: Input.InputChangeReason,
})
const FocusedInput = m('FocusedInput')
const BlurredInput = m('BlurredInput')

const Message = S.Union([ChangedInput, FocusedInput, BlurredInput])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedInput: ({ value, reason }) => [
        evo(model, {
          value: () => value,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedInput: () => [model, []],
      BlurredInput: () => [model, []],
    }),
  )

// VIEW

const viewInput =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.label(
      [],
      [
        'Name',
        Input.view<Message>({
          value: model.value,
          ...config,
          onValueChange: change => ChangedInput(change),
          toView: attributes => h.input([...attributes.input]),
        }),
      ],
    )
  }

describe('base-ui/input', () => {
  test('renders controlled input attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInput({
            id: 'name',
            name: 'fullName',
            type: 'email',
            placeholder: 'e.g. Colm Tuite',
            isRequired: true,
            isReadOnly: true,
          }),
        },
        Scene.with({ ...initialModel, value: 'Ada' }),
        Scene.expect(Scene.label('Name')).toHaveAttr('id', 'name'),
        Scene.expect(Scene.label('Name')).toHaveAttr('name', 'fullName'),
        Scene.expect(Scene.label('Name')).toHaveAttr('type', 'email'),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'placeholder',
          'e.g. Colm Tuite',
        ),
        Scene.expect(Scene.label('Name')).toHaveAttr('required', 'true'),
        Scene.expect(Scene.label('Name')).toHaveAttr('readOnly', 'true'),
        Scene.expect(Scene.label('Name')).toHaveValue('Ada'),
      )
    }).not.toThrow()
  })

  test('disabled input has disabled and data-disabled without an input handler', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInput({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.label('Name')).not.toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('invalid input has aria-invalid without Field data-invalid', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInput({ isInvalid: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.label('Name')).not.toHaveAttr('data-invalid'),
      )
    }).not.toThrow()
  })

  test('state data attributes mirror provided Field control facts', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInput({
            isValid: true,
            isFieldInvalid: true,
            isDirty: true,
            isTouched: true,
            isFilled: true,
            isFocused: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-valid'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-touched'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-filled'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-focused'),
      )
    }).not.toThrow()
  })

  test('typing emits a value change payload with reason none', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInput({}) },
        Scene.with(initialModel),
        Scene.type(Scene.label('Name'), 'Ada'),
        Scene.expect(Scene.label('Name')).toHaveValue('Ada'),
      )
    }).not.toThrow()
  })

  test('read-only input keeps native readOnly behavior attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewInput({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveAttr('readOnly', 'true'),
        Scene.expect(Scene.label('Name')).toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('focus and blur messages are optional event attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewInput({
            onFocus: FocusedInput(),
            onBlur: BlurredInput(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveHandler('focus'),
        Scene.expect(Scene.label('Name')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
