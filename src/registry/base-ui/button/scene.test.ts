import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Button from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  count: S.Number,
  mouseCount: S.Number,
  pointerCount: S.Number,
})
type Model = typeof Model.Type

const initialModel: Model = {
  count: 0,
  mouseCount: 0,
  pointerCount: 0,
}

// MESSAGE

const ClickedButton = m('ClickedButton')
const PressedMouse = m('PressedMouse')
const PressedPointer = m('PressedPointer')

const Message = S.Union([ClickedButton, PressedMouse, PressedPointer])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ClickedButton: () => [evo(model, { count: count => count + 1 }), []],
      PressedMouse: () => [evo(model, { mouseCount: count => count + 1 }), []],
      PressedPointer: () => [
        evo(model, { pointerCount: count => count + 1 }),
        [],
      ],
    }),
  )

// VIEW

type ElementKind = 'button' | 'div'

type TestButtonConfig = Omit<ViewConfig<Message>, 'toView'> &
  Readonly<{
    elementKind?: ElementKind
    label: string
  }>

const viewButton =
  (config: TestButtonConfig) =>
  (_model: Model): Html => {
    const h = html<Message>()
    const { elementKind = 'button', label, ...buttonConfig } = config

    return Button.view<Message>({
      ...buttonConfig,
      toView: attributes =>
        elementKind === 'button'
          ? h.button([...attributes.button], [label])
          : h.div([...attributes.button], [label]),
    })
  }

const viewCountButton =
  (config: TestButtonConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { elementKind = 'button', label, ...buttonConfig } = config

    return h.div(
      [],
      [
        Button.view<Message>({
          ...buttonConfig,
          toView: attributes =>
            elementKind === 'button'
              ? h.button([...attributes.button], [label])
              : h.div([...attributes.button], [label]),
        }),
        h.p([], [`Count ${model.count}`]),
      ],
    )
  }

const viewTypeButtons = (_model: Model): Html => {
  const h = html<Message>()

  return h.div(
    [],
    [
      Button.view<Message>({
        type: 'button',
        toView: attributes => h.button([...attributes.button], ['Plain']),
      }),
      Button.view<Message>({
        type: 'submit',
        toView: attributes => h.button([...attributes.button], ['Submit']),
      }),
      Button.view<Message>({
        type: 'reset',
        toView: attributes => h.button([...attributes.button], ['Reset']),
      }),
    ],
  )
}

describe('base-ui/button', () => {
  test('disabled native buttons use disabled and data-disabled without aria-disabled', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewButton({ label: 'Disabled', isDisabled: true }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).toHaveAttr(
          'disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).not.toHaveAttr(
          'aria-disabled',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Disabled' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Disabled' }),
        ).not.toHaveHandler('pointerdown'),
        Scene.expect(
          Scene.role('button', { name: 'Disabled' }),
        ).not.toHaveHandler('mousedown'),
        Scene.expect(
          Scene.role('button', { name: 'Disabled' }),
        ).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('focusable disabled native buttons use aria-disabled and tabindex without disabled', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewButton({
            label: 'Focusable disabled',
            isDisabled: true,
            isFocusableWhenDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).toHaveAttr('tabIndex', '0'),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).toHaveAttr('data-disabled'),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).not.toHaveAttr('disabled'),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Focusable disabled' }),
        ).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('disabled non-native buttons use role, aria-disabled, and non-tabbable tabindex', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewButton({
            label: 'Non-native disabled',
            elementKind: 'div',
            isNativeButton: false,
            isDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).toHaveAttr('role', 'button'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).toHaveAttr('tabIndex', '-1'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).toHaveAttr('data-disabled'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).not.toHaveHandler('pointerdown'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).not.toHaveHandler('mousedown'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native disabled' }),
        ).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('focusable disabled non-native buttons keep tabindex zero while suppressing activation', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewButton({
            label: 'Non-native focusable disabled',
            elementKind: 'div',
            isNativeButton: false,
            isDisabled: true,
            isFocusableWhenDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Non-native focusable disabled' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native focusable disabled' }),
        ).toHaveAttr('tabIndex', '0'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native focusable disabled' }),
        ).not.toHaveHandler('click'),
        Scene.expect(
          Scene.role('button', { name: 'Non-native focusable disabled' }),
        ).not.toHaveHandler('keydown'),
      )
    }).not.toThrow()
  })

  test('enabled non-native buttons activate on Enter and Space', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCountButton({
            label: 'Div button',
            elementKind: 'div',
            isNativeButton: false,
            onClick: ClickedButton(),
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.text('Count 0')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Div button' }), 'Enter'),
        Scene.expect(Scene.text('Count 1')).toExist(),
        Scene.keydown(Scene.role('button', { name: 'Div button' }), ' '),
        Scene.expect(Scene.text('Count 2')).toExist(),
      )
    }).not.toThrow()
  })

  test('native button type attributes pass through', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTypeButtons },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Plain' })).toHaveAttr(
          'type',
          'button',
        ),
        Scene.expect(Scene.role('button', { name: 'Submit' })).toHaveAttr(
          'type',
          'submit',
        ),
        Scene.expect(Scene.role('button', { name: 'Reset' })).toHaveAttr(
          'type',
          'reset',
        ),
      )
    }).not.toThrow()
  })
})
