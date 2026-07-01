import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type ToastConfig = Readonly<{
  id: string
  title: string
  description: string
  type?: string
  priority?: 'low' | 'high'
  duration?: number
  actionLabel?: string
  limited?: boolean
  height?: number
  transitionStatus?: 'starting' | 'ending'
  position?: Readonly<{
    side?: 'top' | 'bottom' | 'left' | 'right' | 'inline-start' | 'inline-end'
    align?: 'start' | 'center' | 'end'
    sideOffset?: number
    alignOffset?: number
    collisionAvoidance?: boolean
    collisionPadding?: number
    arrowPadding?: number
    arrowWidth?: number
    arrowHeight?: number
    isAnchorHidden?: boolean
    isArrowUncentered?: boolean
    positionMethod?: 'absolute' | 'fixed'
  }>
}>

type CaseConfig = Readonly<{
  id: string
  triggerLabel: string
  additionalTriggerLabels?: ReadonlyArray<string>
  viewportPosition?:
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right'
  isHovered?: boolean
  isFocused?: boolean
  timersPaused?: boolean
  limit?: number
  defaultDuration?: number
  toasts: ReadonlyArray<ToastConfig>
}>

const viewportClass =
  'pointer-events-none z-10 w-[calc(100vw-2rem)] max-w-sm text-sm text-foreground sm:w-90'
const toastClass =
  'rounded-md border border-border bg-background p-4 shadow-sm outline-none data-[expanded]:shadow-md data-[limited]:opacity-50 data-[type=success]:border-emerald-500 data-[type=error]:border-red-500 data-[type=loading]:border-muted-foreground'
const titleClass = 'font-medium leading-none'
const descriptionClass = 'mt-1 text-muted-foreground'
const contentClass = 'grid gap-1 data-[behind]:opacity-80'
const actionRowClass = 'mt-3 flex items-center gap-2'
const actionClass =
  'inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium'
const closeClass =
  'inline-flex h-8 items-center rounded-md border border-input px-3 text-xs font-medium'
const buttonClass =
  'box-border inline-flex h-10 items-center justify-center border border-neutral-950 bg-neutral-950 px-4 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus:outline-2 focus:-outline-offset-1 focus:outline-neutral-950 dark:border-white dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 dark:focus:outline-white'

const setAttr = (
  element: HTMLElement,
  name: string,
  value: string | number | boolean | undefined,
): void => {
  if (value === undefined) {
    return
  }

  element.setAttribute(name, String(value))
}

const createToastRoot = (
  config: ToastConfig,
  isExpanded: boolean,
): HTMLDivElement => {
  const root = document.createElement('div')

  setAttr(root, 'id', `notifications-${config.id}`)
  setAttr(root, 'role', config.priority === 'high' ? 'alertdialog' : 'dialog')
  setAttr(root, 'tabindex', 0)
  setAttr(root, 'aria-modal', false)
  setAttr(root, 'aria-labelledby', `notifications-${config.id}-title`)
  setAttr(root, 'aria-describedby', `notifications-${config.id}-description`)
  if (config.priority === 'high' && !isExpanded) {
    setAttr(root, 'aria-hidden', true)
  }
  if (isExpanded) {
    setAttr(root, 'data-expanded', '')
  }
  if (config.limited === true) {
    setAttr(root, 'data-limited', '')
    setAttr(root, 'inert', '')
  }
  if (config.type !== undefined) {
    setAttr(root, 'data-type', config.type)
  }
  if (config.transitionStatus === 'starting') {
    setAttr(root, 'data-starting-style', '')
  }
  if (config.transitionStatus === 'ending') {
    setAttr(root, 'data-ending-style', '')
  }
  if (config.priority === 'high') {
    setAttr(root, 'aria-hidden', !isExpanded)
  }
  setAttr(root, 'class', toastClass)

  return root
}

