import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseMenubar from '../../base-ui/menubar'

// MODEL

export type MenubarMenuCheckedChange = BaseMenubar.MenubarMenuCheckedChange
export type MenubarMenuDescriptor = BaseMenubar.MenubarMenuDescriptor
export type MenubarMenuHighlightChange = BaseMenubar.MenubarMenuHighlightChange
export type MenubarMenuItemPress = BaseMenubar.MenubarMenuItemPress
export type MenubarMenuOpenChange = BaseMenubar.MenubarMenuOpenChange
export type MenubarMenuRadioValueChange =
  BaseMenubar.MenubarMenuRadioValueChange
export type MenubarOrientation = BaseMenubar.MenubarOrientation
export type MenubarTriggerChange = BaseMenubar.MenubarTriggerChange
export type MenubarTriggerChangeReason = BaseMenubar.MenubarTriggerChangeReason
export type MenuAlign = BaseMenubar.MenuAlign
export type MenuHighlightChangeReason = BaseMenubar.MenuHighlightChangeReason
export type MenuItemDescriptor = BaseMenubar.MenuItemDescriptor
export type MenuItemKind = BaseMenubar.MenuItemKind
export type MenuOpenChangeReason = BaseMenubar.MenuOpenChangeReason
export type MenuSide = BaseMenubar.MenuSide
export type MenuTransitionStatus = BaseMenubar.MenuTransitionStatus

export const MenubarVariant = S.Union([
  S.Literal('default'),
  S.Literal('destructive'),
])
export type MenubarVariant = typeof MenubarVariant.Type

export const MenubarStyleOptions = S.Struct({
  dir: S.optional(S.String),
  className: S.optional(S.String),
  menuClassName: S.optional(S.String),
  triggerClassName: S.optional(S.String),
  portalClassName: S.optional(S.String),
  positionerClassName: S.optional(S.String),
  contentClassName: S.optional(S.String),
  groupClassName: S.optional(S.String),
  labelClassName: S.optional(S.String),
  itemClassName: S.optional(S.String),
  checkboxItemClassName: S.optional(S.String),
  radioItemClassName: S.optional(S.String),
  subTriggerClassName: S.optional(S.String),
  subContentClassName: S.optional(S.String),
  separatorClassName: S.optional(S.String),
  shortcutClassName: S.optional(S.String),
  itemIndicatorClassName: S.optional(S.String),
  inset: S.optional(S.Boolean),
  variant: S.optional(MenubarVariant),
})
export type MenubarStyleOptions = typeof MenubarStyleOptions.Type

// UPDATE

export const {
  FocusMenubarMenu,
  RestoreMenubarMenuFocus,
  activeMenuValue,
  arrowId,
  checkedChange,
  commandForMenuOpenChange,
  enabledItems,
  enabledMenus,
  groupLabelId,
  hasOpenMenu,
  highlightChange,
  highlightedItem,
  itemFocusSelector,
  itemId,
  itemKind,
  itemPress,
  itemsForParent,
  menuCheckedChange,
  menuHighlightChange,
  menuId,
  menuItemPress,
  menuOpenChange,
  menuOptions,
  menuRadioValueChange,
  menuTriggerId,
  menuTriggerSelector,
  nextEnabledMenu,
  nextHighlightedItem,
  openChange,
  popupId,
  positionerId,
  radioValueChange,
  triggerChange,
  triggerId,
  triggerSelector,
  typeaheadItem,
} = BaseMenubar

// VIEW

export type MenuPartAttributes<Message> =
  BaseMenubar.MenuPartAttributes<Message>
export type MenuItemAttributes<Message> =
  BaseMenubar.MenuItemAttributes<Message> &
    Readonly<{
      shortcut: ReadonlyArray<Attribute<Message>>
    }>
export type MenuPopupAttributes<Message> = Omit<
  BaseMenubar.MenuPopupAttributes<Message>,
  'items'
> &
  Readonly<{
    items: ReadonlyArray<MenuItemAttributes<Message>>
  }>
export type MenubarMenuAttributes<Message> = Omit<
  BaseMenubar.MenubarMenuAttributes<Message>,
  'popup' | 'submenus'
> &
  Readonly<{
    popup: MenuPopupAttributes<Message>
    submenus: ReadonlyArray<MenuPopupAttributes<Message>>
  }>
export type MenubarAttributes<Message> = Omit<
  BaseMenubar.MenubarAttributes<Message>,
  'menus'
> &
  Readonly<{
    menus: ReadonlyArray<Html>
  }>

export type ViewConfig<Message> = Omit<
  BaseMenubar.ViewConfig<Message>,
  'toMenuView' | 'toView'
