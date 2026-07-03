import { Schema as S } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { m } from 'foldkit/message'

import * as Button from '../button'
import * as Card from '../card'
import * as Checkbox from '../checkbox'
import * as DropdownMenu from '../dropdown-menu'
import * as Input from '../input'
import * as Pagination from '../pagination'
import * as Select from '../select'
import * as Table from '../table'
import * as Badge from '../badge'
import * as DataTable from './index'

type Child = Html | string

type PaymentStatus = 'pending' | 'processing' | 'success' | 'failed'
type TaskStatus = 'todo' | 'in-progress' | 'done' | 'blocked'
type TaskPriority = 'low' | 'medium' | 'high'

type Payment = Readonly<{
  id: string
  email: string
  status: PaymentStatus
  amount: number
}>

type Task = Readonly<{
  id: string
  title: string
  status: TaskStatus
  priority: TaskPriority
  label: string
}>

type Copy = Readonly<{
  dir?: 'rtl'
  title: string
  description: string
  filterPlaceholder: string
  noResults: string
  selectedSummary: (selected: number, total: number) => string
  columnsLabel: string
  rowsPerPageLabel: string
  pageLabel: (page: number, totalPages: number) => string
  previousLabel: string
  nextLabel: string
  firstLabel: string
  lastLabel: string
  clearLabel: string
  actionLabel: string
  selectAllLabel: string
  selectRowLabel: string
}>

type ExampleDefinition = Readonly<{
  id: string
  title: string
  view: <Message = never>(controller?: DataTableExampleController<Message>) => Html
}>

// MESSAGE

const UpdatedDataTableFilterLocal = m('UpdatedDataTableFilter', {
  columnId: S.String,
  value: S.String,
})
const ClickedDataTableSortLocal = m('ClickedDataTableSort', {
  columnId: S.String,
})
const ClickedDataTableRowCheckboxLocal = m('ClickedDataTableRowCheckbox', {
  rowId: S.String,
})
const ClickedDataTableSelectAllLocal = m('ClickedDataTableSelectAll', {
  rowIds: S.Array(S.String),
})
const ClickedDataTableColumnVisibilityLocal = m(
  'ClickedDataTableColumnVisibility',
  {
    columnId: S.String,
    isVisible: S.Boolean,
  },
)
const ClickedDataTablePreviousPageLocal = m('ClickedDataTablePreviousPage')
const ClickedDataTableNextPageLocal = m('ClickedDataTableNextPage', {
  pageCount: S.Number,
})
const ClickedDataTableFirstPageLocal = m('ClickedDataTableFirstPage')
const ClickedDataTableLastPageLocal = m('ClickedDataTableLastPage', {
  pageCount: S.Number,
})
const SelectedDataTablePageSizeLocal = m('SelectedDataTablePageSize', {
  pageSize: S.Number,
})
const ClickedDataTableActionLocal = m('ClickedDataTableAction', {
  actionId: S.String,
})
const ClickedDataTableClearFiltersLocal = m('ClickedDataTableClearFilters')

export {
  ClickedDataTableActionLocal as ClickedDataTableAction,
  ClickedDataTableClearFiltersLocal as ClickedDataTableClearFilters,
  ClickedDataTableColumnVisibilityLocal as ClickedDataTableColumnVisibility,
  ClickedDataTableFirstPageLocal as ClickedDataTableFirstPage,
  ClickedDataTableLastPageLocal as ClickedDataTableLastPage,
  ClickedDataTableNextPageLocal as ClickedDataTableNextPage,
  ClickedDataTablePreviousPageLocal as ClickedDataTablePreviousPage,
  ClickedDataTableRowCheckboxLocal as ClickedDataTableRowCheckbox,
  ClickedDataTableSelectAllLocal as ClickedDataTableSelectAll,
  ClickedDataTableSortLocal as ClickedDataTableSort,
  SelectedDataTablePageSizeLocal as SelectedDataTablePageSize,
  UpdatedDataTableFilterLocal as UpdatedDataTableFilter,
}

