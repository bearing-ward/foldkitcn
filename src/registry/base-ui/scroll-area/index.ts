import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

// MODEL

export const ScrollAreaOrientation = S.Union([
  S.Literal('horizontal'),
  S.Literal('vertical'),
])
export type ScrollAreaOrientation = typeof ScrollAreaOrientation.Type

export const ScrollAreaDirection = S.Union([S.Literal('ltr'), S.Literal('rtl')])
export type ScrollAreaDirection = typeof ScrollAreaDirection.Type

export const ScrollAreaSize = S.Struct({
  width: S.Number,
  height: S.Number,
})
export type ScrollAreaSize = typeof ScrollAreaSize.Type

export const ScrollAreaOverflowEdges = S.Struct({
  xStart: S.Boolean,
  xEnd: S.Boolean,
  yStart: S.Boolean,
  yEnd: S.Boolean,
})
export type ScrollAreaOverflowEdges = typeof ScrollAreaOverflowEdges.Type

export const ScrollAreaOverflowMetrics = S.Struct({
  xStart: S.Number,
  xEnd: S.Number,
  yStart: S.Number,
  yEnd: S.Number,
})
export type ScrollAreaOverflowMetrics = typeof ScrollAreaOverflowMetrics.Type

export const ScrollAreaOverflowEdgeThreshold = S.Union([
  S.Number,
  S.Struct({
    xStart: S.optional(S.Number),
    xEnd: S.optional(S.Number),
    yStart: S.optional(S.Number),
    yEnd: S.optional(S.Number),
  }),
])
export type ScrollAreaOverflowEdgeThreshold =
  typeof ScrollAreaOverflowEdgeThreshold.Type

export const ScrollAreaMetrics = S.Struct({
  viewportWidth: S.Number,
  viewportHeight: S.Number,
  contentWidth: S.Number,
  contentHeight: S.Number,
  scrollLeft: S.optional(S.Number),
  scrollTop: S.optional(S.Number),
  dir: S.optional(ScrollAreaDirection),
  overflowEdgeThreshold: S.optional(ScrollAreaOverflowEdgeThreshold),
  verticalTrackHeight: S.optional(S.Number),
  horizontalTrackWidth: S.optional(S.Number),
})
export type ScrollAreaMetrics = typeof ScrollAreaMetrics.Type

export const ScrollAreaStateOptions = S.Struct({
  scrollingX: S.optional(S.Boolean),
  scrollingY: S.optional(S.Boolean),
  isHovering: S.optional(S.Boolean),
  hasOverflowX: S.optional(S.Boolean),
  hasOverflowY: S.optional(S.Boolean),
  overflowXStart: S.optional(S.Boolean),
  overflowXEnd: S.optional(S.Boolean),
  overflowYStart: S.optional(S.Boolean),
  overflowYEnd: S.optional(S.Boolean),
  hasMeasuredScrollbar: S.optional(S.Boolean),
  cornerSize: S.optional(ScrollAreaSize),
  thumbSize: S.optional(ScrollAreaSize),
  overflowMetrics: S.optional(ScrollAreaOverflowMetrics),
})
export type ScrollAreaStateOptions = typeof ScrollAreaStateOptions.Type

export const ScrollAreaScrollbarDescriptor = S.Struct({
  orientation: S.optional(ScrollAreaOrientation),
  keepMounted: S.optional(S.Boolean),
})
export type ScrollAreaScrollbarDescriptor =
  typeof ScrollAreaScrollbarDescriptor.Type

export const ScrollAreaOptions = S.Struct({
  id: S.optional(S.String),
  rootId: S.optional(S.String),
  dir: S.optional(ScrollAreaDirection),
  state: S.optional(ScrollAreaStateOptions),
  scrollbars: S.optional(S.Array(ScrollAreaScrollbarDescriptor)),
})
export type ScrollAreaOptions = typeof ScrollAreaOptions.Type