> &
  MenubarStyleOptions &
  Readonly<{
    toMenuView?: (attributes: MenubarMenuAttributes<Message>) => Html
    toView?: (attributes: MenubarAttributes<Message>) => Html
  }>

const rootBaseClassName =
  'flex h-8 items-center gap-0.5 rounded-lg border border-border p-[3px] data-[has-submenu-open]:relative data-[has-submenu-open]:z-50'

const triggerBaseClassName =
  'flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted'

const positionerBaseClassName = 'isolate z-50 outline-none'

const contentBaseClassName =
  'cn-menu-target cn-menu-translucent min-w-36 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95'

const subContentBaseClassName =
  'cn-menu-target cn-menu-translucent min-w-32 rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const itemBaseClassName =
  "group/menubar-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!"

const checkedItemBaseClassName =
  "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const subTriggerBaseClassName =
  "relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const labelBaseClassName = 'px-1.5 py-1 text-sm font-medium data-inset:pl-7'

const itemIndicatorBaseClassName =
  "pointer-events-none absolute right-2 flex items-center justify-center [&_svg:not([class*='size-'])]:size-4"

const separatorBaseClassName = '-mx-1 my-1 h-px bg-border'

const shortcutBaseClassName =
  'ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground'

export const menubarClassName = ({
  className,
}: Pick<MenubarStyleOptions, 'className'> = {}): string =>
  cn(rootBaseClassName, className)

export const menubarMenuClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn('relative', className)

export const menubarTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(triggerBaseClassName, className)

export const menubarPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const menubarContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(contentBaseClassName, className)

export const menubarSubContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(subContentBaseClassName, className)

export const menubarLabelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(labelBaseClassName, className)

export const menubarItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemBaseClassName, className)

export const menubarCheckedItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(checkedItemBaseClassName, className)

export const menubarSubTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(subTriggerBaseClassName, className)

export const menubarItemIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemIndicatorBaseClassName, className)

export const menubarSeparatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(separatorBaseClassName, className)

export const menubarShortcutClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(shortcutBaseClassName, className)

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

const itemClassName = <Message>(
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
): string => {
  if (BaseMenubar.itemKind(item) === 'submenu-trigger') {
    return menubarSubTriggerClassName({
      className: config.subTriggerClassName,
    })
  }

  if (
    BaseMenubar.itemKind(item) === 'checkbox' ||
    BaseMenubar.itemKind(item) === 'radio'
  ) {
    return menubarCheckedItemClassName({
      className:
        BaseMenubar.itemKind(item) === 'checkbox'
          ? config.checkboxItemClassName
          : config.radioItemClassName,
    })
  }

  return menubarItemClassName({ className: config.itemClassName })
}

