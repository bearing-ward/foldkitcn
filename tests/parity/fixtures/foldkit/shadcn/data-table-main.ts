import { Match as M } from 'effect'
import type { Command } from 'foldkit'
import type { Document } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as DataTable from '../../../../../src/registry/shadcn/data-table'
import {
  DataTableDemo,
  DataTableExampleMessage,
} from '../../../../../src/registry/shadcn/data-table/examples'

export const Model = DataTable.DataTableState
export type Model = typeof Model.Type

export const Message = DataTableExampleMessage
export type Message = typeof Message.Type

export const init = (): readonly [
  Model,
  ReadonlyArray<Command.Command<Message>>,
] => [DataTable.initialState({ pageSize: 5 }), []]

export const update = (
  model: Model,
  message: Message,
): readonly [Model, ReadonlyArray<Command.Command<Message>>] => [
  M.value(message).pipe(
    M.withReturnType<Model>(),
    M.tagsExhaustive({
      UpdatedDataTableFilter: ({ columnId, value }) =>
        DataTable.setFilter(model, columnId, value),
      ClickedDataTableSort: ({ columnId }) =>
        DataTable.toggleSort(model, columnId),
      ClickedDataTableRowCheckbox: ({ rowId }) =>
        DataTable.toggleRowSelection(model, rowId),
      ClickedDataTableSelectAll: ({ rowIds }) =>
        DataTable.toggleAllPageRowsSelection(model, rowIds),
      ClickedDataTableColumnVisibility: ({ columnId, isVisible }) =>
        DataTable.toggleColumnVisibility(model, columnId, isVisible),
      ClickedDataTablePreviousPage: () => DataTable.previousPage(model),
      ClickedDataTableNextPage: ({ pageCount }) =>
        DataTable.nextPage(model, pageCount),
      ClickedDataTableFirstPage: () => DataTable.firstPage(model),
      ClickedDataTableLastPage: ({ pageCount }) =>
        DataTable.lastPage(model, pageCount),
      SelectedDataTablePageSize: ({ pageSize }) =>
        DataTable.setPageSize(model, pageSize),
      ClickedDataTableAction: () => model,
      ClickedDataTableClearFilters: () => DataTable.clearFilters(model),
    }),
  ),
  [],
]

export const view = (model: Model): Document => {
  const h = html<Message>()

  return {
    title: 'Data Table parity fixture',
    body: h.div(
      [
        h.DataAttribute('foldkit-fixture-root', ''),
        h.DataAttribute('foldkit-case-id', 'data-table-demo'),
        h.Class('p-6'),
      ],
      [
        DataTableDemo<Message>({
          state: model,
          onDataTableMessage: message => message,
        }),
      ],
    ),
  }
}
