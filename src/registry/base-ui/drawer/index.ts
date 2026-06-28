import { Schema as S } from 'effect'
import type * as Command from 'foldkit/command'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Dialog from '../dialog'

// MODEL

export const DrawerModalMode = Dialog.DialogModalMode
export type DrawerModalMode = Dialog.DialogModalMode

export const DrawerTransitionStatus = Dialog.DialogTransitionStatus
export type DrawerTransitionStatus = Dialog.DialogTransitionStatus

export const DrawerSwipeDirection = S.Union([
  S.Literal('up'),
  S.Literal('down'),
  S.Literal('left'),
  S.Literal('right'),
])
export type DrawerSwipeDirection = typeof DrawerSwipeDirection.Type

export const DrawerPlacement = S.Union([
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('bottom'),
  S.Literal('left'),
])
export type DrawerPlacement = typeof DrawerPlacement.Type

export const DrawerChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('close-press'),
  S.Literal('outside-press'),
  S.Literal('escape-key'),
  S.Literal('swipe'),
  S.Literal('none'),
])
export type DrawerChangeReason = typeof DrawerChangeReason.Type

export const DrawerOpenChange = S.Struct({
  open: S.Boolean,
  reason: DrawerChangeReason,
})
export type DrawerOpenChange = typeof DrawerOpenChange.Type

export const DrawerOptions = S.Struct({
  id: S.String,
  open: S.Boolean,
  modal: S.optional(DrawerModalMode),
  isDisabled: S.optional(S.Boolean),
  isNested: S.optional(S.Boolean),
  hasNestedDialogOpen: S.optional(S.Boolean),
  hasNestedDrawerOpen: S.optional(S.Boolean),
  hasNestedDrawerSwiping: S.optional(S.Boolean),
  hasActiveDrawer: S.optional(S.Boolean),
  isExpanded: S.optional(S.Boolean),
  isSwiping: S.optional(S.Boolean),
  transitionStatus: S.optional(DrawerTransitionStatus),
  titleId: S.optional(S.String),
  descriptionId: S.optional(S.String),
  focusSelector: S.optional(S.String),
  forceMount: S.optional(S.Boolean),
  disableOutsidePress: S.optional(S.Boolean),
  swipeDirection: S.optional(DrawerSwipeDirection),
  placement: S.optional(DrawerPlacement),
})
export type DrawerOptions = typeof DrawerOptions.Type

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
  outsideOpenChange,
  panelId,
  titleId,
  triggerOpenChange,
} = Dialog

export const openChange = (
  open: boolean,
  reason: DrawerChangeReason = 'none',
): DrawerOpenChange => ({
  open,
  reason,
})

export const swipeOpenChange = (): DrawerOpenChange =>
  openChange(false, 'swipe')

const toDialogChange = (change: DrawerOpenChange): Dialog.DialogOpenChange =>
  Dialog.openChange(
    change.open,
    change.reason === 'swipe' ? 'none' : change.reason,
  )

export const commandForOpenChange = (
  config: Pick<DrawerOptions, 'focusSelector' | 'id' | 'modal'>,
  change: DrawerOpenChange,
): Command.Command<CommandMessage> =>
  Dialog.commandForOpenChange(config, toDialogChange(change))

// VIEW

export type DrawerAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  dialog: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  backdrop: DrawerPopupPartAttributes<Message>
  popup: DrawerPopupPartAttributes<Message>
  content: ReadonlyArray<Attribute<Message>>
  title: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
  close: ReadonlyArray<Attribute<Message>>
  indent: DrawerIndentPartAttributes<Message>
  indentBackground: DrawerIndentPartAttributes<Message>
  isMounted: boolean
  isOpen: boolean
}>

export type DrawerPopupPartAttributes<Message> =
  Dialog.DialogPartAttributes<Message>

export type DrawerIndentPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isActive: boolean
}>

export type ViewConfig<Message> = DrawerOptions &
  Readonly<{
    toView: (attributes: DrawerAttributes<Message>) => Html
    onOpenChange?: (change: DrawerOpenChange) => Message
  }>

