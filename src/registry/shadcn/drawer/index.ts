import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseDrawer from '../../base-ui/drawer'

// MODEL

export type DrawerChangeReason = BaseDrawer.DrawerChangeReason
export type DrawerModalMode = BaseDrawer.DrawerModalMode
export type DrawerOpenChange = BaseDrawer.DrawerOpenChange
export type DrawerPlacement = BaseDrawer.DrawerPlacement
export type DrawerSwipeDirection = BaseDrawer.DrawerSwipeDirection
export type DrawerTransitionStatus = BaseDrawer.DrawerTransitionStatus

export const DrawerDirection = S.Union([
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('bottom'),
  S.Literal('left'),
])
export type DrawerDirection = typeof DrawerDirection.Type

export const DrawerStyleOptions = S.Struct({
  className: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  overlayClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  handleClassName: S.optional(S.String),
  headerClassName: S.optional(S.String),
  footerClassName: S.optional(S.String),
  titleClassName: S.optional(S.String),
  descriptionClassName: S.optional(S.String),
  closeClassName: S.optional(S.String),
  direction: S.optional(DrawerDirection),
  dir: S.optional(S.String),
})
export type DrawerStyleOptions = typeof DrawerStyleOptions.Type

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
  swipeOpenChange,
  titleId,
  triggerOpenChange,
} = BaseDrawer

// VIEW

export type DrawerAttributes<Message> = BaseDrawer.DrawerAttributes<Message> &
  Readonly<{
    handle: ReadonlyArray<Attribute<Message>>
    header: ReadonlyArray<Attribute<Message>>
    footer: ReadonlyArray<Attribute<Message>>
  }>
export type DrawerPartAttributes<Message> =
  BaseDrawer.DrawerPopupPartAttributes<Message>

export type ViewConfig<Message> = Omit<
  BaseDrawer.ViewConfig<Message>,
  'placement' | 'swipeDirection' | 'toView'
> &
  DrawerStyleOptions &
  Readonly<{
    toView?: (attributes: DrawerAttributes<Message>) => Html
  }>

const defaultDirection: DrawerDirection = 'bottom'

const overlayBaseClassName =
  'fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

const contentBaseClassName =
  'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm'

const contentRtlBaseClassName =
  'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:start-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-e-xl data-[vaul-drawer-direction=left]:border-e data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:end-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-s-xl data-[vaul-drawer-direction=right]:border-s data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm'

const handleBaseClassName =
  'mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block'

const headerBaseClassName =
  'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left'

const headerRtlBaseClassName =
  'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-start'

const footerBaseClassName = 'mt-auto flex flex-col gap-2 p-4'

const titleBaseClassName =
  'cn-font-heading text-base font-medium text-foreground'

const descriptionBaseClassName = 'text-sm text-muted-foreground'

export const drawerClassName = ({
  className,
}: Pick<DrawerStyleOptions, 'className'> = {}): string => cn(className)

export const drawerOverlayClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(overlayBaseClassName, className)

export const drawerContentClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? contentRtlBaseClassName : contentBaseClassName, className)

export const drawerHandleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(handleBaseClassName, className)

export const drawerHeaderClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: string | undefined
}> = {}): string =>
  cn(dir === 'rtl' ? headerRtlBaseClassName : headerBaseClassName, className)

export const drawerFooterClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(footerBaseClassName, className)

export const drawerTitleClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(titleBaseClassName, className)

export const drawerDescriptionClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(descriptionBaseClassName, className)

export const drawerCloseClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

const swipeDirectionFromDirection = (
  direction: DrawerDirection,
): BaseDrawer.DrawerSwipeDirection => {
  if (direction === 'top') {
    return 'up'
  }

  if (direction === 'left') {
    return 'left'
  }

  if (direction === 'right') {
    return 'right'
  }

  return 'down'
}

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
  direction: DrawerDirection,
  attributes: BaseDrawer.DrawerAttributes<Message>,
): DrawerAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'drawer', drawerClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'drawer-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    ...slotAttributes(h, 'drawer-portal', cn(config.portalClassName)),
  ],
  backdrop: {
    ...attributes.backdrop,
    root:
      attributes.backdrop.root.length > 0
        ? [
            ...attributes.backdrop.root,
            ...slotAttributes(
              h,
              'drawer-overlay',
              drawerOverlayClassName({ className: config.overlayClassName }),
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
            h.DataAttribute('vaul-drawer-direction', direction),
            ...slotAttributes(
              h,
              'drawer-content',
              drawerContentClassName({
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
      'drawer-title',
      drawerTitleClassName({ className: config.titleClassName }),
    ),
  ],
  description: [
    ...attributes.description,
    ...slotAttributes(
      h,
      'drawer-description',
      drawerDescriptionClassName({ className: config.descriptionClassName }),
    ),
  ],
  close: [
    ...attributes.close,
    ...slotAttributes(
      h,
      'drawer-close',
      drawerCloseClassName({ className: config.closeClassName }),
    ),
  ],
  handle: optionalClassAttribute(
    h,
    drawerHandleClassName({ className: config.handleClassName }),
  ),
  header: slotAttributes(
    h,
    'drawer-header',
    drawerHeaderClassName({
      className: config.headerClassName,
      dir: config.dir,
    }),
  ),
  footer: slotAttributes(
    h,
    'drawer-footer',
    drawerFooterClassName({ className: config.footerClassName }),
  ),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const direction = config.direction ?? defaultDirection
  const { toView } = config

  return BaseDrawer.view<Message>({
    ...config,
    placement: direction,
    swipeDirection: swipeDirectionFromDirection(direction),
    toView: attributes => {
      const drawerAttributes = shadcnAttributes(
        h,
        config,
        direction,
        attributes,
      )

      if (toView !== undefined) {
        return toView(drawerAttributes)
      }

      return h.div(
        [...drawerAttributes.root],
        [
          h.button([...drawerAttributes.trigger], ['Open Drawer']),
          h.dialog(
            [...drawerAttributes.dialog],
            drawerAttributes.popup.isMounted
              ? [
                  h.div([...drawerAttributes.backdrop.root], []),
                  h.div(
                    [...drawerAttributes.popup.root],
                    [
                      h.div([...drawerAttributes.handle], []),
                      h.div(
                        [...drawerAttributes.header],
                        [
                          h.h2([...drawerAttributes.title], ['Drawer title']),
                          h.p(
                            [...drawerAttributes.description],
                            ['Drawer description'],
                          ),
                        ],
                      ),
                      h.div(
                        [...drawerAttributes.footer],
                        [h.button([...drawerAttributes.close], ['Close'])],
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
