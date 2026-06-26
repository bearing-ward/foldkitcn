import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'activates',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const itemDefinitions = [
  { id: 'density-default', value: 'default' },
  { id: 'density-comfortable', value: 'comfortable' },
]

const stateAttributes = (checked: boolean): Readonly<Record<string, string>> =>
  checked ? { 'data-checked': '' } : { 'data-unchecked': '' }

const radioGroupRoot = (
  attributes: Readonly<Record<string, string>>,
  value?: string,
): FixtureSnapshot => {
  const root = document.createElement('div')
  Object.entries({
    role: 'radiogroup',
    ...attributes,
  }).map(([name, attributeValue]) => root.setAttribute(name, attributeValue))

  itemDefinitions.map(item => {
    const checked = value === item.value
    const radio = document.createElement('span')
    Object.entries({
      role: 'radio',
      tabindex:
        attributes['data-disabled'] !== '' &&
        ((value === undefined && item.value === 'default') || checked)
          ? '0'
          : '-1',
      'aria-checked': String(checked),
      id: item.id,
      ...stateAttributes(checked),
      ...(attributes['data-disabled'] === ''
        ? { 'aria-disabled': 'true', 'data-disabled': '' }
        : {}),
      ...(attributes['data-readonly'] === ''
        ? { 'aria-readonly': 'true', 'data-readonly': '' }
        : {}),
      ...(attributes['data-required'] === ''
        ? { 'aria-required': 'true', 'data-required': '' }
        : {}),
    }).map(([name, attributeValue]) => radio.setAttribute(name, attributeValue))

    if (checked) {
      const indicator = document.createElement('span')
      Object.entries({
        ...stateAttributes(checked),
        ...(attributes['data-disabled'] === '' ? { 'data-disabled': '' } : {}),
        ...(attributes['data-readonly'] === '' ? { 'data-readonly': '' } : {}),
        ...(attributes['data-required'] === '' ? { 'data-required': '' } : {}),
      }).map(([name, attributeValue]) =>
        indicator.setAttribute(name, attributeValue),
      )
      radio.append(indicator)
    }

    const input = document.createElement('input')
    Object.entries({
      type: 'radio',
      'aria-hidden': 'true',
      tabindex: '-1',
      value: item.value,
      id: `${item.id}-input`,
      style:
        'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: fixed; top: 0px; left: 0px;',
      ...(attributes['data-disabled'] === '' ? { disabled: '' } : {}),
      ...(attributes['data-readonly'] === '' ? { readonly: '' } : {}),
      ...(attributes['data-required'] === '' ? { required: '' } : {}),
    }).map(([name, attributeValue]) => input.setAttribute(name, attributeValue))

    if (value === item.value) {
      input.setAttribute('checked', '')
    }

    root.append(radio, input)

    return item.value
  })

  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    attributes['data-disabled'] === '' ? suppressedKeyboard : baseKeyboard,
  )
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'unchecked-group',
    snapshot: radioGroupRoot({}),
  },
  {
    id: 'checked-with-indicator',
    snapshot: radioGroupRoot({}, 'comfortable'),
  },
  {
    id: 'disabled-readonly-required',
    snapshot: radioGroupRoot(
      {
        'aria-disabled': 'true',
        'aria-readonly': 'true',
        'aria-required': 'true',
        'data-disabled': '',
        'data-readonly': '',
        'data-required': '',
      },
      'comfortable',
    ),
  },
]
