import { Array as EffectArray, Match as M, Option, Schema as S } from 'effect'
import type { Command } from 'foldkit'
import type { Attribute, Html, KeyboardModifiers } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import { cn } from '../../../utils/cn'

// MODEL

export const ResizableOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type ResizableOrientation = typeof ResizableOrientation.Type

export const resizableOrientationValues: ReadonlyArray<ResizableOrientation> = [
  'horizontal',
  'vertical',
]

export const ResizableDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type ResizableDirection = typeof ResizableDirection.Type

export const ResizablePanelState = S.Struct({
  id: S.String,
  size: S.Number,
  minSize: S.Number,
  maxSize: S.Number,
  collapsedSize: S.Number,
  collapsible: S.Boolean,
  collapsed: S.Boolean,
})
export type ResizablePanelState = typeof ResizablePanelState.Type

export const ResizableActiveDrag = S.Struct({
  handleIndex: S.Number,
  startScreenX: S.Number,
  startScreenY: S.Number,
  startSizes: S.Array(S.Number),
})
export type ResizableActiveDrag = typeof ResizableActiveDrag.Type

export const ResizableState = S.Struct({
  orientation: ResizableOrientation,
  dir: ResizableDirection,
  panels: S.Array(ResizablePanelState),
  maybeActiveDrag: S.Option(ResizableActiveDrag),
})
export type ResizableState = typeof ResizableState.Type

export const ResizablePanelOptions = S.Struct({
  id: S.String,
  defaultSize: S.optional(S.Number),
  minSize: S.optional(S.Number),
  maxSize: S.optional(S.Number),
  collapsedSize: S.optional(S.Number),
  collapsible: S.optional(S.Boolean),
})
export type ResizablePanelOptions = typeof ResizablePanelOptions.Type

export const ResizableStateOptions = S.Struct({
  orientation: S.optional(ResizableOrientation),
  dir: S.optional(ResizableDirection),
  panels: S.Array(ResizablePanelOptions),
})
export type ResizableStateOptions = typeof ResizableStateOptions.Type

const defaultMinSize = 10
const defaultMaxSize = 100
const defaultCollapsedSize = 0
const defaultKeyboardStep = 10
const defaultGroupSizePx = 400

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

const safePanelSize = (size: number | undefined, fallback: number): number =>
  size === undefined || !Number.isFinite(size) ? fallback : size

const constrainedPanel = (
  panel: ResizablePanelOptions,
  fallbackSize: number,
): ResizablePanelState => {
  const minSize = clamp(safePanelSize(panel.minSize, defaultMinSize), 0, 100)
  const maxSize = clamp(
    safePanelSize(panel.maxSize, defaultMaxSize),
    minSize,
    100,
  )
  const collapsedSize = clamp(
    safePanelSize(panel.collapsedSize, defaultCollapsedSize),
    0,
    maxSize,
  )
  const preferredSize = clamp(
    safePanelSize(panel.defaultSize, fallbackSize),
    panel.collapsible === true ? collapsedSize : minSize,
    maxSize,
  )

  return {
    id: panel.id,
    size: preferredSize,
    minSize,
    maxSize,
    collapsedSize,
    collapsible: panel.collapsible === true,
    collapsed: panel.collapsible === true && preferredSize <= collapsedSize,
  }
}

const totalSize = (panels: ReadonlyArray<Pick<ResizablePanelState, 'size'>>) =>
  panels.reduce((total, panel) => total + panel.size, 0)

const normalizedTotalSizes = (
  panels: ReadonlyArray<ResizablePanelState>,
): ReadonlyArray<number> => {
  const total = totalSize(panels)

  if (panels.length === 0) {
    return []
  }

  if (total === 100) {
    return panels.map(panel => panel.size)
  }

  if (total <= 0) {
    return panels.map(() => 100 / panels.length)
  }

  return panels.map(panel => (panel.size * 100) / total)
}

