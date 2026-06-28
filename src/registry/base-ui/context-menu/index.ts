import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Menu from '../menu'

// MODEL

export const {
  MenuAlign,
  MenuHighlightChangeReason,
  MenuItemKind,
  MenuOpenChangeReason,
  MenuSide,
  MenuTransitionStatus,
} = Menu

export type MenuAlign = Menu.MenuAlign
export type MenuCheckedChange = Menu.MenuCheckedChange
export type MenuHighlightChange = Menu.MenuHighlightChange
export type MenuHighlightChangeReason = Menu.MenuHighlightChangeReason
export type MenuItemDescriptor = Menu.MenuItemDescriptor
export type MenuItemKind = Menu.MenuItemKind
export type MenuItemPress = Menu.MenuItemPress
export type MenuOpenChangeReason = Menu.MenuOpenChangeReason
export type MenuRadioValueChange = Menu.MenuRadioValueChange
export type MenuSide = Menu.MenuSide
export type MenuTransitionStatus = Menu.MenuTransitionStatus

export const ContextMenuPlatform = S.Union([
  S.Literal('mac'),
  S.Literal('non-mac'),
])
export type ContextMenuPlatform = typeof ContextMenuPlatform.Type

export const ContextMenuPoint = S.Struct({
  clientX: S.Number,
  clientY: S.Number,
  screenX: S.Number,
  screenY: S.Number,
  pointerType: S.String,
})
export type ContextMenuPoint = typeof ContextMenuPoint.Type

export const ContextMenuOpenChange = S.Struct({
  open: S.Boolean,
  reason: Menu.MenuOpenChangeReason,
  parentValue: S.optional(S.String),
  point: S.optional(ContextMenuPoint),
})
export type ContextMenuOpenChange = typeof ContextMenuOpenChange.Type

// UPDATE

const defaultPlatform: ContextMenuPlatform = 'mac'
const pointerMoveTolerance = 2

const keyboardPoint: ContextMenuPoint = {
  clientX: 0,
  clientY: 0,
  screenX: 0,
  screenY: 0,
  pointerType: 'keyboard',
}

export const {
  FocusMenu: FocusContextMenu,
  RestoreMenuFocus: RestoreContextMenuFocus,
  arrowId,
  checkedChange,
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
  popupId,
  positionerId,
  radioValueChange,
  triggerId,
  triggerSelector,
  typeaheadItem,
} = Menu

export const contextPoint = (
  clientX: number,
  clientY: number,
  screenX: number,
  screenY: number,
  pointerType: string,
): ContextMenuPoint => ({
  clientX,
  clientY,
  screenX,
  screenY,
  pointerType,
})

export const openChange = (
  open: boolean,
  reason: MenuOpenChangeReason = 'none',
  point?: ContextMenuPoint | undefined,
  parentValue?: string | undefined,
): ContextMenuOpenChange => ({ open, reason, point, parentValue })

export const commandForOpenChange = (
  config: Pick<Menu.MenuOptions, 'id' | 'triggerId' | 'triggerSelector'>,
  change: ContextMenuOpenChange,
): ReturnType<typeof Menu.commandForOpenChange> =>
  Menu.commandForOpenChange(
    config,
    Menu.openChange(change.open, change.reason, change.parentValue),
  )

// VIEW

export type MenuPartAttributes<Message> = Menu.MenuPartAttributes<Message>
export type MenuItemAttributes<Message> = Menu.MenuItemAttributes<Message>
export type MenuPopupAttributes<Message> = Omit<
  Menu.MenuPopupAttributes<Message>,
  'items'
> &
  Readonly<{
    items: ReadonlyArray<MenuItemAttributes<Message>>
  }>
export type MenuAttributes<Message> = Omit<
  Menu.MenuAttributes<Message>,
  'popup' | 'submenus' | 'trigger'
> &
  Readonly<{
    trigger: ReadonlyArray<Attribute<Message>>
    popup: MenuPopupAttributes<Message>
    submenus: ReadonlyArray<MenuPopupAttributes<Message>>
  }>

export type ViewConfig<Message> = Omit<
  Menu.ViewConfig<Message>,
  'onOpenChange' | 'toView'
