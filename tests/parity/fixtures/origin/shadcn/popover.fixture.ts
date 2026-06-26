import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

const positionerClassName = 'isolate z-50'
const contentClassName =
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentClassNameWithW80 =
  'z-50 flex origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 w-80'
const contentRtlClassName =
  'z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-start-2 data-[side=inline-start]:slide-in-from-end-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const headerClassName = 'flex flex-col gap-0.5 text-sm'
const titleClassName = 'font-medium'
const descriptionClassName = 'text-muted-foreground'

const resolvedContentClassName = (
  options: Readonly<{ className?: string; dir?: string }>,
): string => {
  if (options.dir === 'rtl') {
    return contentRtlClassName
  }

  if (options.className === 'w-80') {
    return contentClassNameWithW80
  }

  return contentClassName
}

const snapshotPopover = (
  options: Readonly<{
    open: boolean
    align?: string
    contentClassName?: string
    dir?: string
    modal?: boolean | 'trap-focus'
    side?: string
  }>,
) => {
  const side = options.side ?? 'bottom'
  const align = options.align ?? 'center'
  const root = document.createElement('div')
  root.dataset.modal = String(options.modal ?? false)
  root.dataset.side = side
  root.dataset.align = align
  root.dataset.slot = 'popover'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('id', 'profile-popover-trigger')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'profile-popover-popup')
  trigger.dataset.popupOpen = ''
  trigger.dataset.slot = 'popover-trigger'
  trigger.append(document.createTextNode('Open Popover'))
  root.append(trigger)

  const portal = document.createElement('div')
  portal.dataset.portal = ''

  const backdrop = document.createElement('div')
  backdrop.setAttribute('role', 'presentation')
  backdrop.dataset.open = ''

  const positioner = document.createElement('div')
  positioner.setAttribute('id', 'profile-popover-positioner')
  positioner.dataset.open = ''
  positioner.dataset.side = side
  positioner.dataset.align = align
  positioner.dataset.sideOffset = '0'
  positioner.dataset.alignOffset = '0'
  positioner.dataset.collisionAvoidance = 'true'
  positioner.dataset.collisionPadding = '0'
  positioner.setAttribute('class', positionerClassName)

  const content = document.createElement('div')
  content.setAttribute('id', 'profile-popover-popup')
  content.setAttribute('popover', 'manual')
  content.setAttribute('role', 'dialog')
  content.setAttribute('tabindex', '-1')
  content.setAttribute('aria-modal', String((options.modal ?? false) !== false))
  content.setAttribute('aria-labelledby', 'profile-popover-title')
  content.setAttribute('aria-describedby', 'profile-popover-description')
  content.dataset.open = ''
  content.dataset.side = side
  content.dataset.align = align
  content.dataset.sideOffset = '0'
  content.dataset.alignOffset = '0'
  content.dataset.collisionAvoidance = 'true'
  content.dataset.collisionPadding = '0'
  content.dataset.slot = 'popover-content'
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

  const header = document.createElement('div')
  header.dataset.slot = 'popover-header'
  header.setAttribute('class', headerClassName)

  const title = document.createElement('h3')
  title.setAttribute('id', 'profile-popover-title')
  title.dataset.slot = 'popover-title'
  title.setAttribute('class', titleClassName)
  title.append(document.createTextNode('Dimensions'))

  const description = document.createElement('p')
  description.setAttribute('id', 'profile-popover-description')
  description.dataset.slot = 'popover-description'
  description.setAttribute('class', descriptionClassName)
  description.append(
    document.createTextNode('Set the dimensions for the layer.'),
  )

  header.append(title, description)
  content.append(header)
  positioner.append(content)
  portal.append(backdrop, positioner)
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
    id: 'popover-basic',
    snapshot: snapshotPopover({ open: true, align: 'start' }),
  },
  {
    id: 'popover-demo',
    snapshot: snapshotPopover({ open: true, contentClassName: 'w-80' }),
  },
  {
    id: 'popover-modal',
    snapshot: snapshotPopover({ open: true, modal: true }),
  },
  {
    id: 'popover-rtl',
    snapshot: snapshotPopover({
      open: true,
      dir: 'rtl',
      side: 'inline-start',
    }),
  },
]
