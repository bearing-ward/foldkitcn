import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const suppressedKeyboard = {
  click: 'suppressed',
  Enter: 'suppressed',
  Space: 'suppressed',
  mousedown: 'suppressed',
  pointerdown: 'suppressed',
}

const appendTooltipParts = (
  portal: HTMLDivElement,
  options: Readonly<{
    open: boolean
    disabled?: boolean
    align?: string
    alignOffset?: number
    forceMount?: boolean
    instant?: string
    side?: string
    sideOffset?: number
    viewportActivationDirection?: string
    viewportTransitioning?: boolean
  }>,
): void => {
  if (!options.open && options.forceMount !== true) {
    return
  }

  const side = options.side ?? 'top'
  const align = options.align ?? 'center'
  const sideOffset = String(options.sideOffset ?? 0)
  const alignOffset = String(options.alignOffset ?? 0)

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'library-tooltip-positioner')
  positioner.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  positioner.dataset.side = side
  positioner.dataset.align = align
  positioner.dataset.sideOffset = sideOffset
  positioner.dataset.alignOffset = alignOffset
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '5'
  positioner.dataset.arrowPadding = '5'

  if (options.instant !== undefined) {
    positioner.dataset.instant = options.instant
  }

  if (!options.open) {
    positioner.setAttribute('hidden', '')
  }

  const popup = document.createElement('div')
  popup.setAttribute('id', 'library-tooltip-popup')
  popup.setAttribute('role', 'tooltip')
  popup.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  popup.dataset.side = side
  popup.dataset.align = align
  popup.dataset.sideOffset = sideOffset
  popup.dataset.alignOffset = alignOffset
  popup.dataset.collisionAvoidance = 'true'
  popup.dataset.collisionPadding = '5'
  popup.dataset.arrowPadding = '5'

  if (options.instant !== undefined) {
    popup.dataset.instant = options.instant
  }

  if (!options.open) {
    popup.setAttribute('hidden', '')
  }

  const viewport = document.createElement('div')
  viewport.setAttribute('id', 'library-tooltip-viewport')

  if (options.instant !== undefined) {
    viewport.dataset.instant = options.instant
  }

  if (options.viewportActivationDirection !== undefined) {
    viewport.dataset.activationDirection = options.viewportActivationDirection
  }

  if (options.viewportTransitioning === true) {
    viewport.dataset.transitioning = ''
  }

  viewport.append(document.createTextNode('Add to library'))

  const arrow = document.createElement('div')
  arrow.setAttribute('id', 'library-tooltip-arrow')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  arrow.dataset.side = side
  arrow.dataset.align = align
  arrow.dataset.sideOffset = sideOffset
  arrow.dataset.alignOffset = alignOffset
  arrow.dataset.collisionAvoidance = 'true'
  arrow.dataset.collisionPadding = '5'
  arrow.dataset.arrowPadding = '5'

  if (options.instant !== undefined) {
    arrow.dataset.instant = options.instant
  }

  popup.append(viewport, arrow)
  positioner.append(popup)
  portal.append(positioner)
}

const tooltipRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    align?: string
    alignOffset?: number
    forceMount?: boolean
    instant?: string
    keyboard?: FixtureSnapshot['keyboardBehavior']
    side?: string
    sideOffset?: number
    viewportActivationDirection?: string
    viewportTransitioning?: boolean
  }>,
): FixtureSnapshot => {
  const provider = document.createElement('div')
  provider.dataset.provider = ''
  provider.dataset.delay = '600'
  provider.dataset.closeDelay = '0'
  provider.dataset.timeout = '400'

  const root = document.createElement('div')
  root.dataset.side = options.side ?? 'top'
  root.dataset.align = options.align ?? 'center'
  root.dataset.trackCursorAxis = 'none'

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'library-tooltip-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-describedby', 'library-tooltip-popup')
  trigger.dataset.delay = '600'
  trigger.dataset.closeDelay = '0'
  trigger.dataset.closeOnClick = 'true'

  if (options.open) {
    trigger.dataset.popupOpen = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.triggerDisabled = ''
  } else {
    trigger.dataset.baseUiTooltipTrigger = ''
  }

  trigger.append(document.createTextNode('Hover'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  appendTooltipParts(portal, options)
  root.append(portal)
  provider.append(root)
  document.body.append(provider)
  const snapshot = snapshotElement(
    provider,
    options.keyboard ?? enabledKeyboard,
  )
  provider.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tooltip-open',
    snapshot: tooltipRoot({
      open: true,
      side: 'bottom',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'tooltip-closed',
    snapshot: tooltipRoot({ open: false }),
  },
  {
    id: 'tooltip-force-mounted',
    snapshot: tooltipRoot({ open: false, forceMount: true, alignOffset: 2 }),
  },
  {
    id: 'tooltip-instant-viewport',
    snapshot: tooltipRoot({
      open: true,
      instant: 'delay',
      viewportActivationDirection: 'right down',
      viewportTransitioning: true,
    }),
  },
  {
    id: 'tooltip-disabled',
    snapshot: tooltipRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
