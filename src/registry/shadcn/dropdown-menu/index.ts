import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseMenu from '../../base-ui/menu'

// MODEL

export type MenuAlign = BaseMenu.MenuAlign
export type MenuCheckedChange = BaseMenu.MenuCheckedChange
export type MenuHighlightChange = BaseMenu.MenuHighlightChange
export type MenuHighlightChangeReason = BaseMenu.MenuHighlightChangeReason
export type MenuItemDescriptor = BaseMenu.MenuItemDescriptor
export type MenuItemKind = BaseMenu.MenuItemKind
export type MenuItemPress = BaseMenu.MenuItemPress
export type MenuOpenChange = BaseMenu.MenuOpenChange
export type MenuOpenChangeReason = BaseMenu.MenuOpenChangeReason
export type MenuRadioValueChange = BaseMenu.MenuRadioValueChange
export type MenuSide = BaseMenu.MenuSide
export type MenuTransitionStatus = BaseMenu.MenuTransitionStatus

export const DropdownMenuVariant = S.Union([
  S.Literal('default'),
  S.Literal('destructive'),
])
export type DropdownMenuVariant = typeof DropdownMenuVariant.Type

export const DropdownMenuStyleOptions = S.Struct({
  dir: S.optional(S.String),
  className: S.optional(S.String),
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
  variant: S.optional(DropdownMenuVariant),
})
export type DropdownMenuStyleOptions = typeof DropdownMenuStyleOptions.Type

// UPDATE

export const {
  FocusMenu,
  RestoreMenuFocus,
  arrowId,
  checkedChange,
  commandForOpenChange,
  enabledItems,
  groupLabelId,
  highlightChange,
  highlightedItem,
  itemFocusSelector,
  itemId,
  itemKind,
  itemPress,
  itemsForParent,
  nextHighlightedItem,
  openChange,
  popupId,
  positionerId,
  radioValueChange,
  triggerId,
  triggerSelector,
  typeaheadItem,
} = BaseMenu

// VIEW

export type MenuPartAttributes<Message> = BaseMenu.MenuPartAttributes<Message>
export type MenuItemAttributes<Message> = BaseMenu.MenuItemAttributes<Message> &
  Readonly<{
    shortcut: ReadonlyArray<Attribute<Message>>
  }>
export type MenuPopupAttributes<Message> = Omit<
  BaseMenu.MenuPopupAttributes<Message>,
  'items'
> &
  Readonly<{
    items: ReadonlyArray<MenuItemAttributes<Message>>
  }>
export type MenuAttributes<Message> = Omit<
  BaseMenu.MenuAttributes<Message>,
  'popup' | 'submenus'
> &
  Readonly<{
    popup: MenuPopupAttributes<Message>
    submenus: ReadonlyArray<MenuPopupAttributes<Message>>
  }>

export type ViewConfig<Message> = Omit<BaseMenu.ViewConfig<Message>, 'toView'> &
  DropdownMenuStyleOptions &
  Readonly<{
    toView?: (attributes: MenuAttributes<Message>) => Html
  }>

const positionerBaseClassName = 'isolate z-50 outline-none'

const contentBaseClassName =
  'cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95'

const subContentBaseClassName =
  'cn-menu-target cn-menu-translucent w-auto min-w-[96px] rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const labelBaseClassName =
  'px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7'

const itemBaseClassName =
  "group/dropdown-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm whitespace-nowrap outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive"

const subTriggerBaseClassName =
  "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm whitespace-nowrap outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:relative data-popup-open:z-10 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:relative data-open:z-10 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const checkedItemBaseClassName =
  "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm whitespace-nowrap outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const itemIndicatorBaseClassName =
  'pointer-events-none absolute right-2 flex items-center justify-center'

const separatorBaseClassName = '-mx-1 my-1 h-px bg-border'

const shortcutBaseClassName =
  'ml-auto shrink-0 text-xs tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground'

export const dropdownMenuClassName = ({
  className,
}: Pick<DropdownMenuStyleOptions, 'className'> = {}): string => cn(className)

export const dropdownMenuPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const dropdownMenuContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(contentBaseClassName, className)

export const dropdownMenuSubContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(subContentBaseClassName, className)

export const dropdownMenuLabelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(labelBaseClassName, className)

export const dropdownMenuItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemBaseClassName, className)

export const dropdownMenuSubTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(subTriggerBaseClassName, className)

export const dropdownMenuCheckedItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(checkedItemBaseClassName, className)

export const dropdownMenuItemIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemIndicatorBaseClassName, className)

export const dropdownMenuSeparatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(separatorBaseClassName, className)

