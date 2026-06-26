import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Field from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
  validation: Field.FieldValidation,
  isTouched: S.Boolean,
  isDirty: S.Boolean,
  isFocused: S.Boolean,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: '',
  validation: Field.UnknownFieldValidation(),
  isTouched: false,
  isDirty: false,
  isFocused: false,
}

// MESSAGE

const ChangedField = m('ChangedField', {
  value: S.String,
  reason: S.Literal('none'),
})
const FocusedField = m('FocusedField')
const BlurredField = m('BlurredField')

const Message = S.Union([ChangedField, FocusedField, BlurredField])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const validationFromValue = (value: string): Field.FieldValidation =>
  value.length > 0
    ? Field.ValidFieldValidation({ value })
    : Field.InvalidFieldValidation({
        error: 'Name is required',
        errors: ['Name is required'],
        issues: ['valueMissing'],
        value,
      })

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedField: ({ value }) => [
        evo(model, {
          value: () => value,
          validation: () => validationFromValue(value),
          isDirty: () => value !== '',
        }),
        [],
      ],
      FocusedField: () => [evo(model, { isFocused: () => true }), []],
      BlurredField: () => [
        evo(model, {
          isFocused: () => false,
          isTouched: () => true,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewField =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()
    const validation = config.validation ?? model.validation

    return Field.view<Message>({
      id: 'profile-name',
      name: 'name',
      value: model.value,
      isTouched: model.isTouched,
      isDirty: model.isDirty,
      isFocused: model.isFocused,
      validation,
      ...config,
      onValueChange: change => ChangedField(change),
      onFocus: FocusedField(),
      onBlur: BlurredField(),
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.label([...attributes.label], ['Name']),
            h.input([...attributes.control]),
            h.p([...attributes.description], ['Your public display name.']),
            attributes.state.isErrorVisible
              ? h.div(
                  [...attributes.error],
                  [attributes.state.validityData.error],
                )
              : '',
          ],
        ),
    })
  }

describe('base-ui/field', () => {
  test('derives root, label, control, description, and error ids from the field id', () => {
    expect(Field.fieldState({ id: 'account' })).toMatchObject({
      controlId: 'account-control',
      labelId: 'account-label',
      descriptionId: 'account-description',
      errorId: 'account-error',
    })
  })

  test('renders accessible label and description relationships', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewField({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('id', 'profile-name'),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'id',
          'profile-name-control',
        ),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'aria-labelledby',
          'profile-name-label',
        ),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'aria-describedby',
          'profile-name-description',
        ),
      )
    }).not.toThrow()
  })

  test('invalid validation state adds error messaging and invalid data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewField({
            validation: Field.InvalidFieldValidation({
              error: 'Name is required',
              errors: ['Name is required'],
              issues: ['valueMissing'],
            }),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'aria-describedby',
          'profile-name-description profile-name-error',
        ),
        Scene.expect(Scene.selector('#profile-name-error')).toHaveText(
          'Name is required',
        ),
        Scene.expect(Scene.selector('#profile-name-label')).toHaveAttr(
          'data-invalid',
        ),
        Scene.expect(Scene.selector('#profile-name-description')).toHaveAttr(
          'data-invalid',
        ),
      )
    }).not.toThrow()
  })

  test('valid validation state adds valid data attributes without an error relationship', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewField({
            validation: Field.ValidFieldValidation({ value: 'Ada' }),
          }),
        },
        Scene.with({ ...initialModel, value: 'Ada' }),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-valid'),
        Scene.expect(Scene.label('Name')).not.toHaveAttr('aria-invalid'),
        Scene.expect(Scene.label('Name')).toHaveAttr(
          'aria-describedby',
          'profile-name-description',
        ),
      )
    }).not.toThrow()
  })

  test('typing, focus, and blur let the consuming model drive validation facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewField({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Name')).not.toHaveAttr('data-focused'),
        Scene.focus(Scene.label('Name')),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-focused'),
        Scene.type(Scene.label('Name'), 'Ada'),
        Scene.expect(Scene.label('Name')).toHaveValue('Ada'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-valid'),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-dirty'),
        Scene.blur(Scene.label('Name')),
        Scene.expect(Scene.label('Name')).toHaveAttr('data-touched'),
      )
    }).not.toThrow()
  })

  test('disabled and required state propagate to all parts', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewField({
            isDisabled: true,
            isRequired: true,
            validation: Field.InvalidFieldValidation({
              error: 'Name is required',
              errors: ['Name is required'],
              issues: ['valueMissing'],
            }),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-required'),
        Scene.expect(Scene.label('Name')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.label('Name')).not.toHaveAttr('aria-invalid'),
        Scene.expect(Scene.selector('#profile-name-label')).toHaveAttr(
          'data-disabled',
        ),
      )
    }).not.toThrow()
  })

  test('combinedValidityData applies external invalid facts without mutating validation errors', () => {
    expect(
      Field.combinedValidityData(
        Field.ValidFieldValidation({ value: 'Ada' }),
        true,
      ),
    ).toStrictEqual({
      valid: false,
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valueMissing: false,
      error: '',
      errors: [],
      value: 'Ada',
    })
  })
})
