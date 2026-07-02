import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as ToastPrimitive from '../../base-ui/toast'

// MODEL

export const SonnerTheme = S.Union([
  S.Literal('system'),
  S.Literal('light'),
  S.Literal('dark'),
])
export type SonnerTheme = typeof SonnerTheme.Type

export const sonnerThemeValues: ReadonlyArray<SonnerTheme> = [
  'system',
  'light',
  'dark',
]

export const SonnerStyleOptions = S.Struct({
  theme: S.optional(SonnerTheme),
  className: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  toastClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  textClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  iconClassName: S.optional(S.String),
  actionClassName: S.optional(S.String),
  closeClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type SonnerStyleOptions = typeof SonnerStyleOptions.Type

// VIEW

export type SonnerAttributes<Message> = Readonly<{
  provider: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  viewport: ToastPrimitive.ToastPartAttributes<Message>
  toasts: ReadonlyArray<ToastPrimitive.ToastItemAttributes<Message>>
  highPriorityAnnouncements: ReadonlyArray<
    ToastPrimitive.ToastAnnouncementAttributes<Message>
  >
  isExpanded: boolean
  isEmpty: boolean
}>

export type ViewConfig<Message> = Omit<
  ToastPrimitive.ViewConfig<Message>,
  'toView'
> &
  SonnerStyleOptions &
  Readonly<{
    toView?: (attributes: SonnerAttributes<Message>) => Html
  }>

const providerBaseClassName = 'toaster group'

const viewportBaseClassName =
  'pointer-events-auto z-50 box-border flex min-h-[var(--toast-frontmost-height)] w-[calc(100vw-2rem)] max-w-sm flex-col gap-2 text-sm text-foreground sm:w-90 data-[expanded]:gap-3'

const toastBaseClassName =
  'pointer-events-none absolute bottom-0 right-0 box-border flex w-full min-w-0 items-start gap-3 rounded-2xl border border-border bg-popover px-4 py-3 text-popover-foreground shadow-lg transition-[transform,opacity,box-shadow] duration-300 ease-out data-[visible-index=0]:pointer-events-auto data-[expanded]:pointer-events-auto data-[limited]:opacity-0 data-ending-style:opacity-0'

const contentBaseClassName =
  'flex min-w-0 flex-1 items-start gap-3 transition-opacity duration-200 data-[behind]:opacity-0 data-[expanded]:opacity-100'

const textBaseClassName = 'flex min-w-0 flex-1 flex-col gap-1'

const titleBaseClassName = 'text-sm font-medium leading-5'

const descriptionBaseClassName = 'text-sm leading-5 text-muted-foreground'

const iconBaseClassName =
  'mt-0.5 size-4 shrink-0 text-foreground/70 dark:text-foreground/80'

const actionBaseClassName =
  'inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted'

const closeBaseClassName =
  'inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-input bg-background text-foreground transition-colors hover:bg-muted'

const announcementBaseClassName = 'sr-only'

export const sonnerProviderClassName = ({
  className,
}: Pick<SonnerStyleOptions, 'className'> = {}): string =>
  cn(providerBaseClassName, className)

export const sonnerViewportClassName = ({
  viewportClassName,
}: Pick<SonnerStyleOptions, 'viewportClassName'> = {}): string =>
  cn(viewportBaseClassName, viewportClassName)

export const sonnerToastClassName = ({
  toastClassName,
}: Pick<SonnerStyleOptions, 'toastClassName'> = {}): string =>
  cn(toastBaseClassName, toastClassName)

export const sonnerContentClassName = ({
  contentClassName,
}: Pick<SonnerStyleOptions, 'contentClassName'> = {}): string =>
  cn(contentBaseClassName, contentClassName)

export const sonnerTextClassName = ({
  textClassName,
}: Pick<SonnerStyleOptions, 'textClassName'> = {}): string =>
  cn(textBaseClassName, textClassName)

export const sonnerTitleClassName = ({
  titleClassName,
}: Pick<SonnerStyleOptions, 'titleClassName'> = {}): string =>
  cn(titleBaseClassName, titleClassName)

export const sonnerDescriptionClassName = ({
  descriptionClassName,
}: Pick<SonnerStyleOptions, 'descriptionClassName'> = {}): string =>
  cn(descriptionBaseClassName, descriptionClassName)

export const sonnerIconClassName = ({
  iconClassName,
}: Pick<SonnerStyleOptions, 'iconClassName'> = {}): string =>
  cn(iconBaseClassName, iconClassName)

export const sonnerActionClassName = ({
  actionClassName,
}: Pick<SonnerStyleOptions, 'actionClassName'> = {}): string =>
  cn(actionBaseClassName, actionClassName)

export const sonnerCloseClassName = ({
  closeClassName,
}: Pick<SonnerStyleOptions, 'closeClassName'> = {}): string =>
  cn(closeBaseClassName, closeClassName)

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

const themedAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  theme: SonnerTheme,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('theme', theme)]

const icon = (
  className: string,
  path: string,
  children: ReadonlyArray<Attribute<never>> = [],
): Html => {
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
      h.Class(className),
      ...children,
    ],
    [h.path([h.D(path)], [])],
  )
}

