import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Toggle from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  isPressed: S.Boolean,
})
type Model = typeof Model.Type

const initialModel: Model = {
  isPressed: false,
}

// MESSAGE

const ChangedPressed = m('ChangedPressed', { isPressed: S.Boolean })

const Message = S.Union([ChangedPressed])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedPressed: ({ isPressed }) => [
        evo(model, { isPressed: () => isPressed }),
        [],
      ],
    }),
  )

// VIEW

type ElementKind = 'button' | 'div'

type TestToggleConfig = Omit<ViewConfig<Message>, 'isPressed' | 'toView'> &
  Readonly<{
    elementKind?: ElementKind
    label: string
  }>

const viewToggle =
  (config: TestToggleConfig) =>
  (model: Model): Html => {
    const h = html<Message>()
    const { elementKind = 'button', label, ...toggleConfig } = config

    return Toggle.view<Message>({
      ...toggleConfig,
      isPressed: model.isPressed,
      onPressedChange: change =>
        ChangedPressed({ isPressed: change.isPressed }),
      toView: attributes =>
        elementKind === 'button'
          ? h.button([...attributes.button], [label])
          : h.div([...attributes.button], [label]),
    })
  }

describe('base-ui/toggle', () => {
  test('reflects controlled pressed state with aria-pressed and data-pressed', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewToggle({ label: 'Bookmark' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Bookmark' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
        Scene.expect(Scene.role('button', { name: 'Bookmark' })).not.toHaveAttr(
          'data-pressed',
        ),
        Scene.click(Scene.role('button', { name: 'Bookmark' })),
        Scene.expect(Scene.role('button', { name: 'Bookmark' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Bookmark' })).toHaveAttr(
          'data-pressed',
        ),
      )
    }).not.toThrow()
  })

  test('disabled toggles suppress pressed changes and expose disabled attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggle({ label: 'Disabled', isDisabled: true }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).toHaveAttr(
          'disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(Scene.role('button', { name: 'Disabled' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
        Scene.expect(
          Scene.role('button', { name: 'Disabled' }),
        ).not.toHaveHandler('click'),
      )
    }).not.toThrow()
  })

  test('non-native toggles keep button keyboard activation semantics', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggle({
            label: 'Div toggle',
            elementKind: 'div',
            isNativeButton: false,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Div toggle' })).toHaveAttr(
          'role',
          'button',
        ),
        Scene.keydown(Scene.role('button', { name: 'Div toggle' }), 'Enter'),
        Scene.expect(Scene.role('button', { name: 'Div toggle' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.keydown(Scene.role('button', { name: 'Div toggle' }), ' '),
        Scene.expect(Scene.role('button', { name: 'Div toggle' })).toHaveAttr(
          'aria-pressed',
          'false',
        ),
      )
    }).not.toThrow()
  })
})