const UpdatedDataTableFilter = UpdatedDataTableFilterLocal
const ClickedDataTableSort = ClickedDataTableSortLocal
const ClickedDataTableRowCheckbox = ClickedDataTableRowCheckboxLocal
const ClickedDataTableSelectAll = ClickedDataTableSelectAllLocal
const ClickedDataTableColumnVisibility = ClickedDataTableColumnVisibilityLocal
const ClickedDataTablePreviousPage = ClickedDataTablePreviousPageLocal
const ClickedDataTableNextPage = ClickedDataTableNextPageLocal
const ClickedDataTableFirstPage = ClickedDataTableFirstPageLocal
const ClickedDataTableLastPage = ClickedDataTableLastPageLocal
const SelectedDataTablePageSize = SelectedDataTablePageSizeLocal
const ClickedDataTableAction = ClickedDataTableActionLocal
const ClickedDataTableClearFilters = ClickedDataTableClearFiltersLocal

export const DataTableExampleMessage = S.Union([
  UpdatedDataTableFilterLocal,
  ClickedDataTableSortLocal,
  ClickedDataTableRowCheckboxLocal,
  ClickedDataTableSelectAllLocal,
  ClickedDataTableColumnVisibilityLocal,
  ClickedDataTablePreviousPageLocal,
  ClickedDataTableNextPageLocal,
  ClickedDataTableFirstPageLocal,
  ClickedDataTableLastPageLocal,
  SelectedDataTablePageSizeLocal,
  ClickedDataTableActionLocal,
  ClickedDataTableClearFiltersLocal,
])
export type DataTableExampleMessage = typeof DataTableExampleMessage.Type

export type DataTableExampleController<Message> = Readonly<{
  state?: DataTable.DataTableState
  onDataTableMessage?: (message: DataTableExampleMessage) => Message
}>

// DATA

const paymentRows: ReadonlyArray<Payment> = [
  {
    id: 'm5gr84i9',
    email: 'ken99@example.com',
    status: 'success',
    amount: 316,
  },
  {
    id: '3u1reuv4',
    email: 'abe45@example.com',
    status: 'success',
    amount: 242,
  },
  {
    id: 'derv1ws0',
    email: 'monserrat44@example.com',
    status: 'processing',
    amount: 837,
  },
  {
    id: '5kma53ae',
    email: 'silas22@example.com',
    status: 'success',
    amount: 874,
  },
  {
    id: 'bhqecj4p',
    email: 'carmella@example.com',
    status: 'failed',
    amount: 721,
  },
]

const taskRows: ReadonlyArray<Task> = [
  {
    id: 'TASK-8782',
    title: 'Review parity checklist for data-table',
    status: 'in-progress',
    priority: 'high',
    label: 'Docs',
  },
  {
    id: 'TASK-7878',
    title: 'Write acceptance notes for registry docs',
    status: 'todo',
    priority: 'medium',
    label: 'Writing',
  },
  {
    id: 'TASK-7839',
    title: 'Verify generated artifacts on component route',
    status: 'done',
    priority: 'low',
    label: 'QA',
  },
  {
    id: 'TASK-5562',
    title: 'Add toolbar actions and selection summary',
    status: 'blocked',
    priority: 'high',
    label: 'UI',
  },
  {
    id: 'TASK-8686',
    title: 'Port pagination copy to Arabic preview',
    status: 'in-progress',
    priority: 'medium',
    label: 'RTL',
  },
  {
    id: 'TASK-1280',
    title: 'Document DragAndDrop follow-up seam',
    status: 'todo',
    priority: 'low',
    label: 'Follow-up',
  },
]

const paymentCopy: Copy = {
  title: 'Payments',
  description: 'Manage incoming payments and review status at a glance.',
  filterPlaceholder: 'Filter emails...',
  noResults: 'No results.',
  selectedSummary: (selected, total) => `${selected} of ${total} row(s) selected.`,
  columnsLabel: 'Columns',
  rowsPerPageLabel: 'Rows per page',
  pageLabel: (page, totalPages) => `Page ${page} of ${totalPages}`,
  previousLabel: 'Previous',
  nextLabel: 'Next',
  firstLabel: 'First',
  lastLabel: 'Last',
  clearLabel: 'Reset',
  actionLabel: 'View',
  selectAllLabel: 'Select all payments',
  selectRowLabel: 'Select payment',
}

