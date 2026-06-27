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

const visuallyHiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: fixed; top: 0px; left: 0px;'

const items = [
  { id: 'apple-fuji', value: 'fuji-apple' },
  { id: 'apple-gala', value: 'gala-apple' },
  { id: 'apple-granny', value: 'granny-smith-apple' },
]

interface CheckboxGroupFixtureOptions {
  readonly value: ReadonlyArray<string>
  readonly name?: string
  readonly hasParent?: boolean
  readonly isDisabled?: boolean
  readonly isRequired?: boolean
}

const checkboxState = (
  value: ReadonlyArray<string>,
  itemValue: string,
): 'checked' | 'unchecked' =>
  value.includes(itemValue) ? 'checked' : 'unchecked'

const parentState = (
  value: ReadonlyArray<string>,
): 'checked' | 'unchecked' | 'indeterminate' => {
  if (value.length === 0) {
    return 'unchecked'
  }

  return value.length === items.length ? 'checked' : 'indeterminate'
}

const checkedStateAttributes = (
  state: 'checked' | 'unchecked' | 'indeterminate',
): Readonly<Record<string, string>> =>
  state === 'indeterminate'
    ? { 'data-indeterminate': '' }
    : { [`data-${state}`]: '' }

const ariaChecked = (
  state: 'checked' | 'unchecked' | 'indeterminate',
): string => {
  if (state === 'indeterminate') {
    return 'mixed'
  }

  return state === 'checked' ? 'true' : 'false'
}

const appendIndicator = (
  root: HTMLElement,
  state: 'checked' | 'unchecked' | 'indeterminate',
  includeWhenUnchecked: boolean,
  options: CheckboxGroupFixtureOptions,
): void => {
  if (!includeWhenUnchecked && state === 'unchecked') {
    return
  }

  const indicator = document.createElement('span')
  Object.entries({
    ...checkedStateAttributes(state),
    ...(options.isDisabled === true ? { 'data-disabled': '' } : {}),
    ...(options.isRequired === true ? { 'data-required': '' } : {}),
  }).map(([name, value]) => indicator.setAttribute(name, value))
  root.append(indicator)
}

const appendInput = (
  root: HTMLElement,
  id: string,
  value: string | undefined,
  checked: boolean,
  options: CheckboxGroupFixtureOptions,
): void => {
  const input = document.createElement('input')
  Object.entries({
    type: 'checkbox',
    'aria-hidden': 'true',
    tabindex: '-1',
    style: visuallyHiddenInputStyle,
    id: `${id}-input`,
    ...(value === undefined ? {} : { value }),
    ...(options.name === undefined ? {} : { name: options.name }),
    ...(options.isDisabled === true ? { disabled: '' } : {}),
    ...(options.isRequired === true ? { required: '' } : {}),
  }).map(([name, attributeValue]) => input.setAttribute(name, attributeValue))

  if (checked) {
    input.setAttribute('checked', '')
  }

  root.append(input)
}

const appendParent = (
  root: HTMLElement,
  options: CheckboxGroupFixtureOptions,
): void => {
  if (options.hasParent !== true) {
    return
  }

  const state = parentState(options.value)
  const parent = document.createElement('span')
  Object.entries({
    role: 'checkbox',
    'aria-checked': ariaChecked(state),
    tabindex: options.isDisabled === true ? '-1' : '0',
    'data-parent': '',
    id: 'apples-parent',
    'aria-controls': 'apple-fuji apple-gala apple-granny',
    ...checkedStateAttributes(state),
    ...(options.isDisabled === true
      ? { 'aria-disabled': 'true', 'data-disabled': '' }
      : {}),
    ...(options.isRequired === true
      ? { 'aria-required': 'true', 'data-required': '' }
      : {}),
  }).map(([name, value]) => parent.setAttribute(name, value))

  appendIndicator(parent, state, true, options)
  root.append(parent)
  appendInput(root, 'apples-parent', undefined, state === 'checked', options)
}

const appendItem = (
  root: HTMLElement,
  item: (typeof items)[number],
  options: CheckboxGroupFixtureOptions,
): void => {
  const state = checkboxState(options.value, item.value)
  const checkbox = document.createElement('span')
  Object.entries({
    role: 'checkbox',
    'aria-checked': ariaChecked(state),
    tabindex: options.isDisabled === true ? '-1' : '0',
    id: item.id,
    ...checkedStateAttributes(state),
    ...(options.isDisabled === true
      ? { 'aria-disabled': 'true', 'data-disabled': '' }
      : {}),
    ...(options.isRequired === true
      ? { 'aria-required': 'true', 'data-required': '' }
      : {}),
  }).map(([name, value]) => checkbox.setAttribute(name, value))

  appendIndicator(checkbox, state, false, options)
  root.append(checkbox)
  appendInput(root, item.id, item.value, state === 'checked', options)
}

const checkboxGroupRoot = (
  options: CheckboxGroupFixtureOptions,
  keyboardBehavior: FixtureSnapshot['keyboardBehavior'] = baseKeyboard,
): FixtureSnapshot => {
  const root = document.createElement('div')
  Object.entries({
    role: 'group',
    id: 'apples',
    'aria-labelledby': 'apples-caption',
    ...(options.isDisabled === true
      ? { 'aria-disabled': 'true', 'data-disabled': '' }
      : {}),
    ...(options.isRequired === true
      ? { 'aria-required': 'true', 'data-required': '' }
      : {}),
  }).map(([name, value]) => root.setAttribute(name, value))

  appendParent(root, options)
  items.map(item => appendItem(root, item, options))

  document.body.append(root)
  const snapshot = snapshotElement(root, keyboardBehavior)
  root.remove()

  return snapshot
}

export const cases: ReadonlyArray<FixtureCase> = [
  {
    id: 'hero-default-value',
    snapshot: checkboxGroupRoot({
      value: ['fuji-apple'],
      name: 'apple',
    }),
  },
  {
    id: 'parent-mixed',
    snapshot: checkboxGroupRoot({
      value: ['fuji-apple'],
      hasParent: true,
    }),
  },
  {
    id: 'disabled-required',
    snapshot: checkboxGroupRoot(
      {
        value: ['fuji-apple'],
        name: 'apple',
        isDisabled: true,
        isRequired: true,
      },
      suppressedKeyboard,
    ),
  },
]
