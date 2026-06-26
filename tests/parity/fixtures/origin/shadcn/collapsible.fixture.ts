import * as ShadcnCollapsible from '../../../../../src/registry/shadcn/collapsible'
import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

const enabledKeyboard = {
  click: 'activates',
  Enter: 'activates',
  Space: 'activates',
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

const shadcnCollapsibleRoot = (
  options: Readonly<{
    open: boolean
    disabled?: boolean
    keepMounted?: boolean
    className?: string
    triggerClassName?: string
    contentClassName?: string
    keyboard?: FixtureSnapshot['keyboardBehavior']
  }>,
): FixtureSnapshot => {
  const root = document.createElement('div')
  root.setAttribute(options.open ? 'data-open' : 'data-closed', '')
  root.dataset.slot = 'collapsible'

  const className = ShadcnCollapsible.collapsibleClassName({
    className: options.className,
  })

  if (className !== '') {
    root.setAttribute('class', className)
  }

  const button = document.createElement('button')
  button.setAttribute('type', 'button')
  button.setAttribute('aria-expanded', String(options.open))

  if (options.open) {
    button.setAttribute('aria-controls', 'details-panel')
    button.dataset.panelOpen = ''
  }

  if (options.disabled === true) {
    button.setAttribute('aria-disabled', 'true')
    button.dataset.disabled = ''
  }

  button.dataset.slot = 'collapsible-trigger'
  const triggerClassName = ShadcnCollapsible.collapsibleTriggerClassName({
    className: options.triggerClassName,
  })

  if (triggerClassName !== '') {
    button.setAttribute('class', triggerClassName)
  }

  button.append(document.createTextNode('Toggle details'))
  root.append(button)

  if (options.open || options.keepMounted === true) {
    const panel = document.createElement('div')
    panel.setAttribute('id', 'details-panel')
    panel.setAttribute(options.open ? 'data-open' : 'data-closed', '')

    if (!options.open) {
      panel.setAttribute('hidden', '')
    }

    panel.dataset.slot = 'collapsible-content'
    const contentClassName = ShadcnCollapsible.collapsibleContentClassName({
      className: options.contentClassName,
    })

    if (contentClassName !== '') {
      panel.setAttribute('class', contentClassName)
    }

    panel.append(document.createTextNode('Details content'))
    root.append(panel)
  }

  document.body.append(root)
  const snapshot = snapshotElement(root, options.keyboard ?? enabledKeyboard)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'collapsible-demo',
    snapshot: shadcnCollapsibleRoot({
      open: false,
      className: 'flex w-[350px] flex-col gap-2',
      triggerClassName: 'size-8',
    }),
  },
  {
    id: 'collapsible-open',
    snapshot: shadcnCollapsibleRoot({
      open: true,
      className: 'rounded-md data-open:bg-muted',
      triggerClassName: 'w-full',
      contentClassName: 'flex flex-col gap-2',
    }),
  },
  {
    id: 'collapsible-disabled',
    snapshot: shadcnCollapsibleRoot({
      open: false,
      disabled: true,
      keepMounted: true,
      contentClassName: 'flex flex-col gap-2',
      keyboard: suppressedKeyboard,
    }),
  },
]
