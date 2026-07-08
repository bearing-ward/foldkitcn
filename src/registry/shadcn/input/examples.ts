import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Badge } from '../badge'
import { view as Button } from '../button'
import { ButtonGroup } from '../button-group'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '../field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '../input-group'
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

const button = (text: string, variant: 'default' | 'outline' = 'default') =>
  Button<never>({
    variant,
    toView: attributes => {
      const h = html<never>()

      return h.button([...attributes.button], [text])
    },
  })

export const InputField = (): Html =>
  Field<never>({
    className: 'w-full max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'input-field-username',
        children: ['Username'],
      }),
      input({
        id: 'input-field-username',
        placeholder: 'shadcn',
      }),
      FieldDescription<never>({
        children: ['Choose a unique username for your account.'],
      }),
    ],
  })

export const InputFieldGroup = (): Html => {
  const h = html<never>()

  return FieldGroup<never>({
    className: 'w-full max-w-sm',
    children: [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-group-name',
            children: ['Name'],
          }),
          input({ id: 'input-group-name', placeholder: 'Evil Rabbit' }),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-group-email',
            children: ['Email'],
          }),
          input({
            id: 'input-group-email',
            type: 'email',
            placeholder: 'm@example.com',
          }),
          FieldDescription<never>({
            children: ["We'll send updates to this address."],
          }),
        ],
      }),
      h.div(
        [h.Class('flex gap-2')],
        [button('Reset', 'outline'), button('Submit')],
      ),
    ],
  })
}

export const InputInline = (): Html =>
  Field<never>({
    orientation: 'horizontal',
    className: 'w-full max-w-md items-end',
    children: [
      FieldContent<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-inline-search',
            children: ['Search'],
          }),
          input({
            id: 'input-inline-search',
            type: 'search',
            placeholder: 'Search documentation...',
          }),
        ],
      }),
      button('Search'),
    ],
  })

export const InputGrid = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('grid w-full max-w-md grid-cols-2 gap-4')],
    [
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-grid-first',
            children: ['First Name'],
          }),
          input({ id: 'input-grid-first', placeholder: 'Evil' }),
        ],
      }),
      Field<never>({
        children: [
          FieldLabel<never>({
            htmlFor: 'input-grid-last',
            children: ['Last Name'],
          }),
          input({ id: 'input-grid-last', placeholder: 'Rabbit' }),
        ],
      }),
    ],
  )
}

export const InputBadge = (): Html =>
  Field<never>({
    className: 'w-full max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'input-badge-webhook',
        children: [
          'Webhook URL',
          Badge<never>({
            variant: 'secondary',
            toView: attributes => {
              const h = html<never>()

              return h.span([...attributes.badge], ['Beta'])
            },
          }),
        ],
      }),
      input({
        id: 'input-badge-webhook',
        type: 'url',
        placeholder: 'https://example.com/webhook',
      }),
    ],
  })

export const InputGroupExample = (): Html =>
  Field<never>({
    className: 'w-full max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'input-group-website',
        children: ['Website URL'],
      }),
      InputGroup<never>({
        children: [
          InputGroupAddon<never>({
            children: [InputGroupText<never>({ children: ['https://'] })],
          }),
          InputGroupInput<never>({
            id: 'input-group-website',
            placeholder: 'shadcn.com',
          }),
        ],
      }),
    ],
  })

export const InputButtonGroup = (): Html =>
  Field<never>({
    className: 'w-full max-w-sm',
    children: [
      FieldLabel<never>({
        htmlFor: 'input-button-group-search',
        children: ['Search'],
      }),
      ButtonGroup<never>({
        children: [
          input({
            id: 'input-button-group-search',
            type: 'search',
            placeholder: 'Search...',
          }),
          button('Search'),
        ],
      }),
    ],
  })
