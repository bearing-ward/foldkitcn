/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  DataTableDemo,
  DataTableRtl,
  DataTableTasks,
  dataTableExampleViews,
} from './examples'
import * as DataTable from './index'

type Payment = Readonly<{
  id: string
  email: string
  amount: number
  status: string
}>

type Model = Record<string, never>

type Message = never

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const initialModel: Model = {}

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

const paymentRows: ReadonlyArray<Payment> = [
  {
    id: '1',
    email: 'zoe@example.com',
    amount: 400,
    status: 'success',
  },
  {
    id: '2',
    email: 'abe@example.com',
    amount: 100,
    status: 'failed',
  },
  {
    id: '3',
    email: 'mia@example.com',
    amount: 250,
    status: 'processing',
  },
]

const paymentColumns: ReadonlyArray<DataTable.DataTableColumn<Payment>> = [
  {
    id: 'status',
    header: 'Status',
    isFilterable: true,
    valueText: payment => payment.status,
    cell: () => 'status' as unknown as Html,
  },
  {
    id: 'email',
    header: 'Email',
    isHideable: true,
    isSortable: true,
    isFilterable: true,
    valueText: payment => payment.email,
    cell: () => 'email' as unknown as Html,
  },
  {
    id: 'amount',
    header: 'Amount',
    isHideable: true,
    isSortable: true,
    valueText: payment => String(payment.amount),
    sortValue: payment => payment.amount,
    cell: () => 'amount' as unknown as Html,
  },
]

const rowId = (payment: Payment): string => payment.id

describe('shadcn/data-table state helpers', () => {
  test('exports Effect Schema literals for sort direction and state', () => {
    expect(S.decodeUnknownSync(DataTable.DataTableSortDirection)('asc')).toBe(
      'asc',
    )
    expect(
      S.decodeUnknownSync(DataTable.DataTableState)(
        DataTable.initialState({ pageSize: 2 }),
      ),
    ).toStrictEqual(DataTable.initialState({ pageSize: 2 }))
  })

  test('filters, sorts, paginates, and counts selected rows', () => {
    const filteredState = DataTable.setFilter(
      DataTable.initialState({ pageSize: 2 }),
      'email',
      'example.com',
    )
    const selectedState = DataTable.toggleRowSelection(filteredState, '2')
    const sortedState = DataTable.toggleSort(selectedState, 'amount')
    const model = DataTable.rowModel({
      rows: paymentRows,
      columns: paymentColumns,
      state: sortedState,
      rowId,
    })

    expect(model.filteredRows).toHaveLength(3)
    expect(model.paginatedRows.map(row => row.id)).toStrictEqual(['2', '3'])
    expect(model.selectedFilteredRowCount).toBe(1)
    expect(model.selectedPageRowCount).toBe(1)
    expect(model.totalPageCount).toBe(2)
  })

  test('toggles column visibility and select-all state by page rows', () => {
    const initialState = DataTable.initialState({ pageSize: 2 })
    const hiddenState = DataTable.toggleColumnVisibility(
      initialState,
      'amount',
      false,
    )
    const selectedState = DataTable.toggleAllPageRowsSelection(hiddenState, [
      '1',
      '2',
    ])

    expect(
      DataTable.visibleColumns(paymentColumns, hiddenState).map(
        column => column.id,
      ),
    ).toStrictEqual(['status', 'email'])
    expect(selectedState.selectedRowIds).toStrictEqual({
      '1': true,
      '2': true,
    })
    expect(
      DataTable.toggleAllPageRowsSelection(selectedState, ['1', '2'])
        .selectedRowIds,
    ).toStrictEqual({})
  })

  test('clamps page navigation and resets page on page-size or filter changes', () => {
    const pagedState = DataTable.setPageIndex(
      DataTable.initialState({ pageSize: 1 }),
      3,
      2,
    )
    const nextState = DataTable.nextPage(pagedState, 2)
    const previousState = DataTable.previousPage(nextState)
    const resizedState = DataTable.setPageSize(previousState, 3)
    const filteredState = DataTable.setFilter(resizedState, 'email', 'abe')

    expect(pagedState.pageIndex).toBe(1)
    expect(nextState.pageIndex).toBe(1)
    expect(previousState.pageIndex).toBe(0)
    expect(resizedState.pageIndex).toBe(0)
    expect(filteredState.pageIndex).toBe(0)
  })
})

describe('shadcn/data-table view', () => {
  test('renders payment, task, and RTL examples', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => DataTableDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('table')).toBeVisible(),
        Scene.expect(Scene.selector('[data-slot="pagination"]')).toBeVisible(),
      )
      Scene.scene(
        { update, view: () => DataTableTasks() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="card-title"]')).toHaveText(
          'Tasks',
        ),
      )
      Scene.scene(
        { update, view: () => DataTableRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toBeVisible(),
      )
    }).not.toThrow()
  })

  test('renders the no-results row when filters exclude every row', () => {
    const emptyState = DataTable.setFilter(
      DataTable.initialState({ pageSize: 2 }),
      'email',
      'missing-value',
    )

    expect(() => {
      Scene.scene(
        {
          update,
          view: () => DataTableDemo({ state: emptyState }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="table-cell"]')).toHaveText(
          'No results.',
        ),
      )
    }).not.toThrow()
  })

  test('keeps exported examples aligned with the manifest ids', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/data-table/item.json?raw')
    const manifest: {
      readonly examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    } = JSON.parse(manifestModule.default)

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      dataTableExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      dataTableExampleViews.map(example => example.title),
    )
  })
})

describe('shadcn/data-table installable source', () => {
  test('keeps forbidden runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@tanstack/react-table',
      '@dnd-kit/core',
      '@dnd-kit/sortable',
      'react',
      'react-dom',
      'recharts',
      'sonner',
      'zod',
      'lucide-react',
      '@tabler/icons-react',
      '@/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/data-table/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/data-table/index.ts',
      'src/registry/shadcn/data-table/examples.ts',
    ])

    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
