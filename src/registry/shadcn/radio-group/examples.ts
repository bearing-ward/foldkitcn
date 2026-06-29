import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import { view as RadioGroup } from './index'
import type {
  RadioGroupItemAttributes,
  RadioGroupItemDescriptor,
  RadioGroupValueChange,
} from './index'

type ExampleItem = Readonly<{
  id: string
  value: string
  label: string
  description?: string
  isDisabled?: boolean
  isInvalid?: boolean
}>

type RenderMode = 'default' | 'description' | 'choice-card'

export type RadioGroupExampleController<Message> = Readonly<{
  value?: string
  idPrefix?: string
  onValueChange?: (change: RadioGroupValueChange) => Message
}>

type RadioExampleConfig<Message> = Readonly<{
  value: string
  items: ReadonlyArray<ExampleItem>
  className?: string
  dir?: string
  idPrefix?: string
  isInvalid?: boolean
  mode?: RenderMode
  onValueChange?: (change: RadioGroupValueChange) => Message
}>

const fieldBaseClassName =
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive'
const fieldHorizontalClassName =
  'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
const fieldContentClassName =
  'group/field-content flex flex-1 flex-col gap-0.5 leading-snug'
const fieldLabelClassName =
  'items-center text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col'
const fieldTitleClassName =
  'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50'
const fieldDescriptionClassName =
  'text-start text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance'
const fieldSetClassName = 'flex w-full max-w-xs min-w-0 flex-col gap-3'
const fieldLegendClassName = 'text-sm font-medium'
const radioDotClassName =
  'absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground'

const densityItems: ReadonlyArray<ExampleItem> = [
  {
    id: 'density-default',
    value: 'default',
    label: 'Default',
    description: 'Standard spacing for most use cases.',
  },
  {
    id: 'density-comfortable',
    value: 'comfortable',
    label: 'Comfortable',
    description: 'More space between elements.',
  },
  {
    id: 'density-compact',
    value: 'compact',
    label: 'Compact',
    description: 'Minimal spacing for dense layouts.',
  },
]

const planItems: ReadonlyArray<ExampleItem> = [
  {
    id: 'plan-monthly',
    value: 'monthly',
    label: 'Monthly ($9.99/month)',
  },
  {
    id: 'plan-yearly',
    value: 'yearly',
    label: 'Yearly ($99.99/year)',
  },
  {
    id: 'plan-lifetime',
    value: 'lifetime',
    label: 'Lifetime ($299.99)',
  },
]

const notificationItems: ReadonlyArray<ExampleItem> = [
  { id: 'notification-email', value: 'email', label: 'Email only' },
  { id: 'notification-sms', value: 'sms', label: 'SMS only' },
  { id: 'notification-both', value: 'both', label: 'Both Email & SMS' },
]

const choiceCardItems: ReadonlyArray<ExampleItem> = [
  {
    id: 'plus-plan',
    value: 'plus',
    label: 'Plus',
    description: 'For individuals and small teams.',
  },
  {
    id: 'pro-plan',
    value: 'pro',
    label: 'Pro',
    description: 'For growing businesses.',
  },
  {
    id: 'enterprise-plan',
    value: 'enterprise',
    label: 'Enterprise',
    description: 'For large teams and enterprises.',
  },
]

const disabledItems: ReadonlyArray<ExampleItem> = [
  {
    id: 'disabled-option-1',
    value: 'option-1',
    label: 'Disabled',
    isDisabled: true,
  },
  { id: 'disabled-option-2', value: 'option-2', label: 'Option 2' },
  { id: 'disabled-option-3', value: 'option-3', label: 'Option 3' },
]

const rtlItems: ReadonlyArray<ExampleItem> = [
  {
    id: 'density-default-rtl',
    value: 'default',
    label: 'افتراضي',
    description: 'تباعد قياسي لمعظم حالات الاستخدام.',
  },
  {
    id: 'density-comfortable-rtl',
    value: 'comfortable',
    label: 'مريح',
    description: 'مساحة أكبر بين العناصر.',
  },
  {
    id: 'density-compact-rtl',
    value: 'compact',
    label: 'مضغوط',
    description: 'تباعد أدنى للتخطيطات الكثيفة.',
  },
]

const idFor = <Message>(
  config: Pick<RadioExampleConfig<Message>, 'idPrefix'>,
  item: Pick<ExampleItem, 'id'>,
): string => `${config.idPrefix ?? ''}${item.id}`

