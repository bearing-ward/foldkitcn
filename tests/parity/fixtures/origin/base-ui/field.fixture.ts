import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type CaseConfig = Readonly<{
  caseId: string
  id: string
  name: string
  label: string
  description: string
  value?: string
  required?: boolean
  disabled?: boolean
  valid?: boolean
  invalid?: boolean
  touched?: boolean
  dirty?: boolean
  error?: string
}>

const setBooleanAttribute = (
  element: Element,
  name: string,
  value: boolean | undefined,
): void => {
  if (value === true) {
    element.setAttribute(name, '')
  }
}

const setDataStates = (element: HTMLElement, config: CaseConfig): void => {
  setBooleanAttribute(element, 'data-disabled', config.disabled)
  setBooleanAttribute(element, 'data-required', config.required)
  setBooleanAttribute(element, 'data-valid', config.valid)
  setBooleanAttribute(element, 'data-invalid', config.invalid)
  setBooleanAttribute(element, 'data-touched', config.touched)
  setBooleanAttribute(element, 'data-dirty', config.dirty)
}

const renderOriginField = (config: CaseConfig): FixtureSnapshot => {
  const root = document.createElement('div')
  const label = document.createElement('label')
  const control = document.createElement('input')
  const description = document.createElement('p')
  const error = document.createElement('div')

  root.id = config.id
  root.setAttribute('role', 'group')
  setDataStates(root, config)

  label.id = `${config.id}-label`
  label.setAttribute('for', `${config.id}-control`)
  label.textContent = config.label
  setDataStates(label, config)

  control.id = `${config.id}-control`
  control.name = config.name
  control.setAttribute('aria-labelledby', `${config.id}-label`)
  control.setAttribute(
    'aria-describedby',
    config.invalid === true
      ? `${config.id}-description ${config.id}-error`
      : `${config.id}-description`,
  )
  if (config.value !== undefined) {
    control.value = config.value
    control.setAttribute('value', config.value)
  }
  if (config.disabled === true) {
    control.disabled = true
  }
  if (config.required === true) {
    control.required = true
  }
  if (config.invalid === true) {
    control.setAttribute('aria-invalid', 'true')
  }
  setDataStates(control, config)

  description.id = `${config.id}-description`
  description.textContent = config.description
  setDataStates(description, config)

  root.append(label, control, description)

  if (config.invalid === true && config.error !== undefined) {
    error.id = `${config.id}-error`
    error.textContent = config.error
    setDataStates(error, config)
    root.append(error)
  }

  document.body.append(root)
  const snapshot = snapshotElement(root, {})
  root.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'profile',
    name: 'profile',
    value: 'Ada',
    label: 'Name',
    description: 'Your public display name.',
  },
  {
    caseId: 'invalid',
    id: 'email',
    name: 'email',
    label: 'Email',
    description: 'Use your work email.',
    required: true,
    invalid: true,
    touched: true,
    dirty: true,
    error: 'Email is required',
  },
  {
    caseId: 'disabled-valid',
    id: 'team',
    name: 'team',
    label: 'Team',
    description: 'Assigned team.',
    disabled: true,
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderOriginField(config),
}))
