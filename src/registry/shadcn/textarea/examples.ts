import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import { view as Button } from '../button'
import { view as Textarea } from './index'

type TextareaConfig = Readonly<{
  id?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  invalid?: boolean
  readOnly?: boolean
  rows?: number
  dir?: string
}>

const fieldBaseClassName =
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive'
const fieldVerticalClassName = 'flex-col *:w-full [&>.sr-only]:w-auto'
const labelBaseClassName =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
const fieldLabelClassName =
  'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col'
const fieldDescriptionClassName =
  'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

const textarea = (config: TextareaConfig): Html => {
  const h = html<never>()

  return Textarea<never>({
    id: config.id,
    value: config.value,
    placeholder: config.placeholder,
    isDisabled: config.disabled,
    isInvalid: config.invalid,
    isReadOnly: config.readOnly,
    rows: config.rows,
    dir: config.dir,
    toView: attributes => h.textarea([...attributes.textarea], []),
  })
}

const field = (
  config: Readonly<{
    className?: string
    dir?: string
    disabled?: boolean
    invalid?: boolean
    children: ReadonlyArray<Html | string>
  }>,
): Html => {
  const h = html<never>()

  return h.div(
    [
      h.Role('group'),
      h.DataAttribute('slot', 'field'),
      h.DataAttribute('orientation', 'vertical'),
      h.Class(cn(fieldBaseClassName, fieldVerticalClassName, config.className)),
      ...(config.disabled === true
        ? [h.DataAttribute('disabled', 'true')]
        : []),
      ...(config.invalid === true ? [h.DataAttribute('invalid', 'true')] : []),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
    ],
    config.children,
  )
}

const fieldLabel = (
  config: Readonly<{
    forId: string
    dir?: string
    children: ReadonlyArray<string>
  }>,
): Html => {
  const h = html<never>()

  return h.label(
    [
      h.Attribute('for', config.forId),
      h.DataAttribute('slot', 'field-label'),
      h.Class(cn(labelBaseClassName, fieldLabelClassName)),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
    ],
    config.children,
  )
}

const fieldDescription = (
  config: Readonly<{
    dir?: string
    children: ReadonlyArray<string>
  }>,
): Html => {
  const h = html<never>()

  return h.p(
    [
      h.DataAttribute('slot', 'field-description'),
      h.Class(fieldDescriptionClassName),
      ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
    ],
    config.children,
  )
}

export const TextareaDemo = (): Html =>
  textarea({
    placeholder: 'Type your message here.',
  })

export const TextareaButton = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('grid w-full gap-2')],
    [
      textarea({
        placeholder: 'Type your message here.',
      }),
      Button<never>({
        toView: attributes =>
          h.button([...attributes.button], ['Send message']),
      }),
    ],
  )
}

export const TextareaDisabled = (): Html =>
  field({
    disabled: true,
    children: [
      fieldLabel({
        forId: 'textarea-disabled',
        children: ['Message'],
      }),
      textarea({
        id: 'textarea-disabled',
        placeholder: 'Type your message here.',
        disabled: true,
      }),
    ],
  })

export const TextareaField = (): Html =>
  field({
    children: [
      fieldLabel({
        forId: 'textarea-message',
        children: ['Message'],
      }),
      fieldDescription({
        children: ['Enter your message below.'],
      }),
      textarea({
        id: 'textarea-message',
        placeholder: 'Type your message here.',
      }),
    ],
  })

export const TextareaInvalid = (): Html =>
  field({
    invalid: true,
    children: [
      fieldLabel({
        forId: 'textarea-invalid',
        children: ['Message'],
      }),
      textarea({
        id: 'textarea-invalid',
        placeholder: 'Type your message here.',
        invalid: true,
      }),
      fieldDescription({
        children: ['Please enter a valid message.'],
      }),
    ],
  })

export const TextareaRtl = (): Html =>
  field({
    className: 'w-full max-w-xs',
    dir: 'rtl',
    children: [
      fieldLabel({
        forId: 'feedback',
        dir: 'rtl',
        children: ['التعليقات'],
      }),
      textarea({
        id: 'feedback',
        placeholder: 'تعليقاتك تساعدنا على التحسين...',
        dir: 'rtl',
        rows: 4,
      }),
      fieldDescription({
        dir: 'rtl',
        children: ['شاركنا أفكارك حول خدمتنا.'],
      }),
    ],
  })