export const normalizePanels = (
  panels: ReadonlyArray<ResizablePanelOptions>,
): ReadonlyArray<ResizablePanelState> => {
  const fallbackSize = panels.length === 0 ? 100 : 100 / panels.length
  const constrainedPanels = panels.map(panel =>
    constrainedPanel(panel, fallbackSize),
  )
  const sizes = normalizedTotalSizes(constrainedPanels)

  return constrainedPanels.map((panel, index) => {
    const normalizedSize = clamp(
      sizes[index] ?? panel.size,
      panel.collapsible ? panel.collapsedSize : panel.minSize,
      panel.maxSize,
    )

    return {
      ...panel,
      size: Number(normalizedSize.toFixed(6)),
      collapsed: panel.collapsible && normalizedSize <= panel.collapsedSize,
    }
  })
}

export const resizableState = ({
  orientation = 'horizontal',
  dir = 'ltr',
  panels,
}: ResizableStateOptions): ResizableState => ({
  orientation,
  dir,
  panels: normalizePanels(panels),
  maybeActiveDrag: Option.none(),
})

const panelBounds = (
  panel: ResizablePanelState,
): Readonly<{
  minimum: number
  maximum: number
}> => ({
  minimum: panel.collapsible ? panel.collapsedSize : panel.minSize,
  maximum: panel.maxSize,
})

const handlePanelPair = (
  state: ResizableState,
  handleIndex: number,
): Option.Option<readonly [ResizablePanelState, ResizablePanelState]> => {
  const before = state.panels[handleIndex]
  const after = state.panels[handleIndex + 1]

  return before === undefined || after === undefined
    ? Option.none()
    : Option.some([before, after])
}

export const resizedPanels = (
  state: ResizableState,
  handleIndex: number,
  delta: number,
): ReadonlyArray<ResizablePanelState> =>
  Option.match(handlePanelPair(state, handleIndex), {
    onNone: () => state.panels,
    onSome: ([before, after]) => {
      const beforeBounds = panelBounds(before)
      const afterBounds = panelBounds(after)
      const nextBefore = clamp(
        before.size + delta,
        beforeBounds.minimum,
        beforeBounds.maximum,
      )
      const boundedDelta = nextBefore - before.size
      const nextAfter = clamp(
        after.size - boundedDelta,
        afterBounds.minimum,
        afterBounds.maximum,
      )
      const finalDelta = after.size - nextAfter

      return state.panels.map((panel, index) => {
        if (index === handleIndex) {
          const size = Number((before.size + finalDelta).toFixed(6))

          return {
            ...panel,
            size,
            collapsed: panel.collapsible && size <= panel.collapsedSize,
          }
        }

        if (index === handleIndex + 1) {
          const size = Number(nextAfter.toFixed(6))

          return {
            ...panel,
            size,
            collapsed: panel.collapsible && size <= panel.collapsedSize,
          }
        }

        return panel
      })
    },
  })

export const resizedState = (
  state: ResizableState,
  handleIndex: number,
  delta: number,
): ResizableState => ({
  ...state,
  panels: resizedPanels(state, handleIndex, delta),
})

export const collapsedPanelState = (
  state: ResizableState,
  panelIndex: number,
): ResizableState => {
  const panel = state.panels[panelIndex]

  if (panel === undefined || !panel.collapsible) {
    return state
  }

  const delta = panel.collapsedSize - panel.size
  const handleIndex =
    panelIndex < state.panels.length - 1 ? panelIndex : panelIndex - 1

  return panelIndex < state.panels.length - 1
    ? resizedState(state, handleIndex, delta)
    : resizedState(state, handleIndex, -delta)
}

// MESSAGE

export const StartedResizableDrag = m('StartedResizableDrag', {
  handleIndex: S.Number,
  screenX: S.Number,
  screenY: S.Number,
})
export const MovedResizablePointer = m('MovedResizablePointer', {
  screenX: S.Number,
  screenY: S.Number,
  groupSizePx: S.Number,
})
export const EndedResizableDrag = m('EndedResizableDrag')
export const PressedResizableKey = m('PressedResizableKey', {
  handleIndex: S.Number,
  key: S.String,
  shiftKey: S.Boolean,
})
export const ResizableMessage = S.Union([
  StartedResizableDrag,
  MovedResizablePointer,
  EndedResizableDrag,
  PressedResizableKey,
])
export type ResizableMessage = typeof ResizableMessage.Type

