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

const appendPreviewCardParts = (
  portal: HTMLDivElement,
  options: Readonly<{
    open: boolean
    activeTriggerId?: string
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

  const side = options.side ?? 'bottom'
  const align = options.align ?? 'center'
  const sideOffset = String(options.sideOffset ?? 0)
  const alignOffset = String(options.alignOffset ?? 0)

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'presentation')
  backdrop.setAttribute(options.open ? 'data-open' : 'data-closed', '')

  if (!options.open) {
    backdrop.setAttribute('hidden', '')
  }

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'profile-preview-positioner')
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
    positioner.setAttribute('inert', '')
  }

  const popup = document.createElement('div')
  popup.setAttribute('id', 'profile-preview-popup')
  popup.setAttribute('tabindex', '-1')
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
  viewport.setAttribute('id', 'profile-preview-viewport')

  if (options.instant !== undefined) {
    viewport.dataset.instant = options.instant
  }

  if (options.viewportActivationDirection !== undefined) {
    viewport.dataset.activationDirection = options.viewportActivationDirection
  }

  if (options.viewportTransitioning === true) {
    viewport.dataset.transitioning = ''
  }

  const title = document.createElement('h3')
  title.append(document.createTextNode('@base-ui'))
  const description = document.createElement('p')
  description.append(document.createTextNode('Preview Card primitive'))
  viewport.append(title, description)

  const arrow = document.createElement('div')
  arrow.setAttribute('id', 'profile-preview-arrow')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  arrow.dataset.side = side
  arrow.dataset.align = align

  popup.append(viewport, arrow)
  positioner.append(popup)
  portal.append(backdrop, positioner)
}

const previewCardRoot = (
  options: Readonly<{
    open: boolean
    activeTriggerId?: string
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
  const root = document.createElement('div')
  root.dataset.side = options.side ?? 'bottom'
  root.dataset.align = options.align ?? 'center'

  if (options.disabled === true) {
    root.dataset.disabled = ''
  }

  const trigger = document.createElement('a')
  trigger.setAttribute('id', 'profile-preview-trigger')
  trigger.setAttribute('aria-describedby', 'profile-preview-popup')
  trigger.dataset.delay = '600'
  trigger.dataset.closeDelay = '300'

  if (
    options.open &&
    (options.activeTriggerId === undefined ||
      options.activeTriggerId === 'profile-preview-trigger')
  ) {
    trigger.dataset.popupOpen = ''
  }

  if (options.disabled === true) {
    trigger.setAttribute('aria-disabled', 'true')
    trigger.dataset.triggerDisabled = ''
  } else {
    trigger.dataset.baseUiPreviewCardTrigger = ''
  }

  trigger.append(document.createTextNode('Open profile'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  appendPreviewCardParts(portal, options)
  root.append(portal)
  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'preview-card-open',
    snapshot: previewCardRoot({
      open: true,
      activeTriggerId: 'profile-preview-trigger',
      side: 'top',
      align: 'end',
      sideOffset: 4,
    }),
  },
  {
    id: 'preview-card-closed',
    snapshot: previewCardRoot({ open: false }),
  },
  {
    id: 'preview-card-force-mounted',
    snapshot: previewCardRoot({
      open: false,
      forceMount: true,
      alignOffset: 2,
    }),
  },
  {
    id: 'preview-card-instant-viewport',
    snapshot: previewCardRoot({
      open: true,
      instant: 'focus',
      viewportActivationDirection: 'left up',
      viewportTransitioning: true,
    }),
  },
  {
    id: 'preview-card-disabled',
    snapshot: previewCardRoot({
      open: false,
      disabled: true,
      forceMount: true,
      keyboard: suppressedKeyboard,
    }),
  },
]