const taskCopy: Copy = {
  title: 'Tasks',
  description: 'Track work items with filter, visibility, and page-size controls.',
  filterPlaceholder: 'Filter tasks...',
  noResults: 'No tasks match the current filters.',
  selectedSummary: (selected, total) => `${selected} of ${total} tasks selected.`,
  columnsLabel: 'View',
  rowsPerPageLabel: 'Rows per page',
  pageLabel: (page, totalPages) => `Page ${page} of ${totalPages}`,
  previousLabel: 'Previous',
  nextLabel: 'Next',
  firstLabel: 'First',
  lastLabel: 'Last',
  clearLabel: 'Reset',
  actionLabel: 'Open',
  selectAllLabel: 'Select all tasks on this page',
  selectRowLabel: 'Select task',
}

const paymentRtlCopy: Copy = {
  dir: 'rtl',
  title: 'المدفوعات',
  description: 'راجع المدفوعات الواردة وحالة كل صف من مكان واحد.',
  filterPlaceholder: 'تصفية البريد الإلكتروني...',
  noResults: 'لا توجد نتائج.',
  selectedSummary: (selected, total) => `${selected} من ${total} صفوف محددة.`,
  columnsLabel: 'الأعمدة',
  rowsPerPageLabel: 'عدد الصفوف',
  pageLabel: (page, totalPages) => `الصفحة ${page} من ${totalPages}`,
  previousLabel: 'السابق',
  nextLabel: 'التالي',
  firstLabel: 'الأولى',
  lastLabel: 'الأخيرة',
  clearLabel: 'إعادة تعيين',
  actionLabel: 'عرض',
  selectAllLabel: 'تحديد كل المدفوعات',
  selectRowLabel: 'تحديد المدفوعة',
}

const pageSizeItems: ReadonlyArray<Select.SelectItemDescriptor> = [
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
]

const defaultPaymentState = (): DataTable.DataTableState =>
  DataTable.initialState({ pageSize: 2 })

const defaultTaskState = (): DataTable.DataTableState =>
  DataTable.initialState({ pageSize: 3 })

const defaultRtlState = (): DataTable.DataTableState =>
  DataTable.initialState({ pageSize: 2 })

const paymentRowId = (payment: Payment): string => payment.id
const taskRowId = (task: Task): string => task.id

// VIEW

const checkedStateFor = (
  selectedCount: number,
  totalCount: number,
): Checkbox.CheckboxCheckedState => {
  if (selectedCount === 0) {
    return 'unchecked'
  }

  if (selectedCount === totalCount) {
    return 'checked'
  }

  return 'indeterminate'
}

const buttonMessageAttributes = <Message>(
  h: ReturnType<typeof html<Message>>,
  controller: DataTableExampleController<Message>,
  message: DataTableExampleMessage,
): ReadonlyArray<Attribute<Message>> =>
  controller.onDataTableMessage === undefined
    ? []
    : [h.OnClick(controller.onDataTableMessage(message))]

const checkboxView = <Message>(
  config: Readonly<{
    id: string
    label: string
    checkedState: Checkbox.CheckboxCheckedState
    controller: DataTableExampleController<Message>
    message: DataTableExampleMessage
  }>,
): Html => {
  const h = html<Message>()
  const onDataTableMessage = config.controller.onDataTableMessage

  return Checkbox.view<Message>({
    id: config.id,
    name: config.id,
    checkedState: config.checkedState,
    ...(onDataTableMessage === undefined
      ? {}
      : { onCheckedChange: () => onDataTableMessage(config.message) }),
    toView: attributes =>
      h.span(
        [...attributes.root, h.AriaLabel(config.label)],
        attributes.indicator.length > 0
          ? [h.span([...attributes.indicator], [])]
          : [],
      ),
  })
}

const icon = (
  path: string,
  className: string,
  placement?: 'inline-start' | 'inline-end',
): Html => {
  const h = html<never>()

  return h.svg(
    [
      h.Xmlns('http://www.w3.org/2000/svg'),
      h.Width('24'),
      h.Height('24'),
      h.ViewBox('0 0 24 24'),
      h.Fill('none'),
      h.Stroke('currentColor'),
      h.StrokeWidth('2'),
      h.StrokeLinecap('round'),
      h.StrokeLinejoin('round'),
      h.Class(className),
      h.AriaHidden(true),
      ...(placement === undefined ? [] : [h.DataAttribute('icon', placement)]),
    ],
    [h.path([h.D(path)], [])],
  )
}

const arrowUpDownIcon = (): Html =>
  icon('m7 15 5 5 5-5M7 9l5-5 5 5', 'lucide lucide-arrow-up-down size-4')