// UPDATE

export type UpdateReturn = readonly [
  ResizableState,
  ReadonlyArray<Command.Command<ResizableMessage>>,
]

const withUpdateReturn = M.withReturnType<UpdateReturn>()

const keyDelta = (
  state: Pick<ResizableState, 'dir' | 'orientation'>,
  key: string,
  shiftKey: boolean,
): Option.Option<number> => {
  const step = shiftKey ? defaultKeyboardStep * 2 : defaultKeyboardStep

  return M.value({ key, orientation: state.orientation, dir: state.dir }).pipe(
    M.withReturnType<Option.Option<number>>(),
    M.when({ key: 'ArrowLeft', orientation: 'horizontal', dir: 'ltr' }, () =>
      Option.some(-step),
    ),
    M.when({ key: 'ArrowRight', orientation: 'horizontal', dir: 'ltr' }, () =>
      Option.some(step),
    ),
    M.when({ key: 'ArrowLeft', orientation: 'horizontal', dir: 'rtl' }, () =>
      Option.some(step),
    ),
    M.when({ key: 'ArrowRight', orientation: 'horizontal', dir: 'rtl' }, () =>
      Option.some(-step),
    ),
    M.when({ key: 'ArrowUp', orientation: 'vertical' }, () =>
      Option.some(-step),
    ),
    M.when({ key: 'ArrowDown', orientation: 'vertical' }, () =>
      Option.some(step),
    ),
    M.when({ key: 'Home' }, () => Option.some(-100)),
    M.when({ key: 'End' }, () => Option.some(100)),
    M.orElse(() => Option.none()),
  )
}

const pointerDelta = (
  state: Pick<ResizableState, 'dir' | 'orientation'>,
  drag: ResizableActiveDrag,
  screenX: number,
  screenY: number,
  groupSizePx: number,
): number => {
  const size = Math.max(1, groupSizePx)
  const rawDelta =
    state.orientation === 'vertical'
      ? screenY - drag.startScreenY
      : screenX - drag.startScreenX
  const directionalDelta =
    state.orientation === 'horizontal' && state.dir === 'rtl'
      ? -rawDelta
      : rawDelta

  return (directionalDelta / size) * 100
}

const draggedState = (
  state: ResizableState,
  drag: ResizableActiveDrag,
  screenX: number,
  screenY: number,
  groupSizePx: number,
): ResizableState => {
  const baseState = {
    ...state,
    panels: state.panels.map((panel, index) => ({
      ...panel,
      size: drag.startSizes[index] ?? panel.size,
    })),
  }

  return resizedState(
    baseState,
    drag.handleIndex,
    pointerDelta(state, drag, screenX, screenY, groupSizePx),
  )
}

export const update = (
  state: ResizableState,
  message: ResizableMessage,
): UpdateReturn =>
  M.value(message).pipe(
    withUpdateReturn,
    M.tagsExhaustive({
      StartedResizableDrag: ({ handleIndex, screenX, screenY }) => [
        {
          ...state,
          maybeActiveDrag: Option.some({
            handleIndex,
            startScreenX: screenX,
            startScreenY: screenY,
            startSizes: state.panels.map(panel => panel.size),
          }),
        },
        [],
      ],
      MovedResizablePointer: ({ screenX, screenY, groupSizePx }) => [
        Option.match(state.maybeActiveDrag, {
          onNone: () => state,
          onSome: drag =>
            draggedState(state, drag, screenX, screenY, groupSizePx),
        }),
        [],
      ],
      EndedResizableDrag: () => [
        { ...state, maybeActiveDrag: Option.none() },
        [],
      ],
      PressedResizableKey: ({ handleIndex, key, shiftKey }) => [
        Option.match(keyDelta(state, key, shiftKey), {
          onNone: () => state,
          onSome: delta => resizedState(state, handleIndex, delta),
        }),
        [],
      ],
    }),
  )

// VIEW

type Child = Html | string

