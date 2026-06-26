import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  id: string
  caseId: string
  inputId: string
  name: string
  label: string
  value: number | null
  textValue: string
  min?: number
  max?: number
  step?: number
  required?: boolean
  disabled?: boolean
  readOnly?: boolean
  invalid?: boolean
}>

const baseKeyboard = {
  click: 'activates',
  Enter: 'suppressed',
  Space: 'suppressed',
  ArrowDown: 'activates',
  ArrowUp: 'activates',
  Home: 'activates',
  End: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const fieldStyle =
  'display: flex; flex-direction: column; align-items: start; gap: 4px; width: 134px;'
const scrubAreaStyle =
  'cursor: ew-resize; font-weight: 700; user-select: none; height: 20px;'
const groupStyle = 'display: flex; height: 32px; width: 134px;'
const inputStyle =
  'box-sizing: border-box; margin: 0; padding: 0 8px; border: 1px solid black; border-radius: 0; width: 70px; height: 32px; font-size: 14px; line-height: 20px; text-align: left; font-variant-numeric: tabular-nums;'
const buttonStyle =
  'box-sizing: border-box; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; margin: 0; padding: 0; border: 1px solid black; border-radius: 0; background-color: white;'
const hiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: absolute;'

const setBooleanAttribute = (
  element: Element,
  name: string,
  value: boolean | undefined,
): Element => {
  if (value === true) {
    element.setAttribute(name, '')
  }

  return element
}

const setDataStates = (
  element: HTMLElement,
  config: CaseConfig,
): HTMLElement => {
  if (config.disabled === true) {
    element.dataset.disabled = ''
  }
  if (config.readOnly === true) {
    element.dataset.readonly = ''
  }
  if (config.required === true) {
    element.dataset.required = ''
  }
  if (config.invalid === true) {
    element.dataset.invalid = ''
  }

  return element
}

const button = (
  label: string,
  inputId: string,
  config: CaseConfig,
): HTMLButtonElement => {
  const element = document.createElement('button')
  element.setAttribute('aria-label', label)
  element.setAttribute('aria-controls', inputId)
  element.setAttribute('tabindex', '-1')
  element.setAttribute('style', buttonStyle)
  setDataStates(element, config)

  if (config.disabled === true || config.readOnly === true) {
    element.setAttribute('disabled', '')
  }

  element.textContent = label === 'Increase' ? '+' : '-'

  return element
}

const renderOriginNumberField = (config: CaseConfig): FixtureSnapshot => {
  const root = document.createElement('div')
  const scrubArea = document.createElement('span')
  const label = document.createElement('label')
  const cursor = document.createElement('span')
  const group = document.createElement('div')
  const input = document.createElement('input')
  const hiddenInput = document.createElement('input')

  root.id = config.id
  root.setAttribute('style', fieldStyle)
  setDataStates(root, config)

  scrubArea.setAttribute('style', scrubAreaStyle)
  setDataStates(scrubArea, config)

  label.setAttribute('for', config.inputId)
  label.textContent = config.label

  cursor.setAttribute('role', 'presentation')
  cursor.setAttribute(
    'style',
    'position: fixed; top: 0; left: 0; pointer-events: none;',
  )
  cursor.textContent = 'cursor'
  setDataStates(cursor, config)

  group.setAttribute('role', 'group')
  group.setAttribute('style', groupStyle)
  setDataStates(group, config)

  input.id = config.inputId
  input.type = 'text'
  input.value = config.textValue
  input.setAttribute('inputmode', 'numeric')
  input.setAttribute('autocomplete', 'off')
  input.setAttribute('autocorrect', 'off')
  input.setAttribute('spellcheck', 'false')
  input.setAttribute('aria-roledescription', 'Number field')
  input.setAttribute('style', inputStyle)
  input.setAttribute('value', config.textValue)
  setBooleanAttribute(input, 'disabled', config.disabled)
  setBooleanAttribute(input, 'required', config.required)
  setBooleanAttribute(input, 'readonly', config.readOnly)
  if (config.invalid === true) {
    input.setAttribute('aria-invalid', 'true')
  }
  setDataStates(input, config)

  hiddenInput.id = `${config.inputId}-hidden-input`
  hiddenInput.type = 'number'
  hiddenInput.name = config.name
  hiddenInput.value = config.value === null ? '' : String(config.value)
  hiddenInput.setAttribute(
    'value',
    config.value === null ? '' : String(config.value),
  )
  hiddenInput.setAttribute('aria-hidden', 'true')
  hiddenInput.setAttribute('tabindex', '-1')
  hiddenInput.setAttribute('style', hiddenInputStyle)
  setBooleanAttribute(hiddenInput, 'disabled', config.disabled)
  setBooleanAttribute(hiddenInput, 'required', config.required)
  setBooleanAttribute(hiddenInput, 'readonly', config.readOnly)
  if (config.min !== undefined) {
    hiddenInput.min = String(config.min)
  }
  if (config.max !== undefined) {
    hiddenInput.max = String(config.max)
  }
  hiddenInput.step = String(config.step ?? 1)

  scrubArea.append(label, cursor)
  group.append(button('Decrease', config.inputId, config), input)
  group.append(button('Increase', config.inputId, config))
  root.append(scrubArea, group, hiddenInput)

  document.body.append(root)
  const snapshot = snapshotElement(
    root,
    config.disabled === true ? suppressedKeyboard : baseKeyboard,
  )
  root.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'hero',
    id: 'amount-field',
    inputId: 'amount',
    name: 'amount',
    label: 'Amount',
    value: 100,
    textValue: '100',
  },
  {
    caseId: 'bounded-step',
    id: 'quantity-field',
    inputId: 'quantity',
    name: 'quantity',
    label: 'Quantity',
    value: 5,
    textValue: '5',
    min: 0,
    max: 10,
    step: 0.5,
    required: true,
  },
  {
    caseId: 'disabled-readonly-invalid',
    id: 'disabled-field',
    inputId: 'disabled-amount',
    name: 'disabledAmount',
    label: 'Disabled amount',
    value: null,
    textValue: 'oops',
    disabled: true,
    readOnly: true,
    invalid: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderOriginNumberField(config),
}))
