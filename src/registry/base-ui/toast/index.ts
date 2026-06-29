import {
  Array as EffectArray,
  Match as M,
  Option,
  Predicate,
  Schema as S,
} from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { ts } from 'foldkit/schema'

// MODEL

export const ToastPriority = S.Union([S.Literal('low'), S.Literal('high')])
export type ToastPriority = typeof ToastPriority.Type

export const ToastTransitionStatus = S.Union([
  S.Literal('idle'),
  S.Literal('starting'),
  S.Literal('ending'),
])
export type ToastTransitionStatus = typeof ToastTransitionStatus.Type

export const ToastSide = S.Union([
  S.Literal('bottom'),
  S.Literal('top'),
  S.Literal('right'),
  S.Literal('left'),
  S.Literal('inline-start'),
  S.Literal('inline-end'),
])
export type ToastSide = typeof ToastSide.Type

export const ToastAlign = S.Union([
  S.Literal('start'),
  S.Literal('center'),
  S.Literal('end'),
])
export type ToastAlign = typeof ToastAlign.Type

export const ToastViewportPosition = S.Union([
  S.Literal('top-left'),
  S.Literal('top-center'),
  S.Literal('top-right'),
  S.Literal('bottom-left'),
  S.Literal('bottom-center'),
  S.Literal('bottom-right'),
])
export type ToastViewportPosition = typeof ToastViewportPosition.Type

export const ToastSwipeDirection = S.Union([
  S.Literal('up'),
  S.Literal('down'),
  S.Literal('left'),
  S.Literal('right'),
])
export type ToastSwipeDirection = typeof ToastSwipeDirection.Type

export const ToastSwipeStatus = S.Union([
  S.Literal('idle'),
  S.Literal('swiping'),
  S.Literal('dismissed'),
])
export type ToastSwipeStatus = typeof ToastSwipeStatus.Type

export const ToastTimerStatus = S.Union([
  S.Literal('idle'),
  S.Literal('running'),
  S.Literal('paused'),
])
export type ToastTimerStatus = typeof ToastTimerStatus.Type

export const ToastPromiseLoading = ts('ToastPromiseLoading', {
  label: S.String,
})
export const ToastPromiseSucceeded = ts('ToastPromiseSucceeded', {
  title: S.optional(S.String),
  description: S.optional(S.String),
  duration: S.optional(S.Number),
})
export const ToastPromiseFailed = ts('ToastPromiseFailed', {
  title: S.optional(S.String),
  description: S.optional(S.String),
  duration: S.optional(S.Number),
})

export const ToastPromiseState = S.Union([
  ToastPromiseLoading,
  ToastPromiseSucceeded,
  ToastPromiseFailed,
])
export type ToastPromiseState = typeof ToastPromiseState.Type

export const ToastSwipeState = S.Struct({
  status: ToastSwipeStatus,
  direction: S.optional(ToastSwipeDirection),
  movementX: S.Number,
  movementY: S.Number,
})
export type ToastSwipeState = typeof ToastSwipeState.Type

export const ToastPosition = S.Struct({
  side: S.optional(ToastSide),
  align: S.optional(ToastAlign),
  sideOffset: S.optional(S.Number),
  alignOffset: S.optional(S.Number),
  collisionAvoidance: S.optional(S.Boolean),
  collisionPadding: S.optional(S.Number),
  arrowPadding: S.optional(S.Number),
  arrowWidth: S.optional(S.Number),
  arrowHeight: S.optional(S.Number),
  isAnchorHidden: S.optional(S.Boolean),
  isArrowUncentered: S.optional(S.Boolean),
  positionMethod: S.optional(
    S.Union([S.Literal('absolute'), S.Literal('fixed')]),
  ),
})
export type ToastPosition = typeof ToastPosition.Type

export const ToastItem = S.Struct({
  id: S.String,
  title: S.optional(S.String),
  description: S.optional(S.String),
  type: S.optional(S.String),
  priority: S.optional(ToastPriority),
  duration: S.optional(S.Number),
  remainingDuration: S.optional(S.Number),
  timerStatus: S.optional(ToastTimerStatus),
  transitionStatus: S.optional(ToastTransitionStatus),
  updateKey: S.optional(S.Number),
  limited: S.optional(S.Boolean),
  height: S.optional(S.Number),
  actionLabel: S.optional(S.String),
  position: S.optional(ToastPosition),
  swipe: S.optional(ToastSwipeState),
  promiseState: S.optional(ToastPromiseState),
})
export type ToastItem = typeof ToastItem.Type