export type ScrollAreaState = Readonly<{
  scrolling: boolean
  scrollingX: boolean
  scrollingY: boolean
  hovering: boolean
  hasOverflowX: boolean
  hasOverflowY: boolean
  overflowXStart: boolean
  overflowXEnd: boolean
  overflowYStart: boolean
  overflowYEnd: boolean
  cornerHidden: boolean
  hasMeasuredScrollbar: boolean
  cornerSize: ScrollAreaSize
  thumbSize: ScrollAreaSize
  overflowMetrics: ScrollAreaOverflowMetrics
}>

// UPDATE

export const minThumbSize = 16

const emptySize: ScrollAreaSize = { width: 0, height: 0 }
const emptyOverflowMetrics: ScrollAreaOverflowMetrics = {
  xStart: 0,
  xEnd: 0,
  yStart: 0,
  yEnd: 0,
}

const clamp = (value: number, min: number, max: number): number =>
  Math.max(min, Math.min(value, max))

const normalizedThreshold = (
  threshold: ScrollAreaOverflowEdgeThreshold | undefined,
): ScrollAreaOverflowMetrics => {
  if (typeof threshold === 'number') {
    const value = Math.max(0, threshold)

    return {
      xStart: value,
      xEnd: value,
      yStart: value,
      yEnd: value,
    }
  }

  return {
    xStart: Math.max(0, threshold?.xStart ?? 0),
    xEnd: Math.max(0, threshold?.xEnd ?? 0),
    yStart: Math.max(0, threshold?.yStart ?? 0),
    yEnd: Math.max(0, threshold?.yEnd ?? 0),
  }
}

const safeRatio = (viewportSize: number, contentSize: number): number =>
  contentSize <= 0 ? 0 : clamp(viewportSize / contentSize, 0, 1)

const thumbLength = (
  viewportSize: number,
  contentSize: number,
  trackSize: number,
): number =>
  contentSize <= viewportSize
    ? 0
    : Math.max(minThumbSize, trackSize * safeRatio(viewportSize, contentSize))

export const scrollAreaState = (
  options: ScrollAreaStateOptions = {},
): ScrollAreaState => {
  const scrollingX = options.scrollingX ?? false
  const scrollingY = options.scrollingY ?? false
  const hasOverflowX = options.hasOverflowX ?? false
  const hasOverflowY = options.hasOverflowY ?? false

  return {
    scrolling: scrollingX || scrollingY,
    scrollingX,
    scrollingY,
    hovering: options.isHovering ?? false,
    hasOverflowX,
    hasOverflowY,
    overflowXStart: options.overflowXStart ?? false,
    overflowXEnd: options.overflowXEnd ?? hasOverflowX,
    overflowYStart: options.overflowYStart ?? false,
    overflowYEnd: options.overflowYEnd ?? hasOverflowY,
    cornerHidden: !(hasOverflowX && hasOverflowY),
    hasMeasuredScrollbar: options.hasMeasuredScrollbar ?? true,
    cornerSize: options.cornerSize ?? emptySize,
    thumbSize: options.thumbSize ?? emptySize,
    overflowMetrics: options.overflowMetrics ?? emptyOverflowMetrics,
  }
}