const createToastContent = (
  config: ToastConfig,
  visibleIndex: number,
  isExpanded: boolean,
): HTMLDivElement => {
  const content = document.createElement('div')

  setAttr(content, 'id', `notifications-${config.id}-content`)
  if (isExpanded) {
    setAttr(content, 'data-expanded', '')
  }
  if (visibleIndex > 0) {
    setAttr(content, 'data-behind', '')
  }
  setAttr(content, 'class', contentClass)

  const title = document.createElement('h2')
  setAttr(title, 'id', `notifications-${config.id}-title`)
  if (config.type !== undefined) {
    setAttr(title, 'data-type', config.type)
  }
  setAttr(title, 'class', titleClass)
  title.append(document.createTextNode(config.title))

  const description = document.createElement('p')
  setAttr(description, 'id', `notifications-${config.id}-description`)
  if (config.type !== undefined) {
    setAttr(description, 'data-type', config.type)
  }
  setAttr(description, 'class', descriptionClass)
  description.append(document.createTextNode(config.description))

  content.append(title, description)

  return content
}

const createToastActionRow = (
  config: ToastConfig,
  isExpanded: boolean,
): HTMLDivElement => {
  const actionRow = document.createElement('div')

  setAttr(actionRow, 'class', actionRowClass)
  if (config.actionLabel !== undefined) {
    const action = document.createElement('button')
    setAttr(action, 'type', 'button')
    if (config.type !== undefined) {
      setAttr(action, 'data-type', config.type)
    }
    setAttr(action, 'class', actionClass)
    action.append(document.createTextNode(config.actionLabel))
    actionRow.append(action)
  }

  const close = document.createElement('button')
  if (!isExpanded) {
    setAttr(close, 'aria-hidden', true)
  }
  if (config.type !== undefined) {
    setAttr(close, 'data-type', config.type)
  }
  setAttr(close, 'type', 'button')
  setAttr(close, 'class', closeClass)
  close.append(document.createTextNode('Dismiss'))
  actionRow.append(close)

  return actionRow
}

const createToastPositioner = (
  config: ToastConfig,
): HTMLDivElement | undefined => {
  const { position } = config

  if (position === undefined || position.side === undefined) {
    return undefined
  }

  const positioner = document.createElement('div')

  setAttr(positioner, 'id', `notifications-${config.id}-positioner`)
  setAttr(positioner, 'data-side', position.side)
  setAttr(positioner, 'data-align', position.align ?? 'center')
  setAttr(positioner, 'data-side-offset', position.sideOffset ?? 0)
  setAttr(positioner, 'data-align-offset', position.alignOffset ?? 0)
  setAttr(
    positioner,
    'data-collision-avoidance',
    position.collisionAvoidance ?? true,
  )
  setAttr(positioner, 'data-collision-padding', position.collisionPadding ?? 5)
  setAttr(positioner, 'data-arrow-padding', position.arrowPadding ?? 5)
  if (position.isAnchorHidden === true) {
    setAttr(positioner, 'data-anchor-hidden', '')
  }

  return positioner
}

const createToastArrow = (config: ToastConfig): HTMLDivElement | undefined => {
  const { position } = config

  if (
    position === undefined ||
    (position.arrowWidth === undefined && position.arrowHeight === undefined)
  ) {
    return undefined
  }

  const arrow = document.createElement('div')

  setAttr(arrow, 'id', `notifications-${config.id}-arrow`)
  setAttr(arrow, 'aria-hidden', true)
  if (position.side !== undefined) {
    setAttr(arrow, 'data-side', position.side)
  }
  if (position.align !== undefined) {
    setAttr(arrow, 'data-align', position.align)
  }
  if (position.isArrowUncentered === true) {
    setAttr(arrow, 'data-uncentered', '')
  }

  return arrow
}

const createToast = (
  config: ToastConfig,
  visibleIndex: number,
  offsetY: number,
  isExpanded: boolean,
): HTMLDivElement => {
  const root = createToastRoot(config, isExpanded)
  const content = createToastContent(config, visibleIndex, isExpanded)
  const actionRow = createToastActionRow(config, isExpanded)
  const maybePositioner = createToastPositioner(config)
  const maybeArrow = createToastArrow(config)

  root.append(content, actionRow)
  if (maybePositioner !== undefined) {
    root.append(maybePositioner)
  }
  if (maybeArrow !== undefined) {
    root.append(maybeArrow)
  }

  return root
}