> &
  Readonly<{
    contextPoint?: ContextMenuPoint | undefined
    platform?: ContextMenuPlatform | undefined
    onOpenChange?: (change: ContextMenuOpenChange) => Message
    onPointerChange?: (point: ContextMenuPoint) => Message
    toView: (attributes: MenuAttributes<Message>) => Html
  }>

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const optionalBooleanAttribute = <Message>(
  value: boolean | undefined,
  toAttribute: (value: boolean) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [toAttribute(true)] : []

const optionalMessageAttribute = <Message>(
  message: Option.Option<Message>,
  toAttribute: (message: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(message, {
    onNone: () => [],
    onSome: value => [toAttribute(value)],
  })

const currentPoint = <Message>(
  config: Pick<ViewConfig<Message>, 'contextPoint'>,
): ContextMenuPoint => config.contextPoint ?? keyboardPoint

const openMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'contextPoint' | 'onOpenChange'>,
  change: ContextMenuOpenChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onOpenChange)
    ? Option.some(config.onOpenChange(change))
    : Option.none()

const pointerChangeMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'isDisabled' | 'onPointerChange'>,
  pointerType: string,
  button: number,
  screenX: number,
  screenY: number,
  clientX: number,
  clientY: number,
): Option.Option<Message> => {
  if (
    config.isDisabled === true ||
    button !== 2 ||
    Predicate.isUndefined(config.onPointerChange)
  ) {
    return Option.none()
  }

  return Option.some(
    config.onPointerChange(
      contextPoint(clientX, clientY, screenX, screenY, pointerType),
    ),
  )
}

const keyboardOpenMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    'contextPoint' | 'isDisabled' | 'onOpenChange'
  >,
  key: string,
  modifiers: KeyboardModifiers,
): Option.Option<Message> => {
  if (config.isDisabled === true) {
    return Option.none()
  }

  if (key === 'ContextMenu' || (key === 'F10' && modifiers.shiftKey)) {
    return openMessage(
      config,
      openChange(true, 'keyboard-open', currentPoint(config)),
    )
  }

  return Option.none()
}

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(triggerId(config)),
  h.Tabindex(config.isDisabled === true ? -1 : 0),
  h.AriaHasPopup('menu'),
  h.AriaExpanded(config.open),
  h.AriaControls(popupId(config)),
  h.Style({ WebkitTouchCallout: 'none' }),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.open ? [h.DataAttribute('popup-open', '')] : []),
  ...optionalBooleanAttribute<Message>(config.isDisabled, value =>
    h.AriaDisabled(value),
  ),
  ...(config.isDisabled === true
    ? []
    : [
        h.OnPointerDown(
          (pointerType, button, screenX, screenY, _time, clientX, clientY) =>
            pointerChangeMessage(
              config,
              pointerType,
              button,
              screenX,
              screenY,
              clientX,
              clientY,
            ),
        ),
      ]),
  ...optionalMessageAttribute(
    config.isDisabled === true
      ? Option.none()
      : openMessage(
          config,
          openChange(true, 'trigger-press', currentPoint(config)),
        ),
    message => h.OnContextMenu(message),
  ),
  h.OnKeyDownPreventDefault((key, modifiers) =>
    keyboardOpenMessage(config, key, modifiers),
  ),
  ...(Predicate.isNotUndefined(config.onFocus)
    ? [h.OnFocus(config.onFocus)]
    : []),
  ...(Predicate.isNotUndefined(config.onBlur) ? [h.OnBlur(config.onBlur)] : []),
]

const contextPositionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'contextPoint'>,
  positioner: Menu.MenuPartAttributes<Message>,
): Menu.MenuPartAttributes<Message> => {
  if (!positioner.isMounted) {
    return positioner
  }

  const point = currentPoint(config)

  return {
    ...positioner,
    root: [
      ...positioner.root.filter(attribute => attribute._tag !== 'Style'),
      h.DataAttribute('anchor', 'context-point'),
      h.DataAttribute('anchor-x', String(point.clientX)),
      h.DataAttribute('anchor-y', String(point.clientY)),
      h.Style({
        position: 'fixed',
        left: `${point.clientX}px`,
        top: `${point.clientY}px`,
        inset: 'auto',
        margin: '0',
      }),
    ],
  }
}

