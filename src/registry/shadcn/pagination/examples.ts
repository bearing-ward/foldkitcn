import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { Field, FieldLabel } from '../field'
import type { SelectItemDescriptor } from '../select'
import { displayValue, view as Select } from '../select'
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
  view: () => Html
}>

const rowsPerPageItems: ReadonlyArray<SelectItemDescriptor> = [
  { value: '10', label: '10' },
  { value: '25', label: '25' },
  { value: '50', label: '50' },
  { value: '100', label: '100' },
]

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
  [...value
    .toString()]
    .map(digit => arabicDigits[Number.parseInt(digit, 10)] ?? digit)
    .join('')

const paginationShell = (
  children: ReadonlyArray<Child>,
  config: Readonly<{ className?: string; dir?: 'ltr' | 'rtl' }> = {},
): Html =>
  Pagination<never>({
    className: config.className,
    dir: config.dir,
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
    isActive: config.isActive,
    children: [label],
  })

const rowsPerPageSelect = (): Html => {
  const h = html<never>()
  const config = {
    id: 'select-rows-per-page',
    items: rowsPerPageItems,
    open: false,
    value: '25',
    placeholder: '25',
    triggerClassName: 'w-20',
  }

  return Select<never>({
    ...config,
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          h.button(
            [...attributes.trigger, h.Id('select-rows-per-page')],
            [
              h.span([...attributes.value], [displayValue(config)]),
              h.span([...attributes.icon], ['v']),
            ],
          ),
          h.div([...attributes.portal], []),
          h.input([...attributes.hiddenInput]),
        ],
      ),
  })
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

export const PaginationIconsOnly = (): Html => {
  const h = html<never>()

  return h.div(
    [h.Class('flex items-center justify-between gap-4')],
    [
      Field<never>({
        orientation: 'horizontal',
        className: 'w-fit',
        children: [
          FieldLabel<never>({
            htmlFor: 'select-rows-per-page',
            children: ['Rows per page'],
          }),
          rowsPerPageSelect(),
        ],
      }),
      Pagination<never>({
        className: 'mx-0 w-auto',
        children: [
          PaginationContent<never>({
            children: [
              paginationItem([PaginationPrevious<never>({ href: '#' })]),
              paginationItem([PaginationNext<never>({ href: '#' })]),
            ],
          }),
        ],
      }),
    ],
  )
}

export const PaginationRtl = (): Html => {
  const { dir, values } = arabicPagination

  return paginationShell(
    [
      paginationItem([
        PaginationPrevious<never>({
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
