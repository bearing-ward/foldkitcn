import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'
import { view as Checkbox } from './index'
import type { CheckboxCheckedState } from './index'

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
const tableClassName = 'w-full caption-bottom text-sm'
const tableHeaderClassName = '[&_tr]:border-b'
const tableBodyClassName = '[&_tr:last-child]:border-0'
const tableRowClassName =
  'hover:bg-muted/50 data-[state=selected]:bg-muted border-b transition-colors'
const tableHeadClassName =
  'text-muted-foreground h-10 px-2 text-left align-middle font-medium whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'
const tableCellClassName =
  'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]'

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

const fieldSetAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-set'),
  h.Class('flex min-w-0 flex-col gap-3'),
]

const fieldLegendAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'field-legend'),
  h.DataAttribute('variant', 'label'),
  h.Class('text-sm font-medium'),
]

const tableAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table'),
  h.Class(tableClassName),
]

const tableHeaderAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table-header'),
  h.Class(tableHeaderClassName),
]

const tableBodyAttributes = (
  h: ReturnType<typeof html<never>>,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table-body'),
  h.Class(tableBodyClassName),
]

const tableRowAttributes = (
  h: ReturnType<typeof html<never>>,
  state?: string,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table-row'),
  h.Class(tableRowClassName),
  ...(state === undefined ? [] : [h.Attribute('data-state', state)]),
]

const tableHeadAttributes = (
  h: ReturnType<typeof html<never>>,
  className?: string,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table-head'),
  h.Class(cn(tableHeadClassName, className)),
]

const tableCellAttributes = (
  h: ReturnType<typeof html<never>>,
  className?: string,
): ReadonlyArray<Attribute<never>> => [
  h.DataAttribute('slot', 'table-cell'),
  h.Class(cn(tableCellClassName, className)),
]

const checkboxControl = (
  h: ReturnType<typeof html<never>>,
  config: Readonly<{
    id: string
    name?: string
    checkedState?: CheckboxCheckedState
    isDisabled?: boolean
    isInvalid?: boolean
    dir?: string
  }>,
): ReadonlyArray<Html> => {
  const baseConfig = {
    id: config.id,
    name: config.name ?? config.id,
    checkedState: config.checkedState ?? 'unchecked',
    ...(config.isDisabled === undefined
      ? {}
      : { isDisabled: config.isDisabled }),
    ...(config.isInvalid === undefined ? {} : { isInvalid: config.isInvalid }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
  }
  const checkbox = Checkbox<never>({
    ...baseConfig,
    toView: attributes =>
      h.span(
        [...attributes.root],
        attributes.indicator.length > 0
          ? [h.span([...attributes.indicator], [])]
          : [],
      ),
  })
  const input = Checkbox<never>({
    ...baseConfig,
    toView: attributes => h.input([...attributes.input]),
  })

  return [checkbox, input]
}

export const CheckboxDemo = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'max-w-sm')],
    [
      h.div(
        [...fieldAttributes(h)],
        [
          ...checkboxControl(h, { id: 'terms-checkbox' }),
          h.label(
            [...labelAttributes(h, { htmlFor: 'terms-checkbox' })],
            ['Accept terms and conditions'],
          ),
        ],
      ),
      h.div(
        [...fieldAttributes(h)],
        [
          ...checkboxControl(h, {
            id: 'terms-checkbox-2',
            checkedState: 'checked',
          }),
          h.div(
            [...fieldContentAttributes(h)],
            [
              h.label(
                [
                  ...labelAttributes(h, {
                    htmlFor: 'terms-checkbox-2',
                    field: true,
                  }),
                ],
                ['Accept terms and conditions'],
              ),
              h.p(
                [...fieldDescriptionAttributes(h)],
                ['By clicking this checkbox, you agree to the terms.'],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [...fieldAttributes(h, { isDisabled: true })],
        [
          ...checkboxControl(h, {
            id: 'toggle-checkbox',
            isDisabled: true,
          }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'toggle-checkbox',
                field: true,
              }),
            ],
            ['Enable notifications'],
          ),
        ],
      ),
      h.label(
        [...labelAttributes(h, { field: true })],
        [
          h.div(
            [...fieldAttributes(h)],
            [
              ...checkboxControl(h, { id: 'toggle-checkbox-2' }),
              h.div(
                [...fieldContentAttributes(h)],
                [
                  h.div([...fieldTitleAttributes(h)], ['Enable notifications']),
                  h.p(
                    [...fieldDescriptionAttributes(h)],
                    ['You can enable or disable notifications at any time.'],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}

export const CheckboxBasic = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'mx-auto w-56')],
    [
      h.div(
        [...fieldAttributes(h)],
        [
          ...checkboxControl(h, { id: 'terms-checkbox-basic' }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'terms-checkbox-basic',
                field: true,
              }),
            ],
            ['Accept terms and conditions'],
          ),
        ],
      ),
    ],
  )
}

export const CheckboxDescription = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'mx-auto w-72')],
    [
      h.div(
        [...fieldAttributes(h)],
        [
          ...checkboxControl(h, {
            id: 'terms-checkbox-desc',
            checkedState: 'checked',
          }),
          h.div(
            [...fieldContentAttributes(h)],
            [
              h.label(
                [
                  ...labelAttributes(h, {
                    htmlFor: 'terms-checkbox-desc',
                    field: true,
                  }),
                ],
                ['Accept terms and conditions'],
              ),
              h.p(
                [...fieldDescriptionAttributes(h)],
                [
                  'By clicking this checkbox, you agree to the terms and conditions.',
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}

export const CheckboxDisabled = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'mx-auto w-56')],
    [
      h.div(
        [...fieldAttributes(h, { isDisabled: true })],
        [
          ...checkboxControl(h, {
            id: 'toggle-checkbox-disabled',
            isDisabled: true,
          }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'toggle-checkbox-disabled',
                field: true,
              }),
            ],
            ['Enable notifications'],
          ),
        ],
      ),
    ],
  )
}

