import { Match as M, Schema as S } from 'effect'
import { Scene, Story } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Field from '../field'
import * as Form from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  name: S.String,
  age: S.Number,
  validation: Field.FieldValidation,
  submittedValues: S.Array(Form.FormFieldValue),
  resetCount: S.Number,
})
type Model = typeof Model.Type

const initialModel: Model = {
  name: '',
  age: 42,
  validation: Field.UnknownFieldValidation(),
  submittedValues: [],
  resetCount: 0,
}

// MESSAGE

const UpdatedName = m('UpdatedName', { value: S.String })
const SubmittedForm = m('SubmittedForm', {
  reason: S.Literal('none'),
  validationMode: Form.FormValidationMode,
  values: S.Array(Form.FormFieldValue),
  invalidNames: S.Array(S.String),
  isValid: S.Boolean,
})
const ResetForm = m('ResetForm', {
  reason: S.Literal('none'),
  values: S.Array(Form.FormFieldValue),
})

const Message = S.Union([UpdatedName, SubmittedForm, ResetForm])
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
      UpdatedName: ({ value }) => [
        evo(model, {
          name: () => value,
          validation: () => validationFromValue(value),
        }),
        [],
      ],
      SubmittedForm: ({ values, isValid }) =>
        isValid
          ? [
              evo(model, {
                submittedValues: () => values,
              }),
              [],
            ]
          : [model, []],
      ResetForm: () => [
        evo(model, {
          name: () => '',
          validation: () => Field.UnknownFieldValidation(),
          submittedValues: () => [],
          resetCount: count => count + 1,
        }),
        [],
      ],
    }),
  )

// VIEW

const fieldsForModel = (model: Model): ReadonlyArray<Form.FormFieldValue> => [
  {
    name: 'name',
    value: model.name,
    validation: model.validation,
  },
  {
    name: 'age',
    value: model.age,
  },
  {
    name: 'disabled',
    value: 'ignored',
    validation: Field.InvalidFieldValidation({
      error: 'Disabled fields do not block submission',
      errors: ['Disabled fields do not block submission'],
      issues: ['valueMissing'],
      value: '',
    }),
    isDisabled: true,
  },
]

const viewForm =
  (config: Omit<ViewConfig<Message>, 'fields' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Form.view<Message>({
      id: 'profile-form',
      name: 'profile',
      fields: fieldsForModel(model),
      ...config,
      onSubmit: payload => SubmittedForm(payload),
      onReset: payload => ResetForm(payload),
      toView: attributes =>
        h.form(
          [...attributes.root],
          [
            Field.view<Message>({
              id: 'profile-name',
              name: 'name',
              value: model.name,
              validation: model.validation,
              onValueChange: change => UpdatedName({ value: change.value }),
              toView: fieldAttributes =>
                h.div(
                  [...fieldAttributes.root],
                  [
                    h.label([...fieldAttributes.label], ['Name']),
                    h.input([...fieldAttributes.control]),
                    fieldAttributes.state.isErrorVisible
                      ? h.div(
                          [...fieldAttributes.error],
                          [fieldAttributes.state.validityData.error],
                        )
                      : h.empty,
                  ],
                ),
            }),
            h.button([h.Type('submit')], ['Submit']),
            h.button([h.Type('reset')], ['Reset']),
            h.output(
              [h.Attribute('data-testid', 'submitted')],
              [
                Form.valuesByName(model.submittedValues).name === undefined
                  ? 'none'
                  : String(Form.valuesByName(model.submittedValues).name),
              ],
            ),
            h.output(
              [h.Attribute('data-testid', 'reset-count')],
              [String(model.resetCount)],
            ),
          ],
        ),
    })
  }

describe('base-ui/form', () => {
  test('renders a native form with noValidate, validation mode, and state attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewForm({
            action: '/profiles',
            method: 'post',
            encType: 'multipart/form-data',
            target: '_self',
            autocomplete: 'off',
            validationMode: 'onBlur',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'noValidate',
          'true',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'action',
          '/profiles',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'method',
          'post',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'enctype',
          'multipart/form-data',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'target',
          '_self',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'autocomplete',
          'off',
        ),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr('data-valid'),
      )
    }).not.toThrow()
  })

  test('submitting an invalid model reports invalid names and update ignores submission', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewForm({}) },
        Scene.with({
          ...initialModel,
          validation: Field.InvalidFieldValidation({
            error: 'Name is required',
            errors: ['Name is required'],
            issues: ['valueMissing'],
            value: '',
          }),
        }),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'data-invalid',
        ),
        Scene.submit(Scene.selector('#profile-form')),
        Scene.expect(Scene.selector('[data-testid="submitted"]')).toHaveText(
          'none',
        ),
      )
    }).not.toThrow()
  })

  test('submitting a valid model sends typed payload values to update', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewForm({ validationMode: 'onChange' }) },
        Scene.with({
          ...initialModel,
          name: 'Ada',
          validation: Field.ValidFieldValidation({ value: 'Ada' }),
        }),
        Scene.submit(Scene.selector('#profile-form')),
        Scene.expect(Scene.selector('[data-testid="submitted"]')).toHaveText(
          'Ada',
        ),
      )
    }).not.toThrow()
  })

  test('input changes keep validation model-owned before submit', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewForm({}) },
        Scene.with(initialModel),
        Scene.type(Scene.label('Name'), 'Ada'),
        Scene.expect(Scene.label('Name')).toHaveValue('Ada'),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr('data-valid'),
        Scene.submit(Scene.selector('#profile-form')),
        Scene.expect(Scene.selector('[data-testid="submitted"]')).toHaveText(
          'Ada',
        ),
      )
    }).not.toThrow()
  })

  test('reset payload emits a reset fact and the consuming update owns clearing state', () => {
    Story.story(
      update,
      Story.with({
        ...initialModel,
        name: 'Ada',
        validation: Field.ValidFieldValidation({ value: 'Ada' }),
      }),
      Story.message(
        ResetForm({
          reason: 'none',
          values: [{ name: 'name', value: 'Ada' }],
        }),
      ),
      Story.model(model => {
        expect(model.name).toBe('')
        expect(model.validation._tag).toBe('UnknownFieldValidation')
        expect(model.resetCount).toBe(1)
      }),
    )
  })

  test('disabled forms suppress submit and reset handlers', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewForm({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#profile-form')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.selector('#profile-form')).not.toHaveHandler(
          'submit',
        ),
        Scene.expect(Scene.selector('#profile-form')).not.toHaveHandler(
          'reset',
        ),
      )
    }).not.toThrow()
  })

  test('form helpers exclude disabled fields and expose payload shape', () => {
    const validField = Field.ValidFieldValidation({ value: 'Ada' })
    const invalidField = Field.InvalidFieldValidation({
      error: 'Name is required',
      errors: ['Name is required'],
      issues: ['valueMissing'],
      value: '',
    })
    const state = Form.formState({
      validationMode: 'onSubmit',
      fields: [
        { name: 'name', value: '', validation: invalidField },
        { name: 'age', value: 42, validation: validField },
        {
          name: 'disabled',
          value: 'ignored',
          validation: invalidField,
          isDisabled: true,
        },
      ],
    })

    expect(Form.submitPayload(state)).toStrictEqual({
      reason: 'none',
      validationMode: 'onSubmit',
      values: [
        { name: 'name', value: '', validation: invalidField },
        { name: 'age', value: 42, validation: validField },
      ],
      invalidNames: ['name'],
      isValid: false,
    })
    expect(Form.valuesByName(state.values)).toStrictEqual({
      name: '',
      age: 42,
    })
  })
})