export const scrollAreaStateFromMetrics = (
  metrics: ScrollAreaMetrics,
): ScrollAreaState => {
  const dir = metrics.dir ?? 'ltr'
  const scrollLeft = metrics.scrollLeft ?? 0
  const scrollTop = metrics.scrollTop ?? 0
  const maxScrollLeft = Math.max(
    0,
    metrics.contentWidth - metrics.viewportWidth,
  )
  const maxScrollTop = Math.max(
    0,
    metrics.contentHeight - metrics.viewportHeight,
  )
  const hasOverflowX = maxScrollLeft > 0
  const hasOverflowY = maxScrollTop > 0
  const scrollLeftFromStart = hasOverflowX
    ? clamp(dir === 'rtl' ? -scrollLeft : scrollLeft, 0, maxScrollLeft)
    : 0
  const scrollTopFromStart = hasOverflowY
    ? clamp(scrollTop, 0, maxScrollTop)
    : 0
  const overflowMetrics: ScrollAreaOverflowMetrics = {
    xStart: scrollLeftFromStart,
    xEnd: hasOverflowX ? maxScrollLeft - scrollLeftFromStart : 0,
    yStart: scrollTopFromStart,
    yEnd: hasOverflowY ? maxScrollTop - scrollTopFromStart : 0,
  }
  const threshold = normalizedThreshold(metrics.overflowEdgeThreshold)

  return scrollAreaState({
    hasOverflowX,
    hasOverflowY,
    overflowXStart: hasOverflowX && overflowMetrics.xStart > threshold.xStart,
    overflowXEnd: hasOverflowX && overflowMetrics.xEnd > threshold.xEnd,
    overflowYStart: hasOverflowY && overflowMetrics.yStart > threshold.yStart,
    overflowYEnd: hasOverflowY && overflowMetrics.yEnd > threshold.yEnd,
    cornerSize: hasOverflowX && hasOverflowY ? emptySize : emptySize,
    thumbSize: {
      width: thumbLength(
        metrics.viewportWidth,
        metrics.contentWidth,
        metrics.horizontalTrackWidth ?? metrics.viewportWidth,
      ),
      height: thumbLength(
        metrics.viewportHeight,
        metrics.contentHeight,
        metrics.verticalTrackHeight ?? metrics.viewportHeight,
      ),
    },
    overflowMetrics,
  })
}

export const trackPressScrollOffset = (config: {
  readonly orientation: ScrollAreaOrientation
  readonly pointerOffset: number
  readonly thumbSize: number
  readonly trackSize: number
  readonly viewportSize: number
  readonly contentSize: number
  readonly dir?: ScrollAreaDirection
}): number => {
  const maxScroll = Math.max(0, config.contentSize - config.viewportSize)
  const maxThumbOffset = Math.max(0, config.trackSize - config.thumbSize)
  const pointerOffset = clamp(
    config.pointerOffset - config.thumbSize / 2,
    0,
    maxThumbOffset,
  )
  const ratio = maxThumbOffset === 0 ? 0 : pointerOffset / maxThumbOffset
  const scrollOffset = ratio * maxScroll

  return config.orientation === 'horizontal' && config.dir === 'rtl'
    ? -scrollOffset
    : scrollOffset
}

export const thumbDragScrollOffset = (config: {
  readonly startScrollOffset: number
  readonly pointerDelta: number
  readonly thumbSize: number
  readonly trackSize: number
  readonly viewportSize: number
  readonly contentSize: number
  readonly dir?: ScrollAreaDirection
}): number => {
  const maxScroll = Math.max(0, config.contentSize - config.viewportSize)
  const maxThumbOffset = Math.max(0, config.trackSize - config.thumbSize)
  const ratio = maxThumbOffset === 0 ? 0 : config.pointerDelta / maxThumbOffset
  const directionMultiplier = config.dir === 'rtl' ? -1 : 1

  return clamp(
    config.startScrollOffset + ratio * maxScroll * directionMultiplier,
    config.dir === 'rtl' ? -maxScroll : 0,
    config.dir === 'rtl' ? 0 : maxScroll,
  )
}

// VIEW

export type ScrollAreaScrollbarAttributes<Message> = Readonly<{
  orientation: ScrollAreaOrientation
  root: ReadonlyArray<Attribute<Message>>
  thumb: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
}>

type ResolvedScrollAreaScrollbarDescriptor = Readonly<{
  orientation: ScrollAreaOrientation
  keepMounted: boolean
}>

export type ScrollAreaCornerAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
}>

export type ScrollAreaAttributes<Message> = Readonly<{
  state: ScrollAreaState
  root: ReadonlyArray<Attribute<Message>>
  viewport: ReadonlyArray<Attribute<Message>>
  content: ReadonlyArray<Attribute<Message>>
  scrollbars: ReadonlyArray<ScrollAreaScrollbarAttributes<Message>>
  corner: ScrollAreaCornerAttributes<Message>
}>

export type ViewConfig<Message> = ScrollAreaOptions &
  Readonly<{
    metrics?: ScrollAreaMetrics
    children?: ReadonlyArray<Html | string>
    toView: (attributes: ScrollAreaAttributes<Message>) => Html
  }>

