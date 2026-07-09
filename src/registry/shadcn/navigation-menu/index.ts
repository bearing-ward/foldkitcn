import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseNavigationMenu from '../../base-ui/navigation-menu'

// MODEL

export type NavigationMenuActivationDirection =
  BaseNavigationMenu.NavigationMenuActivationDirection
export type NavigationMenuAlign = BaseNavigationMenu.NavigationMenuAlign
export type NavigationMenuInstant = BaseNavigationMenu.NavigationMenuInstant
export type NavigationMenuItemDescriptor =
  BaseNavigationMenu.NavigationMenuItemDescriptor &
    Readonly<{
      className?: string | undefined
      popupHeight?: string | undefined
      popupWidth?: string | undefined
      positionerLeft?: string | undefined
    }>
export type NavigationMenuItemKind = BaseNavigationMenu.NavigationMenuItemKind
export type NavigationMenuOrientation =
  BaseNavigationMenu.NavigationMenuOrientation
export type NavigationMenuSide = BaseNavigationMenu.NavigationMenuSide
export type NavigationMenuTransitionStatus =
  BaseNavigationMenu.NavigationMenuTransitionStatus
export type NavigationMenuValueChange =
  BaseNavigationMenu.NavigationMenuValueChange
export type NavigationMenuValueChangeReason =
  BaseNavigationMenu.NavigationMenuValueChangeReason

export const NavigationMenuStyleOptions = S.Struct({
  dir: S.optional(S.String),
  className: S.optional(S.String),
  listClassName: S.optional(S.String),
  itemClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  popupClassName: S.optional(S.String),
  viewportClassName: S.optional(S.String),
  linkClassName: S.optional(S.String),
  indicatorClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  backdropClassName: S.optional(S.String),
  arrowClassName: S.optional(S.String),
})
export type NavigationMenuStyleOptions = typeof NavigationMenuStyleOptions.Type

// UPDATE

export const {
  CompletedFocusNavigationMenu,
  CompletedRestoreNavigationMenuFocus,
  FocusNavigationMenu,
  RestoreNavigationMenuFocus,
  activeItem,
  arrowId,
  backdropId,
  commandForValueChange,
  contentFocusSelector,
  contentId,
  enabledItems,
  iconId,
  isActiveItem,
  isOpen,
  isTriggerItem,
  itemId,
  itemKind,
  linkFocusSelector,
  linkId,
  listId,
  navigationMenuSelector,
  nextEnabledItem,
  popupId,
  positionerId,
  triggerFocusSelector,
  triggerId,
  valueChange,
  viewportId,
} = BaseNavigationMenu

// VIEW

export type NavigationMenuPartAttributes<Message> =
  BaseNavigationMenu.NavigationMenuPartAttributes<Message>
export type NavigationMenuItemAttributes<Message> = Omit<
  BaseNavigationMenu.NavigationMenuItemAttributes<Message>,
  'item'
> &
  Readonly<{ item: NavigationMenuItemDescriptor }>
export type NavigationMenuAttributes<Message> = Omit<
  BaseNavigationMenu.NavigationMenuAttributes<Message>,
  'activeItem' | 'items'
> &
  Readonly<{
    items: ReadonlyArray<NavigationMenuItemAttributes<Message>>
    activeItem?: NavigationMenuItemAttributes<Message> | undefined
  }>

export type ViewConfig<Message> = Omit<
  BaseNavigationMenu.ViewConfig<Message>,
  'items' | 'toView'
> &
  NavigationMenuStyleOptions &
  Readonly<{
    items: ReadonlyArray<NavigationMenuItemDescriptor>
    toView?: (attributes: NavigationMenuAttributes<Message>) => Html
  }>

const rootBaseClassName =
  'group/navigation-menu relative flex max-w-max flex-1 items-center justify-center'

const listBaseClassName =
  'group flex flex-1 list-none items-center justify-center gap-0'

const itemBaseClassName = 'relative'

const triggerBaseClassName =
  'group/navigation-menu-trigger inline-flex h-9 w-max items-center justify-center rounded-lg px-2.5 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-popup-open:bg-muted/50 data-popup-open:hover:bg-muted data-open:bg-muted/50 data-open:hover:bg-muted data-open:focus:bg-muted'