const checkCircleIcon = (): Html =>
  icon('text-emerald-600 dark:text-emerald-400', 'M20 6 9 17l-5-5')

const infoIcon = (): Html =>
  icon(
    'text-sky-600 dark:text-sky-400',
    'M12 16v-4m0-4h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  )

const warningIcon = (): Html =>
  icon(
    'text-amber-600 dark:text-amber-400',
    'M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4m0 4h.01',
  )

const errorIcon = (): Html =>
  icon(
    'text-rose-600 dark:text-rose-400',
    'M15 9 9 15m6 0L9 9m3-7a10 10 0 1 0 0 20 10 10 0 0 0 0-20z',
  )

const loadingIcon = (): Html =>
  icon(
    'animate-spin text-foreground/70 dark:text-foreground/80',
    'M21 12a9 9 0 1 1-6.219-8.56',
  )

const toastIcon = (toast: ToastPrimitive.ToastItem): Html | undefined => {
  if (toast.type === 'loading') {
    return loadingIcon()
  }

  if (toast.type === 'success') {
    return checkCircleIcon()
  }

  if (toast.type === 'info') {
    return infoIcon()
  }

  if (toast.type === 'warning') {
    return warningIcon()
  }

  if (toast.type === 'error') {
    return errorIcon()
  }

  return undefined
}

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
  const maybeIcon = toastIcon(toast.toast)
  const viewportInteractionAttributes =
    config.onViewportInteraction === undefined
      ? []
      : [
          h.OnMouseEnter(config.onViewportInteraction({ type: 'hover-start' })),
          h.OnMouseLeave(config.onViewportInteraction({ type: 'hover-end' })),
          h.OnFocus(config.onViewportInteraction({ type: 'focus-start' })),
          h.OnBlur(config.onViewportInteraction({ type: 'focus-end' })),
        ]

  return h.div(
    [
      ...toast.root,
      ...viewportInteractionAttributes,
      h.DataAttribute('visible-index', String(toast.metadata.visibleIndex)),
      ...slotAttributes(
        h,
        'sonner-toast',
        sonnerToastClassName({ toastClassName: config.toastClassName }),
      ),
    ],
    [
      h.div(
        [
          ...toast.content,
          ...slotAttributes(
            h,
            'sonner-content',
            sonnerContentClassName({
              contentClassName: config.contentClassName,
            }),
          ),
        ],
        [
          maybeIcon === undefined
            ? h.empty
            : h.div(
                [
                  ...slotAttributes(
                    h,
                    'sonner-icon',
                    sonnerIconClassName({
                      iconClassName: config.iconClassName,
                    }),
                  ),
                ],
                [maybeIcon],
              ),
          h.div(
            [
              ...slotAttributes(
                h,
                'sonner-text',
                sonnerTextClassName({ textClassName: config.textClassName }),
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
                        'sonner-title',
                        sonnerTitleClassName({
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
                        'sonner-description',
                        sonnerDescriptionClassName({
                          descriptionClassName: config.descriptionClassName,
                        }),
                      ),
                    ],
                    [toast.toast.description],
                  ),
            ],
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
                    'sonner-action',
                    sonnerActionClassName({
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
                'sonner-close',
                sonnerCloseClassName({
                  closeClassName: config.closeClassName,
                }),
              ),
            ],
            [
              icon(
                'size-3.5 text-foreground/70 dark:text-foreground/80',
                'M18 6 6 18M6 6l12 12',
              ),
            ],
          ),
        ],
      ),
    ],
  )
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
                'sonner-provider',
                sonnerProviderClassName({ className: config.className }),
              ),
              ...themedAttributes(h, config.theme ?? 'system'),
              ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
            ],
            [
              h.div(
                [
                  ...attributes.portal,
                  h.DataAttribute('slot', 'sonner-portal'),
                ],
                [
                  h.div(
                    [
                      ...attributes.viewport.root,
                      h.DataAttribute('slot', 'sonner-viewport'),
                      h.Class(
                        sonnerViewportClassName({
                          viewportClassName: config.viewportClassName,
                        }),
                      ),
                    ],
                    [
                      ...attributes.highPriorityAnnouncements.map(
                        announcement => announcementAttributes(h, announcement),
                      ),
                      ...attributes.toasts.flatMap(toast =>
                        toast.isMounted ? [renderToast(h, config, toast)] : [],
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
