import type { FixtureCase } from '../../../fixture'
import { nativeEnabledKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const overlayClassName =
  'fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'

const contentClassName =
  'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-r-xl data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-l-xl data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm'

const contentRtlClassName =
  'group/drawer-content fixed z-50 flex h-auto flex-col bg-popover text-sm text-popover-foreground data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-xl data-[vaul-drawer-direction=bottom]:border-t data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:start-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:rounded-e-xl data-[vaul-drawer-direction=left]:border-e data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:end-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:rounded-s-xl data-[vaul-drawer-direction=right]:border-s data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-xl data-[vaul-drawer-direction=top]:border-b data-[vaul-drawer-direction=left]:sm:max-w-sm data-[vaul-drawer-direction=right]:sm:max-w-sm'

const handleClassName =
  'mx-auto mt-4 hidden h-1 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block'

const headerClassName =
  'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-left'

const headerRtlClassName =
  'flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-0.5 md:text-start'

const footerClassName = 'mt-auto flex flex-col gap-2 p-4'
const titleClassName = 'cn-font-heading text-base font-medium text-foreground'
const descriptionClassName = 'text-sm text-muted-foreground'

type Direction = 'top' | 'right' | 'bottom' | 'left'

const swipeDirectionFromDirection = (direction: Direction): string => {
  if (direction === 'top') {
    return 'up'
  }

  if (direction === 'left') {
    return 'left'
  }

  if (direction === 'right') {
    return 'right'
  }

  return 'down'
}

const snapshotDrawer = (
  options: Readonly<{
    open: boolean
    direction?: Direction
    dir?: string
  }>,
) => {
  const direction = options.direction ?? 'bottom'
  const swipeDirection = swipeDirectionFromDirection(direction)
  const root = document.createElement('div')
  root.dataset.modal = 'true'
  root.dataset.swipeDirection = swipeDirection
  root.dataset.placement = direction
  root.dataset.slot = 'drawer'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'activity-drawer-popup')
  trigger.dataset.popupOpen = ''
  trigger.dataset.slot = 'drawer-trigger'
  trigger.append(document.createTextNode('Open Drawer'))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'activity-drawer')
  dialog.setAttribute('open', '')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', 'activity-drawer-title')
  dialog.setAttribute('aria-describedby', 'activity-drawer-description')

  const overlay = document.createElement('div')
  overlay.setAttribute('role', 'presentation')
  overlay.dataset.open = ''
  overlay.dataset.slot = 'drawer-overlay'
  overlay.setAttribute('class', overlayClassName)

  const content = document.createElement('div')
  content.setAttribute('id', 'activity-drawer-popup')
  content.setAttribute('role', 'dialog')
  content.setAttribute('tabindex', '-1')
  content.setAttribute('aria-labelledby', 'activity-drawer-title')
  content.setAttribute('aria-describedby', 'activity-drawer-description')
  content.dataset.open = ''
  content.dataset.swipeDirection = swipeDirection
  content.dataset.placement = direction
  content.dataset.vaulDrawerDirection = direction
  content.dataset.slot = 'drawer-content'
  content.setAttribute(
    'class',
    options.dir === 'rtl' ? contentRtlClassName : contentClassName,
  )

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  const handle = document.createElement('div')
  handle.setAttribute('class', handleClassName)

  const header = document.createElement('div')
  header.dataset.slot = 'drawer-header'
  header.setAttribute(
    'class',
    options.dir === 'rtl' ? headerRtlClassName : headerClassName,
  )

  const title = document.createElement('h2')
  title.setAttribute('id', 'activity-drawer-title')
  title.dataset.slot = 'drawer-title'
  title.setAttribute('class', titleClassName)
  title.append(document.createTextNode('Drawer title'))

  const description = document.createElement('p')
  description.setAttribute('id', 'activity-drawer-description')
  description.dataset.slot = 'drawer-description'
  description.setAttribute('class', descriptionClassName)
  description.append(document.createTextNode('Drawer description'))

  const footer = document.createElement('div')
  footer.dataset.slot = 'drawer-footer'
  footer.setAttribute('class', footerClassName)

  const close = document.createElement('button')
  close.setAttribute('type', 'button')
  close.dataset.slot = 'drawer-close'
  close.append(document.createTextNode('Close'))

  header.append(title, description)
  footer.append(close)
  content.append(handle, header, footer)
  dialog.append(overlay, content)
  root.append(dialog)
  document.body.append(root)
  const snapshot = snapshotElement(root, nativeEnabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'drawer-demo',
    snapshot: snapshotDrawer({ open: true }),
  },
  {
    id: 'drawer-right',
    snapshot: snapshotDrawer({ direction: 'right', open: true }),
  },
  {
    id: 'drawer-rtl',
    snapshot: snapshotDrawer({ dir: 'rtl', direction: 'left', open: true }),
  },
]
