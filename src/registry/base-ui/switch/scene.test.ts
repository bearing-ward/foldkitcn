import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Switch from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  isChecked: S.Boolean,
  isFocused: S.Boolean,
  isBlurred: S.Boolean,
  lastReason: Switch.SwitchChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  isChecked: false,
  isFocused: false,
  isBlurred: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedSwitch = m('ChangedSwitch', {
  isChecked: S.Boolean,
  reason: Switch.SwitchChangeReason,
})
const FocusedSwitch = m('FocusedSwitch')
const BlurredSwitch = m('BlurredSwitch')

const Message = S.Union([ChangedSwitch, FocusedSwitch, BlurredSwitch])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedSwitch: ({ isChecked, reason }) => [
        evo(model, {
          isChecked: () => isChecked,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedSwitch: () => [evo(model, { isFocused: () => true }), []],
      BlurredSwitch: () => [evo(model, { isBlurred: () => true }), []],
    }),
  )

// VIEW

const viewSwitch =
  (config: Omit<ViewConfig<Message>, 'isChecked' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        Switch.view<Message>({
          isChecked: model.isChecked,
          ...config,
          onCheckedChange: change => ChangedSwitch(change),
          toView: attributes =>
            h.span(
              [...attributes.root],
              [
                h.span(
                  [...attributes.thumb, h.Attribute('data-testid', 'thumb')],
                  [],
                ),
                h.input([...attributes.input]),
                ...(attributes.uncheckedInput.length > 0
                  ? [h.input([...attributes.uncheckedInput])]
                  : []),
              ],
            ),
        }),
        h.p([], [model.isChecked ? 'Checked' : 'Unchecked']),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/switch', () => {
  test('root and thumb expose checked and unchecked state attributes', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedSwitch({ isChecked: true, reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        { update, view: viewSwitch({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-checked', 'false'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-unchecked'),
        Scene.expect(Scene.selector('[data-testid="thumb"]')).toHaveAttr(
          'data-unchecked',
        ),
      )
      Scene.scene(
        { update, view: viewSwitch({}) },
        Scene.with(checkedModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-checked'),
        Scene.expect(Scene.selector('[data-testid="thumb"]')).toHaveAttr(
          'data-checked',
        ),
      )
    }).not.toThrow()
  })

  test('clicking and keyboard activation emit checked change payloads', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSwitch({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Unchecked')).toExist(),
        Scene.click(Scene.role('switch')),
        Scene.expect(Scene.text('Checked')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
        Scene.keydown(Scene.role('switch'), 'Enter'),
        Scene.expect(Scene.text('Unchecked')).toExist(),
        Scene.keydown(Scene.role('switch'), ' '),
        Scene.expect(Scene.text('Checked')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled switch suppresses activation and marks root, thumb, and input', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSwitch({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('switch')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('switch')).not.toHaveHandler('keydown'),
        Scene.expect(Scene.selector('[data-testid="thumb"]')).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('read-only switch suppresses activation while preserving readonly attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSwitch({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-readonly', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-readonly'),
        Scene.expect(Scene.role('switch')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('switch')).not.toHaveHandler('keydown'),
        Scene.expect(Scene.selector('[data-testid="thumb"]')).toHaveAttr(
          'data-readonly',
        ),
      )
    }).not.toThrow()
  })

  test('required and invalid states map to ARIA and Base UI data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSwitch({
            isRequired: true,
            isInvalid: true,
            isFieldInvalid: true,
            isDirty: true,
            isTouched: true,
            isFilled: true,
            isFocused: true,
            isValid: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-required', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-required'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-touched'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-filled'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-focused'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-valid'),
        Scene.expect(Scene.selector('[data-testid="thumb"]')).toHaveAttr(
          'data-invalid',
        ),
      )
    }).not.toThrow()
  })

  test('form input carries name, checked state, required, form, and custom value', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedSwitch({ isChecked: true, reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSwitch({
            id: 'notifications',
            name: 'notifications',
            form: 'settings',
            value: 'yes',
            isRequired: true,
          }),
        },
        Scene.with(checkedModel),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'id',
          'notifications',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'name',
          'notifications',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'form',
          'settings',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'value',
          'yes',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'checked',
          'true',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'required',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('unchecked value renders as a hidden form input only while off', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedSwitch({ isChecked: true, reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSwitch({
            name: 'notifications',
            uncheckedValue: 'no',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('input[type="hidden"]')).toHaveAttr(
          'name',
          'notifications',
        ),
        Scene.expect(Scene.selector('input[type="hidden"]')).toHaveAttr(
          'value',
          'no',
        ),
      )
      Scene.scene(
        {
          update,
          view: viewSwitch({
            name: 'notifications',
            uncheckedValue: 'no',
          }),
        },
        Scene.with(checkedModel),
        Scene.expect(Scene.selector('input[type="hidden"]')).toBeAbsent(),
      )
    }).not.toThrow()
  })

  test('focus and blur messages are optional event attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSwitch({
            onFocus: FocusedSwitch(),
            onBlur: BlurredSwitch(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveHandler('focus'),
        Scene.expect(Scene.role('switch')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