export const ToastState = S.Struct({
  toasts: S.Array(ToastItem),
  limit: S.Number,
  defaultDuration: S.Number,
  isHovered: S.Boolean,
  isFocused: S.Boolean,
  isWindowFocused: S.Boolean,
  timersPaused: S.Boolean,
  nextId: S.Number,
})
export type ToastState = typeof ToastState.Type

export const ToastMetadata = S.Struct({
  id: S.String,
  domIndex: S.Number,
  visibleIndex: S.Number,
  offsetY: S.Number,
})
export type ToastMetadata = typeof ToastMetadata.Type

export const ToastCloseReason = S.Union([
  S.Literal('close-button'),
  S.Literal('escape-key'),
  S.Literal('timeout'),
  S.Literal('swipe'),
  S.Literal('manager-close'),
])
export type ToastCloseReason = typeof ToastCloseReason.Type

export const ToastCloseRequest = S.Struct({
  id: S.optional(S.String),
  reason: ToastCloseReason,
})
export type ToastCloseRequest = typeof ToastCloseRequest.Type

export const ToastActionPress = S.Struct({
  id: S.String,
})
export type ToastActionPress = typeof ToastActionPress.Type

export const ToastViewportInteractionType = S.Union([
  S.Literal('hover-start'),
  S.Literal('hover-end'),
  S.Literal('focus-start'),
  S.Literal('focus-end'),
  S.Literal('touch-start'),
  S.Literal('touch-end'),
  S.Literal('window-blur'),
  S.Literal('window-focus'),
])
export type ToastViewportInteractionType =
  typeof ToastViewportInteractionType.Type

export const ToastViewportInteraction = S.Struct({
  type: ToastViewportInteractionType,
})
export type ToastViewportInteraction = typeof ToastViewportInteraction.Type

export const ToastSwipePhase = S.Union([
  S.Literal('start'),
  S.Literal('move'),
  S.Literal('end'),
  S.Literal('cancel'),
])
export type ToastSwipePhase = typeof ToastSwipePhase.Type

export const ToastSwipeChange = S.Struct({
  id: S.String,
  phase: ToastSwipePhase,
  pointerType: S.String,
  x: S.Number,
  y: S.Number,
  timeStamp: S.optional(S.Number),
})
export type ToastSwipeChange = typeof ToastSwipeChange.Type

export type ToastStateOptions = Readonly<{
  toasts?: ReadonlyArray<ToastItem>
  limit?: number
  defaultDuration?: number
  isHovered?: boolean
  isFocused?: boolean
  isWindowFocused?: boolean
  timersPaused?: boolean
  nextId?: number
}>

export type ToastAddOptions = Readonly<{
  id?: string
  title?: string
  description?: string
  type?: string
  priority?: ToastPriority
  duration?: number
  actionLabel?: string
  position?: ToastPosition
  promiseState?: ToastPromiseState
}>

export type ToastUpdateOptions = Partial<
  Pick<
    ToastItem,
    | 'actionLabel'
    | 'description'
    | 'duration'
    | 'height'
    | 'position'
    | 'priority'
    | 'promiseState'
    | 'remainingDuration'
    | 'swipe'
    | 'timerStatus'
    | 'title'
    | 'transitionStatus'
    | 'type'
  >
>

export type ToastStateChange = Readonly<{
  id: string
  state: ToastState
}>

// UPDATE

const defaultDuration = 5000
const defaultLimit = 3
const defaultSide: ToastSide = 'top'
const defaultAlign: ToastAlign = 'center'
const defaultSideOffset = 0
const defaultAlignOffset = 0
const defaultCollisionAvoidance = true
const defaultCollisionPadding = 5
const defaultArrowPadding = 5
const defaultArrowWidth = 10
const defaultArrowHeight = 5
const defaultViewportPosition: ToastViewportPosition = 'bottom-right'

const activeToast = (toast: ToastItem): boolean =>
  toast.transitionStatus !== 'ending'

const activeCountBefore = (
  toasts: ReadonlyArray<ToastItem>,
  index: number,
): number => toasts.slice(0, index).filter(activeToast).length

const offsetBefore = (
  toasts: ReadonlyArray<ToastItem>,
  index: number,
): number =>
  toasts
    .slice(0, index)
    .reduce((offset, toast) => offset + (toast.height ?? 0), 0)

