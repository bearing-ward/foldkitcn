import {
  Array as EffectArray,
  Option,
  pipe,
  Record as EffectRecord,
  Schema as S,
  String as EffectString,
} from 'effect'
import type { Html } from 'foldkit/html'
import { evo } from 'foldkit/struct'

import { cn } from '../../../utils/cn'

// MODEL

export const DataTableSortDirection = S.Union([
  S.Literal('asc'),
  S.Literal('desc'),
])
export type DataTableSortDirection = typeof DataTableSortDirection.Type

export const DataTableSort = S.Struct({
  columnId: S.String,
  direction: DataTableSortDirection,
})
export type DataTableSort = typeof DataTableSort.Type

export const DataTableState = S.Struct({
  sorting: S.Array(DataTableSort),
  filters: S.Record(S.String, S.String),
  hiddenColumnIds: S.Array(S.String),
  selectedRowIds: S.Record(S.String, S.Boolean),
  pageIndex: S.Number,
  pageSize: S.Number,
})
export type DataTableState = typeof DataTableState.Type

export type DataTableColumn<Row> = Readonly<{
  id: string
  header: string
  isHideable?: boolean
  isSortable?: boolean
  isFilterable?: boolean
  valueText: (row: Row) => string
  sortValue?: (row: Row) => string | number
  filterValue?: (row: Row) => string
  cell: (row: Row) => Html
}>

export type DataTableRowModel<Row> = Readonly<{
  visibleColumns: ReadonlyArray<DataTableColumn<Row>>
  filteredRows: ReadonlyArray<Row>
  sortedRows: ReadonlyArray<Row>
  paginatedRows: ReadonlyArray<Row>
  filteredRowCount: number
  selectedFilteredRowCount: number
  selectedPageRowCount: number
  totalPageCount: number
  canPreviousPage: boolean
  canNextPage: boolean
}>

export const DataTableLayoutStyleOptions = S.Struct({
  className: S.optional(S.String),
})
export type DataTableLayoutStyleOptions = typeof DataTableLayoutStyleOptions.Type

// UPDATE

const normalizeFilterValue = (value: string): string =>
  EffectString.trim(value).toLocaleLowerCase()

const comparableValue = <Row>(
  column: DataTableColumn<Row>,
  row: Row,
): string | number => column.sortValue?.(row) ?? column.valueText(row)

const columnById = <Row>(
  columns: ReadonlyArray<DataTableColumn<Row>>,
  columnId: string,
): Option.Option<DataTableColumn<Row>> =>
  EffectArray.findFirst(columns, column => column.id === columnId)

const maxPageIndex = (pageCount: number): number => Math.max(pageCount - 1, 0)

const pageCountFor = (rowCount: number, pageSize: number): number =>
  Math.max(1, Math.ceil(rowCount / Math.max(pageSize, 1)))

const clampedPageIndex = (pageIndex: number, pageCount: number): number =>
  Math.min(Math.max(pageIndex, 0), maxPageIndex(pageCount))

const compareValues = (
  left: string | number,
  right: string | number,
): number =>
  typeof left === 'number' && typeof right === 'number'
    ? left - right
    : String(left).localeCompare(String(right))

const selectedRowCount = <Row>(
  rows: ReadonlyArray<Row>,
  rowId: (row: Row) => string,
  state: DataTableState,
): number =>
  rows.filter(row => state.selectedRowIds[rowId(row)] === true).length

const normalizedState = (
  state: DataTableState,
  pageCount: number = pageCountFor(0, state.pageSize),
): DataTableState =>
  evo(state, {
    pageIndex: () => clampedPageIndex(state.pageIndex, pageCount),
    pageSize: value => Math.max(value, 1),
  })

const hiddenColumnIds = (
  state: DataTableState,
  columnId: string,
  isVisible: boolean,
): ReadonlyArray<string> => {
  if (isVisible) {
    return state.hiddenColumnIds.filter(id => id !== columnId)
  }

  return state.hiddenColumnIds.includes(columnId)
    ? state.hiddenColumnIds
    : [...state.hiddenColumnIds, columnId]
}

