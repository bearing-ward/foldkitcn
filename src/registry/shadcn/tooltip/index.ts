import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { AnchorPositioningConfig } from '../../../utils/anchor-positioning'
import { cn } from '../../../utils/cn'
import * as BaseTooltip from '../../base-ui/tooltip'

// MODEL

export type TooltipAlign = BaseTooltip.TooltipAlign
export type TooltipChangeReason = BaseTooltip.TooltipChangeReason
export type TooltipInstant = BaseTooltip.TooltipInstant
export type TooltipOpenChange = BaseTooltip.TooltipOpenChange
export type TooltipSide = BaseTooltip.TooltipSide
export type TooltipTrackCursorAxis = BaseTooltip.TooltipTrackCursorAxis
export type TooltipTransitionStatus = BaseTooltip.TooltipTransitionStatus

export const TooltipStyleOptions = S.Struct({
  className: S.optional(S.String),
  providerClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  arrowClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type TooltipStyleOptions = typeof TooltipStyleOptions.Type

// UPDATE

export const {
  CompletedFocusTooltip,
  CompletedRestoreTooltipFocus,
  FocusTooltip,
  RestoreTooltipFocus,
  activeTriggerId,
  arrowId,
  commandForOpenChange,
  disabledOpenChange,
  escapeOpenChange,
  focusCloseChange,
  focusOpenChange,
  hoverCloseChange,
  hoverOpenChange,
  imperativeOpenChange,
  openChange,
  outsideOpenChange,
  popupId,
  positionerId,
  pressCloseChange,
  pressOpenChange,
  tooltipSelector,
  triggerId,
  triggerSelector,
  viewportId,
} = BaseTooltip

// VIEW

export type TooltipAttributes<Message> = BaseTooltip.TooltipAttributes<Message>
export type TooltipPartAttributes<Message> =
  BaseTooltip.TooltipPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseTooltip.ViewConfig<Message>,
  'onPositioned' | 'positioning' | 'toView'
> &
  TooltipStyleOptions &
  Readonly<{
    toView?: (attributes: TooltipAttributes<Message>) => Html
  }> &
  AnchorPositioningConfig<Message>

const positionerBaseClassName = 'isolate z-50'

const contentBaseClassName =
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const arrowBaseClassName =
  'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5'

const arrowRtlBaseClassName =
  'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:-start-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:-end-1 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5'

export const tooltipClassName = ({
  className,
}: Pick<TooltipStyleOptions, 'className'> = {}): string => cn(className)

export const tooltipProviderClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const tooltipPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const tooltipContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const tooltipArrowClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? arrowRtlBaseClassName : arrowBaseClassName, className)

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

const partAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  attributes: BaseTooltip.TooltipPartAttributes<Message>,
  className: string,
  slot?: string,
): BaseTooltip.TooltipPartAttributes<Message> => ({
  ...attributes,
  root:
    attributes.root.length > 0
      ? [
          ...attributes.root,
          ...(slot === undefined
            ? optionalClassAttribute(h, className)
            : slotAttributes(h, slot, className)),
        ]
      : attributes.root,
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseTooltip.TooltipAttributes<Message>,
): TooltipAttributes<Message> => ({
  ...attributes,
  provider: [
    ...attributes.provider,
    ...slotAttributes(
      h,
      'tooltip-provider',
      tooltipProviderClassName({ className: config.providerClassName }),
    ),
  ],
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'tooltip', tooltipClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'tooltip-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...optionalClassAttribute(h, cn(config.portalClassName)),
  ],
  positioner: partAttributes(
    h,
    attributes.positioner,
    tooltipPositionerClassName({ className: config.positionerClassName }),
  ),
  popup: {
    ...partAttributes(
      h,
      attributes.popup,
      tooltipContentClassName({
        className: config.contentClassName,
        dir: config.dir,
      }),
      'tooltip-content',
    ),
    root:
      attributes.popup.root.length > 0
        ? [
            ...partAttributes(
              h,
              attributes.popup,
              tooltipContentClassName({
                className: config.contentClassName,
                dir: config.dir,
              }),
              'tooltip-content',
            ).root,
            h.DataAttribute(
              'state',
              config.instant === 'delay' ? 'delayed-open' : 'instant-open',
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : [],
  },
  viewport: partAttributes(
    h,
    attributes.viewport,
    cn(config.viewportClassName),
  ),
  arrow: partAttributes(
    h,
    attributes.arrow,
    tooltipArrowClassName({
      className: config.arrowClassName,
      dir: config.dir,
    }),
  ),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, side = 'top', sideOffset = 4, ...baseConfig } = config

  return BaseTooltip.view<Message>({
    ...baseConfig,
    side,
    sideOffset,
    toView: attributes => {
      const tooltipAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(tooltipAttributes)
      }

      return h.div(
        [...tooltipAttributes.provider],
        [
          h.div(
            [...tooltipAttributes.root],
            [
              h.button([...tooltipAttributes.trigger], ['Hover']),
              h.div(
                [...tooltipAttributes.portal],
                tooltipAttributes.popup.isMounted
                  ? [
                      h.div(
                        [...tooltipAttributes.positioner.root],
                        [
                          h.div(
                            [...tooltipAttributes.popup.root],
                            [
                              h.div(
                                [...tooltipAttributes.viewport.root],
                                ['Add to library'],
                              ),
                              h.div([...tooltipAttributes.arrow.root], []),
                            ],
                          ),
                        ],
                      ),
                    ]
                  : [],
              ),
            ],
          ),
        ],
      )
    },
  })
}
