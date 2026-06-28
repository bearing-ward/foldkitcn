import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { view as Button } from '../button'
import { Field, FieldDescription, FieldLabel } from '../field'
import { InputOTPGroup, InputOTPSeparator, view as InputOTP } from './index'

const otp = (
  config: Readonly<{
    id?: string
    value?: string
    length?: number
    validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none'
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    dir?: string
    groupClassName?: string
    separatorClassName?: string
  }>,
): Html =>
  InputOTP<never>({
    id: config.id,
    length: config.length ?? 6,
    value: config.value,
    validationType: config.validationType,
    isDisabled: config.disabled,
    isInvalid: config.invalid,
    isRequired: config.required,
    dir: config.dir,
    toView: attributes =>
      InputOTPGroup<never>({
        attributes,
        indexes: Array.from(
          { length: attributes.state.length },
          (_item, index) => index,
        ),
        className: config.groupClassName,
      }),
  })

const splitOtp = (
  config: Readonly<{
    id?: string
    value?: string
    validationType?: 'numeric' | 'alpha' | 'alphanumeric' | 'none'
    disabled?: boolean
    invalid?: boolean
    required?: boolean
    large?: boolean
  }>,
): Html =>
  InputOTP<never>({
    id: config.id,
    length: 6,
    value: config.value,
    validationType: config.validationType,
    isDisabled: config.disabled,
    isInvalid: config.invalid,
    isRequired: config.required,
    groupClassName: config.large
      ? '*:data-[slot=input-otp-slot]:h-12 *:data-[slot=input-otp-slot]:w-11 *:data-[slot=input-otp-slot]:text-xl'
      : undefined,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          InputOTPGroup<never>({
            attributes,
            indexes: [0, 1, 2],
          }),
          InputOTPSeparator<never>(),
          InputOTPGroup<never>({
            attributes,
            indexes: [3, 4, 5],
          }),
          h.input([...attributes.hiddenInput]),
        ],
      )
    },
  })

export const InputOTPDemo = (): Html =>
  otp({
    id: 'input-otp-demo',
    value: '123456',
  })

export const InputOTPSeparatorExample = (): Html =>
  InputOTP<never>({
    id: 'input-otp-separator',
    length: 6,
    toView: attributes => {
      const h = html<never>()

      return h.div(
        [...attributes.root],
        [
          InputOTPGroup<never>({ attributes, indexes: [0, 1] }),
          InputOTPSeparator<never>(),
          InputOTPGroup<never>({ attributes, indexes: [2, 3] }),
          InputOTPSeparator<never>(),
          InputOTPGroup<never>({ attributes, indexes: [4, 5] }),
          h.input([...attributes.hiddenInput]),
        ],
      )
    },
  })

export const InputOTPDisabled = (): Html =>
  splitOtp({
    id: 'disabled',
    value: '123456',
    disabled: true,
  })

export const InputOTPAlphanumeric = (): Html =>
  splitOtp({
    id: 'input-otp-alphanumeric',
    validationType: 'alphanumeric',
  })

export const InputOTPFourDigits = (): Html =>
  otp({
    id: 'input-otp-four-digits',
    length: 4,
    validationType: 'numeric',
  })

export const InputOTPInvalid = (): Html =>
  splitOtp({
    id: 'input-otp-invalid',
    value: '000000',
    invalid: true,
  })

export const InputOTPPattern = (): Html =>
  Field<never>({
    className: 'w-fit',
    children: [
      FieldLabel<never>({
        htmlFor: 'digits-only',
        children: ['Digits Only'],
      }),
      otp({
        id: 'digits-only',
        validationType: 'numeric',
      }),
    ],
  })

export const InputOTPControlled = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('space-y-2')],
    [
      otp({
        id: 'input-otp-controlled',
        value: '',
      }),
      h.div(
        [h.Class('text-center text-sm')],
        ['Enter your one-time password.'],
      ),
    ],
  )
}

export const InputOTPRtl = (): Html =>
  html<never>().div(
    [html<never>().Dir('rtl')],
    [
      Field<never>({
        className: 'mx-auto max-w-xs',
        children: [
          FieldLabel<never>({
            htmlFor: 'input-otp-rtl',
            dir: 'rtl',
            children: ['رمز التحقق'],
          }),
          otp({
            id: 'input-otp-rtl',
            value: '123456',
            dir: 'rtl',
          }),
        ],
      }),
    ],
  )

const localCard = (children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return h.div(
    [
      h.DataAttribute('slot', 'card'),
      h.Class(
        'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm mx-auto max-w-md',
      ),
    ],
    children,
  )
}

export const InputOTPForm = (): Html => {
  const h = html<never>()

  return localCard([
    h.div(
      [
        h.DataAttribute('slot', 'card-header'),
        h.Class(
          'grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6',
        ),
      ],
      [
        h.div(
          [
            h.DataAttribute('slot', 'card-title'),
            h.Class('leading-none font-semibold'),
          ],
          ['Verify your login'],
        ),
        h.div(
          [
            h.DataAttribute('slot', 'card-description'),
            h.Class('text-muted-foreground text-sm'),
          ],
          [
            'Enter the verification code we sent to your email address: m@example.com.',
          ],
        ),
      ],
    ),
    h.div(
      [h.DataAttribute('slot', 'card-content'), h.Class('px-6')],
      [
        Field<never>({
          children: [
            h.div(
              [h.Class('flex items-center justify-between')],
              [
                FieldLabel<never>({
                  htmlFor: 'otp-verification',
                  children: ['Verification code'],
                }),
                Button<never>({
                  variant: 'outline',
                  size: 'xs',
                  toView: attributes =>
                    h.button([...attributes.button], ['Resend Code']),
                }),
              ],
            ),
            splitOtp({
              id: 'otp-verification',
              required: true,
              large: true,
            }),
            FieldDescription<never>({
              children: ['I no longer have access to this email address.'],
            }),
          ],
        }),
      ],
    ),
  ])
}