const idReferenceFor = <Message>(
  config: Pick<RadioExampleConfig<Message>, 'idPrefix'>,
  item: Pick<ExampleItem, 'id' | 'value'>,
): Pick<RadioGroupItemDescriptor, 'id' | 'value'> => ({
  id: idFor(config, item),
  value: item.value,
})

const descriptorFor = <Message>(
  config: Pick<RadioExampleConfig<Message>, 'idPrefix'>,
  item: ExampleItem,
): RadioGroupItemDescriptor => ({
  id: idFor(config, item),
  value: item.value,
  ...(item.isDisabled === undefined ? {} : { isDisabled: item.isDisabled }),
  ...(item.isInvalid === undefined ? {} : { isInvalid: item.isInvalid }),
})

const itemId = (item: Pick<RadioGroupItemDescriptor, 'id' | 'value'>): string =>
  item.id ?? item.value

const labelIdFor = (
  item: Pick<RadioGroupItemDescriptor, 'id' | 'value'>,
): string => `${itemId(item)}-label`

const inputIdFor = (
  item: Pick<RadioGroupItemDescriptor, 'id' | 'value'>,
): string => `${itemId(item)}-input`

const itemDefinitionFor = <Message>(
  items: ReadonlyArray<ExampleItem>,
  attributes: RadioGroupItemAttributes<Message>,
): ExampleItem => {
  const definition = items.find(item => item.value === attributes.item.value)

  if (definition === undefined) {
    throw new Error(`Missing radio example item: ${attributes.item.value}`)
  }

  return definition
}

const fieldAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  definition: ExampleItem,
  className?: string,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', 'field'),
  h.DataAttribute('orientation', 'horizontal'),
  h.Class(cn(fieldBaseClassName, fieldHorizontalClassName, className)),
  ...(definition.isDisabled === true
    ? [h.Attribute('data-disabled', 'true')]
    : []),
  ...(definition.isInvalid === true
    ? [h.Attribute('data-invalid', 'true')]
    : []),
]

const changeAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  definition: ExampleItem,
): ReadonlyArray<Attribute<Message>> =>
  config.onValueChange === undefined || definition.isDisabled === true
    ? []
    : [
        h.OnClick(
          config.onValueChange({
            value: definition.value,
            reason: 'none',
            focusSelector: `#${idFor(config, definition)}`,
          }),
        ),
      ]

const radioControl = <Message>(
  h: ReturnType<typeof html<Message>>,
  attributes: RadioGroupItemAttributes<Message>,
): Html =>
  h.span(
    [...attributes.root, h.AriaLabelledBy(labelIdFor(attributes.item))],
    attributes.indicator.length > 0
      ? [
          h.span(
            [...attributes.indicator],
            [h.span([h.Class(radioDotClassName)], [])],
          ),
        ]
      : [],
  )

const radioInput = <Message>(
  h: ReturnType<typeof html<Message>>,
  attributes: RadioGroupItemAttributes<Message>,
): Html => h.input([...attributes.input])

const label = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  definition: ExampleItem,
): Html => {
  const item = idReferenceFor(config, definition)

  return h.label(
    [
      h.Id(labelIdFor(item)),
      h.For(inputIdFor(item)),
      h.DataAttribute('slot', 'field-label'),
      h.Class(fieldLabelClassName),
    ],
    [definition.label],
  )
}

const description = <Message>(
  h: ReturnType<typeof html<Message>>,
  definition: ExampleItem,
): Html =>
  definition.description === undefined
    ? h.empty
    : h.p(
        [
          h.DataAttribute('slot', 'field-description'),
          h.Class(fieldDescriptionClassName),
        ],
        [definition.description],
      )

const defaultField = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  definition: ExampleItem,
  attributes: RadioGroupItemAttributes<Message>,
): Html =>
  h.div(
    [
      ...fieldAttributes(h, definition),
      ...changeAttributes(h, config, definition),
    ],
    [
      radioControl(h, attributes),
      radioInput(h, attributes),
      label(h, config, definition),
    ],
  )

const descriptionField = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  definition: ExampleItem,
  attributes: RadioGroupItemAttributes<Message>,
): Html =>
  h.div(
    [
      ...fieldAttributes(h, definition),
      ...changeAttributes(h, config, definition),
    ],
    [
      radioControl(h, attributes),
      radioInput(h, attributes),
      h.div(
        [
          h.DataAttribute('slot', 'field-content'),
          h.Class(fieldContentClassName),
        ],
        [label(h, config, definition), description(h, definition)],
      ),
    ],
  )

