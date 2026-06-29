import { Array as EffectArray, pipe } from 'effect'
import type { Attribute, Html } from 'foldkit/html'
import { html } from 'foldkit/html'

import * as Button from '../button'
import * as DropdownMenu from '../dropdown-menu'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './index'

type InvoiceStatus = 'paid' | 'pending' | 'unpaid'
type PaymentMethod = 'bankTransfer' | 'creditCard' | 'paypal'
type Child = Html | string

type Invoice = Readonly<{
  invoice: string
  paymentStatus: InvoiceStatus
  totalAmount: string
  paymentMethod: PaymentMethod
}>

type InvoiceCopy = Readonly<{
  dir?: 'rtl'
  caption: string
  invoice: string
  status: string
  method: string
  amount: string
  paid: string
  pending: string
  unpaid: string
  creditCard: string
  paypal: string
  bankTransfer: string
  total: string
}>

type Product = Readonly<{
  id: string
  name: string
  price: string
}>

type ExampleDefinition = Readonly<{
  id: string
  title: string
  view: () => Html
}>

const invoices: ReadonlyArray<Invoice> = [
  {
    invoice: 'INV001',
    paymentStatus: 'paid',
    totalAmount: '$250.00',
    paymentMethod: 'creditCard',
  },
  {
    invoice: 'INV002',
    paymentStatus: 'pending',
    totalAmount: '$150.00',
    paymentMethod: 'paypal',
  },
  {
    invoice: 'INV003',
    paymentStatus: 'unpaid',
    totalAmount: '$350.00',
    paymentMethod: 'bankTransfer',
  },
  {
    invoice: 'INV004',
    paymentStatus: 'paid',
    totalAmount: '$450.00',
    paymentMethod: 'creditCard',
  },
  {
    invoice: 'INV005',
    paymentStatus: 'paid',
    totalAmount: '$550.00',
    paymentMethod: 'paypal',
  },
  {
    invoice: 'INV006',
    paymentStatus: 'pending',
    totalAmount: '$200.00',
    paymentMethod: 'bankTransfer',
  },
  {
    invoice: 'INV007',
    paymentStatus: 'unpaid',
    totalAmount: '$300.00',
    paymentMethod: 'creditCard',
  },
]

const defaultInvoiceCopy: InvoiceCopy = {
  caption: 'A list of your recent invoices.',
  invoice: 'Invoice',
  status: 'Status',
  method: 'Method',
  amount: 'Amount',
  paid: 'Paid',
  pending: 'Pending',
  unpaid: 'Unpaid',
  creditCard: 'Credit Card',
  paypal: 'PayPal',
  bankTransfer: 'Bank Transfer',
  total: 'Total',
}

const arabicInvoiceCopy: InvoiceCopy = {
  dir: 'rtl',
  caption: 'قائمة بفواتيرك الأخيرة.',
  invoice: 'الفاتورة',
  status: 'الحالة',
  method: 'الطريقة',
  amount: 'المبلغ',
  paid: 'مدفوع',
  pending: 'قيد الانتظار',
  unpaid: 'غير مدفوع',
  creditCard: 'بطاقة ائتمانية',
  paypal: 'PayPal',
  bankTransfer: 'تحويل بنكي',
  total: 'المجموع',
}

const products: ReadonlyArray<Product> = [
  { id: 'wireless-mouse', name: 'Wireless Mouse', price: '$29.99' },
  {
    id: 'mechanical-keyboard',
    name: 'Mechanical Keyboard',
    price: '$129.99',
  },
  { id: 'usb-c-hub', name: 'USB-C Hub', price: '$49.99' },
]

const invoiceStatus = (copy: InvoiceCopy, status: InvoiceStatus): string =>
  copy[status]

const paymentMethod = (copy: InvoiceCopy, method: PaymentMethod): string =>
  copy[method]

const moreHorizontalIcon = (): Html => {
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
      h.Class('lucide lucide-more-horizontal'),
      h.AriaHidden(true),
    ],
    [
      h.circle([h.Cx('12'), h.Cy('12'), h.R('1')], []),
      h.circle([h.Cx('19'), h.Cy('12'), h.R('1')], []),
      h.circle([h.Cx('5'), h.Cy('12'), h.R('1')], []),
    ],
  )
}

const triggerBehaviorAttributes = (
  attributes: ReadonlyArray<Attribute<never>>,
): ReadonlyArray<Attribute<never>> =>
  attributes.filter(
    attribute =>
      !(attribute._tag === 'DataAttribute' && attribute.key === 'slot'),
  )

const actionButton = (
  triggerAttributes: ReadonlyArray<Attribute<never>>,
): Html => {
  const h = html<never>()

  return Button.view<never>({
    variant: 'ghost',
    size: 'icon',
    className: 'size-8',
    toView: attributes =>
      h.button(
        [...attributes.button, ...triggerAttributes],
        [moreHorizontalIcon(), h.span([h.Class('sr-only')], ['Open menu'])],
      ),
  })
}

