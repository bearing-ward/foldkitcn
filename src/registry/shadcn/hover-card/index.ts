import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BasePreviewCard from '../../base-ui/preview-card'

// MODEL

export type HoverCardAlign = BasePreviewCard.PreviewCardAlign
export type HoverCardChangeReason = BasePreviewCard.PreviewCardChangeReason
export type HoverCardInstant = BasePreviewCard.PreviewCardInstant
export type HoverCardOpenChange = BasePreviewCard.PreviewCardOpenChange
export type HoverCardSide = BasePreviewCard.PreviewCardSide
export type HoverCardTransitionStatus =
  BasePreviewCard.PreviewCardTransitionStatus

export const HoverCardStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  backdropClassName: S.optional(S.String),
  arrowClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type HoverCardStyleOptions = typeof HoverCardStyleOptions.Type

// UPDATE

export const {
  CompletedFocusPreviewCard: CompletedFocusHoverCard,
  CompletedRestorePreviewCardFocus: CompletedRestoreHoverCardFocus,
  FocusPreviewCard: FocusHoverCard,
  RestorePreviewCardFocus: RestoreHoverCardFocus,
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
  previewCardSelector: hoverCardSelector,
  triggerId,
  triggerSelector,
  viewportId,
} = BasePreviewCard

// VIEW

export type HoverCardAttributes<Message> =
  BasePreviewCard.PreviewCardAttributes<Message>
export type HoverCardPartAttributes<Message> =
  BasePreviewCard.PreviewCardPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BasePreviewCard.ViewConfig<Message>,
  'toView'
> &
  HoverCardStyleOptions &
  Readonly<{
    toView?: (attributes: HoverCardAttributes<Message>) => Html
  }>

const positionerBaseClassName = 'isolate z-50'

const contentBaseClassName =
  'z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const contentRtlBaseClassName =
  'z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

export const hoverCardClassName = ({
  className,
}: Pick<HoverCardStyleOptions, 'className'> = {}): string => cn(className)

export const hoverCardPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const hoverCardContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

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
  attributes: BasePreviewCard.PreviewCardPartAttributes<Message>,
  className: string,
  slot?: string,
): BasePreviewCard.PreviewCardPartAttributes<Message> => ({
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
  attributes: BasePreviewCard.PreviewCardAttributes<Message>,
): HoverCardAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'hover-card', hoverCardClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'hover-card-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...slotAttributes(h, 'hover-card-portal', cn(config.portalClassName)),
  ],
  positioner: partAttributes(
    h,
    attributes.positioner,
    hoverCardPositionerClassName({
      className: config.positionerClassName,
    }),
  ),
  backdrop: partAttributes(
    h,
    attributes.backdrop,
    cn(config.backdropClassName),
  ),
  popup: {
    ...partAttributes(
      h,
      attributes.popup,
      hoverCardContentClassName({
        className: config.contentClassName,
        dir: config.dir,
      }),
      'hover-card-content',
    ),
    root:
      attributes.popup.root.length > 0
        ? [
            ...partAttributes(
              h,
              attributes.popup,
              hoverCardContentClassName({
                className: config.contentClassName,
                dir: config.dir,
              }),
              'hover-card-content',
            ).root,
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : [],
  },
  viewport: partAttributes(
    h,
    attributes.viewport,
    cn(config.viewportClassName),
  ),
  arrow: partAttributes(h, attributes.arrow, cn(config.arrowClassName)),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const {
    align = 'center',
    alignOffset = 4,
    side = 'bottom',
    sideOffset = 4,
    toView,
    ...baseConfig
  } = config

  return BasePreviewCard.view<Message>({
    ...baseConfig,
    align,
    alignOffset,
    side,
    sideOffset,
    toView: attributes => {
      const hoverCardAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(hoverCardAttributes)
      }

      return h.div(
        [...hoverCardAttributes.root],
        [
          h.a([...hoverCardAttributes.trigger, h.Href('#')], ['Hover Here']),
          h.div(
            [...hoverCardAttributes.portal],
            hoverCardAttributes.popup.isMounted
              ? [
                  h.div(
                    [...hoverCardAttributes.positioner.root],
                    [
                      h.div(
                        [...hoverCardAttributes.popup.root],
                        [
                          h.div([h.Class('font-semibold')], ['@nextjs']),
                          h.div(
                            [],
                            [
                              'The React Framework - created and maintained by @vercel.',
                            ],
                          ),
                          h.div(
                            [h.Class('mt-1 text-xs text-muted-foreground')],
                            ['Joined December 2021'],
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