export const dropdownMenuShortcutClassName = ({
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
  if (BaseMenu.itemKind(item) === 'submenu-trigger') {
    return dropdownMenuSubTriggerClassName({
      className: config.subTriggerClassName,
    })
  }

  if (
    BaseMenu.itemKind(item) === 'checkbox' ||
    BaseMenu.itemKind(item) === 'radio'
  ) {
    return dropdownMenuCheckedItemClassName({
      className:
        BaseMenu.itemKind(item) === 'checkbox'
          ? config.checkboxItemClassName
          : config.radioItemClassName,
    })
  }

  return dropdownMenuItemClassName({ className: config.itemClassName })
}

const itemSlot = (item: MenuItemDescriptor): string => {
  if (BaseMenu.itemKind(item) === 'checkbox') {
    return 'dropdown-menu-checkbox-item'
  }

  if (BaseMenu.itemKind(item) === 'radio') {
    return 'dropdown-menu-radio-item'
  }

  if (BaseMenu.itemKind(item) === 'submenu-trigger') {
    return 'dropdown-menu-sub-trigger'
  }

  return 'dropdown-menu-item'
}

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  itemAttributes: BaseMenu.MenuItemAttributes<Message>,
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
      BaseMenu.itemKind(itemAttributes.item) === 'checkbox'
        ? 'dropdown-menu-checkbox-item-indicator'
        : 'dropdown-menu-radio-item-indicator',
      dropdownMenuItemIndicatorClassName({
        className: config.itemIndicatorClassName,
      }),
    ),
  ],
  submenuIndicator: [
    ...itemAttributes.submenuIndicator,
    ...slotAttributes(h, 'dropdown-menu-sub-indicator', 'cn-rtl-flip ml-auto'),
  ],
  shortcut: slotAttributes(
    h,
    'dropdown-menu-shortcut',
    dropdownMenuShortcutClassName({ className: config.shortcutClassName }),
  ),
})

const shadcnPopupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  popup: BaseMenu.MenuPopupAttributes<Message>,
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
              dropdownMenuPositionerClassName({
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
                ? 'dropdown-menu-content'
                : 'dropdown-menu-sub-content',
              popup.parentValue === undefined
                ? dropdownMenuContentClassName({
                    className: config.contentClassName,
                  })
                : dropdownMenuSubContentClassName({
                    className: config.subContentClassName,
                  }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : popup.popup.root,
  },
  group: [
    ...popup.group,
    ...slotAttributes(h, 'dropdown-menu-group', cn(config.groupClassName)),
  ],
  groupLabel: [
    ...popup.groupLabel,
    ...(config.inset === true ? [h.DataAttribute('inset', 'true')] : []),
    ...slotAttributes(
      h,
      'dropdown-menu-label',
      dropdownMenuLabelClassName({ className: config.labelClassName }),
    ),
  ],
  separator: [
    ...popup.separator,
    ...slotAttributes(
      h,
      'dropdown-menu-separator',
      dropdownMenuSeparatorClassName({
        className: config.separatorClassName,
      }),
    ),
  ],
  items: popup.items.map(itemAttributes =>
    shadcnItemAttributes(h, config, itemAttributes),
  ),
})

const shadcnAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: BaseMenu.MenuAttributes<Message>,
): MenuAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'dropdown-menu', dropdownMenuClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(h, 'dropdown-menu-trigger', cn(config.triggerClassName)),
  ],
  portal: [
    ...attributes.portal,
    h.DataAttribute('slot', 'dropdown-menu-portal'),
    ...optionalClassAttribute(h, cn(config.portalClassName)),
  ],
  popup: shadcnPopupAttributes(h, config, attributes.popup),
  submenus: attributes.submenus.map(popup =>
    shadcnPopupAttributes(h, config, popup),
  ),
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
    BaseMenu.itemKind(itemAttributes.item) === 'checkbox' ||
    BaseMenu.itemKind(itemAttributes.item) === 'radio'
      ? h.span([...itemAttributes.indicator], [checkIcon([])])
      : h.span([], [])
  const submenuIndicator =
    BaseMenu.itemKind(itemAttributes.item) === 'submenu-trigger'
      ? chevronRightIcon(itemAttributes.submenuIndicator)
      : h.span([], [])

  return [
    indicator,
    h.span([...itemAttributes.label], [itemAttributes.item.label]),
    submenuIndicator,
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
            h.div([...popup.arrow.root], []),
            h.div(
              [...popup.group],
              [
                h.div([...popup.groupLabel], ['Menu']),
                ...popup.items.map(itemAttributes =>
                  h.div(
                    [...itemAttributes.root],
                    defaultItemContent(itemAttributes),
                  ),
                ),
              ],
            ),
          ],
        ),
      ],
    ),
  ]
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseMenu.view<Message>({
    ...baseConfig,
    sideOffset: config.sideOffset ?? 4,
    toView: attributes => {
      const menuAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(menuAttributes)
      }

      return h.div(
        [...menuAttributes.root],
        [
          h.button([...menuAttributes.trigger], ['Open']),
          h.div(
            [...menuAttributes.portal],
            [
              ...popupView(menuAttributes.popup),
              ...menuAttributes.submenus.flatMap(popupView),
            ],
          ),
        ],
      )
    },
  })
}
