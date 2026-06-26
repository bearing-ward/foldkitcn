import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

const positionerClassName = 'isolate z-50'
const contentClassName =
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentClassNameWithKbd =
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 has-kbd'
const contentRtlClassName =
  'z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const arrowClassName =
  'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-left-1 data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-right-1 data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5'
const arrowRtlClassName =
  'z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground data-[side=bottom]:top-1 data-[side=inline-end]:-start-1 data-[side=inline-end]:top-1/2! data-[side=inline-end]:-translate-y-1/2 data-[side=inline-start]:-end-1 data-[side=inline-start]:top-1/2! data-[side=inline-start]:-translate-y-1/2 data-[side=left]:top-1/2! data-[side=left]:-right-1 data-[side=left]:-translate-y-1/2 data-[side=right]:top-1/2! data-[side=right]:-left-1 data-[side=right]:-translate-y-1/2 data-[side=top]:-bottom-2.5'

const resolvedContentClassName = (
  options: Readonly<{ className?: string; dir?: string }>,
): string => {
  if (options.dir === 'rtl') {
    return contentRtlClassName
  }

  if (options.className === 'has-kbd') {
    return contentClassNameWithKbd
  }

  return contentClassName
}

const snapshotTooltip = (
  options: Readonly<{
    open: boolean
    contentClassName?: string
    dir?: string
    instant?: string
    side?: string
  }>,
) => {
  const side = options.side ?? 'top'
  const provider = document.createElement('div')
  provider.dataset.provider = ''
  provider.dataset.delay = '600'
  provider.dataset.closeDelay = '0'
  provider.dataset.timeout = '400'
  provider.dataset.slot = 'tooltip-provider'

  const root = document.createElement('div')
  root.dataset.side = side
  root.dataset.align = 'center'
  root.dataset.trackCursorAxis = 'none'
  root.dataset.slot = 'tooltip'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'library-tooltip-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-describedby', 'library-tooltip-popup')
  trigger.dataset.delay = '600'
  trigger.dataset.closeDelay = '0'
  trigger.dataset.closeOnClick = 'true'
  trigger.dataset.popupOpen = ''
  trigger.dataset.baseUiTooltipTrigger = ''
  trigger.dataset.slot = 'tooltip-trigger'
  trigger.append(document.createTextNode('Hover'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'library-tooltip-positioner')
  positioner.dataset.open = ''
  positioner.dataset.side = side
  positioner.dataset.align = 'center'
  positioner.dataset.sideOffset = '4'
  positioner.dataset.alignOffset = '0'
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '5'
  positioner.dataset.arrowPadding = '5'
  positioner.setAttribute('class', positionerClassName)

  if (options.instant !== undefined) {
    positioner.dataset.instant = options.instant
  }

  const content = document.createElement('div')
  content.setAttribute('id', 'library-tooltip-popup')
  content.setAttribute('role', 'tooltip')
  content.dataset.open = ''
  content.dataset.side = side
  content.dataset.align = 'center'
  content.dataset.sideOffset = '4'
  content.dataset.alignOffset = '0'
  content.dataset.collisionAvoidance = 'true'
  content.dataset.collisionPadding = '5'
  content.dataset.arrowPadding = '5'
  content.dataset.slot = 'tooltip-content'
  content.dataset.state =
    options.instant === 'delay' ? 'delayed-open' : 'instant-open'
  content.setAttribute(
    'class',
    resolvedContentClassName({
      className: options.contentClassName,
      dir: options.dir,
    }),
  )

  if (options.instant !== undefined) {
    content.dataset.instant = options.instant
  }

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  const viewport = document.createElement('div')
  viewport.setAttribute('id', 'library-tooltip-viewport')
  viewport.append(document.createTextNode('Add to library'))

  if (options.instant !== undefined) {
    viewport.dataset.instant = options.instant
  }

  const arrow = document.createElement('div')
  arrow.setAttribute('id', 'library-tooltip-arrow')
  arrow.setAttribute('aria-hidden', 'true')
  arrow.dataset.open = ''
  arrow.dataset.side = side
  arrow.dataset.align = 'center'
  arrow.dataset.sideOffset = '4'
  arrow.dataset.alignOffset = '0'
  arrow.dataset.collisionAvoidance = 'true'
  arrow.dataset.collisionPadding = '5'
  arrow.dataset.arrowPadding = '5'
  arrow.setAttribute(
    'class',
    options.dir === 'rtl' ? arrowRtlClassName : arrowClassName,
  )

  if (options.instant !== undefined) {
    arrow.dataset.instant = options.instant
  }

  content.append(viewport, arrow)
  positioner.append(content)
  portal.append(positioner)
  root.append(portal)
  provider.append(root)
  document.body.append(provider)
  const snapshot = snapshotElement(provider, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })
  provider.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'tooltip-demo',
    snapshot: snapshotTooltip({ open: true }),
  },
  {
    id: 'tooltip-keyboard',
    snapshot: snapshotTooltip({ open: true, contentClassName: 'has-kbd' }),
  },
  {
    id: 'tooltip-delayed',
    snapshot: snapshotTooltip({ open: true, instant: 'delay' }),
  },
  {
    id: 'tooltip-rtl',
    snapshot: snapshotTooltip({
      open: true,
      dir: 'rtl',
      side: 'inline-start',
    }),
  },
]