export const CheckboxInvalid = (): Html => {
  const h = html<never>()

  return h.div(
    [...fieldGroupAttributes(h, 'mx-auto w-56')],
    [
      h.div(
        [...fieldAttributes(h, { isInvalid: true })],
        [
          ...checkboxControl(h, {
            id: 'terms-checkbox-invalid',
            isInvalid: true,
          }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'terms-checkbox-invalid',
                field: true,
              }),
            ],
            ['Accept terms and conditions'],
          ),
        ],
      ),
    ],
  )
}

export const CheckboxGroup = (): Html => {
  const h = html<never>()
  const options = [
    {
      id: 'finder-pref-9k2-hard-disks-ljj-checkbox',
      label: 'Hard disks',
      checkedState: 'checked' as const,
    },
    {
      id: 'finder-pref-9k2-external-disks-1yg-checkbox',
      label: 'External disks',
      checkedState: 'checked' as const,
    },
    {
      id: 'finder-pref-9k2-cds-dvds-fzt-checkbox',
      label: 'CDs, DVDs, and iPods',
      checkedState: 'unchecked' as const,
    },
    {
      id: 'finder-pref-9k2-connected-servers-6l2-checkbox',
      label: 'Connected servers',
      checkedState: 'unchecked' as const,
    },
  ]

  return h.fieldset(
    [...fieldSetAttributes(h)],
    [
      h.legend(
        [...fieldLegendAttributes(h)],
        ['Show these items on the desktop:'],
      ),
      h.p(
        [...fieldDescriptionAttributes(h)],
        ['Select the items you want to show on the desktop.'],
      ),
      h.div(
        [...fieldGroupAttributes(h, 'gap-3')],
        options.map(option =>
          h.div(
            [...fieldAttributes(h)],
            [
              ...checkboxControl(h, {
                id: option.id,
                checkedState: option.checkedState,
              }),
              h.label(
                [
                  ...labelAttributes(h, {
                    htmlFor: option.id,
                    className: 'font-normal',
                    field: true,
                  }),
                ],
                [option.label],
              ),
            ],
          ),
        ),
      ),
    ],
  )
}

