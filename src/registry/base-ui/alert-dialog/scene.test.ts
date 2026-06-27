import { Match as M, Option, Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import * as AlertDialog from './index'
import type { ViewConfig } from './index'

// MODEL

const Model = S.Struct({
  open: S.Boolean,
  lastReason: AlertDialog.AlertDialogChangeReason,
  actionCount: S.Number,
})
type Model = typeof Model.Type

const initialModel: Model = {
  open: false,
  lastReason: 'none',
  actionCount: 0,
}

// MESSAGE

const ChangedAlertDialog = m('ChangedAlertDialog', {
  open: S.Boolean,
  reason: AlertDialog.AlertDialogChangeReason,
})
const ClickedConfirmAction = m('ClickedConfirmAction')

const Message = S.Union([ChangedAlertDialog, ClickedConfirmAction])
type Message = typeof Message.Type

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]
const withUpdateReturn = M.withReturnType<UpdateReturn>()

const update = (model: Model, message: Message): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      ChangedAlertDialog: ({ open, reason }) => [
        evo(model, {
          open: () => open,
          lastReason: () => reason,
        }),
        [],
      ],
      ClickedConfirmAction: () => [
        evo(model, { actionCount: count => count + 1 }),
        [],
      ],
    }),
  )

// VIEW

const viewAlertDialog =
  (
    config: Omit<
      ViewConfig<Message>,
      'id' | 'onAction' | 'onOpenChange' | 'open' | 'toView'
    >,
  ) =>
  (model: Model): Html => {
    const h = html<Message>()

    return AlertDialog.view<Message>({
      id: 'confirm-dialog',
      open: model.open,
      titleId: 'confirm-title',
      descriptionId: 'confirm-description',
      onOpenChange: change => ChangedAlertDialog(change),
      onAction: () => ClickedConfirmAction(),
      ...config,
      toView: attributes =>
        h.div(
          [...attributes.root],
          [
            h.button([...attributes.trigger], ['Delete account']),
            h.dialog(
              [...attributes.dialog],
              attributes.isMounted
                ? [
                    h.div([...attributes.backdrop.root], []),
                    h.div(
                      [...attributes.popup.root],
                      [
                        h.h2([...attributes.title], ['Are you sure?']),
                        h.p(
                          [...attributes.description],
                          ['This action cannot be undone.'],
                        ),
                        h.button([...attributes.cancel], ['Cancel']),
                        h.button([...attributes.action], ['Continue']),
                      ],
                    ),
                  ]
                : [],
            ),
            h.p([], [`Reason ${model.lastReason}`]),
            h.p([], [`Actions ${model.actionCount}`]),
          ],
        ),
    })
  }

describe('base-ui/alert-dialog', () => {
  test('renders forced modal alert dialog ARIA and data attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlertDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.role('button', { name: 'Delete account' }),
        ).toHaveAttr('aria-haspopup', 'dialog'),
        Scene.expect(
          Scene.role('button', { name: 'Delete account' }),
        ).toHaveAttr('aria-expanded', 'true'),
        Scene.expect(Scene.selector('[data-modal="true"]')).toExist(),
        Scene.expect(Scene.selector('#confirm-dialog')).toHaveAttr(
          'aria-modal',
          'true',
        ),
        Scene.expect(Scene.selector('#confirm-dialog-popup')).toHaveAttr(
          'role',
          'alertdialog',
        ),
        Scene.expect(Scene.selector('#confirm-dialog-popup')).toHaveAttr(
          'aria-labelledby',
          'confirm-title',
        ),
        Scene.expect(Scene.selector('#confirm-dialog-popup')).toHaveAttr(
          'aria-describedby',
          'confirm-description',
        ),
        Scene.expect(Scene.selector('#confirm-title')).toHaveText(
          'Are you sure?',
        ),
        Scene.expect(Scene.selector('#confirm-description')).toHaveText(
          'This action cannot be undone.',
        ),
      )
    }).not.toThrow()
  })

  test('trigger, cancel, and action emit model-owned facts', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlertDialog({}) },
        Scene.with(initialModel),
        Scene.click(Scene.role('button', { name: 'Delete account' })),
        Scene.expect(Scene.text('Reason trigger-press')).toExist(),
        Scene.click(Scene.role('button', { name: 'Cancel' })),
        Scene.expect(Scene.text('Reason close-press')).toExist(),
      )
      Scene.scene(
        { update, view: viewAlertDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.click(Scene.role('button', { name: 'Continue' })),
        Scene.expect(Scene.text('Actions 1')).toExist(),
        Scene.expect(Scene.text('Reason none')).toExist(),
      )
    }).not.toThrow()
  })

  test('backdrop dismissal is suppressed while Escape remains a close fact', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewAlertDialog({}) },
        Scene.with({ ...initialModel, open: true }),
        Scene.expect(
          Scene.selector('div[role="presentation"]'),
        ).not.toHaveHandler('click'),
        Scene.expect(Scene.selector('#confirm-dialog')).toHaveHandler('cancel'),
      )
    }).not.toThrow()
  })

  test('command helper keeps Dialog focus handoff and forced modal behavior', () => {
    const showCommand = AlertDialog.commandForOpenChange(
      { id: 'confirm-dialog', focusSelector: '#confirm-cancel' },
      AlertDialog.triggerOpenChange(),
    )
    const closeCommand = AlertDialog.commandForOpenChange(
      { id: 'confirm-dialog' },
      AlertDialog.closeOpenChange(),
    )

    expect(showCommand.name).toBe('ShowDialog')
    expect(showCommand.args).toStrictEqual({
      id: 'confirm-dialog',
      modal: true,
      maybeFocusSelector: Option.some('#confirm-cancel'),
    })
    expect(closeCommand.name).toBe('CloseDialog')
    expect(closeCommand.args).toStrictEqual({
      id: 'confirm-dialog',
      modal: true,
    })
  })
})