const cardIcon = (): Html =>
  icon(
    'M2 8h20M6 16h.01M10 16h4M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    'lucide lucide-credit-card size-4 text-muted-foreground',
    'inline-start',
  )

const badgeForPaymentStatus = (status: PaymentStatus): Html => {
  const h = html<never>()
  const variant =
    status === 'failed'
      ? 'destructive'
      : status === 'success'
        ? 'default'
        : 'secondary'
  const label =
    status === 'processing'
      ? 'Processing'
      : status === 'pending'
        ? 'Pending'
        : status === 'success'
          ? 'Success'
          : 'Failed'

  return Badge.view<never>({
    variant,
    toView: attributes => h.span([...attributes.badge], [label]),
  })
}

const badgeForTaskStatus = (status: TaskStatus): Html => {
  const h = html<never>()
  const variant =
    status === 'blocked'
      ? 'destructive'
      : status === 'done'
        ? 'default'
        : 'outline'
  const label =
    status === 'in-progress'
      ? 'In Progress'
      : status === 'todo'
        ? 'Todo'
        : status === 'done'
          ? 'Done'
          : 'Blocked'

  return Badge.view<never>({
    variant,
    toView: attributes => h.span([...attributes.badge], [label]),
  })
}

const badgeForTaskPriority = (priority: TaskPriority): Html => {
  const h = html<never>()

  return Badge.view<never>({
    variant: priority === 'high' ? 'secondary' : 'outline',
    toView: attributes =>
      h.span([...attributes.badge], [
        priority === 'high'
          ? 'High'
          : priority === 'medium'
            ? 'Medium'
            : 'Low',
      ]),
  })
}

const amountText = (amount: number, locale: string = 'en-US'): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const paymentColumns: ReadonlyArray<DataTable.DataTableColumn<Payment>> = [
  {
    id: 'status',
    header: 'Status',
    isHideable: true,
    isFilterable: true,
    valueText: payment => payment.status,
    cell: payment => badgeForPaymentStatus(payment.status),
  },
  {
    id: 'email',
    header: 'Email',
    isHideable: true,
    isSortable: true,
    isFilterable: true,
    valueText: payment => payment.email,
    cell: payment => {
      const h = html<never>()
      return h.div([h.Class('lowercase')], [payment.email])
    },
  },
  {
    id: 'amount',
    header: 'Amount',
    isHideable: true,
    isSortable: true,
    valueText: payment => amountText(payment.amount),
    sortValue: payment => payment.amount,
    cell: payment => {
      const h = html<never>()
      return h.div([h.Class('text-right font-medium')], [
        amountText(payment.amount),
      ])
    },
  },
]

const taskColumns: ReadonlyArray<DataTable.DataTableColumn<Task>> = [
  {
    id: 'id',
    header: 'Task',
    valueText: task => task.id,
    cell: task => {
      const h = html<never>()
      return h.div([h.Class('font-mono text-xs text-muted-foreground')], [
        task.id,
      ])
    },
  },
  {
    id: 'title',
    header: 'Title',
    isHideable: true,
    isFilterable: true,
    isSortable: true,
    valueText: task => task.title,
    cell: task => {
      const h = html<never>()
      return h.div([h.Class('flex min-w-0 items-center gap-2')], [
        Badge.view<never>({
          variant: 'outline',
          toView: attributes => h.span([...attributes.badge], [task.label]),
        }),
        h.span([h.Class('truncate font-medium')], [task.title]),
      ])
    },
  },
  {
    id: 'status',
    header: 'Status',
    isHideable: true,
    isFilterable: true,
    valueText: task => task.status,
    cell: task => badgeForTaskStatus(task.status),
  },
  {
    id: 'priority',
    header: 'Priority',
    isHideable: true,
    isSortable: true,
    valueText: task => task.priority,
    cell: task => badgeForTaskPriority(task.priority),
  },
]

