import { Match as M, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as Dialog from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: Dialog.DialogChangeReason,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
}

// MESSAGE

const ChangedDialog = m('ChangedDialog', {
  open: S.Boolean,
  reason: Dialog.DialogChangeReason,
})

const Message = S.Union([ChangedDialog])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedDialog: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
    }),
  )

// VIEW

const viewDialog =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return Dialog.view<Message>({
      id: 'settings-dialog',
      open: model.open,
      titleId: 'settings-title',
      descriptionId: 'settings-description',
      onOpenChange: change => ChangedDialog(change),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Open settings']),
            h.dialog(
              [...attributes.dialog],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.popup.root],
                      [
                        h.h2([...attributes.title], ['Settings']),
                        h.p([...attributes.description], ['Manage settings.']),
                        h.button([...attributes.close], ['Close']),
                      ],
                    ),
                  ]
                : [],
            ),
            h.p([], [`Reason ${model.lastReason}`]),
          ],
        ),
    })
  }

describe('base-ui/dialog', () => {
  test('renders trigger, dialog, backdrop, popup, title, and description attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-haspopup', 'dialog'),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-expanded', 'true'),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr('open'),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr(
          'aria-modal',
          'true',
        ),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr(
          'aria-labelledby',
          'settings-title',
        ),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr(
          'aria-describedby',
          'settings-description',
        ),
        Scene.expect(Scene.selector('#settings-dialog-popup')).toHaveAttr(
          'data-open',
        ),
        Scene.expect(Scene.selector('#settings-title')).toHaveText('Settings'),
        Scene.expect(Scene.selector('#settings-description')).toHaveText(
          'Manage settings.',
        ),
      )
    }).not.toThrow()
  })

  test('model-owned open state changes from trigger, close, backdrop, and Escape facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDialog({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Open settings' })),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr('open'),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Close' })),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-expanded', 'false'),
        Scene.expect(Scene.text('Reason close-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.selector('div[role="presentation"]')),
        Scene.expect(Scene.text('Reason outside-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveHandler(
          'cancel',
        ),
      )
    }).not.toThrow()
  })

  test('disabled and non-modal states expose attributes and suppress activation', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewDialog({ isDisabled: true, modal: false }) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.role('button', { name: 'Open settings' }),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#settings-dialog')).toHaveAttr(
          'aria-modal',
          'false',
        ),
      )
    }).not.toThrow()
  })
})
