import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Radio from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  checkedState: Radio.RadioCheckedState,
  lastReason: Radio.RadioChangeReason,
  isFocused: S.Boolean,
  isBlurred: S.Boolean,
})
type Model = typeof Model.Type

const initialModel: Model = {
  checkedState: 'unchecked',
  lastReason: 'none',
  isFocused: false,
  isBlurred: false,
}

// MESSAGE

const ChangedRadio = m('ChangedRadio', {
  checkedState: Radio.RadioCheckedState,
  reason: Radio.RadioChangeReason,
})
const FocusedRadio = m('FocusedRadio')
const BlurredRadio = m('BlurredRadio')

const Message = S.Union([ChangedRadio, FocusedRadio, BlurredRadio])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedRadio: ({ checkedState, reason }) => [
        evo(model, {
          checkedState: () => checkedState,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedRadio: () => [evo(model, { isFocused: () => true }), []],
      BlurredRadio: () => [evo(model, { isBlurred: () => true }), []],
    }),
  )

// VIEW

const viewRadio =
  (config: Omit<ViewConfig<Message>, 'checkedState' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        Radio.view<Message>({
          checkedState: model.checkedState,
          ...config,
          onCheckedChange: change => ChangedRadio(change),
          toView: attributes =>
            h.span(
              [...attributes.root],
              [
                ...(attributes.indicator.length > 0
                  ? [
                      h.span(
                        [
                          ...attributes.indicator,
                          h.Attribute('data-testid', 'indicator'),
                        ],
                        [],
                      ),
                    ]
                  : []),
                h.input([...attributes.input]),
              ],
            ),
        }),
        h.p([], [model.checkedState]),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/radio', () => {
  test('root and indicator expose checked and unchecked state attributes', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedRadio({ checkedState: 'checked', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        { update, view: viewRadio({ keepIndicatorMounted: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-checked', 'false'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-unchecked'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-unchecked',
        ),
      )
      Scene.scene(
        { update, view: viewRadio({}) },
        Scene.with(checkedModel),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-checked'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-checked',
        ),
      )
    }).not.toThrow()
  })

  test('indicator is absent while unchecked unless keepIndicatorMounted is enabled', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadio({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toBeAbsent(),
      )
      Scene.scene(
        { update, view: viewRadio({ keepIndicatorMounted: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('clicking and Space select while Enter does not activate', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadio({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('unchecked')).toExist(),
        Scene.click(Scene.role('radio')),
        Scene.expect(Scene.text('checked')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
      )
      Scene.scene(
        { update, view: viewRadio({}) },
        Scene.with(initialModel),
        Scene.keydown(Scene.role('radio'), 'Enter'),
        Scene.expect(Scene.text('unchecked')).toExist(),
        Scene.expect(Scene.role('radio')).toHaveHandler('keyup'),
      )
    }).not.toThrow()
  })

  test('checked radio remains selected and has no activation handlers', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedRadio({ checkedState: 'checked', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        { update, view: viewRadio({}) },
        Scene.with(checkedModel),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('keyup'),
      )
    }).not.toThrow()
  })

  test('disabled radio suppresses activation and marks root and input', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadio({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('keyup'),
        Scene.expect(Scene.selector('input[type="radio"]')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('read-only radio suppresses activation while preserving readonly attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadio({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-readonly', 'true'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-readonly'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('radio')).not.toHaveHandler('keyup'),
        Scene.expect(Scene.selector('input[type="radio"]')).toHaveAttr(
          'readonly',
          '',
        ),
      )
    }).not.toThrow()
  })

  test('required and invalid states map to ARIA and Base UI data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadio({
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
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-required', 'true'),
        Scene.expect(Scene.role('radio')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-required'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.role('radio')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-focused',
        ),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-valid',
        ),
      )
    }).not.toThrow()
  })

  test('radio input preserves native form value semantics', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedRadio({ checkedState: 'checked', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadio({
            id: 'density-radio',
            inputId: 'density-radio-input',
            name: 'density',
            form: 'settings',
            value: 'comfortable',
            isRequired: true,
          }),
        },
        Scene.with(checkedModel),
        Scene.expect(Scene.selector('#density-radio')).toHaveAttr(
          'role',
          'radio',
        ),
        Scene.expect(Scene.selector('#density-radio-input')).toHaveAttr(
          'name',
          'density',
        ),
        Scene.expect(Scene.selector('#density-radio-input')).toHaveAttr(
          'form',
          'settings',
        ),
        Scene.expect(Scene.selector('#density-radio-input')).toHaveAttr(
          'value',
          'comfortable',
        ),
        Scene.expect(Scene.selector('#density-radio-input')).toHaveAttr(
          'checked',
          'true',
        ),
        Scene.expect(Scene.selector('#density-radio-input')).toHaveAttr(
          'required',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('focus and blur messages are optional root event attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadio({
            onFocus: FocusedRadio(),
            onBlur: BlurredRadio(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radio')).toHaveHandler('focus'),
        Scene.expect(Scene.role('radio')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
