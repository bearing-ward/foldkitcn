import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import * as ToastPrimitive from '../../base-ui/toast'
import * as Button from '../button'
import * as Sonner from './index'

// MESSAGE

const ClickedShowToast = m('ClickedShowToast')
const ClickedShowDescriptionToast = m('ClickedShowDescriptionToast')
const ClickedShowPositionToast = m('ClickedShowPositionToast', {
  position: ToastPrimitive.ToastViewportPosition,
})
const ClickedShowTypeToast = m('ClickedShowTypeToast', {
  variant: S.Union([
    S.Literal('default'),
    S.Literal('success'),
    S.Literal('info'),
    S.Literal('warning'),
    S.Literal('error'),
    S.Literal('promise'),
  ]),
})
const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})
const ChangedToastViewport = m('ChangedToastViewport', {
  interaction: ToastPrimitive.ToastViewportInteraction,
})

export const ToastExampleMessage = S.Union([
  ClickedShowToast,
  ClickedShowDescriptionToast,
  ClickedShowPositionToast,
  ClickedShowTypeToast,
  PressedToastAction,
  RequestedToastClose,
  ChangedToastViewport,
])
export type ToastExampleMessage = typeof ToastExampleMessage.Type

export type ToastExampleController<Message> = Readonly<{
  state?: ToastPrimitive.ToastState
  onToastMessage?: (message: ToastExampleMessage) => Message
}>

const defaultState = (): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState()

const descriptionButtonClassName = 'w-fit'
const positionButtonsClassName = 'flex flex-wrap justify-center gap-2'
const typeButtonsClassName = 'flex flex-wrap gap-2'

const toastPositionMap: Readonly<
  Record<ToastPrimitive.ToastViewportPosition, ToastPrimitive.ToastPosition>
> = {
  'top-left': { side: 'top', align: 'start' },
  'top-center': { side: 'top', align: 'center' },
  'top-right': { side: 'top', align: 'end' },
  'bottom-left': { side: 'bottom', align: 'start' },
  'bottom-center': { side: 'bottom', align: 'center' },
  'bottom-right': { side: 'bottom', align: 'end' },
}

const messageAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  onToastMessage: ((message: ToastExampleMessage) => Message) | undefined,
  message: ToastExampleMessage,
): ReadonlyArray<Attribute<Message>> =>
  onToastMessage === undefined ? [] : [h.OnClick(onToastMessage(message))]

const toastButton = <Message>(
  label: string,
  message: ToastExampleMessage,
  controller: ToastExampleController<Message>,
  buttonClassName?: string,
): Html => {
  const h = html<Message>()

  return Button.view<Message>({
    variant: 'outline',
    ...(buttonClassName === undefined ? {} : { className: buttonClassName }),
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          ...messageAttribute(h, controller.onToastMessage, message),
          h.Type('button'),
        ],
        [label],
      ),
  })
}

const layoutButtons = <Message>(
  className: string,
  buttons: ReadonlyArray<Html>,
): Html => {
  const h = html<Message>()

  return h.div([h.Class(className)], buttons)
}

const positionButtons = <Message>(
  controller: ToastExampleController<Message>,
): ReadonlyArray<Html> => [
  toastButton(
    'Top Left',
    ClickedShowPositionToast({ position: 'top-left' }),
    controller,
  ),
  toastButton(
    'Top Center',
    ClickedShowPositionToast({ position: 'top-center' }),
    controller,
  ),
  toastButton(
    'Top Right',
    ClickedShowPositionToast({ position: 'top-right' }),
    controller,
  ),
  toastButton(
    'Bottom Left',
    ClickedShowPositionToast({ position: 'bottom-left' }),
    controller,
  ),
  toastButton(
    'Bottom Center',
    ClickedShowPositionToast({ position: 'bottom-center' }),
    controller,
  ),
  toastButton(
    'Bottom Right',
    ClickedShowPositionToast({ position: 'bottom-right' }),
    controller,
  ),
]

const typeButtons = <Message>(
  controller: ToastExampleController<Message>,
): ReadonlyArray<Html> => [
  toastButton(
    'Default',
    ClickedShowTypeToast({ variant: 'default' }),
    controller,
  ),
  toastButton(
    'Success',
    ClickedShowTypeToast({ variant: 'success' }),
    controller,
  ),
  toastButton('Info', ClickedShowTypeToast({ variant: 'info' }), controller),
  toastButton(
    'Warning',
    ClickedShowTypeToast({ variant: 'warning' }),
    controller,
  ),
  toastButton('Error', ClickedShowTypeToast({ variant: 'error' }), controller),
  toastButton(
    'Promise',
    ClickedShowTypeToast({ variant: 'promise' }),
    controller,
  ),
]

export const SonnerDemo = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastButton('Show Toast', ClickedShowToast(), controller)

export const SonnerDescription = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastButton(
    'Show Toast',
    ClickedShowDescriptionToast(),
    controller,
    descriptionButtonClassName,
  )

export const SonnerPosition = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => layoutButtons(positionButtonsClassName, positionButtons(controller))

export const SonnerTypes = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => layoutButtons(typeButtonsClassName, typeButtons(controller))

export const toastViewportPositionFromPosition = (
  position: ToastPrimitive.ToastViewportPosition,
): ToastPrimitive.ToastPosition => toastPositionMap[position]

const toastViewportPositionFromToast = (
  toast: ToastPrimitive.ToastItem,
): ToastPrimitive.ToastViewportPosition => {
  if (toast.position?.side === 'top' && toast.position.align === 'start') {
    return 'top-left'
  }

  if (toast.position?.side === 'top' && toast.position.align === 'center') {
    return 'top-center'
  }

  if (toast.position?.side === 'top' && toast.position.align === 'end') {
    return 'top-right'
  }

  if (toast.position?.side === 'bottom' && toast.position.align === 'start') {
    return 'bottom-left'
  }

  if (toast.position?.side === 'bottom' && toast.position.align === 'center') {
    return 'bottom-center'
  }

  return 'bottom-right'
}

const activeToastViewportPosition = (
  state: ToastPrimitive.ToastState,
): ToastPrimitive.ToastViewportPosition =>
  toastViewportPositionFromToast(
    state.toasts.find(toast => toast.transitionStatus !== 'ending') ?? {
      id: 'default',
    },
  )

export const renderSonnerDemoToaster = <Message>(
  controller: ToastExampleController<Message>,
  options: Readonly<{
    theme?: Sonner.SonnerTheme
    viewportPosition?: ToastPrimitive.ToastViewportPosition
  }> = {},
): Html => {
  const { state = defaultState(), onToastMessage } = controller

  return Sonner.Toaster<Message>({
    id: 'notifications',
    state,
    theme: options.theme ?? 'system',
    viewportPosition:
      options.viewportPosition ?? activeToastViewportPosition(state),
    viewportPositioning: 'absolute',
    ...(onToastMessage === undefined
      ? {}
      : {
          onAction: (press: ToastPrimitive.ToastActionPress) =>
            onToastMessage(PressedToastAction({ press })),
        }),
    ...(onToastMessage === undefined
      ? {}
      : {
          onClose: (request: ToastPrimitive.ToastCloseRequest) =>
            onToastMessage(RequestedToastClose({ request })),
          onViewportInteraction: interaction =>
            onToastMessage(ChangedToastViewport({ interaction })),
        }),
  })
}