const movedAwayFromInitialPoint = <Message>(
  config: Pick<ViewConfig<Message>, 'contextPoint'>,
  screenX: number,
  screenY: number,
): boolean => {
  if (config.contextPoint === undefined) {
    return false
  }

  return (
    Math.abs(screenX - config.contextPoint.screenX) > pointerMoveTolerance ||
    Math.abs(screenY - config.contextPoint.screenY) > pointerMoveTolerance
  )
}

const itemActionMessage = <Message>(
  config: Pick<
    ViewConfig<Message>,
    | 'contextPoint'
    | 'isDisabled'
    | 'onCheckedChange'
    | 'onItemPress'
    | 'onOpenChange'
    | 'onRadioValueChange'
  >,
  item: MenuItemDescriptor,
): Option.Option<Message> => {
  if (config.isDisabled === true || item.isDisabled === true) {
    return Option.none()
  }

  const kind = Menu.itemKind(item)

  if (kind === 'checkbox' && Predicate.isNotUndefined(config.onCheckedChange)) {
    return Option.some(config.onCheckedChange(Menu.checkedChange(item)))
  }

  if (kind === 'radio' && Predicate.isNotUndefined(config.onRadioValueChange)) {
    return Option.some(config.onRadioValueChange(Menu.radioValueChange(item)))
  }

  if (kind === 'submenu-trigger') {
    return openMessage(
      config,
      openChange(true, 'submenu-open', currentPoint(config), item.value),
    )
  }

  return Predicate.isNotUndefined(config.onItemPress)
    ? Option.some(config.onItemPress(Menu.itemPress(item)))
    : Option.none()
}

const pointerUpMessage = <Message>(
  config: ViewConfig<Message>,
  item: MenuItemDescriptor,
  screenX: number,
  screenY: number,
  pointerType: string,
): Option.Option<Message> => {
  if (
    (config.platform ?? defaultPlatform) !== 'mac' ||
    pointerType !== 'mouse'
  ) {
    return Option.none()
  }

  return movedAwayFromInitialPoint(config, screenX, screenY)
    ? itemActionMessage(config, item)
    : Option.none()
}

const contextItemAttributes = <Message>(
  config: ViewConfig<Message>,
  itemAttributes: Menu.MenuItemAttributes<Message>,
): MenuItemAttributes<Message> => ({
  ...itemAttributes,
  root: [
    ...itemAttributes.root,
    html<Message>().OnPointerUp((screenX, screenY, pointerType) =>
      pointerUpMessage(
        config,
        itemAttributes.item,
        screenX,
        screenY,
        pointerType,
      ),
    ),
  ],
})

const contextPopupAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  popup: Menu.MenuPopupAttributes<Message>,
): MenuPopupAttributes<Message> => ({
  ...popup,
  positioner:
    popup.parentValue === undefined
      ? contextPositionerAttributes(h, config, popup.positioner)
      : popup.positioner,
  items: popup.items.map(itemAttributes =>
    contextItemAttributes(config, itemAttributes),
  ),
})

const contextAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  attributes: Menu.MenuAttributes<Message>,
): MenuAttributes<Message> => ({
  ...attributes,
  root: [...attributes.root, h.DataAttribute('context-menu', '')],
  trigger: triggerAttributes(h, config),
  popup: contextPopupAttributes(h, config, attributes.popup),
  submenus: attributes.submenus.map(popup =>
    contextPopupAttributes(h, config, popup),
  ),
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const { toView, onOpenChange, ...menuConfig } = config
  const toContextView = (attributes: Menu.MenuAttributes<Message>): Html =>
    toView(contextAttributes(h, config, attributes))

  return onOpenChange === undefined
    ? Menu.view<Message>({
        ...menuConfig,
        toView: toContextView,
      })
    : Menu.view<Message>({
        ...menuConfig,
        onOpenChange: change =>
          onOpenChange(
            openChange(
              change.open,
              change.reason,
              currentPoint(config),
              change.parentValue,
            ),
          ),
        toView: toContextView,
      })
}
