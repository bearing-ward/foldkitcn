import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const checkboxBaseClassName =
  'peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary'
const checkboxIndicatorBaseClassName =
  'grid place-content-center text-current transition-none [&>svg]:size-3.5'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const checkIcon = (): SVGElement => {
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

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M20 6 9 17l-5-5')
  svg.append(path)

  return svg
}

const checkboxRoot = (
  attributes: Readonly<Record<string, string>>,
  withIndicator: boolean,
): FixtureSnapshot => {
  const root = document.createElement('span')
  Object.entries({
    role: 'checkbox',
    tabindex: '0',
    'data-slot': 'checkbox',
    class: checkboxBaseClassName,
    ...attributes,
  }).map(([name, value]) => root.setAttribute(name, value))

  if (withIndicator) {
    const indicator = document.createElement('span')
    const indicatorAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([name]) => name.startsWith('data-')),
    )
    Object.entries({
      ...indicatorAttributes,
      'data-slot': 'checkbox-indicator',
      class: checkboxIndicatorBaseClassName,
    }).map(([name, value]) => indicator.setAttribute(name, value))
    indicator.append(checkIcon())
    root.append(indicator)
  }

  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    attributes['data-disabled'] === '' ||
      attributes['data-indeterminate'] === ''
      ? suppressedKeyboard
      : baseKeyboard,
  )
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'checkbox-basic',
    snapshot: checkboxRoot(
      {
        'aria-checked': 'false',
        'data-unchecked': '',
      },
      false,
    ),
  },
  {
    id: 'checkbox-checked',
    snapshot: checkboxRoot(
      {
        'aria-checked': 'true',
        'data-checked': '',
      },
      true,
    ),
  },
  {
    id: 'checkbox-indeterminate',
    snapshot: checkboxRoot(
      {
        'aria-checked': 'mixed',
        'data-indeterminate': '',
      },
      true,
    ),
  },
  {
    id: 'checkbox-disabled-invalid',
    snapshot: checkboxRoot(
      {
        tabindex: '-1',
        'aria-checked': 'false',
        'aria-disabled': 'true',
        'aria-invalid': 'true',
        'data-unchecked': '',
        'data-disabled': '',
      },
      false,
    ),
  },
]
