import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

const radioGroupBaseClassName = 'grid w-full gap-2'
const radioGroupItemBaseClassName =
  'group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary'
const radioGroupIndicatorBaseClassName =
  'flex size-4 items-center justify-center'
const radioGroupDotClassName =
  'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground'

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
    'data-slot': 'radio-group',
    class: radioGroupBaseClassName,
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
      'data-slot': 'radio-group-item',
      class: radioGroupItemBaseClassName,
      ...stateAttributes(checked),
      ...(attributes['data-disabled'] === ''
        ? { 'aria-disabled': 'true', 'data-disabled': '' }
        : {}),
      ...(attributes['aria-invalid'] === 'true'
        ? { 'aria-invalid': 'true' }
        : {}),
    }).map(([name, attributeValue]) => radio.setAttribute(name, attributeValue))

    if (checked) {
      const indicator = document.createElement('span')
      Object.entries({
        'data-slot': 'radio-group-indicator',
        class: radioGroupIndicatorBaseClassName,
        ...stateAttributes(checked),
        ...(attributes['data-disabled'] === '' ? { 'data-disabled': '' } : {}),
      }).map(([name, attributeValue]) =>
        indicator.setAttribute(name, attributeValue),
      )
      const dot = document.createElement('span')
      dot.setAttribute('class', radioGroupDotClassName)
      indicator.append(dot)
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
    id: 'radio-group-basic',
    snapshot: radioGroupRoot({}),
  },
  {
    id: 'radio-group-checked',
    snapshot: radioGroupRoot({}, 'comfortable'),
  },
  {
    id: 'radio-group-disabled-invalid',
    snapshot: radioGroupRoot(
      {
        'aria-disabled': 'true',
        'aria-invalid': 'true',
        'data-disabled': '',
      },
      'default',
    ),
  },
]