const applyLimited = (
  toasts: ReadonlyArray<ToastItem>,
  limit: number,
): ReadonlyArray<ToastItem> =>
  toasts.map((toast, index) => {
    if (!activeToast(toast)) {
      return toast
    }

    const limited = activeCountBefore(toasts, index) >= limit

    return toast.limited === limited ? toast : { ...toast, limited }
  })

const withToasts = (
  state: ToastState,
  toasts: ReadonlyArray<ToastItem>,
): ToastState => ({
  ...state,
  toasts: applyLimited(toasts, state.limit),
})

const generatedToastId = (state: Pick<ToastState, 'nextId'>): string =>
  `toast-${state.nextId}`

const timerStatusForToast = (
  state: Pick<
    ToastState,
    'isFocused' | 'isHovered' | 'isWindowFocused' | 'timersPaused'
  >,
  toast: Pick<ToastItem, 'duration' | 'type'>,
): ToastTimerStatus => {
  const duration = toast.duration ?? defaultDuration

  if (toast.type === 'loading' || duration <= 0) {
    return 'idle'
  }

  return state.timersPaused ||
    state.isHovered ||
    state.isFocused ||
    !state.isWindowFocused
    ? 'paused'
    : 'running'
}

const newToast = (
  state: ToastState,
  id: string,
  options: ToastAddOptions,
): ToastItem => {
  const duration = options.duration ?? state.defaultDuration
  const timerStatus = timerStatusForToast(state, {
    duration,
    type: options.type,
  })

  return {
    id,
    ...(options.title === undefined ? {} : { title: options.title }),
    ...(options.description === undefined
      ? {}
      : { description: options.description }),
    ...(options.type === undefined ? {} : { type: options.type }),
    ...(options.priority === undefined ? {} : { priority: options.priority }),
    duration,
    remainingDuration: duration,
    timerStatus,
    transitionStatus: 'starting',
    updateKey: 0,
    ...(options.actionLabel === undefined
      ? {}
      : { actionLabel: options.actionLabel }),
    ...(options.position === undefined ? {} : { position: options.position }),
    ...(options.promiseState === undefined
      ? {}
      : { promiseState: options.promiseState }),
  }
}

export const createToastState = (
  options: ToastStateOptions = {},
): ToastState => {
  const state = {
    toasts: options.toasts ?? [],
    limit: options.limit ?? defaultLimit,
    defaultDuration: options.defaultDuration ?? defaultDuration,
    isHovered: options.isHovered ?? false,
    isFocused: options.isFocused ?? false,
    isWindowFocused: options.isWindowFocused ?? true,
    timersPaused: options.timersPaused ?? false,
    nextId: options.nextId ?? 1,
  }

  return withToasts(state, state.toasts)
}

export const toastMetadata = (
  state: Pick<ToastState, 'toasts'>,
): ReadonlyArray<ToastMetadata> =>
  state.toasts.map((toast, domIndex) => ({
    id: toast.id,
    domIndex,
    visibleIndex: activeToast(toast)
      ? activeCountBefore(state.toasts, domIndex)
      : -1,
    offsetY: offsetBefore(state.toasts, domIndex),
  }))

export const metadataForToast = (
  state: Pick<ToastState, 'toasts'>,
  id: string,
): ToastMetadata | undefined =>
  toastMetadata(state).find(metadata => metadata.id === id)

export const isExpanded = (
  state: Pick<ToastState, 'isFocused' | 'isHovered'>,
): boolean => state.isHovered || state.isFocused

export const addToast = (
  state: ToastState,
  options: ToastAddOptions,
): ToastStateChange => {
  const id = options.id ?? generatedToastId(state)
  const existing = state.toasts.find(toast => toast.id === id)
  const nextId = options.id === undefined ? state.nextId + 1 : state.nextId

  if (existing !== undefined && activeToast(existing)) {
    return {
      id,
      state: updateToast({ ...state, nextId }, id, {
        ...(options.title === undefined ? {} : { title: options.title }),
        ...(options.description === undefined
          ? {}
          : { description: options.description }),
        ...(options.type === undefined ? {} : { type: options.type }),
        ...(options.priority === undefined
          ? {}
          : { priority: options.priority }),
        ...(options.duration === undefined
          ? {}
          : {
              duration: options.duration,
              remainingDuration: options.duration,
            }),
        ...(options.actionLabel === undefined
          ? {}
          : { actionLabel: options.actionLabel }),
        ...(options.position === undefined
          ? {}
          : { position: options.position }),
        ...(options.promiseState === undefined
          ? {}
          : { promiseState: options.promiseState }),
      }),
    }
  }

  const withoutEndingDuplicate = state.toasts.filter(
    toast => toast.id !== id || activeToast(toast),
  )

  return {
    id,
    state: withToasts({ ...state, nextId }, [
      newToast(state, id, options),
      ...withoutEndingDuplicate,
    ]),
  }
}

