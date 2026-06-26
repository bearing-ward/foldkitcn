import type { FixtureCase, FixtureSnapshot } from '../../../fixture'
import { snapshotElement } from '../../dom'

type FieldConfig = Readonly<{
  id: string
  name: string
  label: string
  value?: string
  description?: string
  required?: boolean
  disabled?: boolean
  invalid?: boolean
  error?: string
}>

type CaseConfig = Readonly<{
  caseId: string
  id: string
  action?: string
  method?: string
  invalid?: boolean
  disabled?: boolean
  submitted?: boolean
  submitting?: boolean
  fields: ReadonlyArray<FieldConfig>
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

const setFormState = (element: HTMLElement, config: CaseConfig): void => {
  setBooleanAttribute(element, 'data-valid', config.invalid !== true)
  setBooleanAttribute(element, 'data-invalid', config.invalid)
  setBooleanAttribute(element, 'data-disabled', config.disabled)
  setBooleanAttribute(element, 'data-submitted', config.submitted)
  setBooleanAttribute(element, 'data-submitting', config.submitting)
}

const setFieldState = (element: HTMLElement, config: FieldConfig): void => {
  setBooleanAttribute(element, 'data-disabled', config.disabled)
  setBooleanAttribute(element, 'data-required', config.required)
  setBooleanAttribute(element, 'data-invalid', config.invalid)
}

const renderField = (config: FieldConfig): HTMLElement => {
  const root = document.createElement('div')
  const label = document.createElement('label')
  const control = document.createElement('input')
  const description = document.createElement('p')
  const error = document.createElement('div')
  const descriptionId = `${config.id}-description`
  const errorId = `${config.id}-error`

  root.id = config.id
  root.setAttribute('role', 'group')
  setFieldState(root, config)

  label.id = `${config.id}-label`
  label.setAttribute('for', `${config.id}-control`)
  label.textContent = config.label
  setFieldState(label, config)

  control.id = `${config.id}-control`
  control.name = config.name
  control.setAttribute('aria-labelledby', `${config.id}-label`)
  control.setAttribute(
    'aria-describedby',
    config.invalid === true ? `${descriptionId} ${errorId}` : descriptionId,
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
  setFieldState(control, config)

  description.id = descriptionId
  description.textContent = config.description ?? ''
  setFieldState(description, config)

  root.append(label, control, description)

  if (config.invalid === true && config.error !== undefined) {
    error.id = errorId
    error.textContent = config.error
    setFieldState(error, config)
    root.append(error)
  }

  return root
}

const renderOriginForm = (config: CaseConfig): FixtureSnapshot => {
  const form = document.createElement('form')

  form.id = config.id
  form.noValidate = true
  form.setAttribute('novalidate', '')
  if (config.action !== undefined) {
    form.setAttribute('action', config.action)
  }
  if (config.method !== undefined) {
    form.setAttribute('method', config.method)
  }
  setFormState(form, config)
  config.fields.map(renderField).reduce((currentForm, field) => {
    currentForm.append(field)
    return currentForm
  }, form)

  document.body.append(form)
  const snapshot = snapshotElement(form, {})
  form.remove()

  return snapshot
}

const caseConfigs: ReadonlyArray<CaseConfig> = [
  {
    caseId: 'basic',
    id: 'profile-form',
    action: '/profiles',
    method: 'post',
    fields: [
      {
        id: 'profile-name',
        name: 'name',
        label: 'Name',
        value: 'Ada',
        description: 'Your public display name.',
      },
    ],
  },
  {
    caseId: 'invalid',
    id: 'signup-form',
    invalid: true,
    submitted: true,
    fields: [
      {
        id: 'signup-email',
        name: 'email',
        label: 'Email',
        required: true,
        invalid: true,
        error: 'Email is required',
        description: 'Use your work email.',
      },
    ],
  },
  {
    caseId: 'disabled',
    id: 'disabled-form',
    disabled: true,
    fields: [
      {
        id: 'disabled-url',
        name: 'url',
        label: 'Homepage',
        disabled: true,
        description: 'A verified homepage.',
      },
    ],
  },
]

export const cases: ReadonlyArray<FixtureCase> = caseConfigs.map(config => ({
  id: config.caseId,
  snapshot: renderOriginForm(config),
}))
