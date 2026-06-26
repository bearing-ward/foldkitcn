import { Option, Predicate, Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const CollapsibleTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type CollapsibleTransitionStatus =
  typeof CollapsibleTransitionStatus.Type

export const CollapsibleChangeReason = S.Union([
  S.Literal('trigger-press'),
  S.Literal('none'),
])
export type CollapsibleChangeReason = typeof CollapsibleChangeReason.Type

export const CollapsibleOpenChange = S.Struct({
  open: S.Boolean,
  reason: CollapsibleChangeReason,
})
export type CollapsibleOpenChange = typeof CollapsibleOpenChange.Type

export const CollapsiblePanelGeometry = S.Struct({
  height: S.optional(S.Number),
  width: S.optional(S.Number),
})
export type CollapsiblePanelGeometry = typeof CollapsiblePanelGeometry.Type

export const CollapsiblePanelDescriptor = S.Struct({
  id: S.optional(S.String),
  label: S.optional(S.String),
  keepMounted: S.optional(S.Boolean),
  hiddenUntilFound: S.optional(S.Boolean),
  geometry: S.optional(CollapsiblePanelGeometry),
})
export type CollapsiblePanelDescriptor = typeof CollapsiblePanelDescriptor.Type

export const CollapsibleOptions = S.Struct({
  id: S.optional(S.String),
  open: S.Boolean,
  isDisabled: S.optional(S.Boolean),
  transitionStatus: S.optional(CollapsibleTransitionStatus),
  panel: S.optional(CollapsiblePanelDescriptor),
})
export type CollapsibleOptions = typeof CollapsibleOptions.Type

// UPDATE

export const openChange = (
  open: boolean,
  reason: CollapsibleChangeReason = 'none',
): CollapsibleOpenChange => ({
  open,
  reason,
})

export const triggerOpenChange = (open: boolean): CollapsibleOpenChange =>
  openChange(!open, 'trigger-press')

// VIEW

export type CollapsiblePanelAttributes<Message> = Readonly<{
  panel: CollapsiblePanelDescriptor
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
  isOpen: boolean
}>

export type CollapsibleAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  trigger: ReadonlyArray<Attribute<Message>>
  panel: CollapsiblePanelAttributes<Message>
}>

export type ViewConfig<Message> = CollapsibleOptions &
  Readonly<{
    toView: (attributes: CollapsibleAttributes<Message>) => Html
    onOpenChange?: (change: CollapsibleOpenChange) => Message
  }>

const activationKeys = new Set([' ', 'Enter'])
const defaultPanel: CollapsiblePanelDescriptor = {}

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Predicate.isNotUndefined(value) ? [toAttribute(value)] : []

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: CollapsibleTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const openStateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  open: boolean,
): ReadonlyArray<Attribute<Message>> =>
  open ? [h.DataAttribute('open', '')] : [h.DataAttribute('closed', '')]

const panelId = (
  config: Pick<CollapsibleOptions, 'id' | 'panel'>,
): string | undefined => config.panel?.id ?? config.id

const canActivate = (
  config: Pick<ViewConfig<unknown>, 'isDisabled' | 'onOpenChange'>,
): boolean =>
  config.isDisabled !== true && Predicate.isNotUndefined(config.onOpenChange)

const activationMessage = <Message>(
  config: ViewConfig<Message>,
): Option.Option<Message> => {
  if (!canActivate(config) || config.onOpenChange === undefined) {
    return Option.none()
  }

  return Option.some(config.onOpenChange(triggerOpenChange(config.open)))
}

const eventAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(activationMessage(config), {
    onNone: () => [],
    onSome: message => [
      h.OnClick(message),
      h.OnKeyDownPreventDefault(key =>
        activationKeys.has(key) ? Option.some(message) : Option.none(),
      ),
    ],
  })

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...openStateDataAttributes(h, config.open),
  ...transitionDataAttributes(h, config.transitionStatus),
]

const triggerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  h.AriaExpanded(config.open),
  ...optionalAttribute<Message>(
    config.open ? panelId(config) : undefined,
    value => h.AriaControls(value),
  ),
  ...booleanDataAttribute(h, 'panel-open', config.open),
  ...booleanDataAttribute(h, 'disabled', config.isDisabled),
  ...(config.isDisabled === true ? [h.AriaDisabled(true)] : []),
  ...transitionDataAttributes(h, config.transitionStatus),
  ...eventAttributes(h, config),
]

const panelStyle = (
  geometry: CollapsiblePanelGeometry | undefined,
): Record<string, string> => ({
  '--collapsible-panel-height':
    geometry?.height === undefined ? 'auto' : `${geometry.height}px`,
  '--collapsible-panel-width':
    geometry?.width === undefined ? 'auto' : `${geometry.width}px`,
})

const hiddenAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  panel: CollapsiblePanelDescriptor,
  open: boolean,
): ReadonlyArray<Attribute<Message>> => {
  if (open) {
    return []
  }

  return panel.hiddenUntilFound === true
    ? [h.Attribute('hidden', 'until-found')]
    : [h.Hidden(true)]
}

const panelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): CollapsiblePanelAttributes<Message> => {
  const panel = config.panel ?? defaultPanel
  const isMounted =
    config.open || panel.keepMounted === true || panel.hiddenUntilFound === true
  const attrs: ReadonlyArray<Attribute<Message>> = [
    ...optionalAttribute<Message>(panelId(config), value => h.Id(value)),
    ...hiddenAttributes(h, panel, config.open),
    h.Style(panelStyle(panel.geometry)),
    ...openStateDataAttributes(h, config.open),
    ...transitionDataAttributes(h, config.transitionStatus),
  ]

  return {
    panel,
    root: isMounted ? attrs : [],
    isMounted,
    isOpen: config.open,
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()

  return config.toView({
    root: rootAttributes(h, config),
    trigger: triggerAttributes(h, config),
    panel: panelAttributes(h, config),
  })
}
