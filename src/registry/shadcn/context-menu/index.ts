import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import * as BaseContextMenu from '../../base-ui/context-menu'

// MODEL

export type ContextMenuOpenChange = BaseContextMenu.ContextMenuOpenChange
export type ContextMenuPlatform = BaseContextMenu.ContextMenuPlatform
export type ContextMenuPoint = BaseContextMenu.ContextMenuPoint
export type MenuAlign = BaseContextMenu.MenuAlign
export type MenuCheckedChange = BaseContextMenu.MenuCheckedChange
export type MenuHighlightChange = BaseContextMenu.MenuHighlightChange
export type MenuHighlightChangeReason =
  BaseContextMenu.MenuHighlightChangeReason
export type MenuItemDescriptor = BaseContextMenu.MenuItemDescriptor
export type MenuItemKind = BaseContextMenu.MenuItemKind
export type MenuItemPress = BaseContextMenu.MenuItemPress
export type MenuOpenChangeReason = BaseContextMenu.MenuOpenChangeReason
export type MenuRadioValueChange = BaseContextMenu.MenuRadioValueChange
export type MenuSide = BaseContextMenu.MenuSide
export type MenuTransitionStatus = BaseContextMenu.MenuTransitionStatus

export const ContextMenuVariant = S.Union([
  S.Literal('default'),
  S.Literal('destructive'),
])
export type ContextMenuVariant = typeof ContextMenuVariant.Type

export const ContextMenuStyleOptions = S.Struct({
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
  variant: S.optional(ContextMenuVariant),
})
export type ContextMenuStyleOptions = typeof ContextMenuStyleOptions.Type

// UPDATE

export const {
  FocusContextMenu,
  RestoreContextMenuFocus,
  arrowId,
  checkedChange,
  commandForOpenChange,
  contextPoint,
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
} = BaseContextMenu

// VIEW

export type MenuPartAttributes<Message> =
  BaseContextMenu.MenuPartAttributes<Message>
export type MenuItemAttributes<Message> =
  BaseContextMenu.MenuItemAttributes<Message> &
    Readonly<{
      shortcut: ReadonlyArray<Attribute<Message>>
    }>
export type MenuPopupAttributes<Message> = Omit<
  BaseContextMenu.MenuPopupAttributes<Message>,
  'items'
> &
  Readonly<{
    items: ReadonlyArray<MenuItemAttributes<Message>>
  }>
export type MenuAttributes<Message> = Omit<
  BaseContextMenu.MenuAttributes<Message>,
  'popup' | 'submenus'
> &
  Readonly<{
    popup: MenuPopupAttributes<Message>
    submenus: ReadonlyArray<MenuPopupAttributes<Message>>
  }>

export type ViewConfig<Message> = Omit<
  BaseContextMenu.ViewConfig<Message>,
  'toView'
> &
  ContextMenuStyleOptions &
  Readonly<{
    toView?: (attributes: MenuAttributes<Message>) => Html
  }>

const positionerBaseClassName = 'isolate z-50 outline-none'

const triggerBaseClassName = 'select-none'

const contentBaseClassName =
  'cn-menu-target cn-menu-translucent z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'

const subContentExtraClassName = 'shadow-lg'

const labelBaseClassName =
  'px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7'

const itemBaseClassName =
  "group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive"

const subTriggerBaseClassName =
  "flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const checkedItemBaseClassName =
  "relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

const itemIndicatorBaseClassName =
  'pointer-events-none absolute right-2 flex items-center justify-center'

const separatorBaseClassName = '-mx-1 my-1 h-px bg-border'

const shortcutBaseClassName =
  'ml-auto text-xs tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground'

export const contextMenuClassName = ({
  className,
}: Pick<ContextMenuStyleOptions, 'className'> = {}): string => cn(className)

export const contextMenuTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(triggerBaseClassName, className)

export const contextMenuPositionerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(positionerBaseClassName, className)

export const contextMenuContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(contentBaseClassName, className)

export const contextMenuSubContentClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(contentBaseClassName, subContentExtraClassName, className)

export const contextMenuLabelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(labelBaseClassName, className)

export const contextMenuItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemBaseClassName, className)

export const contextMenuSubTriggerClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(subTriggerBaseClassName, className)

export const contextMenuCheckedItemClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(checkedItemBaseClassName, className)

export const contextMenuItemIndicatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(itemIndicatorBaseClassName, className)

export const contextMenuSeparatorClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(separatorBaseClassName, className)