export const initialState = ({
  pageSize,
}: Readonly<{ pageSize: number }>): DataTableState =>
  normalizedState({
    sorting: [],
    filters: {},
    hiddenColumnIds: [],
    selectedRowIds: {},
    pageIndex: 0,
    pageSize,
  })

export const visibleColumns = <Row>(
  columns: ReadonlyArray<DataTableColumn<Row>>,
  state: DataTableState,
): ReadonlyArray<DataTableColumn<Row>> =>
  columns.filter(column => !state.hiddenColumnIds.includes(column.id))

export const filteredRows = <Row>(
  rows: ReadonlyArray<Row>,
  columns: ReadonlyArray<DataTableColumn<Row>>,
  state: DataTableState,
): ReadonlyArray<Row> => {
  const activeFilters = Object.entries(state.filters).filter(
    ([, value]) => EffectString.trim(value) !== '',
  )

  if (activeFilters.length === 0) {
    return rows
  }

  return rows.filter(row =>
    activeFilters.every(([columnId, value]) =>
      pipe(
        columnById(columns, columnId),
        Option.filter(column => column.isFilterable === true),
        Option.match({
          onNone: () => true,
          onSome: column =>
            (column.filterValue?.(row) ?? column.valueText(row))
              .toLocaleLowerCase()
              .includes(normalizeFilterValue(value)),
        }),
      ),
    ),
  )
}

export const sortedRows = <Row>(
  rows: ReadonlyArray<Row>,
  columns: ReadonlyArray<DataTableColumn<Row>>,
  state: DataTableState,
): ReadonlyArray<Row> =>
  state.sorting.reduceRight(
    (currentRows, sort) =>
      pipe(
        columnById(columns, sort.columnId),
        Option.filter(column => column.isSortable !== false),
        Option.match({
          onNone: () => currentRows,
          onSome: column =>
            [...currentRows].sort((left: Row, right: Row) => {
              const order = compareValues(
                comparableValue(column, left),
                comparableValue(column, right),
              )

              return sort.direction === 'asc' ? order : order * -1
            }),
        }),
      ),
    rows,
  )

export const paginatedRows = <Row>(
  rows: ReadonlyArray<Row>,
  state: DataTableState,
): ReadonlyArray<Row> => {
  const startIndex = state.pageIndex * state.pageSize

  return rows.slice(startIndex, startIndex + state.pageSize)
}

export const rowModel = <Row>({
  rows,
  columns,
  state,
  rowId,
}: Readonly<{
  rows: ReadonlyArray<Row>
  columns: ReadonlyArray<DataTableColumn<Row>>
  state: DataTableState
  rowId: (row: Row) => string
}>): DataTableRowModel<Row> => {
  const visible = visibleColumns(columns, state)
  const filtered = filteredRows(rows, columns, state)
  const sorted = sortedRows(filtered, columns, state)
  const totalPageCount = pageCountFor(sorted.length, state.pageSize)
  const nextState = normalizedState(state, totalPageCount)
  const paginated = paginatedRows(sorted, nextState)

  return {
    visibleColumns: visible,
    filteredRows: filtered,
    sortedRows: sorted,
    paginatedRows: paginated,
    filteredRowCount: filtered.length,
    selectedFilteredRowCount: selectedRowCount(filtered, rowId, state),
    selectedPageRowCount: selectedRowCount(paginated, rowId, state),
    totalPageCount,
    canPreviousPage: nextState.pageIndex > 0,
    canNextPage: nextState.pageIndex < totalPageCount - 1,
  }
}

export const toggleSort = (
  state: DataTableState,
  columnId: string,
): DataTableState =>
  pipe(
    EffectArray.get(state.sorting, 0),
    Option.match({
      onNone: () =>
        evo(state, {
          sorting: () => [{ columnId, direction: 'asc' }],
          pageIndex: () => 0,
        }),
      onSome: sort =>
        sort.columnId === columnId
          ? evo(state, {
              sorting: () => [
                {
                  columnId,
                  direction: sort.direction === 'asc' ? 'desc' : 'asc',
                },
              ],
              pageIndex: () => 0,
            })
          : evo(state, {
              sorting: () => [{ columnId, direction: 'asc' }],
              pageIndex: () => 0,
            }),
    }),
  )

