import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Field, FieldLabel } from '../field'
import type {
  SelectItemDescriptor,
  SelectOpenChange,
  SelectValueChange,
} from '../select'
import { view as Select } from '../select'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './index'

type Child = Html | string

type PaginationExampleDefinition = Readonly<{
  id: string
  title: string
  view: <Message = never>(
    controller?: PaginationExampleController<Message>,
  ) => Html
}>

export type PaginationExampleController<Message> = Readonly<{
  isRowsPerPageOpen: boolean
  rowsPerPageValue: string
  onRowsPerPageOpenChange: (change: SelectOpenChange) => Message
  onRowsPerPageValueChange: (change: SelectValueChange) => Message
}>

const rowsPerPageItems: ReadonlyArray<SelectItemDescriptor> = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]

const pageRows: ReadonlyArray<string> = [
  'Invoice INV001',
  'Invoice INV002',
  'Invoice INV003',
  'Invoice INV004',
  'Invoice INV005',
  'Invoice INV006',
  'Invoice INV007',
  'Invoice INV008',
  'Invoice INV009',
  'Invoice INV010',
  'Invoice INV011',
  'Invoice INV012',
  'Invoice INV013',
  'Invoice INV014',
  'Invoice INV015',
  'Invoice INV016',
  'Invoice INV017',
  'Invoice INV018',
  'Invoice INV019',
  'Invoice INV020',
  'Invoice INV021',
  'Invoice INV022',
  'Invoice INV023',
  'Invoice INV024',
  'Invoice INV025',
]

const originClosedSelectTriggerClassName =
  "flex h-8 w-fit items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm whitespace-nowrap shadow-none transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40 [&_svg:not([class*='size-'])]:size-4 w-20"

const arabicDigits: ReadonlyArray<string> = [
  '٠',
  '١',
  '٢',
  '٣',
  '٤',
  '٥',
  '٦',
  '٧',
  '٨',
  '٩',
]

const arabicPagination = {
  dir: 'rtl',
  values: {
    previous: 'السابق',
    next: 'التالي',
  },
} satisfies Readonly<{
  dir: 'rtl'
  values: Readonly<{
    previous: string
    next: string
  }>
}>

const toArabicNumerals = (value: number): string =>
  [...value.toString()]
    .map(digit => arabicDigits[Number.parseInt(digit, 10)] ?? digit)
    .join('')

const paginationShell = (
  children: ReadonlyArray<Child>,
  config: Readonly<{ className?: string; dir?: 'ltr' | 'rtl' }> = {},
): Html =>
  Pagination<never>({
    ...(config.className === undefined ? {} : { className: config.className }),
    ...(config.dir === undefined ? {} : { dir: config.dir }),
    children: [PaginationContent<never>({ children })],
  })

const paginationItem = (children: ReadonlyArray<Child>): Html =>
  PaginationItem<never>({ children })

const paginationLink = (
  label: string,
  config: Readonly<{ isActive?: boolean }> = {},
): Html =>
  PaginationLink<never>({
    href: '#',
    ...(config.isActive === undefined ? {} : { isActive: config.isActive }),
    children: [label],
  })

const rowsPerPageSelect = <Message>(
  controller?: PaginationExampleController<Message>,
): Html => {
  const config = {
    id: 'select-rows-per-page',
    items: rowsPerPageItems,
    open: controller?.isRowsPerPageOpen ?? false,
    value: controller?.rowsPerPageValue ?? '25',
    placeholder: controller?.rowsPerPageValue ?? '25',
    triggerClassName: 'w-20',
  }

  return Select<Message>({
    ...config,
    triggerClassName: originClosedSelectTriggerClassName,
    ...(controller === undefined
      ? {}
      : {
          onOpenChange: controller.onRowsPerPageOpenChange,
          onValueChange: controller.onRowsPerPageValueChange,
        }),
  })
}

const pageSizeFromController = (
  controller: PaginationExampleController<unknown> | undefined,
): number => Number.parseInt(controller?.rowsPerPageValue ?? '25', 10)