export const updateToast = (
  state: ToastState,
  id: string,
  updates: ToastUpdateOptions,
): ToastState => {
  const existing = state.toasts.find(toast => toast.id === id)

  if (existing === undefined || !activeToast(existing)) {
    return state
  }

  const nextToast = {
    ...existing,
    ...updates,
    updateKey: (existing.updateKey ?? 0) + 1,
  }

  const nextTimerStatus = timerStatusForToast(state, nextToast)
  const withTimer = {
    ...nextToast,
    timerStatus: updates.timerStatus ?? nextTimerStatus,
  }

  return withToasts(
    state,
    state.toasts.map(toast => (toast.id === id ? withTimer : toast)),
  )
}

export const closeRequest = (
  id: string | undefined,
  reason: ToastCloseReason,
): ToastCloseRequest => ({
  ...(id === undefined ? {} : { id }),
  reason,
})

export const closeToast = (
  state: ToastState,
  request: ToastCloseRequest,
): ToastState => {
  const closeAll = request.id === undefined
  const endingTransitionStatus: ToastTransitionStatus = 'ending'
  const idleTimerStatus: ToastTimerStatus = 'idle'
  const toasts = state.toasts.map(toast => {
    if (!closeAll && toast.id !== request.id) {
      return toast
    }

    if (!activeToast(toast)) {
      return toast
    }

    return {
      ...toast,
      transitionStatus: endingTransitionStatus,
      height: 0,
      timerStatus: idleTimerStatus,
    }
  })
  const hasActiveToasts = toasts.some(activeToast)

  return withToasts(
    {
      ...state,
      isHovered: hasActiveToasts ? state.isHovered : false,
      isFocused: hasActiveToasts ? state.isFocused : false,
      timersPaused: hasActiveToasts ? state.timersPaused : false,
    },
    toasts,
  )
}

export const timeoutToast = (state: ToastState, id: string): ToastState =>
  closeToast(state, closeRequest(id, 'timeout'))

export const removeToast = (state: ToastState, id: string): ToastState =>
  withToasts(
    state,
    state.toasts.filter(toast => toast.id !== id),
  )

export const pauseToasts = (state: ToastState): ToastState => ({
  ...state,
  timersPaused: true,
  toasts: state.toasts.map(toast =>
    activeToast(toast) && toast.timerStatus === 'running'
      ? { ...toast, timerStatus: 'paused' }
      : toast,
  ),
})

export const resumeToasts = (state: ToastState): ToastState => ({
  ...state,
  timersPaused: false,
  toasts: state.toasts.map(toast =>
    activeToast(toast) && toast.timerStatus === 'paused'
      ? {
          ...toast,
          timerStatus: timerStatusForToast(
            { ...state, timersPaused: false },
            toast,
          ),
        }
      : toast,
  ),
})

export const applyViewportInteraction = (
  state: ToastState,
  interaction: ToastViewportInteraction,
): ToastState =>
  M.value(interaction.type).pipe(
    M.when('hover-start', () => pauseToasts({ ...state, isHovered: true })),
    M.when('hover-end', () => resumeToasts({ ...state, isHovered: false })),
    M.when('focus-start', () => pauseToasts({ ...state, isFocused: true })),
    M.when('focus-end', () => resumeToasts({ ...state, isFocused: false })),
    M.when('touch-start', () => pauseToasts(state)),
    M.when('touch-end', () => resumeToasts(state)),
    M.when('window-blur', () =>
      pauseToasts({ ...state, isWindowFocused: false }),
    ),
    M.when('window-focus', () =>
      resumeToasts({ ...state, isWindowFocused: true }),
    ),
    M.exhaustive,
  )

export const startPromiseToast = (
  state: ToastState,
  options: Readonly<{
    id?: string
    loading: string
  }>,
): ToastStateChange =>
  addToast(state, {
    ...(options.id === undefined ? {} : { id: options.id }),
    description: options.loading,
    type: 'loading',
    duration: 0,
    promiseState: ToastPromiseLoading({ label: options.loading }),
  })

