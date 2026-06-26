import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BasePopover from '../../base-ui/popover'

// MODEL

export type PopoverAlign = BasePopover.PopoverAlign
export type PopoverChangeReason = BasePopover.PopoverChangeReason
export type PopoverOpenChange = BasePopover.PopoverOpenChange
export type PopoverSide = BasePopover.PopoverSide
export type PopoverTransitionStatus = BasePopover.PopoverTransitionStatus

export const PopoverStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  headerClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type PopoverStyleOptions = typeof PopoverStyleOptions.Type

// UPDATE

export const {
  FocusPopover,
  RestorePopoverFocus,
  arrowId,
  closeOpenChange,
  commandForOpenChange,
  descriptionId,
  escapeOpenChange,
  openChange,
  outsideOpenChange,
  popupId,
  positionerId,
  titleId,
  triggerOpenChange,
  triggerSelector,
} = BasePopover

// VIEW

export type PopoverAttributes<Message> =
  BasePopover.PopoverAttributes<Message> &
    Readonly<{
      header: ReadonlyArray<Attribute<Message>>
    }>
export type PopoverPartAttributes<Message> =
  BasePopover.PopoverPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BasePopover.ViewConfig<Message>,
  'toView'
> &
  PopoverStyleOptions &
  Readonly<{
    toView?: (attributes: PopoverAttributes<Message>) => Html
  }>

const positionerBaseClassName = 'isolate z-50'

const contentBaseClassName =
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const headerBaseClassName = 'flex flex-col gap-0.5 text-sm'
const titleBaseClassName = 'font-medium'
const descriptionBaseClassName = 'text-muted-foreground'

export const popoverClassName = ({
  className,
}: Pick<PopoverStyleOptions, 'className'> = {}): string => cn(className)

export const popoverPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const popoverContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const popoverHeaderClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(headerBaseClassName, className)

export const popoverTitleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(titleBaseClassName, className)

export const popoverDescriptionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(descriptionBaseClassName, className)

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
  attributes: BasePopover.PopoverAttributes<Message>,
): PopoverAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'popover', popoverClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'popover-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...optionalClassAttribute(h, cn(config.portalClassName)),
  ],
  positioner: {
    ...attributes.positioner,
    root:
      attributes.positioner.root.length > 0
        ? [
            ...attributes.positioner.root,
            ...optionalClassAttribute(
              h,
              popoverPositionerClassName({
                className: config.positionerClassName,
              }),
            ),
          ]
        : attributes.positioner.root,
  },
  popup: {
    ...attributes.popup,
    root:
      attributes.popup.root.length > 0
        ? [
            ...attributes.popup.root,
            ...slotAttributes(
              h,
              'popover-content',
              popoverContentClassName({
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
      'popover-title',
      popoverTitleClassName({ className: config.titleClassName }),
    ),
  ],
  description: [
    ...attributes.description,
    ...slotAttributes(
      h,
      'popover-description',
      popoverDescriptionClassName({
        className: config.descriptionClassName,
      }),
    ),
  ],
  header: slotAttributes(
    h,
    'popover-header',
    popoverHeaderClassName({ className: config.headerClassName }),
  ),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BasePopover.view<Message>({
    ...baseConfig,
    toView: attributes => {
      const popoverAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(popoverAttributes)
      }

      return h.div(
        [...popoverAttributes.root],
        [
          h.button([...popoverAttributes.trigger], ['Open Popover']),
          h.div(
            [...popoverAttributes.portal],
            popoverAttributes.popup.isMounted
              ? [
                  h.div([...popoverAttributes.backdrop.root], []),
                  h.div(
                    [...popoverAttributes.positioner.root],
                    [
                      h.div(
                        [...popoverAttributes.popup.root],
                        [
                          h.div(
                            [...popoverAttributes.header],
                            [
                              h.h3(
                                [...popoverAttributes.title],
                                ['Dimensions'],
                              ),
                              h.p(
                                [...popoverAttributes.description],
                                ['Set the dimensions for the layer.'],
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
        ],
      )
    },
  })
}