const defaultScrollbars: ReadonlyArray<ScrollAreaScrollbarDescriptor> = [
  { orientation: 'vertical' },
]

const optionalAttribute = <Message>(
  value: string | undefined,
  toAttribute: (value: string) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  value === undefined ? [] : [toAttribute(value)]

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean,
): ReadonlyArray<Attribute<Message>> =>
  value ? [h.DataAttribute(name, '')] : []

const overflowDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: ScrollAreaState,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanDataAttribute(h, 'has-overflow-x', state.hasOverflowX),
  ...booleanDataAttribute(h, 'has-overflow-y', state.hasOverflowY),
  ...booleanDataAttribute(h, 'overflow-x-start', state.overflowXStart),
  ...booleanDataAttribute(h, 'overflow-x-end', state.overflowXEnd),
  ...booleanDataAttribute(h, 'overflow-y-start', state.overflowYStart),
  ...booleanDataAttribute(h, 'overflow-y-end', state.overflowYEnd),
]

const stateDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: ScrollAreaState,
): ReadonlyArray<Attribute<Message>> => [
  ...booleanDataAttribute(h, 'scrolling', state.scrolling),
  ...overflowDataAttributes(h, state),
]

const scrollDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: ScrollAreaState,
  orientation: ScrollAreaOrientation,
): ReadonlyArray<Attribute<Message>> =>
  booleanDataAttribute(
    h,
    'scrolling',
    orientation === 'horizontal' ? state.scrollingX : state.scrollingY,
  )

const rootStyle = (
  state: ScrollAreaState,
): Readonly<Record<string, string>> => ({
  position: 'relative',
  '--scroll-area-corner-height': `${state.cornerSize.height}px`,
  '--scroll-area-corner-width': `${state.cornerSize.width}px`,
})

const viewportStyle = (
  state: ScrollAreaState,
): Readonly<Record<string, string>> => ({
  overflow: 'scroll',
  '--scroll-area-overflow-x-start': `${state.overflowMetrics.xStart}px`,
  '--scroll-area-overflow-x-end': `${state.overflowMetrics.xEnd}px`,
  '--scroll-area-overflow-y-start': `${state.overflowMetrics.yStart}px`,
  '--scroll-area-overflow-y-end': `${state.overflowMetrics.yEnd}px`,
})

const cssPropertyName = (property: string): string =>
  property.replaceAll(/[A-Z]/gu, match => `-${match.toLowerCase()}`)

const styleText = (style: Readonly<Record<string, string>>): string =>
  Object.entries(style)
    .map(([property, value]) => `${cssPropertyName(property)}: ${value};`)
    .join(' ')

const styleAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  style: Readonly<Record<string, string>>,
): Attribute<Message> => h.Attribute('style', styleText(style))

const scrollbarStyle = (
  state: ScrollAreaState,
  descriptor: ResolvedScrollAreaScrollbarDescriptor,
): Readonly<Record<string, string>> => {
  const visibility =
    state.hasMeasuredScrollbar || descriptor.keepMounted
      ? {}
      : { visibility: 'hidden' }

  if (descriptor.orientation === 'horizontal') {
    return {
      position: 'absolute',
      touchAction: 'none',
      userSelect: 'none',
      insetInlineStart: '0px',
      insetInlineEnd: 'var(--scroll-area-corner-width)',
      bottom: '0px',
      '--scroll-area-thumb-width': `${state.thumbSize.width}px`,
      ...visibility,
    }
  }

  return {
    position: 'absolute',
    touchAction: 'none',
    userSelect: 'none',
    top: '0px',
    bottom: 'var(--scroll-area-corner-height)',
    insetInlineEnd: '0px',
    '--scroll-area-thumb-height': `${state.thumbSize.height}px`,
    ...visibility,
  }
}

const thumbStyle = (
  state: ScrollAreaState,
  orientation: ScrollAreaOrientation,
): Readonly<Record<string, string>> => {
  const visibility = state.hasMeasuredScrollbar ? {} : { visibility: 'hidden' }

  return orientation === 'horizontal'
    ? {
        width: 'var(--scroll-area-thumb-width)',
        transform: 'translate3d(0px, 0px, 0px)',
        ...visibility,
      }
    : {
        height: 'var(--scroll-area-thumb-height)',
        transform: 'translate3d(0px, 0px, 0px)',
        ...visibility,
      }
}

