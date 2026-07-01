import { Schema as S } from 'effect'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import { view as Toast } from './index'
import * as ToastPrimitive from './index'

// MESSAGE

export const ClickedCopyToClipboard = m('ClickedCopyToClipboard')
export const ClickedCreateStackedToast = m('ClickedCreateStackedToast')
export const ClickedCreatePositionToast = m('ClickedCreatePositionToast')
export const ClickedPerformAction = m('ClickedPerformAction')
export const ClickedRunPromiseToast = m('ClickedRunPromiseToast')
export const ClickedCreateCustomToast = m('ClickedCreateCustomToast')
export const ClickedSaveDraft = m('ClickedSaveDraft')
export const ClickedCreateVaryingHeightToast = m(
  'ClickedCreateVaryingHeightToast',
)
export const PressedToastAction = m('PressedToastAction', {
  press: ToastPrimitive.ToastActionPress,
})
export const RequestedToastClose = m('RequestedToastClose', {
  request: ToastPrimitive.ToastCloseRequest,
})

export const ToastExampleMessage = S.Union([
  ClickedCopyToClipboard,
  ClickedCreateStackedToast,
  ClickedCreatePositionToast,
  ClickedPerformAction,
  ClickedRunPromiseToast,
  ClickedCreateCustomToast,
  ClickedSaveDraft,
  ClickedCreateVaryingHeightToast,
  PressedToastAction,
  RequestedToastClose,
])
export type ToastExampleMessage = typeof ToastExampleMessage.Type

export type ToastExampleController<Message> = Readonly<{
  state?: ToastPrimitive.ToastState
  onToastMessage?: (message: ToastExampleMessage) => Message
}>

const viewportClass =
  'pointer-events-none z-10 w-[calc(100vw-2rem)] max-w-sm text-sm text-foreground sm:w-90'

const toastClass =
  'pointer-events-auto absolute bottom-0 right-0 box-border w-full cursor-default select-none border border-neutral-950 bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0_rgb(0_0_0_/_12%)] outline-none transition-[transform,opacity,height] duration-500 data-[limited]:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white'

const titleClass = 'font-medium leading-none'
const descriptionClass = 'm-0 text-sm leading-5'
const contentClass =
  'box-border flex h-full items-center gap-4 overflow-hidden p-3 transition-opacity duration-200 data-[behind]:opacity-0 data-[expanded]:opacity-100'
const textClass = 'flex min-w-0 flex-1 flex-col gap-1'
const actionRowClass = 'flex items-center gap-2'
const actionClass =
  'flex h-8 shrink-0 items-center justify-center border border-neutral-950 bg-white px-3 text-sm leading-none text-neutral-950 dark:border-white dark:bg-neutral-950 dark:text-white'
const closeClass =
  'flex h-8 shrink-0 items-center justify-center border border-neutral-950 bg-white px-3 text-sm leading-none text-neutral-950 dark:border-white dark:bg-neutral-950 dark:text-white'
const buttonClass =
  'box-border inline-flex h-10 items-center justify-center border border-neutral-950 bg-neutral-950 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:outline-white'

const defaultState = (): ToastPrimitive.ToastState =>
  ToastPrimitive.createToastState()

const messageAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  onToastMessage: ((message: ToastExampleMessage) => Message) | undefined,
  message: ToastExampleMessage,
) => (onToastMessage === undefined ? [] : [h.OnClick(onToastMessage(message))])

