import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import { view as Checkbox } from '../checkbox'
import { view as Input } from '../input'
import { view as Textarea } from '../textarea'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from './index'

const input = (
  config: Readonly<{
    id: string
    type?: string
    placeholder?: string
    required?: boolean
  }>,
): Html => {
  const h = html<never>()

  return Input<never>({
    id: config.id,
    type: config.type,
    placeholder: config.placeholder,
    isRequired: config.required,
    toView: attributes => h.input([...attributes.input]),
  })
}

const checkbox = (
  id: string,
  checkedState: 'checked' | 'unchecked' = 'unchecked',
): Html =>
  Checkbox<never>({
    id,
    checkedState,
  })

const button = (
  text: string,
  variant: 'default' | 'outline' = 'default',
): Html => {
  const h = html<never>()

  return Button<never>({
    variant,
    toView: attributes => h.button([...attributes.button], [text]),
  })
}

export const FieldInput = (): Html =>
  FieldSet<never>({
    className: 'w-full max-w-xs',
    children: [
      FieldGroup<never>({
        children: [
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'username',
                children: ['Username'],
              }),
              input({
                id: 'username',
                type: 'text',
                placeholder: 'Max Leiter',
              }),
              FieldDescription<never>({
                children: ['Choose a unique username for your account.'],
              }),
            ],
          }),
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'password',
                children: ['Password'],
              }),
              FieldDescription<never>({
                children: ['Must be at least 8 characters long.'],
              }),
              input({
                id: 'password',
                type: 'password',
                placeholder: '********',
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const FieldTextarea = (): Html =>
  FieldSet<never>({
    className: 'w-full max-w-xs',
    children: [
      FieldGroup<never>({
        children: [
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'feedback',
                children: ['Feedback'],
              }),
              Textarea<never>({
                id: 'feedback',
                placeholder: 'Your feedback helps us improve...',
                rows: 4,
                toView: attributes => {
                  const h = html<never>()

                  return h.textarea([...attributes.textarea], [])
                },
              }),
              FieldDescription<never>({
                children: ['Share your thoughts about our service.'],
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const FieldFieldset = (): Html =>
  FieldSet<never>({
    className: 'w-full max-w-sm',
    children: [
      FieldLegend<never>({ children: ['Address Information'] }),
      FieldDescription<never>({
        children: ['We need your address to deliver your order.'],
      }),
      FieldGroup<never>({
        children: [
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'field-address-street',
                children: ['Street Address'],
              }),
              input({
                id: 'field-address-street',
                placeholder: '123 Main St',
              }),
            ],
          }),
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'field-address-city',
                children: ['City'],
              }),
              input({ id: 'field-address-city', placeholder: 'New York' }),
            ],
          }),
          Field<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'field-address-postal-code',
                children: ['Postal Code'],
              }),
              input({
                id: 'field-address-postal-code',
                placeholder: '10001',
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const FieldCheckbox = (): Html =>
  FieldGroup<never>({
    className: 'w-full max-w-xs',
    children: [
      FieldSet<never>({
        children: [
          FieldLegend<never>({
            variant: 'label',
            children: ['Show these items on the desktop'],
          }),
          FieldDescription<never>({
            children: ['Select the items you want to show on the desktop.'],
          }),
          FieldGroup<never>({
            className: 'gap-3',
            children: [
              Field<never>({
                orientation: 'horizontal',
                children: [
                  checkbox('finder-pref-hard-disks'),
                  FieldLabel<never>({
                    htmlFor: 'finder-pref-hard-disks',
                    className: 'font-normal',
                    children: ['Hard disks'],
                  }),
                ],
              }),
              Field<never>({
                orientation: 'horizontal',
                children: [
                  checkbox('finder-pref-external-disks'),
                  FieldLabel<never>({
                    htmlFor: 'finder-pref-external-disks',
                    className: 'font-normal',
                    children: ['External disks'],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      FieldSeparator<never>(),
      Field<never>({
        orientation: 'horizontal',
        children: [
          checkbox('finder-pref-sync-folders', 'checked'),
          FieldContent<never>({
            children: [
              FieldLabel<never>({
                htmlFor: 'finder-pref-sync-folders',
                children: ['Sync Desktop & Documents folders'],
              }),
              FieldDescription<never>({
                children: [
                  'Your Desktop & Documents folders are being synced with iCloud Drive.',
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const FieldResponsive = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('w-full max-w-lg')],
    [
      h.form(
        [],
        [
          FieldSet<never>({
            children: [
              FieldLegend<never>({ children: ['Profile'] }),
              FieldDescription<never>({
                children: ['Fill in your profile information.'],
              }),
              FieldGroup<never>({
                children: [
                  Field<never>({
                    orientation: 'responsive',
                    children: [
                      FieldContent<never>({
                        children: [
                          FieldLabel<never>({
                            htmlFor: 'name',
                            children: ['Name'],
                          }),
                          FieldDescription<never>({
                            children: [
                              'Provide your full name for identification',
                            ],
                          }),
                        ],
                      }),
                      input({
                        id: 'name',
                        placeholder: 'Evil Rabbit',
                        required: true,
                      }),
                    ],
                  }),
                  Field<never>({
                    orientation: 'responsive',
                    children: [button('Submit'), button('Cancel', 'outline')],
                  }),
                ],
              }),
            ],
          }),
        ],
      ),
    ],
  )
}

export const FieldRtl = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('w-full max-w-xs py-6'), h.Dir('rtl')],
    [
      FieldGroup<never>({
        dir: 'rtl',
        children: [
          FieldSet<never>({
            dir: 'rtl',
            children: [
              FieldLegend<never>({ dir: 'rtl', children: ['طريقة الدفع'] }),
              FieldDescription<never>({
                dir: 'rtl',
                children: ['جميع المعاملات آمنة ومشفرة'],
              }),
              FieldGroup<never>({
                dir: 'rtl',
                children: [
                  Field<never>({
                    children: [
                      FieldLabel<never>({
                        htmlFor: 'checkout-card-name-rtl',
                        dir: 'rtl',
                        children: ['الاسم على البطاقة'],
                      }),
                      input({
                        id: 'checkout-card-name-rtl',
                        placeholder: 'Evil Rabbit',
                        required: true,
                      }),
                    ],
                  }),
                  Field<never>({
                    orientation: 'horizontal',
                    children: [
                      checkbox('checkout-same-as-shipping-rtl', 'checked'),
                      FieldLabel<never>({
                        htmlFor: 'checkout-same-as-shipping-rtl',
                        className: 'font-normal',
                        dir: 'rtl',
                        children: ['نفس عنوان الشحن'],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  )
}