const promiseUpdates = (result: ToastPromiseState): ToastUpdateOptions =>
  M.value(result).pipe(
    M.tagsExhaustive({
      ToastPromiseLoading: ({ label }) => ({
        description: label,
        duration: 0,
        promiseState: result,
        type: 'loading',
      }),
      ToastPromiseSucceeded: ({ description, duration, title }) => ({
        ...(title === undefined ? {} : { title }),
        ...(description === undefined ? {} : { description }),
        ...(duration === undefined ? {} : { duration }),
        promiseState: result,
        type: 'success',
      }),
      ToastPromiseFailed: ({ description, duration, title }) => ({
        ...(title === undefined ? {} : { title }),
        ...(description === undefined ? {} : { description }),
        ...(duration === undefined ? {} : { duration }),
        promiseState: result,
        type: 'error',
      }),
    }),
  )

export const resolvePromiseToast = (
  state: ToastState,
  id: string,
  result: ToastPromiseState,
): ToastState => updateToast(state, id, promiseUpdates(result))

export const updateSwipe = (
  state: ToastState,
  change: ToastSwipeChange,
): ToastState => {
  const status: ToastSwipeStatus =
    change.phase === 'end' ? 'dismissed' : 'swiping'
  const swipe = {
    status,
    movementX: change.x,
    movementY: change.y,
  }

  return updateToast(state, change.id, {
    swipe,
  })
}

// VIEW

export type ToastPartAttributes<Message> = Readonly<{
  root: ReadonlyArray<Attribute<Message>>
  isMounted: boolean
}>

export type ToastItemAttributes<Message> = Readonly<{
  toast: ToastItem
  metadata: ToastMetadata
  root: ReadonlyArray<Attribute<Message>>
  content: ReadonlyArray<Attribute<Message>>
  title: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
  action: ReadonlyArray<Attribute<Message>>
  close: ReadonlyArray<Attribute<Message>>
  positioner: ToastPartAttributes<Message>
  arrow: ToastPartAttributes<Message>
  isOpen: boolean
  isMounted: boolean
}>

export type ToastAnnouncementAttributes<Message> = Readonly<{
  toast: ToastItem
  root: ReadonlyArray<Attribute<Message>>
  title: ReadonlyArray<Attribute<Message>>
  description: ReadonlyArray<Attribute<Message>>
}>

export type ToastAttributes<Message> = Readonly<{
  provider: ReadonlyArray<Attribute<Message>>
  portal: ReadonlyArray<Attribute<Message>>
  viewport: ToastPartAttributes<Message>
  toasts: ReadonlyArray<ToastItemAttributes<Message>>
  highPriorityAnnouncements: ReadonlyArray<ToastAnnouncementAttributes<Message>>
  isExpanded: boolean
  isEmpty: boolean
}>

export type ViewConfig<Message> = Readonly<{
  id: string
  state: ToastState
  label?: string
  forceMount?: boolean
  viewportPosition?: ToastViewportPosition
  swipeDirections?: ReadonlyArray<ToastSwipeDirection>
  toView: (attributes: ToastAttributes<Message>) => Html
  onAction?: (press: ToastActionPress) => Message
  onClose?: (request: ToastCloseRequest) => Message
  onSwipeChange?: (change: ToastSwipeChange) => Message
  onViewportInteraction?: (interaction: ToastViewportInteraction) => Message
}>

const booleanDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  name: string,
  value: boolean | undefined,
): ReadonlyArray<Attribute<Message>> =>
  value === true ? [h.DataAttribute(name, '')] : []

const typeDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  toast: Pick<ToastItem, 'type'>,
): ReadonlyArray<Attribute<Message>> =>
  toast.type === undefined ? [] : [h.DataAttribute('type', toast.type)]

const optionalMessageAttribute = <Message>(
  message: Option.Option<Message>,
  toAttribute: (message: Message) => Attribute<Message>,
): ReadonlyArray<Attribute<Message>> =>
  Option.match(message, {
    onNone: () => [],
    onSome: value => [toAttribute(value)],
  })

const viewportId = (config: Pick<ViewConfig<unknown>, 'id'>): string =>
  `${config.id}-viewport`

export const rootId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${config.id}-${toast.id}`

export const contentId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${rootId(config, toast)}-content`