const defaultSwipeDirection: DrawerSwipeDirection = 'down'

export const placementFromSwipeDirection = (
  swipeDirection: DrawerSwipeDirection,
): DrawerPlacement => {
  if (swipeDirection === 'up') {
    return 'top'
  }

  if (swipeDirection === 'left') {
    return 'left'
  }

  if (swipeDirection === 'right') {
    return 'right'
  }

  return 'bottom'
}

const resolvedSwipeDirection = (
  config: Pick<DrawerOptions, 'swipeDirection'>,
): DrawerSwipeDirection => config.swipeDirection ?? defaultSwipeDirection

const resolvedPlacement = (
  config: Pick<DrawerOptions, 'placement' | 'swipeDirection'>,
): DrawerPlacement =>
  config.placement ??
  placementFromSwipeDirection(resolvedSwipeDirection(config))

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const activeDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  active: boolean,
): ReadonlyArray<Attribute<Message>> =>
  active ? [h.DataAttribute('active', '')] : [h.DataAttribute('inactive', '')]

const drawerOpenChange = (change: Dialog.DialogOpenChange): DrawerOpenChange =>
  openChange(change.open, change.reason)

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: Dialog.DialogAttributes<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...attributes.root,
  h.DataAttribute('swipe-direction', resolvedSwipeDirection(config)),
  h.DataAttribute('placement', resolvedPlacement(config)),
]

const popupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: Dialog.DialogAttributes<Message>,
): DrawerPopupPartAttributes<Message> => ({
  ...attributes.popup,
  root:
    attributes.popup.root.length > 0
      ? [
          ...attributes.popup.root,
          h.DataAttribute('swipe-direction', resolvedSwipeDirection(config)),
          h.DataAttribute('placement', resolvedPlacement(config)),
          h.Style({
            '--drawer-frontmost-height': '0px',
            '--drawer-height': 'auto',
            '--drawer-snap-point-offset': '0px',
            '--drawer-swipe-movement-x': '0px',
            '--drawer-swipe-movement-y': '0px',
            '--drawer-swipe-progress': '0',
            '--drawer-swipe-strength': '1',
            '--nested-drawers': config.hasNestedDrawerOpen === true ? '1' : '0',
          }),
          ...booleanDataAttribute(h, 'expanded', config.isExpanded),
          ...booleanDataAttribute(
            h,
            'nested-drawer-open',
            config.hasNestedDrawerOpen,
          ),
          ...booleanDataAttribute(
            h,
            'nested-drawer-swiping',
            config.hasNestedDrawerSwiping,
          ),
          ...booleanDataAttribute(h, 'swiping', config.isSwiping),
        ]
      : attributes.popup.root,
})

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('drawer-content', '')]

const indentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  active: boolean,
): DrawerIndentPartAttributes<Message> => ({
  root: [
    ...activeDataAttributes(h, active),
    h.Style({ '--drawer-swipe-progress': '0' }),
  ],
  isActive: active,
})

const indentBackgroundAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  active: boolean,
): DrawerIndentPartAttributes<Message> => ({
  root: activeDataAttributes(h, active),
  isActive: active,
})

const drawerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: Dialog.DialogAttributes<Message>,
): DrawerAttributes<Message> => {
  const hasActiveDrawer = config.hasActiveDrawer ?? config.open

  return {
    ...attributes,
    root: rootAttributes(h, config, attributes),
    backdrop: attributes.backdrop,
    popup: popupAttributes(h, config, attributes),
    content: contentAttributes(h),
    indent: indentAttributes(h, hasActiveDrawer),
    indentBackground: indentBackgroundAttributes(h, hasActiveDrawer),
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { onOpenChange, ...dialogConfig } = config
  const maybeOnOpenChange =
    onOpenChange === undefined
      ? {}
      : {
          onOpenChange: (change: Dialog.DialogOpenChange) =>
            onOpenChange(drawerOpenChange(change)),
        }

  return Dialog.view<Message>({
    ...dialogConfig,
    ...maybeOnOpenChange,
    toView: attributes =>
      config.toView(drawerAttributes(h, config, attributes)),
  })
}