const visibleRows = (
  controller: PaginationExampleController<unknown> | undefined,
): ReadonlyArray<string> =>
  pageRows.slice(0, pageSizeFromController(controller))

const paginationRows = <Message>(
  controller?: PaginationExampleController<Message>,
): Html => {
  const h = html<Message>()
  const rows = visibleRows(controller)

  return h.div(
    [h.Class('flex min-w-0 flex-col gap-2 text-sm')],
    [
      h.ul(
        [h.DataAttribute('slot', 'pagination-rows'), h.Class('grid gap-1')],
        rows.map(row =>
          h.li(
            [h.Key(row), h.Class('rounded-md border bg-background px-2 py-1')],
            [row],
          ),
        ),
      ),
      h.p(
        [
          h.DataAttribute('slot', 'pagination-status'),
          h.Class('text-muted-foreground'),
        ],
        [`Showing ${rows.length} of ${pageRows.length} rows`],
      ),
    ],
  )
}

export const PaginationDemo = (): Html =>
  paginationShell([
    paginationItem([PaginationPrevious<never>({ href: '#' })]),
    paginationItem([paginationLink('1')]),
    paginationItem([paginationLink('2', { isActive: true })]),
    paginationItem([paginationLink('3')]),
    paginationItem([PaginationEllipsis<never>()]),
    paginationItem([PaginationNext<never>({ href: '#' })]),
  ])

export const PaginationIconsOnly = <Message = never>(
  controller?: PaginationExampleController<Message>,
): Html => {
  const h = html<Message>()

  return h.div(
    [h.Class('grid gap-4')],
    [
      h.div(
        [h.Class('flex items-center justify-between gap-4')],
        [
          Field<Message>({
            orientation: 'horizontal',
            className: 'w-fit',
            children: [
              FieldLabel<Message>({
                htmlFor: 'select-rows-per-page',
                children: ['Rows per page'],
              }),
              rowsPerPageSelect(controller),
            ],
          }),
          Pagination<Message>({
            className: 'mx-0 w-auto',
            children: [
              PaginationContent<Message>({
                children: [
                  paginationItem([PaginationPrevious<Message>({ href: '#' })]),
                  paginationItem([PaginationNext<Message>({ href: '#' })]),
                ],
              }),
            ],
          }),
        ],
      ),
      paginationRows(controller),
    ],
  )
}

export const PaginationRtl = (): Html => {
  const { dir, values } = arabicPagination

  return paginationShell(
    [
      paginationItem([
        PaginationPrevious<never>({
          dir,
          href: '#',
          text: values.previous,
        }),
      ]),
      paginationItem([paginationLink(toArabicNumerals(1))]),
      paginationItem([paginationLink(toArabicNumerals(2), { isActive: true })]),
      paginationItem([paginationLink(toArabicNumerals(3))]),
      paginationItem([PaginationEllipsis<never>()]),
      paginationItem([
        PaginationNext<never>({
          dir,
          href: '#',
          text: values.next,
        }),
      ]),
    ],
    { dir },
  )
}

export const PaginationSimple = (): Html =>
  paginationShell([
    paginationItem([paginationLink('1')]),
    paginationItem([paginationLink('2', { isActive: true })]),
    paginationItem([paginationLink('3')]),
    paginationItem([paginationLink('4')]),
    paginationItem([paginationLink('5')]),
  ])

export const paginationExampleViews: ReadonlyArray<PaginationExampleDefinition> =
  [
    {
      id: 'shadcn/pagination-demo',
      title: 'PaginationDemo',
      view: PaginationDemo,
    },
    {
      id: 'shadcn/pagination-icons-only',
      title: 'PaginationIconsOnly',
      view: PaginationIconsOnly,
    },
    {
      id: 'shadcn/pagination-rtl',
      title: 'PaginationRtl',
      view: PaginationRtl,
    },
    {
      id: 'shadcn/pagination-simple',
      title: 'PaginationSimple',
      view: PaginationSimple,
    },
  ]

export const paginationIconAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  placement: 'inline-start' | 'inline-end',
): ReadonlyArray<Attribute<Message>> => [h.DataAttribute('icon', placement)]
