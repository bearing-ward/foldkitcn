import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const checkboxRoot = (
  attributes: Readonly<Record<string, string>>,
  withIndicator: boolean,
): FixtureSnapshot => {
  const root = document.createElement('span')
  Object.entries(attributes).map(([name, value]) =>
    root.setAttribute(name, value),
  )

  if (withIndicator) {
    const indicator = document.createElement('span')
    const indicatorAttributes = Object.fromEntries(
      Object.entries(attributes).filter(([name]) => name.startsWith('data-')),
    )
    Object.entries(indicatorAttributes).map(([name, value]) =>
      indicator.setAttribute(name, value),
    )
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
    id: 'unchecked',
    snapshot: checkboxRoot(
      {
        role: 'checkbox',
        'aria-checked': 'false',
        tabindex: '0',
        'data-unchecked': '',
      },
      false,
    ),
  },
  {
    id: 'checked-with-indicator',
    snapshot: checkboxRoot(
      {
        role: 'checkbox',
        'aria-checked': 'true',
        tabindex: '0',
        'data-checked': '',
      },
      true,
    ),
  },
  {
    id: 'indeterminate-with-indicator',
    snapshot: checkboxRoot(
      {
        role: 'checkbox',
        'aria-checked': 'mixed',
        tabindex: '0',
        'data-indeterminate': '',
      },
      true,
    ),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: checkboxRoot(
      {
        role: 'checkbox',
        'aria-checked': 'true',
        tabindex: '-1',
        'aria-disabled': 'true',
        'aria-readonly': 'true',
        'aria-required': 'true',
        'data-checked': '',
        'data-disabled': '',
        'data-readonly': '',
        'data-required': '',
      },
      true,
    ),
  },
]