const contentBaseClassName =
  'data-ending-style:data-activation-direction=left:translate-x-[50%] data-ending-style:data-activation-direction=right:translate-x-[-50%] data-starting-style:data-activation-direction=left:translate-x-[-50%] data-starting-style:data-activation-direction=right:translate-x-[50%] h-full w-auto p-1 transition-[opacity,transform,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] group-data-[viewport=false]/navigation-menu:rounded-lg group-data-[viewport=false]/navigation-menu:bg-popover group-data-[viewport=false]/navigation-menu:text-popover-foreground group-data-[viewport=false]/navigation-menu:shadow group-data-[viewport=false]/navigation-menu:ring-1 group-data-[viewport=false]/navigation-menu:ring-foreground/10 group-data-[viewport=false]/navigation-menu:duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52 data-[motion^=from-]:animate-in data-[motion^=from-]:fade-in data-[motion^=to-]:animate-out data-[motion^=to-]:fade-out **:data-[slot=navigation-menu-link]:focus:ring-0 **:data-[slot=navigation-menu-link]:focus:outline-none group-data-[viewport=false]/navigation-menu:data-open:animate-in group-data-[viewport=false]/navigation-menu:data-open:fade-in-0 group-data-[viewport=false]/navigation-menu:data-open:zoom-in-95 group-data-[viewport=false]/navigation-menu:data-closed:animate-out group-data-[viewport=false]/navigation-menu:data-closed:fade-out-0 group-data-[viewport=false]/navigation-menu:data-closed:zoom-out-95'

const positionerBaseClassName =
  'isolate z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] data-instant:transition-none data-[side=bottom]:before:top-[-10px] data-[side=bottom]:before:right-0 data-[side=bottom]:before:left-0'

const popupBaseClassName =
  'data-[ending-style]:easing-[ease] xs:w-(--popup-width) relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-lg bg-popover text-popover-foreground shadow ring-1 ring-foreground/10 transition-[opacity,transform,width,height,scale,translate] duration-[0.35s] ease-[cubic-bezier(0.22,1,0.36,1)] outline-none data-ending-style:scale-90 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-90 data-starting-style:opacity-0'

const viewportBaseClassName = 'relative size-full overflow-hidden'

const linkBaseClassName =
  "flex items-center gap-2 rounded-lg p-2 text-sm transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-active:bg-muted/50 data-active:hover:bg-muted data-active:focus:bg-muted [&_svg:not([class*='size-'])]:size-4"

const indicatorBaseClassName =
  'top-full z-1 flex h-1.5 items-end justify-center overflow-hidden data-[state=hidden]:animate-out data-[state=hidden]:fade-out data-[state=visible]:animate-in data-[state=visible]:fade-in'

const triggerIconClassName =
  'relative top-px ml-1 size-3 transition duration-300 group-data-popup-open/navigation-menu-trigger:rotate-180 group-data-open/navigation-menu-trigger:rotate-180'

export const navigationMenuClassName = ({
  className,
}: Pick<NavigationMenuStyleOptions, 'className'> = {}): string =>
  cn(rootBaseClassName, className)

export const navigationMenuListClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(listBaseClassName, className)

export const navigationMenuItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemBaseClassName, className)

export const navigationMenuTriggerStyle = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(triggerBaseClassName, className)

export const navigationMenuContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(contentBaseClassName, className)

export const navigationMenuPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const navigationMenuPopupClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(popupBaseClassName, className)

export const navigationMenuViewportClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(viewportBaseClassName, className)

export const navigationMenuLinkClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(linkBaseClassName, className)

export const navigationMenuIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(indicatorBaseClassName, className)

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
  attributes: NavigationMenuPartAttributes<Message>,
  className: string,
): NavigationMenuPartAttributes<Message> => ({
  ...attributes,
  root:
    attributes.root.length > 0
      ? [...attributes.root, ...optionalClassAttribute(h, className)]
      : attributes.root,
})

const mergeStyleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  attributes: ReadonlyArray<Attribute<Message>>,
  style: Record<string, string>,
): ReadonlyArray<Attribute<Message>> =>
  attributes.map(attribute =>
    attribute._tag === 'Style'
      ? h.Style({ ...attribute.value, ...style })
      : attribute,
  )

const popupGeometryStyle = (
  item: NavigationMenuItemDescriptor | undefined,
): Record<string, string> =>
  item === undefined || item.popupWidth === undefined
    ? {}
    : {
        '--popup-height': item.popupHeight ?? 'auto',
        '--popup-width': item.popupWidth,
      }

