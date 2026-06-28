import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  caseId: string
  id: string
  length: number
  value?: string
  name?: string
  grouped?: boolean
  disabled?: boolean
  invalid?: boolean
  fieldInvalid?: boolean
  focused?: boolean
  focusedIndex?: number
  validationType?: 'numeric' | 'alphanumeric'
}>

const baseKeyboard = {
  click: 'activates',
  Enter: 'native-activates',
  Space: 'native-activates',
  ArrowLeft: 'activates',
  ArrowRight: 'activates',
  Backspace: 'activates',
  Delete: 'activates',
  mousedown: 'passes-through',
  pointerdown: 'passes-through',
}

const hiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: absolute;'

const characters = (value: string | undefined): ReadonlyArray<string> => [
  ...(value ?? ''),
]

const inputId = (id: string, index: number): string =>
  index === 0 ? id : `${id}-${index + 1}`

const setBoolean = (
  element: Element,
  name: string,
  value: boolean | undefined,
): void => {
  if (value === true) {
    element.setAttribute(name, '')
  }
}

const appendStateAttributes = (element: Element, config: CaseConfig): void => {
  setBoolean(
    element,
    'data-complete',
    (config.value ?? '').length === config.length,
  )
  setBoolean(element, 'data-disabled', config.disabled)
  setBoolean(element, 'data-invalid', config.fieldInvalid)
  setBoolean(element, 'data-focused', config.focused)
}

const slotInput = (config: CaseConfig, index: number): HTMLInputElement => {
  const input = document.createElement('input')
  const value = characters(config.value)[index] ?? ''

  input.setAttribute('type', 'text')
  input.setAttribute('id', inputId(config.id, index))
  input.setAttribute('value', value)
  input.setAttribute(
    'inputmode',
    config.validationType === 'alphanumeric' ? 'text' : 'numeric',
  )
  input.setAttribute('autocomplete', index === 0 ? 'one-time-code' : 'off')
  input.setAttribute('autocorrect', 'off')
  input.setAttribute('spellcheck', 'false')
  input.setAttribute(
    'enterkeyhint',
    index === config.length - 1 ? 'done' : 'next',
  )
  input.setAttribute(
    'tabindex',
    (config.focused === true
      ? (config.focusedIndex ?? 0)
      : Math.min((config.value ?? '').length, config.length - 1)) === index
      ? '0'
      : '-1',
  )
  input.setAttribute(
    'pattern',
    config.validationType === 'alphanumeric' ? '[a-zA-Z0-9]{1}' : '\\d{1}',
  )

  if (index === 0) {
    input.setAttribute('maxlength', String(config.length))
  }

  if (config.disabled === true) {
    input.setAttribute('disabled', '')
  }
  if (config.invalid === true) {
    input.setAttribute('aria-invalid', 'true')
  }
  if (value !== '') {
    input.dataset.filled = ''
  }
  appendStateAttributes(input, config)

  return input
}

const hiddenInput = (config: CaseConfig): HTMLInputElement => {
  const input = document.createElement('input')

  input.setAttribute('type', 'text')
  input.setAttribute('value', config.value ?? '')
  input.setAttribute('aria-hidden', 'true')
  input.setAttribute('tabindex', '-1')
  input.setAttribute('minlength', String(config.length))
  input.setAttribute('maxlength', String(config.length))
  input.setAttribute('autocomplete', 'one-time-code')
  input.setAttribute(
    'inputmode',
    config.validationType === 'alphanumeric' ? 'text' : 'numeric',
  )
  input.setAttribute('style', hiddenInputStyle)
  input.setAttribute(
    'pattern',
    config.validationType === 'alphanumeric'
      ? `[a-zA-Z0-9]{${config.length}}`
      : `\\d{${config.length}}`,
  )

  if (config.name === undefined) {
    input.setAttribute('id', `${config.id}-hidden-input`)
  } else {
    input.setAttribute('name', config.name)
  }
  if (config.disabled === true) {
    input.setAttribute('disabled', '')
  }

  return input
}

const snapshot = (config: CaseConfig): FixtureSnapshot => {
  const root = document.createElement('div')
  root.setAttribute('role', 'group')
  appendStateAttributes(root, config)
  setBoolean(root, 'data-filled', (config.value ?? '') !== '')

  if (config.grouped === true) {
    const firstGroup = document.createElement('div')
    firstGroup.dataset.testid = 'first-group'
    const secondGroup = document.createElement('div')
    secondGroup.dataset.testid = 'second-group'
    const separator = document.createElement('span')
    separator.setAttribute('role', 'separator')
    separator.textContent = '-'
    Array.from({ length: 3 }, (_item, index) =>
      firstGroup.append(slotInput(config, index)),
    )
    Array.from({ length: 3 }, (_item, index) =>
      secondGroup.append(slotInput(config, index + 3)),
    )
    root.append(firstGroup, separator, secondGroup, hiddenInput(config))
  } else {
    Array.from({ length: config.length }, (_item, index) =>
      root.append(slotInput(config, index)),
    )
    root.append(hiddenInput(config))
  }

  document.body.append(root)
  const result = snapshotElement(
    root,
    config.disabled === true ? suppressedKeyboard : baseKeyboard,
  )
  root.remove()

  return result
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'otp-basic',
    name: 'otp-basic',
    length: 6,
  },
  {
    caseId: 'grouped',
    id: 'otp-grouped',
    length: 6,
    value: '123456',
    grouped: true,
  },
  {
    caseId: 'complete',
    id: 'otp-complete',
    name: 'otp-complete',
    length: 6,
    value: '123456',
    focused: true,
    focusedIndex: 5,
  },
  {
    caseId: 'disabled',
    id: 'otp-disabled',
    name: 'otp-disabled',
    length: 6,
    value: '123456',
    disabled: true,
  },
  {
    caseId: 'invalid',
    id: 'otp-invalid',
    length: 6,
    value: '123',
    invalid: true,
    fieldInvalid: true,
  },
  {
    caseId: 'alphanumeric',
    id: 'otp-alphanumeric',
    length: 6,
    value: 'A1B2C3',
    validationType: 'alphanumeric',
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshot(config),
}))