const paymentColumnsRtl: ReadonlyArray<DataTable.DataTableColumn<Payment>> = [
  {
    id: 'status',
    header: 'الحالة',
    isHideable: true,
    isFilterable: true,
    valueText: payment => payment.status,
    cell: payment => {
      const h = html<never>()
      const labels = {
        success: 'ناجح',
        processing: 'قيد المعالجة',
        failed: 'فشل',
        pending: 'قيد الانتظار',
      }
      return Badge.view<never>({
        variant:
          payment.status === 'failed'
            ? 'destructive'
            : payment.status === 'success'
              ? 'default'
              : 'secondary',
        toView: attributes => h.span([...attributes.badge], [labels[payment.status]]),
      })
    },
  },
  {
    id: 'email',
    header: 'البريد الإلكتروني',
    isHideable: true,
    isSortable: true,
    isFilterable: true,
    valueText: payment => payment.email,
    cell: payment => {
      const h = html<never>()
      return h.div([h.Class('lowercase text-start')], [payment.email])
    },
  },
  {
    id: 'amount',
    header: 'المبلغ',
    isHideable: true,
    isSortable: true,
    valueText: payment => amountText(payment.amount, 'ar-SA'),
    sortValue: payment => payment.amount,
    cell: payment => {
      const h = html<never>()
      return h.div([h.Class('text-start font-medium')], [
        amountText(payment.amount, 'ar-SA'),
      ])
    },
  },
]

const stateFor = (
  state: DataTable.DataTableState | undefined,
  fallback: () => DataTable.DataTableState,
): DataTable.DataTableState => state ?? fallback()

const sortHeaderButton = <Message, Row>(
  controller: DataTableExampleController<Message>,
  column: DataTable.DataTableColumn<Row>,
): Html => {
  const h = html<Message>()

  return Button.view<Message>({
    variant: 'ghost',
    size: 'sm',
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          ...buttonMessageAttributes(
            h,
            controller,
            ClickedDataTableSort({ columnId: column.id }),
          ),
        ],
        [column.header, arrowUpDownIcon()],
      ),
  })
}

const filterInput = <Message>(
  controller: DataTableExampleController<Message>,
  columnId: string,
  state: DataTable.DataTableState,
  placeholder: string,
  className: string,
  dir?: 'rtl',
): Html => {
  const h = html<Message>()
  const onDataTableMessage = controller.onDataTableMessage

  return Input.view<Message>({
    value: state.filters[columnId] ?? '',
    placeholder,
    className,
    ...(dir === undefined ? {} : { dir }),
    ...(onDataTableMessage === undefined
      ? {}
      : {
          onValueChange: change =>
            onDataTableMessage(
              UpdatedDataTableFilter({
                columnId,
                value: change.value,
              }),
            ),
        }),
    toView: attributes => h.input([...attributes.input]),
  })
}

const defaultMenuItemContent = <Message>(
  attributes: DropdownMenu.MenuItemAttributes<Message>,
): ReadonlyArray<Html> => {
  const h = html<Message>()
  const hasIndicator =
    DropdownMenu.itemKind(attributes.item) === 'checkbox' ||
    DropdownMenu.itemKind(attributes.item) === 'radio'

  return [
    h.span(
      [...attributes.indicator],
      hasIndicator ? [DropdownMenu.checkIcon([])] : [],
    ),
    h.span([...attributes.label], [attributes.item.label]),
  ]
}

const columnVisibilityMenu = <Message, Row>(
  controller: DataTableExampleController<Message>,
  columns: ReadonlyArray<DataTable.DataTableColumn<Row>>,
  state: DataTable.DataTableState,
  label: string,
  dir?: 'rtl',
): Html => {
  const h = html<Message>()
  const onDataTableMessage = controller.onDataTableMessage
  const items = columns
    .filter(column => column.isHideable !== false)
    .map(
      (column): DropdownMenu.MenuItemDescriptor => ({
        value: column.id,
        label: column.header,
        kind: 'checkbox',
        isChecked: !state.hiddenColumnIds.includes(column.id),
      }),
    )

  return DropdownMenu.view<Message>({
    id: `${label.replaceAll(' ', '-').toLocaleLowerCase()}-columns`,
    open: true,
    items,
    align: dir === 'rtl' ? 'start' : 'end',
    ...(dir === undefined ? {} : { dir }),
    ...(onDataTableMessage === undefined
      ? {}
      : {
          onCheckedChange: change =>
            onDataTableMessage(
              ClickedDataTableColumnVisibility({
                columnId: change.value,
                isVisible: change.checked,
              }),
            ),
        }),
    toView: attributes =>
      h.div(
        [...attributes.root, h.Class('relative')],
        [
          Button.view<Message>({
            variant: 'outline',
            size: 'sm',
            toView: buttonAttributes =>
              h.button([...buttonAttributes.button, ...attributes.trigger], [
                label,
              ]),
          }),
          h.div(
            [...attributes.portal],
            attributes.popup.isMounted
              ? [
                  h.div([...attributes.popup.backdrop.root], []),
                  h.div(
                    [...attributes.popup.positioner.root],
                    [
                      h.div(
                        [...attributes.popup.popup.root],
                        [
                          h.div([...attributes.popup.group], [
                            h.div([...attributes.popup.groupLabel], [label]),
                            ...attributes.popup.items.map(itemAttributes =>
                              h.div(
                                [...itemAttributes.root],
                                defaultMenuItemContent(itemAttributes),
                              ),
                            ),
                          ]),
                        ],
                      ),
                    ],
                  ),
                ]
              : [],
          ),
        ],
      ),
  })
}

