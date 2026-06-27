import { Schema as S } from 'effect'
import type * as Command from 'foldkit/command'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Dialog from '../dialog'

// MODEL

export type AlertDialogModalMode = true

export const AlertDialogChangeReason = Dialog.DialogChangeReason
export type AlertDialogChangeReason = typeof AlertDialogChangeReason.Type
export const AlertDialogOpenChange = Dialog.DialogOpenChange
export type AlertDialogOpenChange = typeof AlertDialogOpenChange.Type
export const AlertDialogTransitionStatus = Dialog.DialogTransitionStatus
export type AlertDialogTransitionStatus =
  typeof AlertDialogTransitionStatus.Type

export const AlertDialogOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  isDisabled: S.optional(S.Boolean),
  isNested: S.optional(S.Boolean),
  hasNestedDialogOpen: S.optional(S.Boolean),
  transitionStatus: S.optional(Dialog.DialogTransitionStatus),
  titleId: S.optional(S.String),
  descriptionId: S.optional(S.String),
  focusSelector: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
})
export type AlertDialogOptions = typeof AlertDialogOptions.Type

// MESSAGE

export const { CompletedCloseDialog, CompletedShowDialog } = Dialog

export const { CommandMessage } = Dialog
export type CommandMessage = Dialog.CommandMessage

// UPDATE

export const {
  CloseDialog,
  ShowDialog,
  closeOpenChange,
  descriptionId,
  escapeOpenChange,
  openChange,
  panelId,
  titleId,
  triggerOpenChange,
} = Dialog

export const modal: AlertDialogModalMode = true

export const commandForOpenChange = (
  config: Pick<AlertDialogOptions, 'focusSelector' | 'id'>,
  change: AlertDialogOpenChange,
): Command.Command<CommandMessage> =>
  Dialog.commandForOpenChange(
    {
      ...config,
      modal,
    },
    change,
  )

// VIEW

export type AlertDialogAttributes<Message> = Dialog.DialogAttributes<Message> &
  Readonly<{
    action: ReadonlyArray<Attribute<Message>>
    cancel: ReadonlyArray<Attribute<Message>>
  }>

export type AlertDialogPartAttributes<Message> =
  Dialog.DialogPartAttributes<Message>

export type ViewConfig<Message> = AlertDialogOptions &
  Readonly<{
    toView: (attributes: AlertDialogAttributes<Message>) => Html
    onOpenChange?: (change: AlertDialogOpenChange) => Message
    onAction?: () => Message
  }>

const disabledAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<AlertDialogOptions, 'isDisabled'>,
): ReadonlyArray<Attribute<Message>> =>
  config.isDisabled === true
    ? [h.AriaDisabled(true), h.DataAttribute('disabled', '')]
    : []

const actionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  ...disabledAttributes(h, config),
  ...(config.isDisabled === true || config.onAction === undefined
    ? []
    : [h.OnClick(config.onAction())]),
]

const alertDialogAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: Dialog.DialogAttributes<Message>,
): AlertDialogAttributes<Message> => ({
  ...attributes,
  popup: {
    ...attributes.popup,
    root:
      attributes.popup.root.length > 0
        ? [...attributes.popup.root, h.Role('alertdialog')]
        : attributes.popup.root,
  },
  cancel: attributes.close,
  action: actionAttributes(h, config),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return Dialog.view<Message>({
    ...config,
    modal,
    disableOutsidePress: true,
    toView: attributes =>
      config.toView(alertDialogAttributes(h, config, attributes)),
  })
}
