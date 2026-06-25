import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import { view as Switch } from './index'
import type { SwitchSize } from './index'

const fieldBaseClassName =
  'group/field flex w-full gap-2 data-[invalid=true]:text-destructive'
const fieldHorizontalClassName =
  'flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px'
const fieldGroupClassName =
  'group/field-group @container/field-group flex w-full flex-col gap-5 data-[slot=checkbox-group]:gap-3 *:data-[slot=field-group]:gap-4'
const fieldContentClassName =
  'group/field-content flex flex-1 flex-col gap-0.5 leading-snug'
const labelClassName =
  'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50'
const fieldLabelClassName =
  'items-center text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border *:data-[slot=field]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10 has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col'
const fieldTitleClassName =
  'flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50'
const fieldDescriptionClassName =
  'text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'
const fieldDescriptionRtlClassName =
  'text-start text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary'

const fieldAttributes = (
  h: ReturnType<typeof html<never>>,
  config: Readonly<{
    className?: string
    isDisabled?: boolean
    isInvalid?: boolean
    dir?: string
  }> = {},
): ReadonlyArray<Attribute<never>> => [
  h.Role('group'),
  h.DataAttribute('slot', 'field'),
  h.DataAttribute('orientation', 'horizontal'),
  h.Class(cn(fieldBaseClassName, fieldHorizontalClassName, config.className)),
  ...(config.isDisabled === true ? [h.Attribute('data-disabled', 'true')] : []),
  ...(config.isInvalid === true ? [h.Attribute('data-invalid', 'true')] : []),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const fieldGroupAttributes = (
  h: ReturnType<typeof html<never>>,
  className?: string,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-group'),
  h.Class(cn(fieldGroupClassName, className)),
]

const fieldContentAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-content'),
  h.Class(fieldContentClassName),
]

const labelAttributes = (
  h: ReturnType<typeof html<never>>,
  config: Readonly<{
    htmlFor?: string
    className?: string
    field?: boolean
    dir?: string
  }> = {},
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', config.field === true ? 'field-label' : 'label'),
  h.Class(
    cn(
      config.field === true ? fieldLabelClassName : labelClassName,
      config.className,
    ),
  ),
  ...(config.htmlFor === undefined ? [] : [h.Attribute('for', config.htmlFor)]),
  ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
]

const fieldTitleAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-label'),
  h.Class(fieldTitleClassName),
]

const fieldDescriptionAttributes = (
  h: ReturnType<typeof html<never>>,
  dir?: string,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-description'),
  h.Class(
    dir === 'rtl' ? fieldDescriptionRtlClassName : fieldDescriptionClassName,
  ),
  ...(dir === undefined ? [] : [h.Dir(dir)]),
]

const switchControl = (
  h: ReturnType<typeof html<never>>,
  config: Readonly<{
    id: string
    isChecked?: boolean
    isDisabled?: boolean
    isInvalid?: boolean
    size?: SwitchSize
    dir?: string
  }>,
): ReadonlyArray<Html> => {
  const baseConfig = {
    id: config.id,
    isChecked: config.isChecked ?? false,
    ...(config.isDisabled === undefined
      ? {}
      : { isDisabled: config.isDisabled }),
    ...(config.isInvalid === undefined ? {} : { isInvalid: config.isInvalid }),
    ...(config.size === undefined ? {} : { size: config.size }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
  }
  const switchInput = Switch<never>({
    ...baseConfig,
    toView: attributes =>
      h.span([...attributes.root], [h.span([...attributes.thumb], [])]),
  })

  const input = Switch<never>({
    ...baseConfig,
    toView: attributes => h.input([...attributes.input]),
  })

  return [switchInput, input]
}

export const SwitchDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center space-x-2')],
    [
      ...switchControl(h, { id: 'airplane-mode' }),
      h.label(
        [...labelAttributes(h, { htmlFor: 'airplane-mode' })],
        ['Airplane Mode'],
      ),
    ],
  )
}