export const ResizableStyleOptions = S.Struct({
  className: S.optional(S.String),
  panelClassName: S.optional(S.String),
  handleClassName: S.optional(S.String),
  handleIconClassName: S.optional(S.String),
})
export type ResizableStyleOptions = typeof ResizableStyleOptions.Type

export type ResizablePanelConfig<Message> = ResizablePanelOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    className?: string
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type ResizablePanelAttributes<Message> = Readonly<{
  panel: ResizablePanelConfig<Message>
  state: ResizablePanelState
  root: ReadonlyArray<Attribute<Message>>
}>

export type ResizableHandleAttributes<Message> = Readonly<{
  handleIndex: number
  root: ReadonlyArray<Attribute<Message>>
  icon: ReadonlyArray<Attribute<Message>>
}>

export type ResizableAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  panels: ReadonlyArray<ResizablePanelAttributes<Message>>
  handles: ReadonlyArray<ResizableHandleAttributes<Message>>
}>

export type ViewConfig<Message> = ResizableStyleOptions &
  Readonly<{
    state: ResizableState
    panels: ReadonlyArray<ResizablePanelConfig<Message>>
    toMessage?: (message: ResizableMessage) => Message
    toView?: (attributes: ResizableAttributes<Message>) => Html
    groupSizePx?: number
    withHandle?: boolean
  }>

export const resizablePanelGroupBaseClassName =
  'flex h-full w-full aria-[orientation=vertical]:flex-col'

export const resizableHandleBaseClassName =
  'relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90'

export const resizableHandleRtlBaseClassName =
  'relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:start-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:start-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 rtl:after:translate-x-1/2 rtl:aria-[orientation=horizontal]:after:-translate-x-0 [&[aria-orientation=horizontal]>div]:rotate-90'

export const resizableHandleIconBaseClassName =
  'z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border'

export const resizablePanelGroupClassName = ({
  className,
}: Pick<ResizableStyleOptions, 'className'> = {}): string =>
  cn(resizablePanelGroupBaseClassName, className)

export const resizablePanelClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string => cn(className)

export const resizableHandleClassName = ({
  className,
  dir,
}: Readonly<{
  className?: string | undefined
  dir?: ResizableDirection | undefined
}> = {}): string =>
  cn(
    dir === 'rtl'
      ? resizableHandleRtlBaseClassName
      : resizableHandleBaseClassName,
    className,
  )

export const resizableHandleIconClassName = ({
  className,
}: Readonly<{ className?: string | undefined }> = {}): string =>
  cn(resizableHandleIconBaseClassName, className)

const optionalDir = <Message>(
  h: ReturnType<typeof html<Message>>,
  dir: ResizableDirection,
): ReadonlyArray<Attribute<Message>> => (dir === 'ltr' ? [] : [h.Dir(dir)])

const orientationForHandle = (orientation: ResizableOrientation): string =>
  orientation === 'horizontal' ? 'vertical' : 'horizontal'

const hasKeyboardModifier = (modifiers: KeyboardModifiers): boolean =>
  modifiers.altKey || modifiers.ctrlKey || modifiers.metaKey

const pointerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'groupSizePx' | 'toMessage'>,
  state: ResizableState,
): ReadonlyArray<Attribute<Message>> => {
  const { toMessage } = config

  if (toMessage === undefined || Option.isNone(state.maybeActiveDrag)) {
    return []
  }

  return [
    h.OnPointerMove((screenX, screenY) =>
      Option.some(
        toMessage(
          MovedResizablePointer({
            screenX,
            screenY,
            groupSizePx: config.groupSizePx ?? defaultGroupSizePx,
          }),
        ),
      ),
    ),
    h.OnPointerUp(() => Option.some(toMessage(EndedResizableDrag()))),
    h.OnPointerLeave(() => Option.some(toMessage(EndedResizableDrag()))),
  ]
}

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('group'),
  h.DataAttribute('slot', 'resizable-panel-group'),
  h.AriaOrientation(config.state.orientation),
  h.Class(resizablePanelGroupClassName({ className: config.className })),
  ...optionalDir(h, config.state.dir),
  ...pointerAttributes(h, config, config.state),
]

