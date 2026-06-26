import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Checkbox from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  checkedState: Checkbox.CheckboxCheckedState,
  isFocused: S.Boolean,
  isBlurred: S.Boolean,
  lastReason: Checkbox.CheckboxChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  checkedState: 'unchecked',
  isFocused: false,
  isBlurred: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedCheckbox = m('ChangedCheckbox', {
  checkedState: Checkbox.CheckboxCheckedState,
  reason: Checkbox.CheckboxChangeReason,
})
const FocusedCheckbox = m('FocusedCheckbox')
const BlurredCheckbox = m('BlurredCheckbox')

const Message = S.Union([ChangedCheckbox, FocusedCheckbox, BlurredCheckbox])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedCheckbox: ({ checkedState, reason }) => [
        evo(model, {
          checkedState: () => checkedState,
          lastReason: () => reason,
        }),
        [],
      ],
      FocusedCheckbox: () => [evo(model, { isFocused: () => true }), []],
      BlurredCheckbox: () => [evo(model, { isBlurred: () => true }), []],
    }),
  )

// VIEW

const viewCheckbox =
  (config: Omit<ViewConfig<Message>, 'checkedState' | 'toView'>) =>
  (model: Model): Html => {
    const h = html<Message>()

    return h.div(
      [],
      [
        Checkbox.view<Message>({
          checkedState: model.checkedState,
          ...config,
          onCheckedChange: change => ChangedCheckbox(change),
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
                ...(attributes.uncheckedInput.length > 0
                  ? [h.input([...attributes.uncheckedInput])]
                  : []),
              ],
            ),
        }),
        h.p([], [model.checkedState]),
        h.p([], [`Reason ${model.lastReason}`]),
      ],
    )
  }

describe('base-ui/checkbox', () => {
  test('root and indicator expose checked, unchecked, and indeterminate state attributes', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'checked', reason: 'none' }),
    )
    const [indeterminateModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'indeterminate', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({ keepIndicatorMounted: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-checked',
          'false',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-unchecked'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-unchecked',
        ),
      )
      Scene.scene(
        { update, view: viewCheckbox({}) },
        Scene.with(checkedModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-checked'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-checked',
        ),
      )
      Scene.scene(
        { update, view: viewCheckbox({}) },
        Scene.with(indeterminateModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-indeterminate'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-indeterminate',
        ),
      )
    }).not.toThrow()
  })

  test('indicator is absent while unchecked unless keepIndicatorMounted is enabled', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toBeAbsent(),
      )
      Scene.scene(
        { update, view: viewCheckbox({ keepIndicatorMounted: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('clicking and Space toggle while Enter does not activate', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.text('unchecked')).toExist(),
        Scene.click(Scene.role('checkbox')),
        Scene.expect(Scene.text('checked')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
        Scene.keydown(Scene.role('checkbox'), 'Enter'),
        Scene.expect(Scene.text('checked')).toExist(),
        Scene.keydown(Scene.role('checkbox'), ' '),
        Scene.expect(Scene.text('unchecked')).toExist(),
      )
    }).not.toThrow()
  })

  test('disabled checkbox suppresses activation and marks root, indicator, and input', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({ isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-disabled'),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('keydown'),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('read-only checkbox suppresses activation while preserving readonly attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({ isReadOnly: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-readonly',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-readonly'),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('indeterminate checkbox does not expose activation handlers', () => {
    const [indeterminateModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'indeterminate', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({}) },
        Scene.with(indeterminateModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('click'),
        Scene.expect(Scene.role('checkbox')).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('required and invalid states map to ARIA and Base UI data attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckbox({
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
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-required',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-required'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-invalid'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-dirty'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-touched'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-filled'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-focused'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-valid'),
        Scene.expect(Scene.selector('[data-testid="indicator"]')).toHaveAttr(
          'data-invalid',
        ),
      )
    }).not.toThrow()
  })

  test('form input carries name, checked state, required, form, and custom value', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'checked', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckbox({
            id: 'terms',
            name: 'terms',
            form: 'settings',
            value: 'yes',
            isRequired: true,
          }),
        },
        Scene.with(checkedModel),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'id',
          'terms',
        ),
        Scene.expect(Scene.selector('input[type="checkbox"]')).toHaveAttr(
          'name',
          'terms',
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

  test('unchecked value renders as a hidden form input while unchecked or indeterminate', () => {
    const [checkedModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'checked', reason: 'none' }),
    )
    const [indeterminateModel] = update(
      initialModel,
      ChangedCheckbox({ checkedState: 'indeterminate', reason: 'none' }),
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckbox({
            name: 'terms',
            uncheckedValue: 'no',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('input[type="hidden"]')).toHaveAttr(
          'name',
          'terms',
        ),
        Scene.expect(Scene.selector('input[type="hidden"]')).toHaveAttr(
          'value',
          'no',
        ),
      )
      Scene.scene(
        {
          update,
          view: viewCheckbox({
            name: 'terms',
            uncheckedValue: 'no',
          }),
        },
        Scene.with(indeterminateModel),
        Scene.expect(Scene.selector('input[type="hidden"]')).toHaveAttr(
          'value',
          'no',
        ),
      )
      Scene.scene(
        {
          update,
          view: viewCheckbox({
            name: 'terms',
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
          view: viewCheckbox({
            onFocus: FocusedCheckbox(),
            onBlur: BlurredCheckbox(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveHandler('focus'),
        Scene.expect(Scene.role('checkbox')).toHaveHandler('blur'),
      )
    }).not.toThrow()
  })
})
