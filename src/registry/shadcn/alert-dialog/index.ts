import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseAlertDialog from '../../base-ui/alert-dialog'
import * as Button from '../button'

// MODEL

export type AlertDialogChangeReason = BaseAlertDialog.AlertDialogChangeReason
export type AlertDialogModalMode = BaseAlertDialog.AlertDialogModalMode
export type AlertDialogOpenChange = BaseAlertDialog.AlertDialogOpenChange
export type AlertDialogTransitionStatus =
  BaseAlertDialog.AlertDialogTransitionStatus

export const AlertDialogSize = S.Union([S.Literal('default'), S.Literal('sm')])
export type AlertDialogSize = typeof AlertDialogSize.Type

export const AlertDialogStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  overlayClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  headerClassName: S.optional(S.String),
  footerClassName: S.optional(S.String),
  mediaClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  cancelClassName: S.optional(S.String),
  actionClassName: S.optional(S.String),
  cancelVariant: S.optional(Button.ButtonVariant),
  actionVariant: S.optional(Button.ButtonVariant),
  cancelSize: S.optional(Button.ButtonSize),
  actionSize: S.optional(Button.ButtonSize),
  size: S.optional(AlertDialogSize),
  dir: S.optional(S.String),
})
export type AlertDialogStyleOptions = typeof AlertDialogStyleOptions.Type

// UPDATE

export const {
  CloseDialog,
  ShowDialog,
  closeOpenChange,
  commandForOpenChange,
  descriptionId,
  escapeOpenChange,
  modal,
  openChange,
  panelId,
  titleId,
  triggerOpenChange,
} = BaseAlertDialog

// VIEW

export type AlertDialogAttributes<Message> =
  BaseAlertDialog.AlertDialogAttributes<Message> &
    Readonly<{
      header: ReadonlyArray<Attribute<Message>>
      footer: ReadonlyArray<Attribute<Message>>
      media: ReadonlyArray<Attribute<Message>>
    }>
export type AlertDialogPartAttributes<Message> =
  BaseAlertDialog.AlertDialogPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseAlertDialog.ViewConfig<Message>,
  'toView'
> &
  AlertDialogStyleOptions &
  Readonly<{
    toView?: (attributes: AlertDialogAttributes<Message>) => Html
  }>

const overlayBaseClassName =
  'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

const contentBaseClassName =
  'group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'group/alert-dialog-content fixed start-1/2 top-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=sm]:max-w-xs data-[size=default]:sm:max-w-sm rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const headerBaseClassName =
  'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]'

const headerRtlBaseClassName =
  'grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-start sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]'

const footerBaseClassName =
  '-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end'

const mediaBaseClassName =
  "mb-2 inline-flex size-10 items-center justify-center rounded-md bg-muted sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-6"

const titleBaseClassName =
  'cn-font-heading text-base font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2'

const descriptionBaseClassName =
  'text-sm text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground'

export const alertDialogClassName = ({
  className,
}: Pick<AlertDialogStyleOptions, 'className'> = {}): string => cn(className)

export const alertDialogOverlayClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(overlayBaseClassName, className)

export const alertDialogContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const alertDialogHeaderClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? headerRtlBaseClassName : headerBaseClassName, className)

export const alertDialogFooterClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(footerBaseClassName, className)

export const alertDialogMediaClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(mediaBaseClassName, className)

export const alertDialogTitleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(titleBaseClassName, className)

export const alertDialogDescriptionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(descriptionBaseClassName, className)

export const alertDialogCancelClassName = ({
  className,
  size = 'default',
  variant = 'outline',
}: Readonly<{
  className?: string | undefined
  size?: Button.ButtonSize | undefined
  variant?: Button.ButtonVariant | undefined
}> = {}): string => cn(Button.buttonVariants({ variant, size }), className)

export const alertDialogActionClassName = ({
  className,
  size = 'default',
  variant = 'default',
}: Readonly<{
  className?: string | undefined
  size?: Button.ButtonSize | undefined
  variant?: Button.ButtonVariant | undefined
}> = {}): string => cn(Button.buttonVariants({ variant, size }), className)

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
  attributes: BaseAlertDialog.AlertDialogAttributes<Message>,
): AlertDialogAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'alert-dialog', alertDialogClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'alert-dialog-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...slotAttributes(h, 'alert-dialog-portal', cn(config.portalClassName)),
  ],
  backdrop: {
    ...attributes.backdrop,
    root:
      attributes.backdrop.root.length > 0
        ? [
            ...attributes.backdrop.root,
            ...slotAttributes(
              h,
              'alert-dialog-overlay',
              alertDialogOverlayClassName({
                className: config.overlayClassName,
              }),
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
            h.DataAttribute('size', config.size ?? 'default'),
            ...slotAttributes(
              h,
              'alert-dialog-content',
              alertDialogContentClassName({
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
      'alert-dialog-title',
      alertDialogTitleClassName({ className: config.titleClassName }),
    ),
  ],
  description: [
    ...attributes.description,
    ...slotAttributes(
      h,
      'alert-dialog-description',
      alertDialogDescriptionClassName({
        className: config.descriptionClassName,
      }),
    ),
  ],
  cancel: [
    ...attributes.cancel,
    ...slotAttributes(
      h,
      'alert-dialog-cancel',
      alertDialogCancelClassName({
        className: config.cancelClassName,
        size: config.cancelSize,
        variant: config.cancelVariant,
      }),
    ),
  ],
  action: [
    ...attributes.action,
    ...slotAttributes(
      h,
      'alert-dialog-action',
      alertDialogActionClassName({
        className: config.actionClassName,
        size: config.actionSize,
        variant: config.actionVariant,
      }),
    ),
  ],
  header: slotAttributes(
    h,
    'alert-dialog-header',
    alertDialogHeaderClassName({
      className: config.headerClassName,
      dir: config.dir,
    }),
  ),
  footer: slotAttributes(
    h,
    'alert-dialog-footer',
    alertDialogFooterClassName({ className: config.footerClassName }),
  ),
  media: slotAttributes(
    h,
    'alert-dialog-media',
    alertDialogMediaClassName({ className: config.mediaClassName }),
  ),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseAlertDialog.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const alertDialogAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(alertDialogAttributes)
      }

      return h.div(
        [...alertDialogAttributes.root],
        [
          Button.view<Message>({
            variant: 'outline',
            toView: buttonAttributes =>
              h.button(
                [...buttonAttributes.button, ...alertDialogAttributes.trigger],
                ['Show Dialog'],
              ),
          }),
          h.dialog(
            [...alertDialogAttributes.dialog],
            alertDialogAttributes.popup.isMounted
              ? [
                  h.div([...alertDialogAttributes.backdrop.root], []),
                  h.div(
                    [...alertDialogAttributes.popup.root],
                    [
                      h.div(
                        [...alertDialogAttributes.header],
                        [
                          h.h2(
                            [...alertDialogAttributes.title],
                            ['Are you absolutely sure?'],
                          ),
                          h.p(
                            [...alertDialogAttributes.description],
                            ['This action cannot be undone.'],
                          ),
                        ],
                      ),
                      h.div(
                        [...alertDialogAttributes.footer],
                        [
                          h.button(
                            [...alertDialogAttributes.cancel],
                            ['Cancel'],
                          ),
                          h.button(
                            [...alertDialogAttributes.action],
                            ['Continue'],
                          ),
                        ],
                      ),
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