const positionerGeometryStyle = <Message>(
  config: ViewConfig<Message>,
  item: NavigationMenuItemDescriptor | undefined,
): Record<string, string> =>
  item === undefined || item.popupWidth === undefined
    ? {}
    : {
        '--available-width': 'calc(100vw - 4rem)',
        '--positioner-height': item.popupHeight ?? 'auto',
        '--positioner-width': item.popupWidth,
        left: item.positionerLeft ?? '0',
        top: `calc(100% + ${config.sideOffset ?? 8}px)`,
      }

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  itemAttributes: BaseNavigationMenu.NavigationMenuItemAttributes<Message>,
  item: NavigationMenuItemDescriptor,
): NavigationMenuItemAttributes<Message> => ({
  ...itemAttributes,
  item,
  root: [
    ...itemAttributes.root,
    ...slotAttributes(
      h,
      'navigation-menu-item',
      navigationMenuItemClassName({
        className: cn(config.itemClassName, item.className),
      }),
    ),
  ],
  trigger: [
    ...itemAttributes.trigger,
    ...slotAttributes(
      h,
      'navigation-menu-trigger',
      cn(
        navigationMenuTriggerStyle({ className: config.triggerClassName }),
        'group',
      ),
    ),
  ],
  icon: [
    ...itemAttributes.icon,
    ...optionalClassAttribute(
      h,
      cn(triggerIconClassName, config.indicatorClassName),
    ),
  ],
  content: {
    ...itemAttributes.content,
    root:
      itemAttributes.content.root.length > 0
        ? [
            ...itemAttributes.content.root,
            ...slotAttributes(
              h,
              'navigation-menu-content',
              navigationMenuContentClassName({
                className: config.contentClassName,
              }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : itemAttributes.content.root,
  },
  link: [
    ...itemAttributes.link,
    ...slotAttributes(
      h,
      'navigation-menu-link',
      navigationMenuLinkClassName({ className: config.linkClassName }),
    ),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseNavigationMenu.NavigationMenuAttributes<Message>,
): NavigationMenuAttributes<Message> => {
  const items = attributes.items.map(itemAttributes =>
    shadcnItemAttributes(
      h,
      config,
      itemAttributes,
      config.items.find(item => item.value === itemAttributes.item.value) ??
        itemAttributes.item,
    ),
  )
  const maybeActiveItem = items.find(item => item.isActive)?.item

  return {
    ...attributes,
    root: [
      ...attributes.root,
      ...slotAttributes(h, 'navigation-menu', navigationMenuClassName(config)),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
    ],
    list: [
      ...attributes.list,
      ...slotAttributes(
        h,
        'navigation-menu-list',
        navigationMenuListClassName({ className: config.listClassName }),
      ),
    ],
    portal: [
      ...attributes.portal,
      ...optionalClassAttribute(h, cn(config.portalClassName)),
    ],
    positioner: {
      ...attributes.positioner,
      root: mergeStyleAttributes(
        h,
        partAttributes(
          h,
          attributes.positioner,
          navigationMenuPositionerClassName({
            className: config.positionerClassName,
          }),
        ).root,
        positionerGeometryStyle(config, maybeActiveItem),
      ),
    },
    backdrop: partAttributes(
      h,
      attributes.backdrop,
      cn(config.backdropClassName),
    ),
    popup: {
      ...attributes.popup,
      root: mergeStyleAttributes(
        h,
        partAttributes(
          h,
          attributes.popup,
          navigationMenuPopupClassName({ className: config.popupClassName }),
        ).root,
        popupGeometryStyle(maybeActiveItem),
      ),
    },
    viewport: partAttributes(
      h,
      attributes.viewport,
      navigationMenuViewportClassName({ className: config.viewportClassName }),
    ),
    arrow: partAttributes(h, attributes.arrow, cn(config.arrowClassName)),
    items,
    activeItem: items.find(item => item.isActive),
  }
}

export const chevronDownIcon = <Message>(
  attributes: ReadonlyArray<Attribute<Message>>,
): Html => {
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
      ...attributes,
    ],
    [h.path([h.D('m6 9 6 6 6-6')], [])],
  )
}

const defaultContent = <Message>(
  itemAttributes: NavigationMenuItemAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div([...itemAttributes.content.root], [itemAttributes.item.label])
}

const defaultItemView = <Message>(
  itemAttributes: NavigationMenuItemAttributes<Message>,
): Html => {
  const h = html<Message>()

  if (BaseNavigationMenu.itemKind(itemAttributes.item) === 'link') {
    return h.li(
      [...itemAttributes.root],
      [h.a([...itemAttributes.link], [itemAttributes.item.label])],
    )
  }

  return h.li(
    [...itemAttributes.root],
    [
      h.button(
        [...itemAttributes.trigger],
        [itemAttributes.item.label, chevronDownIcon(itemAttributes.icon)],
      ),
    ],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const {
    align = 'start',
    side = 'bottom',
    sideOffset = 8,
    toView,
    ...baseConfig
  } = config

  return BaseNavigationMenu.view<Message>({
    ...baseConfig,
    align,
    side,
    sideOffset,
    toView: attributes => {
      const navigationMenuAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(navigationMenuAttributes)
      }

      return h.nav(
        [...navigationMenuAttributes.root],
        [
          h.ul(
            [...navigationMenuAttributes.list],
            navigationMenuAttributes.items.map(defaultItemView),
          ),
          h.div(
            [...navigationMenuAttributes.portal],
            navigationMenuAttributes.isMounted
              ? [
                  h.div([...navigationMenuAttributes.backdrop.root], []),
                  h.div(
                    [...navigationMenuAttributes.positioner.root],
                    [
                      h.nav(
                        [...navigationMenuAttributes.popup.root],
                        [
                          h.div(
                            [...navigationMenuAttributes.viewport.root],
                            navigationMenuAttributes.items
                              .filter(
                                itemAttributes =>
                                  itemAttributes.content.isMounted,
                              )
                              .map(defaultContent),
                          ),
                          h.div([...navigationMenuAttributes.arrow.root], []),
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
