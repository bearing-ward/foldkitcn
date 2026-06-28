import type { FixtureCase } from '../../../fixture'
import { nativeEnabledKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const overlayClassName =
  'fixed inset-0 z-50 bg-black/10 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs'

const contentClassName =
  'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-r data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-l data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm'

const contentRtlClassName =
  'fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition duration-200 ease-in-out data-ending-style:opacity-0 data-starting-style:opacity-0 data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:h-auto data-[side=bottom]:border-t data-[side=bottom]:data-ending-style:translate-y-[2.5rem] data-[side=bottom]:data-starting-style:translate-y-[2.5rem] data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:h-full data-[side=left]:w-3/4 data-[side=left]:border-e data-[side=left]:data-ending-style:translate-x-[-2.5rem] data-[side=left]:data-starting-style:translate-x-[-2.5rem] data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:h-full data-[side=right]:w-3/4 data-[side=right]:border-s data-[side=right]:data-ending-style:translate-x-[2.5rem] data-[side=right]:data-starting-style:translate-x-[2.5rem] data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:h-auto data-[side=top]:border-b data-[side=top]:data-ending-style:translate-y-[-2.5rem] data-[side=top]:data-starting-style:translate-y-[-2.5rem] data-[side=left]:sm:max-w-sm data-[side=right]:sm:max-w-sm rtl:data-[side=left]:data-ending-style:-translate-x-[-2.5rem] rtl:data-[side=left]:data-starting-style:-translate-x-[-2.5rem] rtl:data-[side=right]:data-ending-style:-translate-x-[2.5rem] rtl:data-[side=right]:data-starting-style:-translate-x-[2.5rem]'

const headerClassName = 'flex flex-col gap-0.5 p-4'
const titleClassName = 'cn-font-heading text-base font-medium text-foreground'
const descriptionClassName = 'text-sm text-muted-foreground'
const closeClassName =
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-3 right-3"
const closeRtlClassName =
  "group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute end-3 top-3"

type Side = 'top' | 'right' | 'bottom' | 'left'

const closeIcon = (): SVGSVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', '24')
  svg.setAttribute('height', '24')
  svg.setAttribute('viewBox', '0 0 24 24')
  svg.setAttribute('fill', 'none')
  svg.setAttribute('stroke', 'currentColor')
  svg.setAttribute('stroke-width', '2')
  svg.setAttribute('stroke-linecap', 'round')
  svg.setAttribute('stroke-linejoin', 'round')
  svg.setAttribute('aria-hidden', 'true')
  const firstPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  )
  firstPath.setAttribute('d', 'M18 6 6 18')
  const secondPath = document.createElementNS(
    'http://www.w3.org/2000/svg',
    'path',
  )
  secondPath.setAttribute('d', 'm6 6 12 12')
  svg.append(firstPath, secondPath)

  return svg
}

const snapshotSheet = (
  options: Readonly<{
    open: boolean
    side?: Side
    dir?: string
    showCloseButton?: boolean
  }>,
) => {
  const side = options.side ?? 'right'
  const root = document.createElement('div')
  root.dataset.modal = 'true'
  root.dataset.slot = 'sheet'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'profile-sheet-popup')
  trigger.dataset.popupOpen = ''
  trigger.dataset.slot = 'sheet-trigger'
  trigger.append(document.createTextNode('Open Sheet'))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'profile-sheet')
  dialog.setAttribute('open', '')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', 'profile-sheet-title')
  dialog.setAttribute('aria-describedby', 'profile-sheet-description')

  const overlay = document.createElement('div')
  overlay.setAttribute('role', 'presentation')
  overlay.dataset.open = ''
  overlay.dataset.slot = 'sheet-overlay'
  overlay.setAttribute('class', overlayClassName)

  const content = document.createElement('div')
  content.setAttribute('id', 'profile-sheet-popup')
  content.setAttribute('role', 'dialog')
  content.setAttribute('tabindex', '-1')
  content.setAttribute('aria-labelledby', 'profile-sheet-title')
  content.setAttribute('aria-describedby', 'profile-sheet-description')
  content.dataset.open = ''
  content.dataset.side = side
  content.dataset.slot = 'sheet-content'
  content.setAttribute(
    'class',
    options.dir === 'rtl' ? contentRtlClassName : contentClassName,
  )

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  const header = document.createElement('div')
  header.dataset.slot = 'sheet-header'
  header.setAttribute('class', headerClassName)

  const title = document.createElement('h2')
  title.setAttribute('id', 'profile-sheet-title')
  title.dataset.slot = 'sheet-title'
  title.setAttribute('class', titleClassName)
  title.append(document.createTextNode('Sheet title'))

  const description = document.createElement('p')
  description.setAttribute('id', 'profile-sheet-description')
  description.dataset.slot = 'sheet-description'
  description.setAttribute('class', descriptionClassName)
  description.append(document.createTextNode('Sheet description'))

  header.append(title, description)
  content.append(header)

  if (options.showCloseButton !== false) {
    const close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.dataset.slot = 'sheet-close'
    close.setAttribute(
      'class',
      options.dir === 'rtl' ? closeRtlClassName : closeClassName,
    )
    const sr = document.createElement('span')
    sr.setAttribute('class', 'sr-only')
    sr.append(document.createTextNode('Close'))
    close.append(closeIcon(), sr)
    content.append(close)
  }

  dialog.append(overlay, content)
  root.append(dialog)
  document.body.append(root)
  const snapshot = snapshotElement(root, nativeEnabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'sheet-demo',
    snapshot: snapshotSheet({ open: true }),
  },
  {
    id: 'sheet-left',
    snapshot: snapshotSheet({ open: true, side: 'left' }),
  },
  {
    id: 'sheet-no-close-button',
    snapshot: snapshotSheet({ open: true, showCloseButton: false }),
  },
  {
    id: 'sheet-rtl',
    snapshot: snapshotSheet({ dir: 'rtl', open: true, side: 'left' }),
  },
]
