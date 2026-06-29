import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Toast } from './index'
import * as ToastPrimitive from './index'

const viewportClass = 'w-80 max-w-[calc(100vw-2rem)] text-sm text-foreground'

const toastClass =
  'rounded-md border border-border bg-background p-4 shadow-sm outline-none data-[expanded]:shadow-md data-[limited]:opacity-50 data-[type=success]:border-emerald-500 data-[type=error]:border-red-500 data-[type=loading]:border-muted-foreground'

const titleClass = 'font-medium leading-none'
const descriptionClass = 'mt-1 text-muted-foreground'
const contentClass = 'grid gap-1 data-[behind]:opacity-80'
const actionRowClass = 'mt-3 flex items-center gap-2'
const actionClass =
  'inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium'
const closeClass =
  'inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium'

const renderToastView = (
  state: ToastPrimitive.ToastState,
  options: Readonly<{
    viewportPosition?: ToastPrimitive.ToastViewportPosition
  }> = {},
): Html => {
  const h = html<never>()

  return Toast<never>({
    id: 'notifications',
    state,
    ...(options.viewportPosition === undefined
      ? {}
      : { viewportPosition: options.viewportPosition }),
    toView: attributes =>
      h.div(
        [...attributes.provider],
        [
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.viewport.root, h.Class(viewportClass)],
                attributes.toasts.map(toast =>
                  h.div(
                    [...toast.root, h.Class(toastClass)],
                    [
                      h.div(
                        [...toast.content, h.Class(contentClass)],
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
                                [...toast.action, h.Class(actionClass)],
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
                ),
              ),
            ],
          ),
        ],
      ),
  })
}

export const ToastDemo = (): Html =>
  renderToastView(
    ToastPrimitive.createToastState({
      toasts: [
        {
          id: 'saved',
          title: 'Saved',
          description: 'Your changes are ready.',
          type: 'success',
          priority: 'low',
          duration: 5000,
          height: 84,
        },
      ],
    }),
  )

export const ToastAction = (): Html =>
  renderToastView(
    ToastPrimitive.createToastState({
      isHovered: true,
      toasts: [
        {
          id: 'undo',
          title: 'File archived',
          description: 'Undo is available for a short time.',
          actionLabel: 'Undo',
          duration: 8000,
          height: 96,
        },
      ],
    }),
  )

export const ToastStack = (): Html =>
  renderToastView(
    ToastPrimitive.createToastState({
      limit: 2,
      toasts: [
        {
          id: 'one',
          title: 'Newest',
          description: 'Visible at the front.',
          height: 84,
        },
        {
          id: 'two',
          title: 'Queued',
          description: 'Still visible within the limit.',
          height: 84,
        },
        {
          id: 'three',
          title: 'Limited',
          description: 'Marked limited after the visible limit.',
          height: 84,
        },
      ],
    }),
  )

export const ToastPromise = (): Html => {
  const started = ToastPrimitive.startPromiseToast(
    ToastPrimitive.createToastState(),
    {
      id: 'upload',
      loading: 'Uploading report',
    },
  )
  const state = ToastPrimitive.resolvePromiseToast(
    started.state,
    started.id,
    ToastPrimitive.ToastPromiseSucceeded({
      title: 'Upload complete',
      description: 'The report is ready to share.',
      duration: 5000,
    }),
  )

  return renderToastView(state)
}

export const ToastPosition = (): Html =>
  renderToastView(
    ToastPrimitive.createToastState({
      toasts: [
        {
          id: 'anchored',
          title: 'Anchored',
          description: 'Position metadata is exposed through data attributes.',
          height: 88,
          position: {
            side: 'top',
            align: 'end',
            sideOffset: 8,
            arrowWidth: 12,
            arrowHeight: 6,
          },
        },
      ],
    }),
    { viewportPosition: 'top-right' },
  )
