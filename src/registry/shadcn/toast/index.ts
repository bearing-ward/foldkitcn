import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as ToastPrimitive from '../../base-ui/toast'

// MODEL

export const ToastVariant = S.Union([
  S.Literal('default'),
  S.Literal('destructive'),
])
export type ToastVariant = typeof ToastVariant.Type

export const ToastVariantValues: ReadonlyArray<ToastVariant> = [
  'default',
  'destructive',
]

export const ToastStyleOptions = S.Struct({
  variant: S.optional(ToastVariant),
  className: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  toastClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  textClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  actionClassName: S.optional(S.String),
  closeClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type ToastStyleOptions = typeof ToastStyleOptions.Type

// VIEW

export type ToastAttributes<Message> = ToastPrimitive.ToastAttributes<Message>

export type ViewConfig<Message> = Omit<
  ToastPrimitive.ViewConfig<Message>,
  'toView'
> &
  ToastStyleOptions &
  Readonly<{
    toView?: (attributes: ToastAttributes<Message>) => Html
  }>

const providerBaseClassName = 'toaster group'

const viewportBaseClassName =
  'pointer-events-auto z-50 box-border flex min-h-[var(--toast-frontmost-height)] w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 text-sm text-foreground sm:w-90 data-[expanded]:gap-3'

const toastBaseClassName =
  'group/toast pointer-events-none absolute bottom-0 right-0 box-border flex w-full min-w-0 items-start gap-3 overflow-hidden rounded-md border bg-background px-4 py-3 pr-10 text-foreground shadow-lg transition-[transform,opacity,box-shadow] data-[visible-index=0]:pointer-events-auto data-[expanded]:pointer-events-auto data-[type=destructive]:border-destructive/50 data-[type=destructive]:bg-destructive data-[type=destructive]:text-destructive-foreground data-[variant=destructive]:border-destructive/50 data-[variant=destructive]:bg-destructive data-[variant=destructive]:text-destructive-foreground'

const contentBaseClassName =
  'flex min-w-0 flex-1 items-start gap-3 data-[behind]:opacity-0 data-[expanded]:opacity-100'

const textBaseClassName = 'flex min-w-0 flex-1 flex-col gap-1'

const titleBaseClassName = 'text-sm font-semibold leading-5'

const descriptionBaseClassName = 'text-sm leading-5 opacity-90'

const actionBaseClassName =
  'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-input bg-transparent px-3 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-data-[type=destructive]/toast:border-muted/40 group-data-[type=destructive]/toast:hover:border-destructive/30 group-data-[type=destructive]/toast:hover:bg-destructive group-data-[type=destructive]/toast:hover:text-destructive-foreground group-data-[type=destructive]/toast:focus-visible:ring-destructive group-data-[variant=destructive]/toast:border-muted/40 group-data-[variant=destructive]/toast:hover:border-destructive/30 group-data-[variant=destructive]/toast:hover:bg-destructive group-data-[variant=destructive]/toast:hover:text-destructive-foreground group-data-[variant=destructive]/toast:focus-visible:ring-destructive'

const closeBaseClassName =
  'absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-md text-foreground/50 opacity-0 transition-[opacity,color] hover:text-foreground focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 group-hover/toast:opacity-100 group-data-[expanded]/toast:opacity-100 group-data-[visible-index=0]/toast:opacity-100 group-data-[type=destructive]/toast:text-destructive-foreground/80 group-data-[type=destructive]/toast:hover:text-destructive-foreground group-data-[type=destructive]/toast:focus-visible:ring-destructive group-data-[variant=destructive]/toast:text-destructive-foreground/80 group-data-[variant=destructive]/toast:hover:text-destructive-foreground group-data-[variant=destructive]/toast:focus-visible:ring-destructive'

const announcementBaseClassName = 'sr-only'
const closeIconClassName = 'size-4'

const optionalClassAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  className: string,
): ReadonlyArray<Attribute<Message>> =>
  className === '' ? [] : [h.Class(className)]

const slotAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  ...optionalClassAttribute(h, className),
]

