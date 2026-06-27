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

const stateAttributes = (checked: boolean): Readonly<Record<string, string>> =>
  checked ? { 'data-checked': '' } : { 'data-unchecked': '' }

const radioRoot = (
  attributes: Readonly<Record<string, string>>,
  checked: boolean,
): FixtureSnapshot => {
  const root = document.createElement('span')
  Object.entries({
    role: 'radio',
    'aria-checked': String(checked),
    tabindex: attributes['data-disabled'] === '' ? '-1' : '0',
    ...stateAttributes(checked),
    ...attributes,
  }).map(([name, value]) => root.setAttribute(name, value))

  if (checked) {
    const indicator = document.createElement('span')
    Object.entries({
      ...stateAttributes(checked),
      ...(attributes['data-disabled'] === '' ? { 'data-disabled': '' } : {}),
      ...(attributes['data-readonly'] === '' ? { 'data-readonly': '' } : {}),
      ...(attributes['data-required'] === '' ? { 'data-required': '' } : {}),
    }).map(([name, value]) => indicator.setAttribute(name, value))
    root.append(indicator)
  }

  const input = document.createElement('input')
  Object.entries({
    type: 'radio',
    'aria-hidden': 'true',
    tabindex: '-1',
    style:
      'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: fixed; top: 0px; left: 0px;',
    ...(attributes['data-disabled'] === '' ? { disabled: '' } : {}),
    ...(attributes['data-readonly'] === '' ? { readonly: '' } : {}),
    ...(attributes['data-required'] === '' ? { required: '' } : {}),
  }).map(([name, value]) => input.setAttribute(name, value))

  if (checked) {
    input.setAttribute('checked', '')
  }

  root.append(input)
  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    attributes['data-disabled'] === '' || checked
      ? suppressedKeyboard
      : baseKeyboard,
  )
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked',
    snapshot: radioRoot({}, false),
  },
  {
    id: 'checked-with-indicator',
    snapshot: radioRoot({}, true),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: radioRoot(
      {
        'aria-disabled': 'true',
        'aria-readonly': 'true',
        'aria-required': 'true',
        'data-disabled': '',
        'data-readonly': '',
        'data-required': '',
      },
      true,
    ),
  },
]
