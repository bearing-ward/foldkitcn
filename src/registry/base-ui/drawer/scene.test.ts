import { Match as M, Option, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Drawer from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: Drawer.DrawerChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedDrawer = m('ChangedDrawer', {
  open: S.Boolean,
  reason: Drawer.DrawerChangeReason,
})

const Message = S.Union([ChangedDrawer])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedDrawer: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewDrawer =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Drawer.view<Message>({
      id: 'mobile-drawer',
      open: model.open,
      titleId: 'mobile-drawer-title',
      descriptionId: 'mobile-drawer-description',
      onOpenChange: change => ChangedDrawer(change),
      ...config,
      toView: attributes =>
        h.div(
          [],
          [
            h.div([...attributes.indentBackground.root], []),
            h.div(
              [...attributes.indent.root, ...attributes.root],
              [
                h.button([...attributes.trigger], ['Open navigation']),
                h.dialog(
                  [...attributes.dialog],
                  attributes.isMounted
                    ? [
                        h.div([...attributes.backdrop.root], []),
                        h.div(
                          [...attributes.popup.root],
                          [
                            h.div(
                              [...attributes.content],
                              [
                                h.h2([...attributes.title], ['Navigation']),
                                h.p(
                                  [...attributes.description],
                                  ['Choose a destination.'],
                                ),
                                h.button([...attributes.close], ['Close']),
                              ],
                            ),
                          ],
                        ),
                      ]
                    : [],
                ),
              ],
            ),
            h.p([], [`Reason ${model.lastReason}`]),
          ],
        ),
    })
  }

describe('base-ui/drawer', () => {
  test('renders Dialog-owned modal, ARIA, focus, and Drawer part attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDrawer({ swipeDirection: 'left' }) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Open navigation' }),
        ).toHaveAttr('aria-haspopup', 'dialog'),
        Scene.expect(
          Scene.role('button', { name: 'Open navigation' }),
        ).toHaveAttr('aria-expanded', 'true'),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveAttr('open'),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveAttr(
          'aria-modal',
          'true',
        ),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveAttr(
          'aria-labelledby',
          'mobile-drawer-title',
        ),
        Scene.expect(Scene.selector('#mobile-drawer-popup')).toHaveAttr(
          'data-swipe-direction',
          'left',
        ),
        Scene.expect(Scene.selector('#mobile-drawer-popup')).toHaveAttr(
          'data-placement',
          'left',
        ),
        Scene.expect(Scene.selector('[data-drawer-content]')).toExist(),
        Scene.expect(Scene.selector('[data-active]')).toExist(),
      )
    }).not.toThrow()
  })

  test('model-owned open state changes from trigger, close, backdrop, and Escape facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDrawer({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Open navigation' })),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveAttr('open'),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Close' })),
        Scene.expect(
          Scene.role('button', { name: 'Open navigation' }),
        ).toHaveAttr('aria-expanded', 'false'),
        Scene.expect(Scene.text('Reason close-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewDrawer({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.selector('div[role="presentation"]')),
        Scene.expect(Scene.text('Reason outside-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewDrawer({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveHandler('cancel'),
      )
    }).not.toThrow()
  })

  test('disabled non-modal drawer suppresses activation while preserving indent input', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewDrawer({
            hasActiveDrawer: false,
            isDisabled: true,
            modal: false,
          }),
        },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Open navigation' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Open navigation' }),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#mobile-drawer')).toHaveAttr(
          'aria-modal',
          'false',
        ),
        Scene.expect(Scene.selector('[data-inactive]')).toExist(),
      )
    }).not.toThrow()
  })

  test('command helper delegates to Dialog commands without forking modal effects', () => {
    const showCommand = Drawer.commandForOpenChange(
      { id: 'mobile-drawer', focusSelector: '#drawer-close' },
      Drawer.triggerOpenChange(),
    )
    const closeCommand = Drawer.commandForOpenChange(
      { id: 'mobile-drawer' },
      Drawer.swipeOpenChange(),
    )

    expect(showCommand.name).toBe('ShowDialog')
    expect(showCommand.args).toStrictEqual({
      id: 'mobile-drawer',
      modal: true,
      maybeFocusSelector: Option.some('#drawer-close'),
    })
    expect(closeCommand.name).toBe('CloseDialog')
    expect(closeCommand.args).toStrictEqual({
      id: 'mobile-drawer',
      modal: true,
    })
  })
})