const closeIcon = (): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.AriaHidden(true),
      h.Class(closeIconClassName),
    ],
    [h.path([h.D('M18 6 6 18')], []), h.path([h.D('m6 6 12 12')], [])],
  )
}

export const toastProviderClassName = ({
  className,
}: Pick<ToastStyleOptions, 'className'> = {}): string =>
  cn(providerBaseClassName, className)

export const toastViewportClassName = ({
  viewportClassName,
}: Pick<ToastStyleOptions, 'viewportClassName'> = {}): string =>
  cn(viewportBaseClassName, viewportClassName)

export const toastClassName = (
  options: Pick<ToastStyleOptions, 'variant' | 'toastClassName'> = {},
): string => cn(toastBaseClassName, options.toastClassName)

export const toastContentClassName = ({
  contentClassName,
}: Pick<ToastStyleOptions, 'contentClassName'> = {}): string =>
  cn(contentBaseClassName, contentClassName)

export const toastTextClassName = ({
  textClassName,
}: Pick<ToastStyleOptions, 'textClassName'> = {}): string =>
  cn(textBaseClassName, textClassName)

export const toastTitleClassName = ({
  titleClassName,
}: Pick<ToastStyleOptions, 'titleClassName'> = {}): string =>
  cn(titleBaseClassName, titleClassName)

export const toastDescriptionClassName = ({
  descriptionClassName,
}: Pick<ToastStyleOptions, 'descriptionClassName'> = {}): string =>
  cn(descriptionBaseClassName, descriptionClassName)

export const toastActionClassName = ({
  actionClassName,
}: Pick<ToastStyleOptions, 'actionClassName'> = {}): string =>
  cn(actionBaseClassName, actionClassName)

export const toastCloseClassName = ({
  closeClassName,
}: Pick<ToastStyleOptions, 'closeClassName'> = {}): string =>
  cn(closeBaseClassName, closeClassName)

const isDestructiveToast = (
  variant: ToastVariant | undefined,
  toast: Pick<ToastPrimitive.ToastItem, 'type'>,
): boolean => variant === 'destructive' || toast.type === 'destructive'

const announcementAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  announcement: ToastPrimitive.ToastAnnouncementAttributes<Message>,
): Html =>
  h.div(
    [...announcement.root, h.Class(announcementBaseClassName)],
    [
      announcement.toast.title === undefined
        ? h.span([...announcement.title], [''])
        : h.span([...announcement.title], [announcement.toast.title]),
      announcement.toast.description === undefined
        ? h.span([...announcement.description], [''])
        : h.span(
            [...announcement.description],
            [announcement.toast.description],
          ),
    ],
  )