const renderCase = (config: CaseConfig): FixtureSnapshot => {
  const wrapper = document.createElement('div')
  wrapper.setAttribute('class', 'min-h-40')

  const provider = document.createElement('div')
  provider.dataset.provider = ''
  provider.dataset.limit = String(config.limit ?? 3)
  provider.dataset.timeout = String(config.defaultDuration ?? 5000)
  provider.dataset.paused = String(config.timersPaused ?? false)

  const createTrigger = (label: string): HTMLButtonElement => {
    const trigger = document.createElement('button')
    trigger.setAttribute('type', 'button')
    trigger.setAttribute('class', buttonClass)
    trigger.append(document.createTextNode(label))

    return trigger
  }
  const trigger = createTrigger(config.triggerLabel)
  const triggerSurface =
    config.additionalTriggerLabels === undefined
      ? trigger
      : document.createElement('div')
  if (config.additionalTriggerLabels !== undefined) {
    triggerSurface.setAttribute('class', 'flex flex-wrap items-center gap-2')
    triggerSurface.append(
      trigger,
      ...config.additionalTriggerLabels.map(createTrigger),
    )
  }

  const portal = document.createElement('div')
  portal.dataset.portal = ''

  const viewport = document.createElement('div')
  viewport.setAttribute('id', 'notifications-viewport')
  viewport.setAttribute('role', 'region')
  viewport.setAttribute('tabindex', '-1')
  viewport.setAttribute('aria-live', 'polite')
  viewport.setAttribute('aria-atomic', 'false')
  viewport.setAttribute('aria-relevant', 'additions text')
  viewport.setAttribute('aria-label', 'Notifications')
  viewport.dataset.position = config.viewportPosition ?? 'bottom-right'
  if (config.isHovered === true || config.isFocused === true) {
    viewport.dataset.expanded = ''
  }
  viewport.setAttribute('class', viewportClass)

  const finalState = config.toasts.reduce(
    (state, toast) => {
      const isActive = toast.transitionStatus !== 'ending'
      const toastVisibleIndex = isActive ? state.visibleIndex : -1
      state.offsetById.set(toast.id, state.offsetY)
      if (isActive) {
        state.visibleIndex += 1
      }
      state.offsetY += toast.height ?? 0
      state.viewport.append(
        createToast(
          toast,
          toastVisibleIndex,
          state.offsetById.get(toast.id) ?? 0,
          config.isHovered === true || config.isFocused === true,
        ),
      )
      return state
    },
    {
      viewport,
      offsetById: new Map<string, number>(),
      offsetY: 0,
      visibleIndex: 0,
    },
  )

  portal.append(finalState.viewport)
  provider.append(portal)
  wrapper.append(triggerSurface, provider)
  document.body.append(wrapper)

  const snapshot = snapshotElement(wrapper, {
    click: 'suppressed',
    Enter: 'suppressed',
    Space: 'suppressed',
    mousedown: 'suppressed',
    pointerdown: 'suppressed',
  })

  wrapper.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    id: 'toast-anchored-toasts',
    triggerLabel: 'Copy to clipboard',
    additionalTriggerLabels: ['Stacked toast'],
    toasts: [],
  },
  {
    id: 'toast-custom-position',
    triggerLabel: 'Create toast',
    viewportPosition: 'top-center',
    toasts: [],
  },
  {
    id: 'toast-undo-action',
    triggerLabel: 'Perform action',
    toasts: [],
  },
  {
    id: 'toast-promise',
    triggerLabel: 'Run effect',
    toasts: [],
  },
  {
    id: 'toast-custom',
    triggerLabel: 'Create custom toast',
    toasts: [],
  },
  {
    id: 'toast-deduplicated-toast',
    triggerLabel: 'Save draft',
    toasts: [],
  },
  {
    id: 'toast-varying-heights',
    triggerLabel: 'Create varying height toast',
    toasts: [],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.id,
  snapshot: renderCase(config),
}))