const menuItem = (attributes: DropdownMenu.MenuItemAttributes<never>): Html => {
  const h = html<never>()
  const children: ReadonlyArray<Child> =
    attributes.item.value === 'delete'
      ? [attributes.item.label]
      : [h.span([...attributes.label], [attributes.item.label])]

  return h.div([...attributes.root], children)
}

const optionalMenuItem = (
  attributes: DropdownMenu.MenuItemAttributes<never> | undefined,
): ReadonlyArray<Html> =>
  attributes === undefined ? [] : [menuItem(attributes)]

const actionMenu = (id: string): Html => {
  const h = html<never>()

  return DropdownMenu.view<never>({
    id,
    align: 'end',
    forceMount: true,
    items: [
      { value: 'edit', label: 'Edit' },
      { value: 'duplicate', label: 'Duplicate' },
      { value: 'delete', label: 'Delete' },
    ],
    open: false,
    variant: 'destructive',
    toView: attributes =>
      h.div(
        [...attributes.root],
        [
          actionButton(triggerBehaviorAttributes(attributes.trigger)),
          h.div(
            [...attributes.portal],
            [
              h.div(
                [...attributes.popup.positioner.root],
                [
                  h.div(
                    [...attributes.popup.popup.root],
                    [
                      h.div(
                        [...attributes.popup.group],
                        [
                          ...optionalMenuItem(attributes.popup.items[0]),
                          ...optionalMenuItem(attributes.popup.items[1]),
                        ],
                      ),
                      h.div([...attributes.popup.separator], []),
                      h.div(
                        [...attributes.popup.group],
                        [...optionalMenuItem(attributes.popup.items[2])],
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ],
      ),
  })
}

const invoiceRow =
  (copy: InvoiceCopy) =>
  (invoice: Invoice): Html =>
    TableRow<never>({
      attributes: [html<never>().Key(invoice.invoice)],
      children: [
        TableCell<never>({
          className: 'font-medium',
          children: [invoice.invoice],
        }),
        TableCell<never>({
          children: [invoiceStatus(copy, invoice.paymentStatus)],
        }),
        TableCell<never>({
          children: [paymentMethod(copy, invoice.paymentMethod)],
        }),
        TableCell<never>({
          className: 'text-right',
          children: [invoice.totalAmount],
        }),
      ],
    })

const invoiceTable = (
  copy: InvoiceCopy,
  visibleInvoices: ReadonlyArray<Invoice>,
): Html =>
  Table<never>({
    dir: copy.dir,
    children: [
      TableCaption<never>({ children: [copy.caption] }),
      TableHeader<never>({
        children: [
          TableRow<never>({
            children: [
              TableHead<never>({
                className: 'w-[100px]',
                children: [copy.invoice],
              }),
              TableHead<never>({ children: [copy.status] }),
              TableHead<never>({ children: [copy.method] }),
              TableHead<never>({
                className: 'text-right',
                children: [copy.amount],
              }),
            ],
          }),
        ],
      }),
      TableBody<never>({
        children: pipe(visibleInvoices, EffectArray.map(invoiceRow(copy))),
      }),
      TableFooter<never>({
        children: [
          TableRow<never>({
            children: [
              TableCell<never>({
                attributes: [html<never>().Attribute('colspan', '3')],
                children: [copy.total],
              }),
              TableCell<never>({
                className: 'text-right',
                children: ['$2,500.00'],
              }),
            ],
          }),
        ],
      }),
    ],
  })

export const TableActions = (): Html =>
  Table<never>({
    children: [
      TableHeader<never>({
        children: [
          TableRow<never>({
            children: [
              TableHead<never>({ children: ['Product'] }),
              TableHead<never>({ children: ['Price'] }),
              TableHead<never>({
                className: 'text-right',
                children: ['Actions'],
              }),
            ],
          }),
        ],
      }),
      TableBody<never>({
        children: pipe(
          products,
          EffectArray.map(product =>
            TableRow<never>({
              attributes: [html<never>().Key(product.id)],
              children: [
                TableCell<never>({
                  className: 'font-medium',
                  children: [product.name],
                }),
                TableCell<never>({ children: [product.price] }),
                TableCell<never>({
                  className: 'text-right',
                  children: [actionMenu(`table-actions-${product.id}`)],
                }),
              ],
            }),
          ),
        ),
      }),
    ],
  })

export const TableDemo = (): Html => invoiceTable(defaultInvoiceCopy, invoices)

export const TableFooterExample = (): Html =>
  invoiceTable(defaultInvoiceCopy, pipe(invoices, EffectArray.take(3)))

export const TableRtl = (): Html => invoiceTable(arabicInvoiceCopy, invoices)

export const tableExampleViews: ReadonlyArray<ExampleDefinition> = [
  {
    id: 'shadcn/table-actions',
    title: 'TableActions',
    view: TableActions,
  },
  {
    id: 'shadcn/table-demo',
    title: 'TableDemo',
    view: TableDemo,
  },
  {
    id: 'shadcn/table-footer',
    title: 'TableFooterExample',
    view: TableFooterExample,
  },
  {
    id: 'shadcn/table-rtl',
    title: 'TableRtl',
    view: TableRtl,
  },
]