export const contextMenuShortcutClassName = ({
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
  if (BaseContextMenu.itemKind(item) === 'submenu-trigger') {
    return contextMenuSubTriggerClassName({
      className: config.subTriggerClassName,
    })
  }

  if (
    BaseContextMenu.itemKind(item) === 'checkbox' ||
    BaseContextMenu.itemKind(item) === 'radio'
  ) {
    return contextMenuCheckedItemClassName({
      className:
        BaseContextMenu.itemKind(item) === 'checkbox'
          ? config.checkboxItemClassName
          : config.radioItemClassName,
    })
  }

  return contextMenuItemClassName({ className: config.itemClassName })
}

const itemSlot = (item: MenuItemDescriptor): string => {
  if (BaseContextMenu.itemKind(item) === 'checkbox') {
    return 'context-menu-checkbox-item'
  }

  if (BaseContextMenu.itemKind(item) === 'radio') {
    return 'context-menu-radio-item'
  }

  if (BaseContextMenu.itemKind(item) === 'submenu-trigger') {
    return 'context-menu-sub-trigger'
  }

  return 'context-menu-item'
}

const shadcnItemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  itemAttributes: BaseContextMenu.MenuItemAttributes<Message>,
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
      BaseContextMenu.itemKind(itemAttributes.item) === 'checkbox'
        ? 'context-menu-checkbox-item-indicator'
        : 'context-menu-radio-item-indicator',
      contextMenuItemIndicatorClassName({
        className: config.itemIndicatorClassName,
      }),
    ),
  ],
  submenuIndicator: [
    ...itemAttributes.submenuIndicator,
    ...slotAttributes(h, 'context-menu-sub-indicator', 'cn-rtl-flip ml-auto'),
  ],
  shortcut: slotAttributes(
    h,
    'context-menu-shortcut',
    contextMenuShortcutClassName({ className: config.shortcutClassName }),
  ),
})

const shadcnPopupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  popup: BaseContextMenu.MenuPopupAttributes<Message>,
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
              contextMenuPositionerClassName({
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
                ? 'context-menu-content'
                : 'context-menu-sub-content',
              popup.parentValue === undefined
                ? contextMenuContentClassName({
                    className: config.contentClassName,
                  })
                : contextMenuSubContentClassName({
                    className: config.subContentClassName,
                  }),
            ),
            ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ]
        : popup.popup.root,
  },
  group: [
    ...popup.group,
    ...slotAttributes(h, 'context-menu-group', cn(config.groupClassName)),
  ],
  groupLabel: [
    ...popup.groupLabel,
    ...(config.inset === true ? [h.DataAttribute('inset', 'true')] : []),
    ...slotAttributes(
      h,
      'context-menu-label',
      contextMenuLabelClassName({ className: config.labelClassName }),
    ),
  ],
  separator: [
    ...popup.separator,
    ...slotAttributes(
      h,
      'context-menu-separator',
      contextMenuSeparatorClassName({
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
  attributes: BaseContextMenu.MenuAttributes<Message>,
): MenuAttributes<Message> => ({
  ...attributes,
  root: [
    ...attributes.root,
    ...slotAttributes(h, 'context-menu', contextMenuClassName(config)),
    ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  ],
  trigger: [
    ...attributes.trigger,
    ...slotAttributes(
      h,
      'context-menu-trigger',
      contextMenuTriggerClassName({ className: config.triggerClassName }),
    ),
  ],
  portal: [
    ...attributes.portal,
    h.DataAttribute('slot', 'context-menu-portal'),
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
  const kind = BaseContextMenu.itemKind(itemAttributes.item)
  const indicator =
    kind === 'checkbox' || kind === 'radio'
      ? h.span([...itemAttributes.indicator], [checkIcon([])])
      : h.span([], [])
  const submenuIndicator =
    kind === 'submenu-trigger'
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
  submenus: ReadonlyArray<MenuPopupAttributes<Message>> = [],
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
            ...submenus.flatMap(submenu => popupView(submenu)),
          ],
        ),
      ],
    ),
  ]
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, ...baseConfig } = config

  return BaseContextMenu.view<Message>({
    ...baseConfig,
    align: config.align ?? 'start',
    alignOffset: config.alignOffset ?? 4,
    side: config.side ?? 'right',
    sideOffset: config.sideOffset ?? 0,
    toView: attributes => {
      const menuAttributes = shadcnAttributes(h, config, attributes)

      if (toView !== undefined) {
        return toView(menuAttributes)
      }

      return h.div(
        [...menuAttributes.root],
        [
          h.div([...menuAttributes.trigger], ['Right click here']),
          h.div(
            [...menuAttributes.portal],
            [...popupView(menuAttributes.popup, menuAttributes.submenus)],
          ),
        ],
      )
    },
  })
}