export const titleId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${rootId(config, toast)}-title`

export const descriptionId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${rootId(config, toast)}-description`

export const positionerId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${rootId(config, toast)}-positioner`

export const arrowId = (
  config: Pick<ViewConfig<unknown>, 'id'>,
  toast: Pick<ToastItem, 'id'>,
): string => `${rootId(config, toast)}-arrow`

const resolvedPosition = (toast: Pick<ToastItem, 'position'>): ToastPosition =>
  toast.position ?? {}

const resolvedSide = (toast: Pick<ToastItem, 'position'>): ToastSide =>
  resolvedPosition(toast).side ?? defaultSide

const resolvedAlign = (toast: Pick<ToastItem, 'position'>): ToastAlign =>
  resolvedPosition(toast).align ?? defaultAlign

const transitionDataAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  transitionStatus: ToastTransitionStatus | undefined,
): ReadonlyArray<Attribute<Message>> => {
  if (transitionStatus === 'starting') {
    return [h.DataAttribute('starting-style', '')]
  }

  if (transitionStatus === 'ending') {
    return [h.DataAttribute('ending-style', '')]
  }

  return []
}

const expandedDataAttribute = <Message>(
  h: ReturnType<typeof html<Message>>,
  expanded: boolean,
): ReadonlyArray<Attribute<Message>> =>
  expanded ? [h.DataAttribute('expanded', '')] : []

const providerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('provider', ''),
  h.DataAttribute('limit', String(config.state.limit)),
  h.DataAttribute('timeout', String(config.state.defaultDuration)),
  h.DataAttribute('paused', String(config.state.timersPaused)),
]

const portalAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('portal', '')]

const viewportPlacementStyle = (
  position: ToastViewportPosition,
): Record<string, string> => {
  if (position === 'top-left') {
    return { top: '1rem', left: '1rem' }
  }

  if (position === 'top-center') {
    return { top: '1rem', left: '50%', transform: 'translateX(-50%)' }
  }

  if (position === 'top-right') {
    return { top: '1rem', right: '1rem' }
  }

  if (position === 'bottom-left') {
    return { bottom: '1rem', left: '1rem' }
  }

  if (position === 'bottom-center') {
    return { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' }
  }

  return { bottom: '1rem', right: '1rem' }
}

const viewportInteractionMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onViewportInteraction'>,
  type: ToastViewportInteractionType,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onViewportInteraction)
    ? Option.some(config.onViewportInteraction({ type }))
    : Option.none()

const viewportAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  expanded: boolean,
): ToastPartAttributes<Message> => ({
  root: [
    h.Id(viewportId(config)),
    h.Role('region'),
    h.Tabindex(-1),
    h.AriaLive('polite'),
    h.AriaAtomic(false),
    h.Attribute('aria-relevant', 'additions text'),
    h.AriaLabel(config.label ?? 'Notifications'),
    h.DataAttribute(
      'position',
      config.viewportPosition ?? defaultViewportPosition,
    ),
    ...expandedDataAttribute(h, expanded),
    h.Style({
      position: 'fixed',
      display: 'grid',
      gap: '0.5rem',
      zIndex: '2147483647',
      '--toast-frontmost-height': `${config.state.toasts[0]?.height ?? 0}px`,
      ...viewportPlacementStyle(
        config.viewportPosition ?? defaultViewportPosition,
      ),
    }),
    ...optionalMessageAttribute(
      viewportInteractionMessage(config, 'hover-start'),
      message => h.OnMouseEnter(message),
    ),
    ...optionalMessageAttribute(
      viewportInteractionMessage(config, 'hover-end'),
      message => h.OnMouseLeave(message),
    ),
    ...optionalMessageAttribute(
      viewportInteractionMessage(config, 'focus-start'),
      message => h.OnFocus(message),
    ),
    ...optionalMessageAttribute(
      viewportInteractionMessage(config, 'focus-end'),
      message => h.OnBlur(message),
    ),
    ...(Predicate.isNotUndefined(config.onViewportInteraction)
      ? [
          h.OnPointerDown(pointerType => {
            const {onViewportInteraction} = config

            return pointerType === 'touch' &&
              Predicate.isNotUndefined(onViewportInteraction)
              ? Option.some(onViewportInteraction({ type: 'touch-start' }))
              : Option.none()
          }),
          h.OnPointerUp((_screenX, _screenY, pointerType) => {
            const {onViewportInteraction} = config

            return pointerType === 'touch' &&
              Predicate.isNotUndefined(onViewportInteraction)
              ? Option.some(onViewportInteraction({ type: 'touch-end' }))
              : Option.none()
          }),
        ]
      : []),
  ],
  isMounted:
    config.forceMount === true ||
    !EffectArray.isReadonlyArrayEmpty(config.state.toasts),
})

const closeMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onClose'>,
  request: ToastCloseRequest,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onClose)
    ? Option.some(config.onClose(request))
    : Option.none()

const actionMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onAction'>,
  press: ToastActionPress,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onAction)
    ? Option.some(config.onAction(press))
    : Option.none()

const swipeMessage = <Message>(
  config: Pick<ViewConfig<Message>, 'onSwipeChange'>,
  change: ToastSwipeChange,
): Option.Option<Message> =>
  Predicate.isNotUndefined(config.onSwipeChange)
    ? Option.some(config.onSwipeChange(change))
    : Option.none()

const rootAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
  metadata: ToastMetadata,
  expanded: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(rootId(config, toast)),
  h.Role(toast.priority === 'high' ? 'alertdialog' : 'dialog'),
  h.Tabindex(0),
  h.AriaModal(false),
  ...(toast.title === undefined
    ? []
    : [h.AriaLabelledBy(titleId(config, toast))]),
  ...(toast.description === undefined
    ? []
    : [h.Attribute('aria-describedby', descriptionId(config, toast))]),
  ...(toast.priority === 'high' && !config.state.isFocused
    ? [h.AriaHidden(true)]
    : []),
  ...expandedDataAttribute(h, expanded),
  ...booleanDataAttribute(h, 'limited', toast.limited),
  ...typeDataAttribute(h, toast),
  ...booleanDataAttribute(h, 'swiping', toast.swipe?.status === 'swiping'),
  ...(toast.swipe?.direction === undefined
    ? []
    : [h.DataAttribute('swipe-direction', toast.swipe.direction)]),
  ...transitionDataAttributes(h, toast.transitionStatus),
  ...(toast.limited === true ? [h.Inert(true)] : []),
  h.Style({
    '--toast-index': String(metadata.visibleIndex),
    '--toast-offset-y': `${metadata.offsetY}px`,
    '--toast-height': `${toast.height ?? 0}px`,
    '--toast-swipe-movement-x': `${toast.swipe?.movementX ?? 0}px`,
    '--toast-swipe-movement-y': `${toast.swipe?.movementY ?? 0}px`,
  }),
  ...optionalMessageAttribute(
    closeMessage(config, closeRequest(toast.id, 'escape-key')),
    message =>
      h.OnKeyDownPreventDefault(key =>
        key === 'Escape' ? Option.some(message) : Option.none(),
      ),
  ),
  ...(Predicate.isNotUndefined(config.onSwipeChange)
    ? [
        h.OnPointerDown(
          (
            pointerType,
            button,
            _screenX,
            _screenY,
            timeStamp,
            clientX,
            clientY,
          ) =>
            button === 0
              ? swipeMessage(config, {
                  id: toast.id,
                  phase: 'start',
                  pointerType,
                  x: clientX,
                  y: clientY,
                  timeStamp,
                })
              : Option.none(),
        ),
        h.OnPointerMove((screenX, screenY, pointerType) =>
          swipeMessage(config, {
            id: toast.id,
            phase: 'move',
            pointerType,
            x: screenX,
            y: screenY,
          }),
        ),
        h.OnPointerUp((screenX, screenY, pointerType, timeStamp) =>
          swipeMessage(config, {
            id: toast.id,
            phase: 'end',
            pointerType,
            x: screenX,
            y: screenY,
            timeStamp,
          }),
        ),
      ]
    : []),
]

const contentAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
  metadata: ToastMetadata,
  expanded: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(contentId(config, toast)),
  ...expandedDataAttribute(h, expanded),
  ...booleanDataAttribute(h, 'behind', metadata.visibleIndex > 0),
]

const titleAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(titleId(config, toast)),
  ...typeDataAttribute(h, toast),
]

const descriptionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
): ReadonlyArray<Attribute<Message>> => [
  h.Id(descriptionId(config, toast)),
  ...typeDataAttribute(h, toast),
]

const actionAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  ...typeDataAttribute(h, toast),
  ...optionalMessageAttribute(
    actionMessage(config, { id: toast.id }),
    message => h.OnClick(message),
  ),
]

const closeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
  expanded: boolean,
): ReadonlyArray<Attribute<Message>> => [
  h.Type('button'),
  h.AriaHidden(!expanded),
  ...typeDataAttribute(h, toast),
  ...optionalMessageAttribute(
    closeMessage(config, closeRequest(toast.id, 'close-button')),
    message => h.OnClick(message),
  ),
]

const placementAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  toast: ToastItem,
): ReadonlyArray<Attribute<Message>> => {
  const position = resolvedPosition(toast)

  return [
    h.DataAttribute('side', resolvedSide(toast)),
    h.DataAttribute('align', resolvedAlign(toast)),
    h.DataAttribute(
      'side-offset',
      String(position.sideOffset ?? defaultSideOffset),
    ),
    h.DataAttribute(
      'align-offset',
      String(position.alignOffset ?? defaultAlignOffset),
    ),
    h.DataAttribute(
      'collision-avoidance',
      String(position.collisionAvoidance ?? defaultCollisionAvoidance),
    ),
    h.DataAttribute(
      'collision-padding',
      String(position.collisionPadding ?? defaultCollisionPadding),
    ),
    h.DataAttribute(
      'arrow-padding',
      String(position.arrowPadding ?? defaultArrowPadding),
    ),
  ]
}

const positionerAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
  metadata: ToastMetadata,
): ToastPartAttributes<Message> => {
  const position = resolvedPosition(toast)

  return {
    root: [
      h.Id(positionerId(config, toast)),
      ...placementAttributes(h, toast),
      ...booleanDataAttribute(h, 'anchor-hidden', position.isAnchorHidden),
      h.Style({
        position: position.positionMethod ?? 'absolute',
        '--toast-index': String(metadata.visibleIndex),
      }),
    ],
    isMounted: true,
  }
}

const arrowAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
): ToastPartAttributes<Message> => {
  const position = resolvedPosition(toast)

  return {
    root: [
      h.Id(arrowId(config, toast)),
      h.AriaHidden(true),
      ...placementAttributes(h, toast),
      ...booleanDataAttribute(h, 'uncentered', position.isArrowUncentered),
      h.Style({
        width: `${position.arrowWidth ?? defaultArrowWidth}px`,
        height: `${position.arrowHeight ?? defaultArrowHeight}px`,
      }),
    ],
    isMounted: true,
  }
}

const itemAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
  metadata: ToastMetadata,
  expanded: boolean,
): ToastItemAttributes<Message> => ({
  toast,
  metadata,
  root: rootAttributes(h, config, toast, metadata, expanded),
  content: contentAttributes(h, config, toast, metadata, expanded),
  title: titleAttributes(h, config, toast),
  description: descriptionAttributes(h, config, toast),
  action: actionAttributes(h, config, toast),
  close: closeAttributes(h, config, toast, expanded),
  positioner: positionerAttributes(h, config, toast, metadata),
  arrow: arrowAttributes(h, config, toast),
  isOpen: activeToast(toast),
  isMounted: true,
})

const announcementAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: ViewConfig<Message>,
  toast: ToastItem,
): ToastAnnouncementAttributes<Message> => ({
  toast,
  root: [h.Role('alert'), h.AriaAtomic(true)],
  title: [h.Id(`${rootId(config, toast)}-announcement-title`)],
  description: [h.Id(`${rootId(config, toast)}-announcement-description`)],
})

export const view = <Message>(config: ViewConfig<Message>): Html => {
  const h = html<Message>()
  const expanded = isExpanded(config.state)
  const metadata = toastMetadata(config.state)
  const metadataById = new Map(metadata.map(item => [item.id, item]))
  const toasts = config.state.toasts.flatMap(toast => {
    const itemMetadata = metadataById.get(toast.id)

    return itemMetadata === undefined
      ? []
      : [itemAttributes(h, config, toast, itemMetadata, expanded)]
  })
  const highPriorityAnnouncements = config.state.toasts
    .filter(toast => toast.priority === 'high')
    .map(toast => announcementAttributes(h, config, toast))

  return config.toView({
    provider: providerAttributes(h, config),
    portal: portalAttributes(h),
    viewport: viewportAttributes(h, config, expanded),
    toasts,
    highPriorityAnnouncements,
    isExpanded: expanded,
    isEmpty: EffectArray.isReadonlyArrayEmpty(config.state.toasts),
  })
}