const rowsPerPageSelect = <Message>(
  controller: DataTableExampleController<Message>,
  state: DataTable.DataTableState,
): Html => {
  const onDataTableMessage = controller.onDataTableMessage

  return Select.view<Message>({
    id: 'data-table-rows-per-page',
    open: true,
    items: pageSizeItems,
    value: String(state.pageSize),
    placeholder: String(state.pageSize),
    triggerClassName: 'h-8 w-16',
    contentClassName: 'w-16',
    ...(onDataTableMessage === undefined
      ? {}
      : {
          onValueChange: change =>
            onDataTableMessage(
              SelectedDataTablePageSize({
                pageSize: Number.parseInt(change.value, 10),
              }),
            ),
        }),
  })
}

const actionButton = <Message>(
  controller: DataTableExampleController<Message>,
  actionId: string,
  label: string,
): Html => {
  const h = html<Message>()

  return Button.view<Message>({
    variant: 'ghost',
    size: 'sm',
    toView: attributes =>
      h.button(
        [
          ...attributes.button,
          ...buttonMessageAttributes(
            h,
            controller,
            ClickedDataTableAction({ actionId }),
          ),
        ],
        [label],
      ),
  })
}

const tableHeadContent = <Message, Row>(
  controller: DataTableExampleController<Message>,
  column: DataTable.DataTableColumn<Row>,
): Child =>
  column.isSortable === true ? sortHeaderButton(controller, column) : column.header