const cornerStyle = (
  state: ScrollAreaState,
): Readonly<Record<string, string>> => ({
  position: 'absolute',
  bottom: '0',
  insetInlineEnd: '0',
  width: `${state.cornerSize.width}px`,
  height: `${state.cornerSize.height}px`,
})

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'id' | 'dir'>,
  state: ScrollAreaState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('presentation'),
  ...optionalAttribute<Message>(config.id, value => h.Id(value)),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
  styleAttribute(h, rootStyle(state)),
  ...stateDataAttributes(h, state),
]

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'rootId'>,
  state: ScrollAreaState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('presentation'),
  ...(config.rootId === undefined
    ? []
    : [h.Attribute('data-id', `${config.rootId}-viewport`)]),
  h.Attribute(
    'tabindex',
    String(state.hasOverflowX || state.hasOverflowY ? 0 : -1),
  ),
  styleAttribute(h, viewportStyle(state)),
  ...stateDataAttributes(h, state),
]

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: ScrollAreaState,
): ReadonlyArray<Attribute<Message>> => [
  h.Role('presentation'),
  styleAttribute(h, { minWidth: 'fit-content' }),
  ...stateDataAttributes(h, state),
]

const isScrollbarMounted = (
  state: ScrollAreaState,
  descriptor: ResolvedScrollAreaScrollbarDescriptor,
): boolean =>
  descriptor.keepMounted ||
  (descriptor.orientation === 'horizontal'
    ? state.hasOverflowX
    : state.hasOverflowY)

const scrollbarAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: Pick<ViewConfig<Message>, 'rootId'>,
  state: ScrollAreaState,
  descriptor: ScrollAreaScrollbarDescriptor,
): ScrollAreaScrollbarAttributes<Message> => {
  const resolvedDescriptor: ResolvedScrollAreaScrollbarDescriptor = {
    orientation: descriptor.orientation ?? 'vertical',
    keepMounted: descriptor.keepMounted ?? false,
  }
  const isMounted = isScrollbarMounted(state, resolvedDescriptor)
  const root = isMounted
    ? [
        ...(config.rootId === undefined
          ? []
          : [h.Attribute('data-id', `${config.rootId}-scrollbar`)]),
        h.DataAttribute('orientation', resolvedDescriptor.orientation),
        ...booleanDataAttribute(h, 'hovering', state.hovering),
        ...scrollDataAttribute(h, state, resolvedDescriptor.orientation),
        ...overflowDataAttributes(h, state),
        styleAttribute(h, scrollbarStyle(state, resolvedDescriptor)),
      ]
    : []
  const thumb = isMounted
    ? [
        h.DataAttribute('orientation', resolvedDescriptor.orientation),
        ...scrollDataAttribute(h, state, resolvedDescriptor.orientation),
        styleAttribute(h, thumbStyle(state, resolvedDescriptor.orientation)),
      ]
    : []

  return {
    orientation: resolvedDescriptor.orientation,
    root,
    thumb,
    isMounted,
  }
}

const cornerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  state: ScrollAreaState,
): ScrollAreaCornerAttributes<Message> => {
  const isMounted = !state.cornerHidden

  return {
    root: isMounted ? [styleAttribute(h, cornerStyle(state))] : [],
    isMounted,
  }
}

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const state =
    config.metrics === undefined
      ? scrollAreaState(config.state)
      : scrollAreaStateFromMetrics(config.metrics)
  const scrollbars = (config.scrollbars ?? defaultScrollbars).map(descriptor =>
    scrollbarAttributes(h, config, state, descriptor),
  )

  return config.toView({
    state,
    root: rootAttributes(h, config, state),
    viewport: viewportAttributes(h, config, state),
    content: contentAttributes(h, state),
    scrollbars,
    corner: cornerAttributes(h, state),
  })
}
