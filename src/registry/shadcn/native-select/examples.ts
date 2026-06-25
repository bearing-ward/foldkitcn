import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import {
  chevronDownIcon,
  optGroupView as NativeSelectOptGroup,
  optionView as NativeSelectOption,
  view as NativeSelect,
} from './index'

const option = (
  value: string,
  children: ReadonlyArray<Html | string>,
): Html => {
  const h = html<never>()

  return NativeSelectOption<never>({
    value,
    toView: attributes => h.option([...attributes.option], children),
  })
}

const optGroup = (label: string, children: ReadonlyArray<Html>): Html => {
  const h = html<never>()

  return NativeSelectOptGroup<never>({
    label,
    toView: attributes => h.optgroup([...attributes.optGroup], children),
  })
}

const nativeSelect = (
  config: Readonly<{
    disabled?: boolean
    invalid?: boolean
    dir?: string
    children: ReadonlyArray<Html>
  }>,
): Html => {
  const h = html<never>()
  const disabledConfig =
    config.disabled === undefined ? {} : { disabled: config.disabled }
  const invalidConfig =
    config.invalid === undefined ? {} : { invalid: config.invalid }
  const dirConfig = config.dir === undefined ? {} : { dir: config.dir }
  const directionConfig =
    config.dir === 'rtl' ? { direction: 'rtl' as const } : {}

  return NativeSelect<never>({
    ...disabledConfig,
    ...invalidConfig,
    ...dirConfig,
    ...directionConfig,
    toView: attributes =>
      h.div(
        [...attributes.wrapper],
        [
          h.select([...attributes.select], config.children),
          chevronDownIcon(attributes.icon),
        ],
      ),
  })
}

const statusOptions = (
  labels: Readonly<{
    placeholder: string
    todo: string
    inProgress: string
    done: string
    cancelled: string
  }>,
): ReadonlyArray<Html> => [
  option('', [labels.placeholder]),
  option('todo', [labels.todo]),
  option('in-progress', [labels.inProgress]),
  option('done', [labels.done]),
  option('cancelled', [labels.cancelled]),
]

const arabicNativeSelectRtl = {
  dir: 'rtl',
  values: {
    placeholder: 'اختر الحالة',
    todo: 'مهام',
    inProgress: 'قيد التنفيذ',
    done: 'منجز',
    cancelled: 'ملغي',
  },
}

export const NativeSelectDemo = (): Html =>
  nativeSelect({
    children: statusOptions({
      placeholder: 'Select status',
      todo: 'Todo',
      inProgress: 'In Progress',
      done: 'Done',
      cancelled: 'Cancelled',
    }),
  })

export const NativeSelectDisabled = (): Html =>
  nativeSelect({
    disabled: true,
    children: [
      option('', ['Disabled']),
      option('apple', ['Apple']),
      option('banana', ['Banana']),
      option('blueberry', ['Blueberry']),
    ],
  })

export const NativeSelectGroups = (): Html =>
  nativeSelect({
    children: [
      option('', ['Select department']),
      optGroup('Engineering', [
        option('frontend', ['Frontend']),
        option('backend', ['Backend']),
        option('devops', ['DevOps']),
      ]),
      optGroup('Sales', [
        option('sales-rep', ['Sales Rep']),
        option('account-manager', ['Account Manager']),
        option('sales-director', ['Sales Director']),
      ]),
      optGroup('Operations', [
        option('support', ['Customer Support']),
        option('product-manager', ['Product Manager']),
        option('ops-manager', ['Operations Manager']),
      ]),
    ],
  })

export const NativeSelectInvalid = (): Html =>
  nativeSelect({
    invalid: true,
    children: [
      option('', ['Error state']),
      option('apple', ['Apple']),
      option('banana', ['Banana']),
      option('blueberry', ['Blueberry']),
    ],
  })

export const NativeSelectRtl = (): Html => {
  const { dir, values } = arabicNativeSelectRtl

  return nativeSelect({
    dir,
    children: statusOptions(values),
  })
}
