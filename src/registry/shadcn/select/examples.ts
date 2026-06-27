import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import type { SelectItemDescriptor } from './index'
import { displayValue, view as Select } from './index'

const fruitItems: ReadonlyArray<SelectItemDescriptor> = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Blueberry', value: 'blueberry' },
  { label: 'Grapes', value: 'grapes' },
  { label: 'Pineapple', value: 'pineapple' },
]

const vegetableItems: ReadonlyArray<SelectItemDescriptor> = [
  { label: 'Carrot', value: 'carrot' },
  { label: 'Broccoli', value: 'broccoli' },
  { label: 'Spinach', value: 'spinach' },
]

const timezoneGroups: ReadonlyArray<
  Readonly<{
    label: string
    items: ReadonlyArray<SelectItemDescriptor>
  }>
> = [
  {
    label: 'North America',
    items: [
      { label: 'Eastern Standard Time', value: 'est' },
      { label: 'Central Standard Time', value: 'cst' },
      { label: 'Mountain Standard Time', value: 'mst' },
      { label: 'Pacific Standard Time', value: 'pst' },
      { label: 'Alaska Standard Time', value: 'akst' },
      { label: 'Hawaii Standard Time', value: 'hst' },
    ],
  },
  {
    label: 'Europe & Africa',
    items: [
      { label: 'Greenwich Mean Time', value: 'gmt' },
      { label: 'Central European Time', value: 'cet' },
      { label: 'Eastern European Time', value: 'eet' },
      { label: 'Western European Summer Time', value: 'west' },
      { label: 'Central Africa Time', value: 'cat' },
      { label: 'East Africa Time', value: 'eat' },
    ],
  },
  {
    label: 'Asia',
    items: [
      { label: 'Moscow Time', value: 'msk' },
      { label: 'India Standard Time', value: 'ist' },
      { label: 'China Standard Time', value: 'cst_china' },
      { label: 'Japan Standard Time', value: 'jst' },
      { label: 'Korea Standard Time', value: 'kst' },
      { label: 'Indonesia Central Standard Time', value: 'ist_indonesia' },
    ],
  },
  {
    label: 'Australia & Pacific',
    items: [
      { label: 'Australian Western Standard Time', value: 'awst' },
      { label: 'Australian Central Standard Time', value: 'acst' },
      { label: 'Australian Eastern Standard Time', value: 'aest' },
      { label: 'New Zealand Standard Time', value: 'nzst' },
      { label: 'Fiji Time', value: 'fjt' },
    ],
  },
  {
    label: 'South America',
    items: [
      { label: 'Argentina Time', value: 'art' },
      { label: 'Bolivia Time', value: 'bot' },
      { label: 'Brasilia Time', value: 'brt' },
      { label: 'Chile Standard Time', value: 'clt' },
    ],
  },
]

const fieldClassName = 'grid gap-2'
const fieldGroupClassName = 'grid w-full max-w-xs gap-4'
const fieldLabelClassName = 'text-sm font-medium'
const fieldDescriptionClassName = 'text-sm text-muted-foreground'
const fieldErrorClassName = 'text-sm text-destructive'
const switchClassName =
  'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-transparent bg-input shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary'

const allTimezones = (): ReadonlyArray<SelectItemDescriptor> =>
  timezoneGroups.flatMap(group => group.items)

