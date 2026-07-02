import { Array as EffectArray, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import * as ToastPrimitive from '../../base-ui/toast'
import { view as Button } from '../button'
import * as Toast from './index'

// MESSAGE

export const ClickedShowToast = m('ClickedShowToast')
export const ClickedShowDescriptionToast = m('ClickedShowDescriptionToast')
export const ClickedShowPositionToast = m('ClickedShowPositionToast', {
  position: ToastPrimitive.ToastViewportPosition,
})
export const ClickedShowTypeToast = m('ClickedShowTypeToast', {
  variant: S.Union([
    S.Literal('default'),
    S.Literal('success'),
    S.Literal('info'),
    S.Literal('warning'),
    S.Literal('error'),
    S.Literal('promise'),
  ]),
})
export const ClickedPerformAction = m('ClickedPerformAction')
export const ClickedCreateStackedToast = m('ClickedCreateStackedToast')
export const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
export const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})
export const ChangedToastViewport = m('ChangedToastViewport', {
  interaction: ToastPrimitive.ToastViewportInteraction,
})

export const ToastExampleMessage = S.Union([
  ClickedShowToast,
  ClickedShowDescriptionToast,
  ClickedShowPositionToast,
  ClickedShowTypeToast,
  ClickedPerformAction,
  ClickedCreateStackedToast,
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
  ToastPrimitive.createToastState({ limit: 3 })

const defaultStackedState = (
  state: ToastPrimitive.ToastState,
): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState({
    limit: state.limit,
    defaultDuration: state.defaultDuration,
    isHovered: state.isHovered,
    isFocused: state.isFocused,
    isWindowFocused: state.isWindowFocused,
    timersPaused: state.timersPaused,
    nextId: state.nextId,
    toasts: [
      {
        id: 'stacked-1',
        title: 'Scheduled',
        description: 'Catch up with the design team.',
        actionLabel: 'Undo',
        duration: 5000,
        height: 84,
      },
      {
        id: 'stacked-2',
        title: 'Queued',
        description: 'The next toast sits one card back.',
        duration: 5000,
        height: 92,
      },
      {
        id: 'stacked-3',
        title: 'Ready',
        description: 'Hover or focus the viewport to expand.',
        duration: 5000,
        height: 96,
      },
    ],
  })

const stackedPreviewState = (
  state: ToastPrimitive.ToastState,
): ToastPrimitive.ToastState =>
  EffectArray.isReadonlyArrayEmpty(state.toasts)
    ? defaultStackedState(state)
    : state

const messageAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  onToastMessage: ((message: ToastExampleMessage) => Message) | undefined,
  message: ToastExampleMessage,
): ReadonlyArray<Attribute<Message>> =>
  onToastMessage === undefined ? [] : [h.OnClick(onToastMessage(message))]

const triggerButton = <Message>(
  label: string,
  message: ToastExampleMessage,
  controller: ToastExampleController<Message>,
): Html => {
  const h = html<Message>()

  return Button<Message>({
    variant: 'outline',
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          h.Type('button'),
          ...messageAttribute(h, controller.onToastMessage, message),
        ],
        [label],
      ),
  })
}

const toastSurface = <Message>(
  controller: ToastExampleController<Message>,
  options: Readonly<{
    variant?: Toast.ToastVariant
    stacked?: boolean
  }> = {},
): Html => {
  const { onToastMessage } = controller
  const state = controller.state ?? defaultState()
  const surfaceState =
    options.stacked === true ? stackedPreviewState(state) : state

  return Toast.Toaster<Message>({
    id: 'notifications',
    state: surfaceState,
    stackingStrategy:
      options.stacked === true ? 'base-ui-shuffle' : 'foldkit-push',
    viewportPositioning: 'absolute',
    ...(options.variant === undefined ? {} : { variant: options.variant }),
    ...(onToastMessage === undefined
      ? {}
      : {
          onAction: press => onToastMessage(PressedToastAction({ press })),
          onClose: request => onToastMessage(RequestedToastClose({ request })),
          onViewportInteraction: interaction =>
            onToastMessage(ChangedToastViewport({ interaction })),
        }),
  })
}

const toastExample = <Message>(
  triggerLabel: string,
  triggerMessage: ToastExampleMessage,
  controller: ToastExampleController<Message>,
  options: Readonly<{
    variant?: Toast.ToastVariant
    stacked?: boolean
  }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [
      h.Class(
        'relative flex min-h-44 w-full flex-col items-start justify-center gap-4 overflow-hidden',
      ),
    ],
    [
      triggerButton(triggerLabel, triggerMessage, controller),
      toastSurface(controller, {
        ...(options.variant === undefined ? {} : { variant: options.variant }),
        ...(options.stacked === undefined ? {} : { stacked: options.stacked }),
      }),
    ],
  )
}

export const ToastDemo = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Add to calendar', ClickedShowToast(), controller)

export const ToastSimple = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Show Toast', ClickedShowDescriptionToast(), controller)

export const ToastWithTitle = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Show Toast', ClickedShowToast(), controller)

export const ToastWithAction = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Show Toast', ClickedPerformAction(), controller)

export const ToastDestructive = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastExample(
    'Show Toast',
    ClickedShowTypeToast({ variant: 'error' }),
    controller,
    {
      variant: 'destructive',
    },
  )

export const ToastStacked = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastExample('Stacked toast', ClickedCreateStackedToast(), controller, {
    stacked: true,
  })