export const setFilter = (
  state: DataTableState,
  columnId: string,
  value: string,
): DataTableState =>
  evo(state, {
    filters: currentFilters => {
      const trimmedValue = EffectString.trim(value)

      return trimmedValue === ''
        ? EffectRecord.remove(currentFilters, columnId)
        : EffectRecord.set(currentFilters, columnId, value)
    },
    pageIndex: () => 0,
  })

export const clearFilters = (state: DataTableState): DataTableState =>
  evo(state, {
    filters: () => ({}),
    pageIndex: () => 0,
  })

export const toggleColumnVisibility = (
  state: DataTableState,
  columnId: string,
  isVisible: boolean,
): DataTableState =>
  evo(state, {
    hiddenColumnIds: () => hiddenColumnIds(state, columnId, isVisible),
  })

export const toggleRowSelection = (
  state: DataTableState,
  rowId: string,
): DataTableState =>
  evo(state, {
    selectedRowIds: currentSelection =>
      currentSelection[rowId] === true
        ? EffectRecord.remove(currentSelection, rowId)
        : EffectRecord.set(currentSelection, rowId, true),
  })

export const toggleAllPageRowsSelection = (
  state: DataTableState,
  rowIds: ReadonlyArray<string>,
): DataTableState => {
  const shouldSelect =
    rowIds.length > 0 &&
    rowIds.some(rowId => state.selectedRowIds[rowId] !== true)

  return evo(state, {
    selectedRowIds: currentSelection =>
      rowIds.reduce(
        (selection, rowId) =>
          shouldSelect
            ? EffectRecord.set(selection, rowId, true)
            : EffectRecord.remove(selection, rowId),
        currentSelection,
      ),
  })
}

export const setPageIndex = (
  state: DataTableState,
  pageIndex: number,
  pageCount?: number,
): DataTableState =>
  normalizedState(
    evo(state, {
      pageIndex: () => Math.max(pageIndex, 0),
    }),
    pageCount,
  )

export const setPageSize = (
  state: DataTableState,
  pageSize: number,
): DataTableState =>
  normalizedState(
    evo(state, {
      pageSize: () => Math.max(pageSize, 1),
      pageIndex: () => 0,
    }),
  )

export const nextPage = (
  state: DataTableState,
  pageCount: number,
): DataTableState => setPageIndex(state, state.pageIndex + 1, pageCount)

export const previousPage = (state: DataTableState): DataTableState =>
  setPageIndex(state, state.pageIndex - 1)

export const firstPage = (state: DataTableState): DataTableState =>
  setPageIndex(state, 0)

export const lastPage = (
  state: DataTableState,
  pageCount: number,
): DataTableState => setPageIndex(state, maxPageIndex(pageCount), pageCount)

// VIEW

export const dataTableToolbarBaseClassName =
  'flex flex-col gap-3 py-4 md:flex-row md:items-center md:justify-between'

export const dataTableFiltersBaseClassName =
  'flex flex-1 flex-col gap-2 sm:flex-row sm:items-center'

export const dataTableActionsBaseClassName =
  'flex items-center gap-2 self-start md:self-center'

export const dataTableMetaBaseClassName =
  'flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between'

export const dataTableEmptyStateBaseClassName =
  'h-24 text-center text-sm text-muted-foreground'

export const dataTableToolbarClassName = ({
  className,
}: DataTableLayoutStyleOptions = {}): string =>
  cn(dataTableToolbarBaseClassName, className)

export const dataTableFiltersClassName = ({
  className,
}: DataTableLayoutStyleOptions = {}): string =>
  cn(dataTableFiltersBaseClassName, className)

export const dataTableActionsClassName = ({
  className,
}: DataTableLayoutStyleOptions = {}): string =>
  cn(dataTableActionsBaseClassName, className)

export const dataTableMetaClassName = ({
  className,
}: DataTableLayoutStyleOptions = {}): string =>
  cn(dataTableMetaBaseClassName, className)

export const dataTableEmptyStateClassName = ({
  className,
}: DataTableLayoutStyleOptions = {}): string =>
  cn(dataTableEmptyStateBaseClassName, className)
