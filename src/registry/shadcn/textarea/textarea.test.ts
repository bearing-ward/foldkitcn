import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  TextareaOptions,
  textareaBaseClassName,
  textareaClassName,
  view as Textarea,
} from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  value: S.String,
})
type Model = typeof Model.Type

const initialModel: Model = {
  value: '',
}

// MESSAGE

const ChangedTextarea = m('ChangedTextarea', {
  value: S.String,
  reason: S.Literal('none'),
})

const Message = S.Union([ChangedTextarea])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedTextarea: ({ value }) => [
        evo(model, {
          value: () => value,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewTextarea =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.label(
      [],
      [
        'Message',
        Textarea<Message>({
          value: model.value,
          ...config,
          onValueChange: change => ChangedTextarea(change),
          toView: attributes => h.textarea([...attributes.textarea], []),
        }),
      ],
    )
  }

describe('shadcn/textarea class helpers', () => {
  test('exports the base-nova class string', () => {
    expect(textareaClassName()).toBe(textareaBaseClassName)
    expect(textareaClassName()).toContain('field-sizing-content')
    expect(textareaClassName()).toContain('min-h-16')
    expect(textareaClassName()).toContain('border-input')
    expect(textareaClassName()).toContain('aria-invalid:border-destructive')
  })

  test('preserves custom className through local cn canonicalization', () => {
    const className = textareaClassName({
      className: 'custom-textarea min-h-20 min-h-24',
    })

    expect(className).toContain('custom-textarea')
    expect(className).toContain('min-h-24')
    expect(className).not.toContain('min-h-20')
  })

  test('exports Effect Schema-derived options', () => {
    expect(
      S.decodeUnknownSync(TextareaOptions)({
        id: 'message',
        rows: 4,
        isReadOnly: true,
      }),
    ).toStrictEqual({
      id: 'message',
      rows: 4,
      isReadOnly: true,
    })
  })
})

describe('shadcn/textarea view', () => {
  test('renders native textarea attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTextarea({
            id: 'message',
            name: 'message',
            placeholder: 'Type your message here.',
            rows: 4,
            cols: 24,
            maxLength: 200,
            minLength: 4,
            wrap: 'soft',
            ariaDescribedBy: 'message-description',
            isRequired: true,
          }),
        },
        Scene.with({ value: 'Hello\nthere' }),
        Scene.expect(Scene.label('Message')).toHaveAttr(
          'data-slot',
          'textarea',
        ),
        Scene.expect(Scene.label('Message')).toHaveAttr(
          'class',
          textareaClassName(),
        ),
        Scene.expect(Scene.label('Message')).toHaveAttr('id', 'message'),
        Scene.expect(Scene.label('Message')).toHaveAttr('name', 'message'),
        Scene.expect(Scene.label('Message')).toHaveAttr(
          'placeholder',
          'Type your message here.',
        ),
        Scene.expect(Scene.label('Message')).toHaveAttr('rows', '4'),
        Scene.expect(Scene.label('Message')).toHaveAttr('cols', '24'),
        Scene.expect(Scene.label('Message')).toHaveAttr('maxLength', '200'),
        Scene.expect(Scene.label('Message')).toHaveAttr('minLength', '4'),
        Scene.expect(Scene.label('Message')).toHaveAttr('wrap', 'soft'),
        Scene.expect(Scene.label('Message')).toHaveAttr(
          'aria-describedby',
          'message-description',
        ),
        Scene.expect(Scene.label('Message')).toHaveAttr('required', 'true'),
        Scene.expect(Scene.label('Message')).toHaveValue('Hello\nthere'),
      )
    }).not.toThrow()
  })

  test('passes disabled behavior without an input handler', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTextarea({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Message')).toHaveAttr('disabled', 'true'),
        Scene.expect(Scene.label('Message')).not.toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('passes read-only behavior while preserving the input handler', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTextarea({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Message')).toHaveAttr('readOnly', 'true'),
        Scene.expect(Scene.label('Message')).toHaveHandler('input'),
      )
    }).not.toThrow()
  })

  test('passes invalid styling hooks through aria-invalid', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTextarea({ isInvalid: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Message')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.label('Message')).not.toHaveAttr('data-invalid'),
      )
    }).not.toThrow()
  })

  test('typing multiline content emits value changes to the parent model', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTextarea({}) },
        Scene.with(initialModel),
        Scene.type(Scene.label('Message'), 'Line one\nLine two'),
        Scene.expect(Scene.label('Message')).toHaveValue('Line one\nLine two'),
      )
    }).not.toThrow()
  })
})
