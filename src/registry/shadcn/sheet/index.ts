import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseDialog from '../../base-ui/dialog'
import * as Button from '../button'

// MODEL

export const SheetModalMode = BaseDialog.DialogModalMode
export type SheetModalMode = BaseDialog.DialogModalMode

export const SheetTransitionStatus = BaseDialog.DialogTransitionStatus
export type SheetTransitionStatus = BaseDialog.DialogTransitionStatus

export const SheetChangeReason = BaseDialog.DialogChangeReason
export type SheetChangeReason = BaseDialog.DialogChangeReason

export const SheetOpenChange = BaseDialog.DialogOpenChange
export type SheetOpenChange = BaseDialog.DialogOpenChange

export const SheetSide = S.Union([
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('bottom'),
  S.Literal('left'),
])
export type SheetSide = typeof SheetSide.Type

export const sheetSideValues: ReadonlyArray<SheetSide> = [
  'top',
  'right',
  'bottom',
  'left',
]

export const SheetStyleOptions = S.Struct({
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
  side: S.optional(SheetSide),
  showCloseButton: S.optional(S.Boolean),
  dir: S.optional(S.String),
})
export type SheetStyleOptions = typeof SheetStyleOptions.Type

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

export type SheetAttributes<Message> = BaseDialog.DialogAttributes<Message> &
  Readonly<{
    header: ReadonlyArray<Attribute<Message>>
    footer: ReadonlyArray<Attribute<Message>>
  }>
export type SheetPartAttributes<Message> =
  BaseDialog.DialogPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseDialog.ViewConfig<Message>,
  'toView'
> &
  SheetStyleOptions &
  Readonly<{
    toView?: (attributes: SheetAttributes<Message>) => Html
  }>

const defaultSide: SheetSide = 'right'

const overlayBaseClassName =
  'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs'

const contentBaseClassName =
  'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm'

const contentRtlBaseClassName =
  'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem]'

const headerBaseClassName = 'flex flex-col gap-0.5 p-4'
const footerBaseClassName = 'mt-auto flex flex-col gap-2 p-4'
const titleBaseClassName =
  'cn-font-heading text-base font-medium text-foreground'
const descriptionBaseClassName = 'text-sm text-muted-foreground'

export const sheetClassName = ({
  className,
}: Pick<SheetStyleOptions, 'className'> = {}): string => cn(className)

export const sheetOverlayClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(overlayBaseClassName, className)

export const sheetContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const sheetHeaderClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(headerBaseClassName, className)

export const sheetFooterClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(footerBaseClassName, className)

export const sheetTitleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(titleBaseClassName, className)

export const sheetDescriptionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(descriptionBaseClassName, className)

export const sheetCloseClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(
    Button.buttonVariants({
      variant: 'ghost',
      size: 'icon-sm',
      className: cn(
        dir === 'rtl' ? 'absolute end-3 top-3' : 'absolute top-3 right-3',
        className,
      ),
    }),
  )

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
  side: SheetSide,
  attributes: BaseDialog.DialogAttributes<Message>,
): SheetAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'sheet', sheetClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'sheet-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...slotAttributes(h, 'sheet-portal', cn(config.portalClassName)),
  ],
  backdrop: {
    ...attributes.backdrop,
    root:
      attributes.backdrop.root.length > 0
        ? [
            ...attributes.backdrop.root,
            ...slotAttributes(
              h,
              'sheet-overlay',
              sheetOverlayClassName({ className: config.overlayClassName }),
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
            h.DataAttribute('side', side),
            ...slotAttributes(
              h,
              'sheet-content',
              sheetContentClassName({
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
      'sheet-title',
      sheetTitleClassName({ className: config.titleClassName }),
    ),
  ],
  description: [
    ...attributes.description,
    ...slotAttributes(
      h,
      'sheet-description',
      sheetDescriptionClassName({ className: config.descriptionClassName }),
    ),
  ],
  close: [
    ...attributes.close,
    ...slotAttributes(
      h,
      'sheet-close',
      sheetCloseClassName({
        className: config.closeClassName,
        dir: config.dir,
      }),
    ),
  ],
  header: slotAttributes(
    h,
    'sheet-header',
    sheetHeaderClassName({ className: config.headerClassName }),
  ),
  footer: slotAttributes(
    h,
    'sheet-footer',
    sheetFooterClassName({ className: config.footerClassName }),
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
  const side = config.side ?? defaultSide
  const { toView, showCloseButton = true, ...baseConfig } = config

  return BaseDialog.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const sheetAttributes = shadcnAttributes(h, config, side, attributes)

      if (toView !== undefined) {
        return toView(sheetAttributes)
      }

      return h.div(
        [...sheetAttributes.root],
        [
          h.button([...sheetAttributes.trigger], ['Open Sheet']),
          h.dialog(
            [...sheetAttributes.dialog],
            sheetAttributes.popup.isMounted
              ? [
                  h.div([...sheetAttributes.backdrop.root], []),
                  h.div(
                    [...sheetAttributes.popup.root],
                    [
                      h.div(
                        [...sheetAttributes.header],
                        [
                          h.h2([...sheetAttributes.title], ['Sheet title']),
                          h.p(
                            [...sheetAttributes.description],
                            ['Sheet description'],
                          ),
                        ],
                      ),
                      showCloseButton
                        ? h.button(
                            [...sheetAttributes.close],
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