export const SwitchDescription = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldAttributes(h, { className: 'max-w-sm' })],
    [
      h.div(
        [...fieldContentAttributes(h)],
        [
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'switch-focus-mode',
                field: true,
              }),
            ],
            ['Share across devices'],
          ),
          h.p(
            [...fieldDescriptionAttributes(h)],
            [
              'Focus is shared across devices, and turns off when you leave the app.',
            ],
          ),
        ],
      ),
      ...switchControl(h, { id: 'switch-focus-mode' }),
    ],
  )
}

export const SwitchChoiceCard = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'w-full max-w-sm')],
    [
      h.label(
        [...labelAttributes(h, { htmlFor: 'switch-share', field: true })],
        [
          h.div(
            [...fieldAttributes(h)],
            [
              h.div(
                [...fieldContentAttributes(h)],
                [
                  h.div([...fieldTitleAttributes(h)], ['Share across devices']),
                  h.p(
                    [...fieldDescriptionAttributes(h)],
                    [
                      'Focus is shared across devices, and turns off when you leave the app.',
                    ],
                  ),
                ],
              ),
              ...switchControl(h, { id: 'switch-share' }),
            ],
          ),
        ],
      ),
      h.label(
        [
          ...labelAttributes(h, {
            htmlFor: 'switch-notifications',
            field: true,
          }),
        ],
        [
          h.div(
            [...fieldAttributes(h)],
            [
              h.div(
                [...fieldContentAttributes(h)],
                [
                  h.div([...fieldTitleAttributes(h)], ['Enable notifications']),
                  h.p(
                    [...fieldDescriptionAttributes(h)],
                    [
                      'Receive notifications when focus mode is enabled or disabled.',
                    ],
                  ),
                ],
              ),
              ...switchControl(h, {
                id: 'switch-notifications',
                isChecked: true,
              }),
            ],
          ),
        ],
      ),
    ],
  )
}

export const SwitchDisabled = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldAttributes(h, { className: 'w-fit', isDisabled: true })],
    [
      ...switchControl(h, {
        id: 'switch-disabled-unchecked',
        isDisabled: true,
      }),
      h.label(
        [
          ...labelAttributes(h, {
            htmlFor: 'switch-disabled-unchecked',
            field: true,
          }),
        ],
        ['Disabled'],
      ),
    ],
  )
}

export const SwitchInvalid = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldAttributes(h, { className: 'max-w-sm', isInvalid: true })],
    [
      h.div(
        [...fieldContentAttributes(h)],
        [
          h.label(
            [...labelAttributes(h, { htmlFor: 'switch-terms', field: true })],
            ['Accept terms and conditions'],
          ),
          h.p(
            [...fieldDescriptionAttributes(h)],
            ['You must accept the terms and conditions to continue.'],
          ),
        ],
      ),
      ...switchControl(h, { id: 'switch-terms', isInvalid: true }),
    ],
  )
}

export const SwitchSizes = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'w-full max-w-[10rem]')],
    [
      h.div(
        [...fieldAttributes(h)],
        [
          ...switchControl(h, { id: 'switch-size-sm', size: 'sm' }),
          h.label(
            [...labelAttributes(h, { htmlFor: 'switch-size-sm', field: true })],
            ['Small'],
          ),
        ],
      ),
      h.div(
        [...fieldAttributes(h)],
        [
          ...switchControl(h, { id: 'switch-size-default', size: 'default' }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'switch-size-default',
                field: true,
              }),
            ],
            ['Default'],
          ),
        ],
      ),
    ],
  )
}

export const SwitchRtl = (): Html => {
  const h = html<never>()
  const dir = 'rtl'

  return h.div(
    [...fieldAttributes(h, { className: 'max-w-sm', dir })],
    [
      h.div(
        [...fieldContentAttributes(h)],
        [
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'switch-focus-mode-rtl',
                field: true,
                dir,
              }),
            ],
            ['المشاركة عبر الأجهزة'],
          ),
          h.p(
            [...fieldDescriptionAttributes(h, dir)],
            [
              'يتم مشاركة التركيز عبر الأجهزة، ويتم إيقاف تشغيله عند مغادرة التطبيق.',
            ],
          ),
        ],
      ),
      ...switchControl(h, { id: 'switch-focus-mode-rtl', dir }),
    ],
  )
}