const renderToastViewport = <Message>(
  state: ToastPrimitive.ToastState,
  options: Readonly<{
    stackingStrategy?: ToastPrimitive.ToastStackingStrategy
    viewportPosition?: ToastPrimitive.ToastViewportPosition
    viewportPositioning?: ToastPrimitive.ToastViewportPositioning
    onToastMessage?: (message: ToastExampleMessage) => Message
  }> = {},
): Html => {
  const h = html<Message>()
  const { onToastMessage } = options

  return Toast<Message>({
    id: 'notifications',
    state,
    ...(options.stackingStrategy === undefined
      ? {}
      : { stackingStrategy: options.stackingStrategy }),
    ...(options.viewportPosition === undefined
      ? {}
      : { viewportPosition: options.viewportPosition }),
    ...(options.viewportPositioning === undefined
      ? {}
      : { viewportPositioning: options.viewportPositioning }),
    ...(onToastMessage === undefined
      ? {}
      : {
          onAction: press => onToastMessage(PressedToastAction({ press })),
          onClose: request => onToastMessage(RequestedToastClose({ request })),
        }),
    toView: attributes =>
      h.div(
        [...attributes.provider],
        [
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.viewport.root, h.Class(viewportClass)],
                attributes.toasts.flatMap(toast =>
                  toast.isOpen
                    ? [
                        h.div(
                          [...toast.root, h.Class(toastClass)],
                          [
                            h.div(
                              [...toast.content, h.Class(contentClass)],
                              [
                                h.div(
                                  [h.Class(textClass)],
                                  [
                                    toast.toast.title === undefined
                                      ? ''
                                      : h.h2(
                                          [...toast.title, h.Class(titleClass)],
                                          [toast.toast.title],
                                        ),
                                    toast.toast.description === undefined
                                      ? ''
                                      : h.p(
                                          [
                                            ...toast.description,
                                            h.Class(descriptionClass),
                                          ],
                                          [toast.toast.description],
                                        ),
                                  ],
                                ),
                                h.div(
                                  [h.Class(actionRowClass)],
                                  [
                                    toast.toast.actionLabel === undefined
                                      ? ''
                                      : h.button(
                                          [
                                            ...toast.action,
                                            h.Class(actionClass),
                                          ],
                                          [toast.toast.actionLabel],
                                        ),
                                    h.button(
                                      [...toast.close, h.Class(closeClass)],
                                      ['Dismiss'],
                                    ),
                                  ],
                                ),
                              ],
                            ),
                          ],
                        ),
                      ]
                    : [],
                ),
              ),
            ],
          ),
        ],
      ),
  })
}

const toastExample = <Message>(
  triggerLabel: string,
  triggerMessage: ToastExampleMessage,
  controller: ToastExampleController<Message>,
  options: Readonly<{
    defaultState?: ToastPrimitive.ToastState
    stackingStrategy?: ToastPrimitive.ToastStackingStrategy
    viewportPosition?: ToastPrimitive.ToastViewportPosition
    viewportPositioning?: ToastPrimitive.ToastViewportPositioning
  }> = {},
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('min-h-40')],
    [
      h.button(
        [
          h.Type('button'),
          h.Class(buttonClass),
          ...messageAttribute(h, controller.onToastMessage, triggerMessage),
        ],
        [triggerLabel],
      ),
      renderToastViewport(
        controller.state ?? options.defaultState ?? defaultState(),
        {
          ...(options.stackingStrategy === undefined
            ? { stackingStrategy: 'foldkit-push' }
            : { stackingStrategy: options.stackingStrategy }),
          ...(options.viewportPosition === undefined
            ? {}
            : { viewportPosition: options.viewportPosition }),
          ...(options.viewportPositioning === undefined
            ? {}
            : { viewportPositioning: options.viewportPositioning }),
          ...(controller.onToastMessage === undefined
            ? {}
            : { onToastMessage: controller.onToastMessage }),
        },
      ),
    ],
  )
}

const anchoredToastExample = <Message>(
  controller: ToastExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('min-h-40')],
    [
      h.div(
        [h.Class('flex flex-wrap items-center gap-2')],
        [
          h.button(
            [
              h.Type('button'),
              h.Class(buttonClass),
              ...messageAttribute(
                h,
                controller.onToastMessage,
                ClickedCopyToClipboard(),
              ),
            ],
            ['Copy to clipboard'],
          ),
          h.button(
            [
              h.Type('button'),
              h.Class(buttonClass),
              ...messageAttribute(
                h,
                controller.onToastMessage,
                ClickedCreateStackedToast(),
              ),
            ],
            ['Stacked toast'],
          ),
        ],
      ),
      renderToastViewport(
        controller.state ?? ToastPrimitive.createToastState(),
        controller.onToastMessage === undefined
          ? { stackingStrategy: 'base-ui-shuffle' }
          : {
              stackingStrategy: 'base-ui-shuffle',
              onToastMessage: controller.onToastMessage,
            },
      ),
    ],
  )
}

export const ToastAnchored = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => anchoredToastExample(controller)

export const ToastCustomPosition = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastExample('Create toast', ClickedCreatePositionToast(), controller, {
    stackingStrategy: 'foldkit-push',
    viewportPosition: 'top-center',
  })

export const ToastUndoAction = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Perform action', ClickedPerformAction(), controller)

export const ToastPromise = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Run effect', ClickedRunPromiseToast(), controller)

export const ToastCustom = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastExample('Create custom toast', ClickedCreateCustomToast(), controller)

export const ToastDeduplicated = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html => toastExample('Save draft', ClickedSaveDraft(), controller)

export const ToastVaryingHeights = <Message = never>(
  controller: ToastExampleController<Message> = {},
): Html =>
  toastExample(
    'Create varying height toast',
    ClickedCreateVaryingHeightToast(),
    controller,
  )
