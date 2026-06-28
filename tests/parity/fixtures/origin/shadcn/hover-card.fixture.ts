import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

const positionerClassName = 'isolate z-50'
const contentClassName =
  'z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentDemoClassName =
  'z-50 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 flex w-64 flex-col gap-0.5'
const contentRtlClassName =
  'z-50 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 flex w-64 flex-col gap-1'

const resolvedContentClassName = (
  options: Readonly<{ className?: string; dir?: string }>,
): string => {
  if (options.dir === 'rtl') {
    return contentRtlClassName
  }

  if (options.className === 'flex w-64 flex-col gap-0.5') {
    return contentDemoClassName
  }

  return contentClassName
}

const snapshotHoverCard = (
  options: Readonly<{
    open: boolean
    contentClassName?: string
    dir?: string
    side?: string
  }>,
) => {
  const side = options.side ?? 'bottom'
  const root = document.createElement('div')
  root.dataset.side = side
  root.dataset.align = 'center'
  root.dataset.slot = 'hover-card'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('a')
  trigger.setAttribute('id', 'profile-hover-card-trigger')
  trigger.setAttribute('aria-describedby', 'profile-hover-card-popup')
  trigger.setAttribute('href', '#')
  trigger.dataset.delay = '600'
  trigger.dataset.closeDelay = '300'
  trigger.dataset.popupOpen = ''
  trigger.dataset.baseUiPreviewCardTrigger = ''
  trigger.dataset.slot = 'hover-card-trigger'
  trigger.append(document.createTextNode('Hover Here'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''
  portal.dataset.slot = 'hover-card-portal'

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'profile-hover-card-positioner')
  positioner.dataset.open = ''
  positioner.dataset.side = side
  positioner.dataset.align = 'center'
  positioner.dataset.sideOffset = '4'
  positioner.dataset.alignOffset = '4'
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '5'
  positioner.dataset.arrowPadding = '5'
  positioner.setAttribute('class', positionerClassName)

  const content = document.createElement('div')
  content.setAttribute('id', 'profile-hover-card-popup')
  content.setAttribute('tabindex', '-1')
  content.dataset.open = ''
  content.dataset.side = side
  content.dataset.align = 'center'
  content.dataset.sideOffset = '4'
  content.dataset.alignOffset = '4'
  content.dataset.collisionAvoidance = 'true'
  content.dataset.collisionPadding = '5'
  content.dataset.arrowPadding = '5'
  content.dataset.slot = 'hover-card-content'
  content.setAttribute(
    'class',
    resolvedContentClassName({
      className: options.contentClassName,
      dir: options.dir,
    }),
  )

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  const handle = document.createElement('div')
  handle.setAttribute('class', 'font-semibold')
  handle.append(document.createTextNode('@nextjs'))
  const description = document.createElement('div')
  description.append(
    document.createTextNode(
      'The React Framework - created and maintained by @vercel.',
    ),
  )
  const joined = document.createElement('div')
  joined.setAttribute('class', 'mt-1 text-xs text-muted-foreground')
  joined.append(document.createTextNode('Joined December 2021'))
  content.append(handle, description, joined)

  positioner.append(content)
  portal.append(positioner)
  root.append(portal)
  document.body.append(root)
  const snapshot = snapshotElement(root, {
    click: 'activates',
    Enter: 'native-activates',
    Space: 'native-activates',
    mousedown: 'passes-through',
    pointerdown: 'passes-through',
  })
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'hover-card-demo',
    snapshot: snapshotHoverCard({
      open: true,
      contentClassName: 'flex w-64 flex-col gap-0.5',
    }),
  },
  {
    id: 'hover-card-placement',
    snapshot: snapshotHoverCard({ open: true, side: 'left' }),
  },
  {
    id: 'hover-card-rtl',
    snapshot: snapshotHoverCard({
      open: true,
      dir: 'rtl',
      side: 'inline-start',
      contentClassName: 'flex w-64 flex-col gap-1',
    }),
  },
]
