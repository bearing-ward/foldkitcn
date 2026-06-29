import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import { cn } from '../../../utils/cn'

// MODEL

export const TableRowState = S.Literal('selected')
export type TableRowState = typeof TableRowState.Type

export const tableRowStateValues: ReadonlyArray<TableRowState> = ['selected']

export const TableStyleOptions = S.Struct({
  className: S.optional(S.String),
  containerClassName: S.optional(S.String),
  dir: S.optional(S.String),
})
export type TableStyleOptions = typeof TableStyleOptions.Type

export const TablePartStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type TablePartStyleOptions = typeof TablePartStyleOptions.Type

export const TableRowStyleOptions = S.Struct({
  className: S.optional(S.String),
  state: S.optional(TableRowState),
})
export type TableRowStyleOptions = typeof TableRowStyleOptions.Type

type Child = Html | string

// VIEW

export type TableConfig<Message> = TableStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
    containerAttributes?: ReadonlyArray<Attribute<Message>>
  }>

export type TablePartConfig<Message> = TablePartStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export type TableRowConfig<Message> = TableRowStyleOptions &
  Readonly<{
    children?: ReadonlyArray<Child>
    attributes?: ReadonlyArray<Attribute<Message>>
  }>

export const tableContainerBaseClassName = 'relative w-full overflow-x-auto'

export const tableBaseClassName = 'w-full caption-bottom text-sm'

export const tableHeaderBaseClassName = '[&_tr]:border-b'

export const tableBodyBaseClassName = '[&_tr:last-child]:border-0'

export const tableFooterBaseClassName =
  'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0'

export const tableRowBaseClassName =
  'border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted'

export const tableHeadBaseClassName =
  'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0'

export const tableCellBaseClassName =
  'p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0'

export const tableCaptionBaseClassName = 'mt-4 text-sm text-muted-foreground'

export const tableContainerClassName = ({
  className,
}: TablePartStyleOptions = {}): string =>
  cn(tableContainerBaseClassName, className)

export const tableClassName = ({
  className,
}: Pick<TableStyleOptions, 'className'> = {}): string =>
  cn(tableBaseClassName, className)

export const tableHeaderClassName = ({
  className,
}: TablePartStyleOptions = {}): string =>
  cn(tableHeaderBaseClassName, className)

export const tableBodyClassName = ({
  className,
}: TablePartStyleOptions = {}): string => cn(tableBodyBaseClassName, className)

export const tableFooterClassName = ({
  className,
}: TablePartStyleOptions = {}): string =>
  cn(tableFooterBaseClassName, className)

export const tableRowClassName = ({
  className,
}: TableRowStyleOptions = {}): string => cn(tableRowBaseClassName, className)

export const tableHeadClassName = ({
  className,
}: TablePartStyleOptions = {}): string => cn(tableHeadBaseClassName, className)

export const tableCellClassName = ({
  className,
}: TablePartStyleOptions = {}): string => cn(tableCellBaseClassName, className)

export const tableCaptionClassName = ({
  className,
}: TablePartStyleOptions = {}): string =>
  cn(tableCaptionBaseClassName, className)

const slotAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
): ReadonlyArray<Attribute<Message>> => [
  h.DataAttribute('slot', slot),
  h.Class(className),
]

const partAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  slot: string,
  className: string,
  config: TablePartConfig<Message>,
): ReadonlyArray<Attribute<Message>> => [
  ...slotAttributes(h, slot, className),
  ...(config.attributes ?? []),
]

export const Table = <Message>(config: TableConfig<Message> = {}): Html => {
  const h = html<Message>()

  return h.div(
    [
      ...slotAttributes(
        h,
        'table-container',
        tableContainerClassName({ className: config.containerClassName }),
      ),
      ...(config.containerAttributes ?? []),
    ],
    [
      h.table(
        [
          ...slotAttributes(h, 'table', tableClassName(config)),
          ...(config.dir === undefined ? [] : [h.Dir(config.dir)]),
          ...(config.attributes ?? []),
        ],
        config.children ?? [],
      ),
    ],
  )
}

export const TableHeader = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.thead(
    [
      ...partAttributes(
        h,
        'table-header',
        tableHeaderClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const TableBody = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.tbody(
    [...partAttributes(h, 'table-body', tableBodyClassName(config), config)],
    config.children ?? [],
  )
}

export const TableFooter = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.tfoot(
    [
      ...partAttributes(
        h,
        'table-footer',
        tableFooterClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}

export const TableRow = <Message>(
  config: TableRowConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.tr(
    [
      ...slotAttributes(h, 'table-row', tableRowClassName(config)),
      ...(config.state === undefined
        ? []
        : [h.DataAttribute('state', config.state)]),
      ...(config.attributes ?? []),
    ],
    config.children ?? [],
  )
}

export const TableHead = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.th(
    [...partAttributes(h, 'table-head', tableHeadClassName(config), config)],
    config.children ?? [],
  )
}

export const TableCell = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.td(
    [...partAttributes(h, 'table-cell', tableCellClassName(config), config)],
    config.children ?? [],
  )
}

export const TableCaption = <Message>(
  config: TablePartConfig<Message> = {},
): Html => {
  const h = html<Message>()

  return h.caption(
    [
      ...partAttributes(
        h,
        'table-caption',
        tableCaptionClassName(config),
        config,
      ),
    ],
    config.children ?? [],
  )
}