const renderDataTable = <Message, Row>(
  config: Readonly<{
    controller: DataTableExampleController<Message>
    state: DataTable.DataTableState
    rows: ReadonlyArray<Row>
    columns: ReadonlyArray<DataTable.DataTableColumn<Row>>
    rowId: (row: Row) => string
    copy: Copy
    filterColumnId: string
    title?: string
    description?: string
    card?: boolean
    actionLabelForRow: (row: Row) => string
    actionIdForRow: (row: Row) => string
  }>,
): Html => {
  const h = html<Message>()
  const model = DataTable.rowModel({
    rows: config.rows,
    columns: config.columns,
    state: config.state,
    rowId: config.rowId,
  })
  const pageRowIds = model.paginatedRows.map(config.rowId)
  const selectAllState = checkedStateFor(
    model.selectedPageRowCount,
    pageRowIds.length,
  )
  const hasFilters = Object.keys(config.state.filters).length > 0
  const body = h.div(
    [h.Class('w-full')],
    [
      h.div([h.Class(DataTable.dataTableToolbarClassName())], [
        h.div([h.Class(DataTable.dataTableFiltersClassName())], [
          filterInput(
            config.controller,
            config.filterColumnId,
            config.state,
            config.copy.filterPlaceholder,
            'h-8 w-full max-w-sm',
            config.copy.dir,
          ),
          ...(hasFilters
            ? [
                Button.view<Message>({
                  variant: 'ghost',
                  size: 'sm',
                  toView: attributes =>
                    h.button(
                      [
                        ...attributes.button,
                        ...buttonMessageAttributes(
                          h,
                          config.controller,
                          ClickedDataTableClearFilters(),
                        ),
                      ],
                      [config.copy.clearLabel],
                    ),
                }),
              ]
            : []),
        ]),
        h.div([h.Class(DataTable.dataTableActionsClassName())], [
          columnVisibilityMenu(
            config.controller,
            config.columns,
            config.state,
            config.copy.columnsLabel,
            config.copy.dir,
          ),
        ]),
      ]),
      h.div([h.Class('overflow-hidden rounded-md border')], [
        Table.Table<Message>({
          ...(config.copy.dir === undefined ? {} : { dir: config.copy.dir }),
          children: [
            Table.TableHeader<Message>({
              children: [
                Table.TableRow<Message>({
                  children: [
                    Table.TableHead<Message>({
                      className: 'w-10',
                      children: [
                        checkboxView({
                          id: `${config.copy.title}-select-all`,
                          label: config.copy.selectAllLabel,
                          checkedState: selectAllState,
                          controller: config.controller,
                          message: ClickedDataTableSelectAll({
                            rowIds: [...pageRowIds],
                          }),
                        }),
                      ],
                    }),
                    ...model.visibleColumns.map(column =>
                      Table.TableHead<Message>({
                        className:
                          column.id === 'amount'
                            ? config.copy.dir === 'rtl'
                              ? 'text-start'
                              : 'text-right'
                            : undefined,
                        children: [tableHeadContent(config.controller, column)],
                      }),
                    ),
                    Table.TableHead<Message>({
                      className:
                        config.copy.dir === 'rtl' ? 'text-start' : 'text-right',
                      children: [config.copy.actionLabel],
                    }),
                  ],
                }),
              ],
            }),
            Table.TableBody<Message>({
              children:
                model.paginatedRows.length > 0
                  ? model.paginatedRows.map(row =>
                      Table.TableRow<Message>({
                        state:
                          config.state.selectedRowIds[config.rowId(row)] === true
                            ? 'selected'
                            : undefined,
                        children: [
                          Table.TableCell<Message>({
                            children: [
                              checkboxView({
                                id: config.rowId(row),
                                label: config.copy.selectRowLabel,
                                checkedState:
                                  config.state.selectedRowIds[config.rowId(row)] ===
                                  true
                                    ? 'checked'
                                    : 'unchecked',
                                controller: config.controller,
                                message: ClickedDataTableRowCheckbox({
                                  rowId: config.rowId(row),
                                }),
                              }),
                            ],
                          }),
                          ...model.visibleColumns.map(column =>
                            Table.TableCell<Message>({
                              className:
                                column.id === 'amount'
                                  ? config.copy.dir === 'rtl'
                                    ? 'text-start'
                                    : 'text-right'
                                  : undefined,
                              children: [column.cell(row)],
                            }),
                          ),
                          Table.TableCell<Message>({
                            className:
                              config.copy.dir === 'rtl' ? 'text-start' : 'text-right',
                            children: [
                              actionButton(
                                config.controller,
                                config.actionIdForRow(row),
                                config.actionLabelForRow(row),
                              ),
                            ],
                          }),
                        ],
                      }),
                    )
                  : [
                      Table.TableRow<Message>({
                        children: [
                          Table.TableCell<Message>({
                            attributes: [h.Attribute('colspan', '5')],
                            className: DataTable.dataTableEmptyStateClassName(),
                            children: [config.copy.noResults],
                          }),
                        ],
                      }),
                    ],
            }),
          ],
        }),
      ]),
      h.div([h.Class(DataTable.dataTableMetaClassName())], [
        h.div([h.Class('flex-1 text-sm text-muted-foreground')], [
          config.copy.selectedSummary(
            model.selectedFilteredRowCount,
            model.filteredRowCount,
          ),
        ]),
        h.div([h.Class('flex items-center gap-4')], [
          h.div([h.Class('flex items-center gap-2 text-sm')], [
            h.span([h.Class('font-medium')], [config.copy.rowsPerPageLabel]),
            rowsPerPageSelect(config.controller, config.state),
          ]),
          h.div([h.Class('text-sm text-muted-foreground')], [
            config.copy.pageLabel(
              config.state.pageIndex + 1,
              model.totalPageCount,
            ),
          ]),
          Pagination.Pagination<Message>({
            className: 'mx-0 w-auto',
            ...(config.copy.dir === undefined ? {} : { dir: config.copy.dir }),
            children: [
              Pagination.PaginationContent<Message>({
                children: [
                  Pagination.PaginationItem<Message>({
                    children: [
                      Pagination.PaginationLink<Message>({
                        href: '#',
                        isDisabled: !model.canPreviousPage,
                        children: [config.copy.firstLabel],
                        ...(config.controller.onDataTableMessage === undefined
                          ? {}
                          : { onClick: config.controller.onDataTableMessage(ClickedDataTableFirstPage()) }),
                      }),
                    ],
                  }),
                  Pagination.PaginationItem<Message>({
                    children: [
                      Pagination.PaginationPrevious<Message>({
                        href: '#',
                        text: config.copy.previousLabel,
                        dir: config.copy.dir ?? 'ltr',
                        isDisabled: !model.canPreviousPage,
                        ...(config.controller.onDataTableMessage === undefined
                          ? {}
                          : {
                              onClick: config.controller.onDataTableMessage(
                                ClickedDataTablePreviousPage(),
                              ),
                            }),
                      }),
                    ],
                  }),
                  Pagination.PaginationItem<Message>({
                    children: [
                      Pagination.PaginationNext<Message>({
                        href: '#',
                        text: config.copy.nextLabel,
                        dir: config.copy.dir ?? 'ltr',
                        isDisabled: !model.canNextPage,
                        ...(config.controller.onDataTableMessage === undefined
                          ? {}
                          : {
                              onClick: config.controller.onDataTableMessage(
                                ClickedDataTableNextPage({
                                  pageCount: model.totalPageCount,
                                }),
                              ),
                            }),
                      }),
                    ],
                  }),
                  Pagination.PaginationItem<Message>({
                    children: [
                      Pagination.PaginationLink<Message>({
                        href: '#',
                        isDisabled: !model.canNextPage,
                        children: [config.copy.lastLabel],
                        ...(config.controller.onDataTableMessage === undefined
                          ? {}
                          : {
                              onClick: config.controller.onDataTableMessage(
                                ClickedDataTableLastPage({
                                  pageCount: model.totalPageCount,
                                }),
                              ),
                            }),
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ]),
      ]),
    ],
  )

  if (config.card !== true) {
    return body
  }

  return Card.Card<Message>({
    ...(config.copy.dir === undefined ? {} : { dir: config.copy.dir }),
    children: [
      Card.CardHeader<Message>({
        children: [
          Card.CardTitle<Message>({ children: [config.title ?? config.copy.title] }),
          Card.CardDescription<Message>({
            children: [config.description ?? config.copy.description],
          }),
        ],
      }),
      Card.CardContent<Message>({ children: [body] }),
    ],
  })
}

export const DataTableDemo = <Message = never>(
  controller: DataTableExampleController<Message> = {},
): Html =>
  renderDataTable({
    controller,
    state: stateFor(controller.state, defaultPaymentState),
    rows: paymentRows,
    columns: paymentColumns,
    rowId: paymentRowId,
    copy: paymentCopy,
    filterColumnId: 'email',
    actionLabelForRow: () => 'Copy ID',
    actionIdForRow: payment => `copy-payment:${payment.id}`,
  })

export const DataTableTasks = <Message = never>(
  controller: DataTableExampleController<Message> = {},
): Html =>
  renderDataTable({
    controller,
    state: stateFor(controller.state, defaultTaskState),
    rows: taskRows,
    columns: taskColumns,
    rowId: taskRowId,
    copy: taskCopy,
    filterColumnId: 'title',
    title: 'Tasks',
    description:
      'A denser task table with badges, title filtering, column toggles, and page-size controls.',
    card: true,
    actionLabelForRow: () => 'Open',
    actionIdForRow: task => `open-task:${task.id}`,
  })

export const DataTableRtl = <Message = never>(
  controller: DataTableExampleController<Message> = {},
): Html =>
  renderDataTable({
    controller,
    state: stateFor(controller.state, defaultRtlState),
    rows: paymentRows,
    columns: paymentColumnsRtl,
    rowId: paymentRowId,
    copy: paymentRtlCopy,
    filterColumnId: 'email',
    actionLabelForRow: () => 'نسخ المعرّف',
    actionIdForRow: payment => `copy-payment-rtl:${payment.id}`,
  })

export const dataTableExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/data-table-demo',
    title: 'DataTableDemo',
    view: DataTableDemo,
  },
  {
    id: 'shadcn/data-table-tasks',
    title: 'DataTableTasks',
    view: DataTableTasks,
  },
  {
    id: 'shadcn/data-table-rtl',
    title: 'DataTableRtl',
    view: DataTableRtl,
  },
]