const itemSlot = (item: MenuItemDescriptor): string => {
  if (BaseMenubar.itemKind(item) === 'checkbox') {
    return 'menubar-checkbox-item'
  }

  if (BaseMenubar.itemKind(item) === 'radio') {
    return 'menubar-radio-item'
  }

  if (BaseMenubar.itemKind(item) === 'submenu-trigger') {
    return 'menubar-sub-trigger'
  }

  return 'menubar-item'
}

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  itemAttributes: BaseMenubar.MenuItemAttributes<Message>,
): MenuItemAttributes<Message> => ({
  ...itemAttributes,
  root: [
    ...itemAttributes.root,
    ...(config.inset === true ? [h.DataAttribute('inset', 'true')] : []),
    h.DataAttribute('variant', config.variant ?? 'default'),
    ...slotAttributes(
      h,
      itemSlot(itemAttributes.item),
      itemClassName(config, itemAttributes.item),
    ),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  indicator: [
    ...itemAttributes.indicator,
    ...slotAttributes(
      h,
      BaseMenubar.itemKind(itemAttributes.item) === 'checkbox'
        ? 'menubar-checkbox-item-indicator'
        : 'menubar-radio-item-indicator',
      menubarItemIndicatorClassName({
        className: config.itemIndicatorClassName,
      }),
    ),
  ],
  submenuIndicator: [
    ...itemAttributes.submenuIndicator,
    ...slotAttributes(h, 'menubar-sub-indicator', 'cn-rtl-flip ml-auto'),
  ],
  shortcut: slotAttributes(
    h,
    'menubar-shortcut',
    menubarShortcutClassName({ className: config.shortcutClassName }),
  ),
})

const shadcnPopupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  popup: BaseMenubar.MenuPopupAttributes<Message>,
): MenuPopupAttributes<Message> => ({
  ...popup,
  positioner: {
    ...popup.positioner,
    root:
      popup.positioner.root.length > 0
        ? [
            ...popup.positioner.root,
            ...optionalClassAttribute(
              h,
              menubarPositionerClassName({
                className: config.positionerClassName,
              }),
            ),
          ]
        : popup.positioner.root,
  },
  popup: {
    ...popup.popup,
    root:
      popup.popup.root.length > 0
        ? [
            ...popup.popup.root,
            ...slotAttributes(
              h,
              popup.parentValue === undefined
                ? 'menubar-content'
                : 'menubar-sub-content',
              popup.parentValue === undefined
                ? menubarContentClassName({
                    className: config.contentClassName,
                  })
                : menubarSubContentClassName({
                    className: config.subContentClassName,
                  }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : popup.popup.root,
  },
  group: [
    ...popup.group,
    ...slotAttributes(h, 'menubar-group', cn(config.groupClassName)),
  ],
  groupLabel: [
    ...popup.groupLabel,
    ...(config.inset === true ? [h.DataAttribute('inset', 'true')] : []),
    ...slotAttributes(
      h,
      'menubar-label',
      menubarLabelClassName({ className: config.labelClassName }),
    ),
  ],
  separator: [
    ...popup.separator,
    ...slotAttributes(
      h,
      'menubar-separator',
      menubarSeparatorClassName({
        className: config.separatorClassName,
      }),
    ),
  ],
  items: popup.items.map(itemAttributes =>
    shadcnItemAttributes(h, config, itemAttributes),
  ),
})

const shadcnMenuAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseMenubar.MenubarMenuAttributes<Message>,
): MenubarMenuAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    h.Style({ zIndex: attributes.menu.open ? '40' : '50' }),
    ...slotAttributes(
      h,
      'menubar-menu',
      menubarMenuClassName({ className: config.menuClassName }),
    ),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(
      h,
      'menubar-trigger',
      menubarTriggerClassName({ className: config.triggerClassName }),
    ),
  ],
  portal: [
    ...attributes.portal,
    h.DataAttribute('slot', 'menubar-portal'),
    ...optionalClassAttribute(h, cn(config.portalClassName)),
  ],
  popup: shadcnPopupAttributes(h, config, attributes.popup),
  submenus: attributes.submenus.map(popup =>
    shadcnPopupAttributes(h, config, popup),
  ),
})

const shadcnRootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseMenubar.MenubarAttributes<Message>,
): MenubarAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'menubar', menubarClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
})

export const checkIcon = <Message>(
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
    [h.path([h.D('m20 6-11 11-5-5')], [])],
  )
}

export const chevronRightIcon = <Message>(
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
    [h.path([h.D('m9 18 6-6-6-6')], [])],
  )
}

const defaultItemContent = <Message>(
  itemAttributes: MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const indicator =
    BaseMenubar.itemKind(itemAttributes.item) === 'checkbox' ||
    BaseMenubar.itemKind(itemAttributes.item) === 'radio'
      ? [h.span([...itemAttributes.indicator], [checkIcon([])])]
      : []
  const submenuIndicator =
    BaseMenubar.itemKind(itemAttributes.item) === 'submenu-trigger'
      ? [chevronRightIcon(itemAttributes.submenuIndicator)]
      : []

  return [
    ...indicator,
    h.span([...itemAttributes.label], [itemAttributes.item.label]),
    ...submenuIndicator,
  ]
}

const popupView = <Message>(
  popup: MenuPopupAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()

  if (!popup.isMounted) {
    return []
  }

  return [
    h.div([...popup.backdrop.root], []),
    h.div(
      [...popup.positioner.root],
      [
        h.div(
          [...popup.popup.root],
          [
            h.div(
              [...popup.group],
              popup.items.map(itemAttributes =>
                h.div(
                  [...itemAttributes.root],
                  defaultItemContent(itemAttributes),
                ),
              ),
            ),
          ],
        ),
      ],
    ),
  ]
}

const defaultMenuView = <Message>(
  attributes: MenubarMenuAttributes<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [...attributes.root],
    [
      h.button([...attributes.trigger], [attributes.menu.label]),
      h.div(
        [...attributes.portal],
        [
          ...popupView(attributes.popup),
          ...attributes.submenus.flatMap(popupView),
        ],
      ),
    ],
  )
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toMenuView, toView, ...baseConfig } = config

  return BaseMenubar.view<Message>({
    ...baseConfig,
    toMenuView: attributes => {
      const menuAttributes = shadcnMenuAttributes(h, config, attributes)

      return toMenuView === undefined
        ? defaultMenuView(menuAttributes)
        : toMenuView(menuAttributes)
    },
    toView: attributes => {
      const menubarAttributes = shadcnRootAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(menubarAttributes)
      }

      return h.div([...menubarAttributes.root], menubarAttributes.menus)
    },
  })
}