const tableData = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    role: 'Admin',
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    email: 'marcus.rodriguez@example.com',
    role: 'User',
  },
  {
    id: '3',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'User',
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    role: 'Editor',
  },
]

export const CheckboxInTable = (): Html => {
  const h = html<never>()
  const selectedRowIds = new Set(['1'])

  return h.table(
    [...tableAttributes(h)],
    [
      h.thead(
        [...tableHeaderAttributes(h)],
        [
          h.tr(
            [...tableRowAttributes(h)],
            [
              h.th(
                [...tableHeadAttributes(h, 'w-8')],
                [
                  ...checkboxControl(h, {
                    id: 'select-all-checkbox',
                    checkedState: 'indeterminate',
                  }),
                ],
              ),
              h.th([...tableHeadAttributes(h)], ['Name']),
              h.th([...tableHeadAttributes(h)], ['Email']),
              h.th([...tableHeadAttributes(h)], ['Role']),
            ],
          ),
        ],
      ),
      h.tbody(
        [...tableBodyAttributes(h)],
        tableData.map(row =>
          h.tr(
            [
              ...tableRowAttributes(
                h,
                selectedRowIds.has(row.id) ? 'selected' : undefined,
              ),
            ],
            [
              h.td(
                [...tableCellAttributes(h)],
                [
                  ...checkboxControl(h, {
                    id: `row-${row.id}-checkbox`,
                    checkedState: selectedRowIds.has(row.id)
                      ? 'checked'
                      : 'unchecked',
                  }),
                ],
              ),
              h.td([...tableCellAttributes(h, 'font-medium')], [row.name]),
              h.td([...tableCellAttributes(h)], [row.email]),
              h.td([...tableCellAttributes(h)], [row.role]),
            ],
          ),
        ),
      ),
    ],
  )
}

export const CheckboxRtl = (): Html => {
  const h = html<never>()
  const dir = 'rtl'

  return h.div(
    [...fieldGroupAttributes(h, 'max-w-sm'), h.Dir(dir)],
    [
      h.div(
        [...fieldAttributes(h, { dir })],
        [
          ...checkboxControl(h, { id: 'terms-checkbox-rtl', dir }),
          h.label(
            [...labelAttributes(h, { htmlFor: 'terms-checkbox-rtl', dir })],
            ['قبول الشروط والأحكام'],
          ),
        ],
      ),
      h.div(
        [...fieldAttributes(h, { dir })],
        [
          ...checkboxControl(h, {
            id: 'terms-checkbox-2-rtl',
            checkedState: 'checked',
            dir,
          }),
          h.div(
            [...fieldContentAttributes(h)],
            [
              h.label(
                [
                  ...labelAttributes(h, {
                    htmlFor: 'terms-checkbox-2-rtl',
                    field: true,
                    dir,
                  }),
                ],
                ['قبول الشروط والأحكام'],
              ),
              h.p(
                [...fieldDescriptionAttributes(h, dir)],
                ['بالنقر على هذا المربع، فإنك توافق على الشروط.'],
              ),
            ],
          ),
        ],
      ),
      h.div(
        [...fieldAttributes(h, { isDisabled: true, dir })],
        [
          ...checkboxControl(h, {
            id: 'toggle-checkbox-rtl',
            isDisabled: true,
            dir,
          }),
          h.label(
            [
              ...labelAttributes(h, {
                htmlFor: 'toggle-checkbox-rtl',
                field: true,
                dir,
              }),
            ],
            ['تفعيل الإشعارات'],
          ),
        ],
      ),
      h.label(
        [...labelAttributes(h, { field: true, dir })],
        [
          h.div(
            [...fieldAttributes(h, { dir })],
            [
              ...checkboxControl(h, { id: 'toggle-checkbox-2', dir }),
              h.div(
                [...fieldContentAttributes(h)],
                [
                  h.div([...fieldTitleAttributes(h)], ['تفعيل الإشعارات']),
                  h.p(
                    [...fieldDescriptionAttributes(h, dir)],
                    ['يمكنك تفعيل أو إلغاء تفعيل الإشعارات في أي وقت.'],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
    ],
  )
}