const renderToast = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastPrimitive.ToastItemAttributes<Message>,
): Html => {
  const destructive = isDestructiveToast(config.variant, toast.toast)
  const viewportInteractionAttributes =
    config.onViewportInteraction === undefined
      ? []
      : [
          h.OnMouseEnter(config.onViewportInteraction({ type: 'hover-start' })),
          h.OnMouseLeave(config.onViewportInteraction({ type: 'hover-end' })),
          h.OnFocus(config.onViewportInteraction({ type: 'focus-start' })),
          h.OnBlur(config.onViewportInteraction({ type: 'focus-end' })),
        ]
  const rootAttributes = [
    ...toast.root,
    ...viewportInteractionAttributes,
    h.DataAttribute('visible-index', String(toast.metadata.visibleIndex)),
    ...(destructive ? [h.DataAttribute('variant', 'destructive')] : []),
    ...slotAttributes(
      h,
      'toast',
      toastClassName({
        variant: destructive ? 'destructive' : undefined,
        toastClassName: config.toastClassName,
      }),
    ),
  ]

  return h.div(rootAttributes, [
    h.div(
      [
        ...toast.content,
        ...slotAttributes(
          h,
          'toast-content',
          toastContentClassName({
            contentClassName: config.contentClassName,
          }),
        ),
      ],
      [
        h.div(
          [
            ...slotAttributes(
              h,
              'toast-text',
              toastTextClassName({ textClassName: config.textClassName }),
            ),
          ],
          [
            toast.toast.title === undefined
              ? h.empty
              : h.h2(
                  [
                    ...toast.title,
                    ...slotAttributes(
                      h,
                      'toast-title',
                      toastTitleClassName({
                        titleClassName: config.titleClassName,
                      }),
                    ),
                  ],
                  [toast.toast.title],
                ),
            toast.toast.description === undefined
              ? h.empty
              : h.p(
                  [
                    ...toast.description,
                    ...slotAttributes(
                      h,
                      'toast-description',
                      toastDescriptionClassName({
                        descriptionClassName: config.descriptionClassName,
                      }),
                    ),
                  ],
                  [toast.toast.description],
                ),
          ],
        ),
        h.div(
          [h.Class('ml-auto flex items-center gap-2')],
          [
            toast.toast.actionLabel === undefined
              ? h.empty
              : h.button(
                  [
                    ...toast.action,
                    ...slotAttributes(
                      h,
                      'toast-action',
                      toastActionClassName({
                        actionClassName: config.actionClassName,
                      }),
                    ),
                  ],
                  [toast.toast.actionLabel],
                ),
            h.button(
              [
                ...toast.close,
                h.AriaLabel('Dismiss notification'),
                ...slotAttributes(
                  h,
                  'toast-close',
                  toastCloseClassName({
                    closeClassName: config.closeClassName,
                  }),
                ),
              ],
              [closeIcon()],
            ),
          ],
        ),
      ],
    ),
  ])
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return ToastPrimitive.view<Message>({
    id: config.id,
    state: config.state,
    ...(config.label === undefined ? {} : { label: config.label }),
    ...(config.forceMount === undefined
      ? {}
      : { forceMount: config.forceMount }),
    stackingStrategy: config.stackingStrategy ?? 'base-ui-shuffle',
    ...(config.viewportPosition === undefined
      ? {}
      : { viewportPosition: config.viewportPosition }),
    ...(config.viewportPositioning === undefined
      ? {}
      : { viewportPositioning: config.viewportPositioning }),
    ...(config.swipeDirections === undefined
      ? {}
      : { swipeDirections: config.swipeDirections }),
    ...(config.onAction === undefined ? {} : { onAction: config.onAction }),
    ...(config.onClose === undefined ? {} : { onClose: config.onClose }),
    ...(config.onSwipeChange === undefined
      ? {}
      : { onSwipeChange: config.onSwipeChange }),
    ...(config.onViewportInteraction === undefined
      ? {}
      : { onViewportInteraction: config.onViewportInteraction }),
    toView: attributes =>
      config.toView === undefined
        ? h.div(
            [
              ...attributes.provider,
              ...slotAttributes(
                h,
                'toast-provider',
                toastProviderClassName({ className: config.className }),
              ),
              ...(config.variant === 'destructive'
                ? [h.DataAttribute('variant', 'destructive')]
                : []),
              ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
            ],
            [
              h.div(
                [...attributes.portal, h.DataAttribute('slot', 'toast-portal')],
                [
                  h.div(
                    [
                      ...attributes.viewport.root,
                      h.DataAttribute('slot', 'toast-viewport'),
                      h.Class(
                        toastViewportClassName({
                          viewportClassName: config.viewportClassName,
                        }),
                      ),
                    ],
                    [
                      ...attributes.highPriorityAnnouncements.map(
                        announcement => announcementAttributes(h, announcement),
                      ),
                      ...attributes.toasts.flatMap(toast =>
                        toast.isOpen ? [renderToast(h, config, toast)] : [],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          )
        : config.toView(attributes),
  })
}

export const Toaster = view