const choiceCardField = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  definition: ExampleItem,
  attributes: RadioGroupItemAttributes<Message>,
): Html => {
  const item = idReferenceFor(config, definition)

  return h.label(
    [
      h.For(inputIdFor(item)),
      h.DataAttribute('slot', 'field-label'),
      h.Class(fieldLabelClassName),
      ...changeAttributes(h, config, definition),
    ],
    [
      h.div(
        [...fieldAttributes(h, definition, 'justify-between')],
        [
          h.div(
            [
              h.DataAttribute('slot', 'field-content'),
              h.Class(fieldContentClassName),
            ],
            [
              h.span(
                [h.Id(labelIdFor(item)), h.Class(fieldTitleClassName)],
                [definition.label],
              ),
              description(h, definition),
            ],
          ),
          radioControl(h, attributes),
          radioInput(h, attributes),
        ],
      ),
    ],
  )
}

const fieldFor = <Message>(
  h: ReturnType<typeof html<Message>>,
  config: RadioExampleConfig<Message>,
  attributes: RadioGroupItemAttributes<Message>,
): Html => {
  const definition = itemDefinitionFor(config.items, attributes)

  if (config.mode === 'choice-card') {
    return choiceCardField(h, config, definition, attributes)
  }

  if (config.mode === 'description') {
    return descriptionField(h, config, definition, attributes)
  }

  return defaultField(h, config, definition, attributes)
}

const radioGroup = <Message>(config: RadioExampleConfig<Message>): Html => {
  const h = html<Message>()

  return RadioGroup<Message>({
    value: config.value,
    items: config.items.map(item => descriptorFor(config, item)),
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    ...(config.isInvalid === undefined ? {} : { isInvalid: config.isInvalid }),
    ...(config.onValueChange === undefined
      ? {}
      : { onValueChange: config.onValueChange }),
    toView: attributes =>
      h.div(
        [...attributes.root],
        attributes.items.map(item => fieldFor(h, config, item)),
      ),
  })
}

export const RadioGroupDemo = <Message = never>({
  value = 'comfortable',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html =>
  radioGroup({
    value,
    items: densityItems,
    className: 'w-fit',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })

export const RadioGroupDescription = <Message = never>({
  value = 'comfortable',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html =>
  radioGroup({
    value,
    items: densityItems,
    className: 'w-fit',
    mode: 'description',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })

export const RadioGroupChoiceCard = <Message = never>({
  value = 'plus',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html =>
  radioGroup({
    value,
    items: choiceCardItems,
    className: 'max-w-sm',
    mode: 'choice-card',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })

export const RadioGroupDisabled = <Message = never>({
  value = 'option-2',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html =>
  radioGroup({
    value,
    items: disabledItems,
    className: 'w-fit',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })

export const RadioGroupFieldset = <Message = never>({
  value = 'monthly',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html => {
  const h = html<Message>()

  return h.fieldset(
    [h.Class(fieldSetClassName)],
    [
      h.legend([h.Class(fieldLegendClassName)], ['Subscription Plan']),
      h.p(
        [h.Class(fieldDescriptionClassName)],
        ['Yearly and lifetime plans offer significant savings.'],
      ),
      radioGroup({
        value,
        items: planItems,
        ...(idPrefix === undefined ? {} : { idPrefix }),
        ...(onValueChange === undefined ? {} : { onValueChange }),
      }),
    ],
  )
}

export const RadioGroupInvalid = <Message = never>({
  value = 'email',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html => {
  const invalidItems = notificationItems.map(item => ({
    ...item,
    isInvalid: true,
  }))

  return radioGroup({
    value,
    items: invalidItems,
    className: 'w-full max-w-xs',
    isInvalid: true,
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })
}

export const RadioGroupRtl = <Message = never>({
  value = 'comfortable',
  idPrefix,
  onValueChange,
}: RadioGroupExampleController<Message> = {}): Html =>
  radioGroup({
    value,
    items: rtlItems,
    className: 'w-fit',
    dir: 'rtl',
    mode: 'description',
    ...(idPrefix === undefined ? {} : { idPrefix }),
    ...(onValueChange === undefined ? {} : { onValueChange }),
  })
