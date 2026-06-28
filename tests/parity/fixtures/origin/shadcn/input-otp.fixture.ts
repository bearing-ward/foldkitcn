import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { suppressedKeyboard } from '../../../fixture'
import { snapshotElement } from '../../dom'

type ValidationType = 'numeric' | 'alphanumeric'

type CaseConfig = Readonly<{
  caseId: string
  id: string
  length: number
  groups: ReadonlyArray<ReadonlyArray<number>>
  value?: string
  disabled?: boolean
  invalid?: boolean
  validationType?: ValidationType
}>

const containerClassName =
  'cn-input-otp flex items-center has-disabled:opacity-50'
const inputClassName = 'disabled:cursor-not-allowed'
const groupClassName =
  'flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40'
const slotClassName =
  'relative flex size-8 items-center justify-center border-y border-r border-input text-sm transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-3 data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40'
const separatorClassName =
  "flex items-center [&_svg:not([class*='size-'])]:size-4"
const caretWrapperClassName =
  'pointer-events-none absolute inset-0 flex items-center justify-center'
const caretLineClassName =
  'h-4 w-px animate-caret-blink bg-foreground duration-1000'
const hiddenInputStyle =
  'clip-path: inset(50%); overflow: hidden; white-space: nowrap; border: 0px; padding: 0px; width: 1px; height: 1px; margin: -1px; position: absolute;'

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

const setAttributes = (
  element: Element,
  attributes: Readonly<Record<string, string | undefined>>,
): Element =>
  Object.entries(attributes).reduce((currentElement, [name, value]) => {
    if (value !== undefined) {
      currentElement.setAttribute(name, value)
    }

    return currentElement
  }, element)

const isComplete = (config: CaseConfig): boolean =>
  (config.value ?? '').length === config.length

const activeIndex = (config: CaseConfig): number =>
  Math.min((config.value ?? '').length, config.length - 1)

const validationInputMode = (validationType: ValidationType): string =>
  validationType === 'alphanumeric' ? 'text' : 'numeric'

const slotPattern = (validationType: ValidationType): string =>
  validationType === 'alphanumeric' ? '[a-zA-Z0-9]{1}' : '\\d{1}'

const hiddenInputPattern = (config: CaseConfig): string =>
  config.validationType === 'alphanumeric'
    ? `[a-zA-Z0-9]{${config.length}}`
    : `\\d{${config.length}}`

const inputId = (id: string, index: number): string =>
  index === 0 ? id : `${id}-${index + 1}`

const characters = (config: CaseConfig): ReadonlyArray<string> => [
  ...(config.value ?? ''),
]

const stateAttributes = (
  config: CaseConfig,
): Readonly<Record<string, string | undefined>> => ({
  ...(isComplete(config) ? { 'data-complete': '' } : {}),
  ...((config.value ?? '') === '' ? {} : { 'data-filled': '' }),
  ...(config.disabled === true ? { 'data-disabled': '' } : {}),
})

const appendCaret = (slot: Element): Element => {
  const wrapper = document.createElement('div')
  const line = document.createElement('div')
  wrapper.setAttribute('class', caretWrapperClassName)
  line.setAttribute('class', caretLineClassName)
  wrapper.append(line)
  slot.append(wrapper)

  return slot
}

const slotElement = (config: CaseConfig, index: number): Element => {
  const validationType = config.validationType ?? 'numeric'
  const char = characters(config)[index] ?? ''
  const isActive = activeIndex(config) === index
  const slot = document.createElement('div')

  setAttributes(slot, {
    'data-slot': 'input-otp-slot',
    'data-active': isActive ? 'true' : 'false',
    class: slotClassName,
    ...(config.invalid === true ? { 'aria-invalid': 'true' } : {}),
    ...stateAttributes(config),
  })
  slot.textContent = char

  if (isActive && char === '') {
    appendCaret(slot)
  }

  const input = document.createElement('input')
  setAttributes(input, {
    type: 'text',
    value: char,
    id: inputId(config.id, index),
    inputmode: validationInputMode(validationType),
    autocomplete: index === 0 ? 'one-time-code' : 'off',
    autocorrect: 'off',
    spellcheck: 'false',
    enterkeyhint: index === config.length - 1 ? 'done' : 'next',
    tabindex: isActive ? '0' : '-1',
    pattern: slotPattern(validationType),
    class: inputClassName,
    ...(index === 0 ? { maxlength: String(config.length) } : {}),
    ...(config.disabled === true ? { disabled: '' } : {}),
  })
  slot.append(input)

  return slot
}

