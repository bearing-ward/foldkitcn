import type { FixtureCase } from '../../../fixture'
import { snapshotElement } from '../../dom'

const overlayClassName =
  'fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0'
const contentClassName =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentClassNameWithExtra =
  'fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-sm'
const contentRtlClassName =
  'fixed start-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95'
const contentRtlClassNameWithExtra =
  'fixed start-1/2 top-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none rtl:translate-x-1/2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 sm:max-w-sm'
const headerClassName = 'flex flex-col gap-2'
const titleClassName = 'cn-font-heading text-base leading-none font-medium'
const descriptionClassName =
  'text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground'
const closeClassName =
  'group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute top-2 right-2'
const closeRtlClassName =
  'group/button inline-flex shrink-0 items-center justify-center border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4 hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50 size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg absolute end-2 top-2'

const joinClassName = (
  ...classNames: ReadonlyArray<string | undefined>
): string =>
  [...new Set(classNames.filter(Boolean).join(' ').split(' '))]
    .filter(Boolean)
    .join(' ')

const baseContentClassName = (dir: string | undefined): string => {
  if (dir === 'rtl') {
    return contentRtlClassName
  }

  return contentClassName
}

const contentClassNameWithExtraFor = (dir: string | undefined): string => {
  if (dir === 'rtl') {
    return contentRtlClassNameWithExtra
  }

  return contentClassNameWithExtra
}

const snapshotDialog = (
  options: Readonly<{
    open: boolean
    dir?: string
    showCloseButton?: boolean
    contentClassName?: string
  }>,
) => {
  const resolvedContentClassName =
    options.contentClassName === undefined
      ? baseContentClassName(options.dir)
      : joinClassName(
          contentClassNameWithExtraFor(options.dir),
          options.contentClassName,
        )
  const root = document.createElement('div')
  root.dataset.modal = 'true'
  root.dataset.slot = 'dialog'

  if (options.dir !== undefined) {
    root.setAttribute('dir', options.dir)
  }

  const trigger = document.createElement('button')
  trigger.setAttribute('type', 'button')
  trigger.setAttribute('aria-haspopup', 'dialog')
  trigger.setAttribute('aria-expanded', String(options.open))
  trigger.setAttribute('aria-controls', 'profile-dialog-popup')
  trigger.dataset.popupOpen = ''
  trigger.dataset.slot = 'dialog-trigger'
  trigger.append(document.createTextNode('Open Dialog'))
  root.append(trigger)

  const dialog = document.createElement('dialog')
  dialog.setAttribute('id', 'profile-dialog')
  dialog.setAttribute('open', '')
  dialog.setAttribute('role', 'dialog')
  dialog.setAttribute('aria-modal', 'true')
  dialog.setAttribute('aria-labelledby', 'profile-dialog-title')
  dialog.setAttribute('aria-describedby', 'profile-dialog-description')

  const overlay = document.createElement('div')
  overlay.setAttribute('role', 'presentation')
  overlay.dataset.open = ''
  overlay.dataset.slot = 'dialog-overlay'
  overlay.setAttribute('class', overlayClassName)

  const content = document.createElement('div')
  content.setAttribute('id', 'profile-dialog-popup')
  content.setAttribute('role', 'dialog')
  content.setAttribute('tabindex', '-1')
  content.setAttribute('aria-labelledby', 'profile-dialog-title')
  content.setAttribute('aria-describedby', 'profile-dialog-description')
  content.dataset.open = ''
  content.dataset.slot = 'dialog-content'
  content.setAttribute('class', resolvedContentClassName)

  if (options.dir !== undefined) {
    content.setAttribute('dir', options.dir)
  }

  const header = document.createElement('div')
  header.dataset.slot = 'dialog-header'
  header.setAttribute('class', headerClassName)

  const title = document.createElement('h2')
  title.setAttribute('id', 'profile-dialog-title')
  title.dataset.slot = 'dialog-title'
  title.setAttribute('class', titleClassName)
  title.append(document.createTextNode('Dialog title'))

  const description = document.createElement('p')
  description.setAttribute('id', 'profile-dialog-description')
  description.dataset.slot = 'dialog-description'
  description.setAttribute('class', descriptionClassName)
  description.append(document.createTextNode('Dialog description'))

  header.append(title, description)
  content.append(header)

  if (options.showCloseButton !== false) {
    const close = document.createElement('button')
    close.setAttribute('type', 'button')
    close.dataset.slot = 'dialog-close'
    close.setAttribute(
      'class',
      options.dir === 'rtl' ? closeRtlClassName : closeClassName,
    )
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
    const sr = document.createElement('span')
    sr.setAttribute('class', 'sr-only')
    sr.append(document.createTextNode('Close'))
    close.append(svg, sr)
    content.append(close)
  }

  dialog.append(overlay, content)
  root.append(dialog)
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
    id: 'dialog-demo',
    snapshot: snapshotDialog({ open: true, contentClassName: 'sm:max-w-sm' }),
  },
  {
    id: 'dialog-no-close-button',
    snapshot: snapshotDialog({ open: true, showCloseButton: false }),
  },
  {
    id: 'dialog-rtl',
    snapshot: snapshotDialog({
      open: true,
      dir: 'rtl',
      contentClassName: 'sm:max-w-sm',
    }),
  },
]