const selectShell = (
  config: Readonly<{
    id: string
    items: ReadonlyArray<SelectItemDescriptor>
    placeholder: string
    value?: string
    highlightedValue?: string
    disabled?: boolean
    invalid?: boolean
    triggerClassName?: string
    contentClassName?: string
    alignItemWithTrigger?: boolean
    dir?: string
    groups?: ReadonlyArray<
      Readonly<{
        label?: string
        items: ReadonlyArray<SelectItemDescriptor>
      }>
    >
  }>,
): Html => {
  const h = html<never>()
  const groups = config.groups ?? [{ items: config.items }]

  return Select<never>({
    id: config.id,
    open: true,
    items: config.items,
    value: config.value,
    highlightedValue: config.highlightedValue,
    placeholder: config.placeholder,
    isDisabled: config.disabled,
    isInvalid: config.invalid,
    triggerClassName: config.triggerClassName,
    contentClassName: config.contentClassName,
    alignItemWithTrigger: config.alignItemWithTrigger,
    dir: config.dir,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [...attributes.trigger],
            [
              h.span([...attributes.value], [displayValue(config)]),
              h.span([...attributes.icon], ['v']),
            ],
          ),
          h.div(
            [...attributes.portal],
            [
              h.div([...attributes.backdrop.root], []),
              h.div(
                [...attributes.positioner.root],
                [
                  h.div(
                    [...attributes.popup.root],
                    [
                      h.div([...attributes.scrollUp.root], ['^']),
                      h.div(
                        [...attributes.list.root],
                        groups.flatMap((group, index) => [
                          h.div(
                            [...attributes.group],
                            [
                              ...(group.label === undefined
                                ? []
                                : [
                                    h.div(
                                      [...attributes.groupLabel],
                                      [group.label],
                                    ),
                                  ]),
                              ...attributes.items
                                .filter(itemAttributes =>
                                  group.items.some(
                                    item =>
                                      item.value === itemAttributes.item.value,
                                  ),
                                )
                                .map(itemAttributes =>
                                  h.div(
                                    [...itemAttributes.root],
                                    [
                                      h.span(
                                        [...itemAttributes.text],
                                        [itemAttributes.item.label],
                                      ),
                                      h.span([...itemAttributes.indicator], []),
                                    ],
                                  ),
                                ),
                            ],
                          ),
                          ...(index === groups.length - 1
                            ? []
                            : [h.div([...attributes.separator], [])]),
                        ]),
                      ),
                      h.div([...attributes.scrollDown.root], ['v']),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

export const SelectDemo = (): Html =>
  selectShell({
    id: 'select-demo',
    items: fruitItems,
    placeholder: 'Select a fruit',
    triggerClassName: 'w-full max-w-48',
    groups: [{ label: 'Fruits', items: fruitItems }],
  })

export const SelectDisabled = (): Html =>
  selectShell({
    id: 'select-disabled',
    items: fruitItems.map(item =>
      item.value === 'grapes' ? { ...item, isDisabled: true } : item,
    ),
    placeholder: 'Select a fruit',
    disabled: true,
    triggerClassName: 'w-full max-w-48',
  })

export const SelectGroups = (): Html =>
  selectShell({
    id: 'select-groups',
    items: [...fruitItems, ...vegetableItems],
    placeholder: 'Select a fruit',
    triggerClassName: 'w-full max-w-48',
    groups: [
      { label: 'Fruits', items: fruitItems },
      { label: 'Vegetables', items: vegetableItems },
    ],
  })

export const SelectScrollable = (): Html =>
  selectShell({
    id: 'select-scrollable',
    items: allTimezones(),
    placeholder: 'Select a timezone',
    triggerClassName: 'w-full max-w-64',
    groups: timezoneGroups,
  })

export const SelectAlignItem = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class(fieldGroupClassName)],
    [
      h.div(
        [h.Class('flex items-center justify-between gap-4')],
        [
          h.div(
            [h.Class(fieldClassName)],
            [
              h.label([h.Class(fieldLabelClassName)], ['Align Item']),
              h.p(
                [h.Class(fieldDescriptionClassName)],
                ['Toggle to align the item with the trigger.'],
              ),
            ],
          ),
          h.button(
            [
              h.Type('button'),
              h.Id('align-item'),
              h.Role('switch'),
              h.AriaChecked(true),
              h.DataAttribute('state', 'checked'),
              h.Class(switchClassName),
            ],
            [],
          ),
        ],
      ),
      selectShell({
        id: 'select-align-item',
        items: fruitItems,
        placeholder: 'Select a fruit',
        value: 'banana',
        highlightedValue: 'banana',
        alignItemWithTrigger: true,
      }),
    ],
  )
}

export const SelectInvalid = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('w-full max-w-48'), h.DataAttribute('invalid', '')],
    [
      h.label([h.Class(fieldLabelClassName)], ['Fruit']),
      selectShell({
        id: 'select-invalid',
        items: fruitItems.slice(0, 3),
        placeholder: 'Select a fruit',
        invalid: true,
      }),
      h.p([h.Class(fieldErrorClassName)], ['Please select a fruit.']),
    ],
  )
}

export const SelectRtl = (): Html =>
  selectShell({
    id: 'select-rtl',
    items: [
      { label: 'تفاح', value: 'apple' },
      { label: 'موز', value: 'banana' },
      { label: 'توت أزرق', value: 'blueberry' },
      { label: 'عنب', value: 'grapes' },
      { label: 'أناناس', value: 'pineapple' },
      { label: 'جزر', value: 'carrot' },
      { label: 'بروكلي', value: 'broccoli' },
      { label: 'سبانخ', value: 'spinach' },
    ],
    placeholder: 'اختر فاكهة',
    triggerClassName: 'w-32',
    dir: 'rtl',
    groups: [
      {
        label: 'الفواكه',
        items: [
          { label: 'تفاح', value: 'apple' },
          { label: 'موز', value: 'banana' },
          { label: 'توت أزرق', value: 'blueberry' },
          { label: 'عنب', value: 'grapes' },
          { label: 'أناناس', value: 'pineapple' },
        ],
      },
      {
        label: 'الخضروات',
        items: [
          { label: 'جزر', value: 'carrot' },
          { label: 'بروكلي', value: 'broccoli' },
          { label: 'سبانخ', value: 'spinach' },
        ],
      },
    ],
  })