const groupElement = (
  config: CaseConfig,
  indexes: ReadonlyArray<number>,
): Element => {
  const group = document.createElement('div')
  setAttributes(group, {
    'data-slot': 'input-otp-group',
    class: groupClassName,
  })
  indexes.reduce((currentGroup, index) => {
    currentGroup.append(slotElement(config, index))

    return currentGroup
  }, group)

  return group
}

const minusIcon = (): SVGElement => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  setAttributes(svg, {
    xmlns: 'http://www.w3.org/2000/svg',
    width: '24',
    height: '24',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    'stroke-width': '2',
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'aria-hidden': 'true',
    'data-icon': 'minus',
    class: 'lucide lucide-minus',
  })

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', 'M5 12h14')
  svg.append(path)

  return svg
}

const separatorElement = (): Element => {
  const separator = document.createElement('div')
  setAttributes(separator, {
    'data-slot': 'input-otp-separator',
    role: 'separator',
    class: separatorClassName,
  })
  separator.append(minusIcon())

  return separator
}

const hiddenInput = (config: CaseConfig): HTMLInputElement => {
  const validationType = config.validationType ?? 'numeric'
  const input = document.createElement('input')
  setAttributes(input, {
    'aria-hidden': 'true',
    inputmode: validationInputMode(validationType),
    style: hiddenInputStyle,
    type: 'text',
    value: config.value ?? '',
    tabindex: '-1',
    minlength: String(config.length),
    maxlength: String(config.length),
    autocomplete: 'one-time-code',
    id: `${config.id}-hidden-input`,
    pattern: hiddenInputPattern(config),
    class: inputClassName,
    ...(config.disabled === true ? { disabled: '' } : {}),
  })

  return input
}

const rootElement = (config: CaseConfig): Element => {
  const root = document.createElement('div')
  setAttributes(root, {
    role: 'group',
    'data-slot': 'input-otp',
    class: containerClassName,
    ...stateAttributes(config),
  })

  config.groups.reduce((currentRoot, indexes, index) => {
    if (index > 0) {
      currentRoot.append(separatorElement())
    }

    currentRoot.append(groupElement(config, indexes))

    return currentRoot
  }, root)
  root.append(hiddenInput(config))

  return root
}

const snapshot = (config: CaseConfig): FixtureSnapshot => {
  const root = rootElement(config)
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
    caseId: 'input-otp-demo',
    id: 'input-otp-demo',
    length: 6,
    value: '123456',
    groups: [[0, 1, 2, 3, 4, 5]],
  },
  {
    caseId: 'input-otp-separator',
    id: 'input-otp-separator',
    length: 6,
    groups: [
      [0, 1],
      [2, 3],
      [4, 5],
    ],
  },
  {
    caseId: 'input-otp-disabled',
    id: 'disabled',
    length: 6,
    value: '123456',
    disabled: true,
    groups: [
      [0, 1, 2],
      [3, 4, 5],
    ],
  },
  {
    caseId: 'input-otp-invalid',
    id: 'input-otp-invalid',
    length: 6,
    value: '000000',
    invalid: true,
    groups: [
      [0, 1],
      [2, 3],
      [4, 5],
    ],
  },
  {
    caseId: 'input-otp-four-digits',
    id: 'input-otp-four-digits',
    length: 4,
    validationType: 'numeric',
    groups: [[0, 1, 2, 3]],
  },
  {
    caseId: 'input-otp-alphanumeric',
    id: 'input-otp-alphanumeric',
    length: 6,
    validationType: 'alphanumeric',
    groups: [
      [0, 1, 2],
      [3, 4, 5],
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: snapshot(config),
}))
