import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseDialog from '../../base-ui/dialog'

// MODEL

export type DialogChangeReason = BaseDialog.DialogChangeReason
export type DialogModalMode = BaseDialog.DialogModalMode
export type DialogOpenChange = BaseDialog.DialogOpenChange
export type DialogTransitionStatus = BaseDialog.DialogTransitionStatus

export const DialogStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  overlayClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  headerClassName: S.optional(S.String),
  footerClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  closeClassName: S.optional(S.String),
  showCloseButton: S.optional(S.Boolean),
  dir: S.optional(S.String),
})
export type DialogStyleOptions = typeof DialogStyleOptions.Type

// UPDATE

export const {
  CloseDialog,
  ShowDialog,
  closeOpenChange,
  commandForOpenChange,
  descriptionId,
  escapeOpenChange,
  openChange,
  outsideOpenChange,
  panelId,
  titleId,
  triggerOpenChange,
} = BaseDialog

// VIEW

export type DialogAttributes<Message> = BaseDialog.DialogAttributes<Message> &
  Readonly<{
    header: ReadonlyArray<Attribute<Message>>
    footer: ReadonlyArray<Attribute<Message>>
  }>
export type DialogPartAttributes<Message> =
  BaseDialog.DialogPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseDialog.ViewConfig<Message>,
  'toView'
> &
  DialogStyleOptions &
  Readonly<{
    toView?: (attributes: DialogAttributes<Message>) => Html
  }>

const overlayBaseClassName =
  'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

const contentBaseClassName =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'fixed start-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const headerBaseClassName = 'flex flex-col gap-2'
const footerBaseClassName =
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end'
const titleBaseClassName = 'cn-font-heading text-base leading-none font-medium'
const descriptionBaseClassName =
  'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground'
const closeBaseClassName =
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2'
const closeRtlBaseClassName =
  'group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute end-2 top-2'

export const dialogClassName = ({
  className,
}: Pick<DialogStyleOptions, 'className'> = {}): string => cn(className)

export const dialogOverlayClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(overlayBaseClassName, className)

export const dialogContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const dialogHeaderClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(headerBaseClassName, className)

export const dialogFooterClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(footerBaseClassName, className)

export const dialogTitleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(titleBaseClassName, className)

export const dialogDescriptionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(descriptionBaseClassName, className)

export const dialogCloseClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? closeRtlBaseClassName : closeBaseClassName, className)

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

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseDialog.DialogAttributes<Message>,
): DialogAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'dialog', dialogClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'dialog-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...slotAttributes(h, 'dialog-portal', cn(config.portalClassName)),
  ],
  backdrop: {
    ...attributes.backdrop,
    root:
      attributes.backdrop.root.length > 0
        ? [
            ...attributes.backdrop.root,
            ...slotAttributes(
              h,
              'dialog-overlay',
              dialogOverlayClassName({ className: config.overlayClassName }),
            ),
          ]
        : attributes.backdrop.root,
  },
  popup: {
    ...attributes.popup,
    root:
      attributes.popup.root.length > 0
        ? [
            ...attributes.popup.root,
            ...slotAttributes(
              h,
              'dialog-content',
              dialogContentClassName({
                className: config.contentClassName,
                dir: config.dir,
              }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : attributes.popup.root,
  },
  title: [
    ...attributes.title,
    ...slotAttributes(
      h,
      'dialog-title',
      dialogTitleClassName({ className: config.titleClassName }),
    ),
  ],
  description: [
    ...attributes.description,
    ...slotAttributes(
      h,
      'dialog-description',
      dialogDescriptionClassName({ className: config.descriptionClassName }),
    ),
  ],
  close: [
    ...attributes.close,
    ...slotAttributes(
      h,
      'dialog-close',
      dialogCloseClassName({
        className: config.closeClassName,
        dir: config.dir,
      }),
    ),
  ],
  header: slotAttributes(
    h,
    'dialog-header',
    dialogHeaderClassName({ className: config.headerClassName }),
  ),
  footer: slotAttributes(
    h,
    'dialog-footer',
    dialogFooterClassName({ className: config.footerClassName }),
  ),
})

const closeIcon = <Message>(): Html => {
  const h = html<Message>()

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
    ],
    [h.path([h.D('M18 6 6 18')], []), h.path([h.D('m6 6 12 12')], [])],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, showCloseButton = true, ...baseConfig } = config

  return BaseDialog.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const dialogAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(dialogAttributes)
      }

      return h.div(
        [...dialogAttributes.root],
        [
          h.button([...dialogAttributes.trigger], ['Open Dialog']),
          h.dialog(
            [...dialogAttributes.dialog],
            dialogAttributes.popup.isMounted
              ? [
                  h.div([...dialogAttributes.backdrop.root], []),
                  h.div(
                    [...dialogAttributes.popup.root],
                    [
                      h.div(
                        [...dialogAttributes.header],
                        [
                          h.h2([...dialogAttributes.title], ['Dialog title']),
                          h.p(
                            [...dialogAttributes.description],
                            ['Dialog description'],
                          ),
                        ],
                      ),
                      showCloseButton
                        ? h.button(
                            [...dialogAttributes.close],
                            [
                              closeIcon(),
                              h.span([h.Class('sr-only')], ['Close']),
                            ],
                          )
                        : h.empty,
                    ],
                  ),
                ]
              : [],
          ),
        ],
      )
    },
  })
}
