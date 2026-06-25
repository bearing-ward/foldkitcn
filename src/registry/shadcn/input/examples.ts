import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Input } from './index'

const input = (
  config: Readonly<{
    id?: string
    type?: string
    placeholder?: string
    value?: string
    disabled?: boolean
    invalid?: boolean
    required?: boolean
  }>,
): Html => {
  const h = html<never>()

  return Input<never>({
    id: config.id,
    type: config.type,
    value: config.value,
    placeholder: config.placeholder,
    isDisabled: config.disabled,
    isInvalid: config.invalid,
    isRequired: config.required,
    toView: attributes => h.input([...attributes.input]),
  })
}

export const InputDemo = (): Html =>
  input({
    id: 'input-demo-api-key',
    type: 'password',
    placeholder: 'sk-...',
  })

export const InputBasic = (): Html =>
  input({
    id: 'input-basic',
    placeholder: 'Enter text',
  })

export const InputDisabled = (): Html =>
  input({
    id: 'input-demo-disabled',
    disabled: true,
    type: 'email',
    placeholder: 'Email',
  })

export const InputInvalid = (): Html =>
  input({
    id: 'input-invalid',
    invalid: true,
    placeholder: 'Error',
  })

export const InputFile = (): Html =>
  input({
    id: 'picture',
    type: 'file',
  })

export const InputRequired = (): Html =>
  input({
    id: 'input-required',
    required: true,
    placeholder: 'This field is required',
  })