export const panelStyle = (state: Pick<ResizablePanelState, 'size'>): string =>
  `flex-basis: ${state.size}%;`

const panelAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  panel: ResizablePanelConfig<Message>,
  state: ResizablePanelState,
): ResizablePanelAttributes<Message> => ({
  panel,
  state,
  root: [
    h.DataAttribute('slot', 'resizable-panel'),
    h.Attribute('style', panelStyle(state)),
    h.Class(
      resizablePanelClassName({
        className: cn(config.panelClassName, panel.className),
      }),
    ),
    ...(panel.attributes ?? []),
  ],
})

const handleKeyboardAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  handleIndex: number,
): ReadonlyArray<Attribute<Message>> => {
  const { toMessage } = config

  if (toMessage === undefined) {
    return []
  }

  return [
    h.OnKeyDownPreventDefault((key, modifiers) => {
      if (hasKeyboardModifier(modifiers)) {
        return Option.none()
      }

      return Option.match(keyDelta(config.state, key, modifiers.shiftKey), {
        onNone: () => Option.none(),
        onSome: () =>
          Option.some(
            toMessage(
              PressedResizableKey({
                handleIndex,
                key,
                shiftKey: modifiers.shiftKey,
              }),
            ),
          ),
      })
    }),
  ]
}

const handlePointerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  handleIndex: number,
): ReadonlyArray<Attribute<Message>> => {
  const { toMessage } = config

  if (toMessage === undefined) {
    return []
  }

  return [
    h.OnPointerDown((_pointerType, button, screenX, screenY) =>
      button === 0
        ? Option.some(
            toMessage(StartedResizableDrag({ handleIndex, screenX, screenY })),
          )
        : Option.none(),
    ),
  ]
}

const handleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  handleIndex: number,
): ResizableHandleAttributes<Message> => {
  const before = config.state.panels[handleIndex]
  const after = config.state.panels[handleIndex + 1]
  const current = before?.size ?? 0

  return {
    handleIndex,
    root: [
      h.DataAttribute('slot', 'resizable-handle'),
      h.Role('separator'),
      h.Tabindex(0),
      h.AriaOrientation(orientationForHandle(config.state.orientation)),
      h.AriaValuemin(before?.minSize ?? 0),
      h.AriaValuemax(after === undefined ? 100 : 100 - after.minSize),
      h.AriaValuenow(current),
      h.Class(
        resizableHandleClassName({
          className: config.handleClassName,
          dir: config.state.dir,
        }),
      ),
      ...handleKeyboardAttributes(h, config, handleIndex),
      ...handlePointerAttributes(h, config, handleIndex),
    ],
    icon: [
      h.Class(
        resizableHandleIconClassName({
          className: config.handleIconClassName,
        }),
      ),
    ],
  }
}

const handleCount = (panels: ReadonlyArray<ResizablePanelState>): number =>
  Math.max(0, panels.length - 1)

const attributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ResizableAttributes<Message> => ({
  root: rootAttributes(h, config),
  panels: config.panels.map((panel, index) =>
    panelAttributes(
      h,
      config,
      panel,
      config.state.panels[index] ??
        constrainedPanel(
          panel,
          config.panels.length === 0 ? 100 : 100 / config.panels.length,
        ),
    ),
  ),
  handles: EffectArray.makeBy(handleCount(config.state.panels), index =>
    handleAttributes(h, config, index),
  ),
})

const renderChildren = <Message>(
  panel: ResizablePanelConfig<Message>,
): ReadonlyArray<Child> => panel.children ?? []

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const resizableAttributes = attributes(h, config)

  if (config.toView !== undefined) {
    return config.toView(resizableAttributes)
  }

  return h.div(
    [...resizableAttributes.root],
    resizableAttributes.panels.flatMap((panel, index) => {
      const handle = resizableAttributes.handles[index]
      const panelNode = h.div([...panel.root], renderChildren(panel.panel))

      if (handle === undefined) {
        return [panelNode]
      }

      return [
        panelNode,
        h.div(
          [...handle.root],
          config.withHandle === true ? [h.div([...handle.icon], [])] : [],
        ),
      ]
    }),
  )
}
