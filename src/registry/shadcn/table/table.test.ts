/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Button from '../button'
import {
  TableActions,
  TableDemo,
  TableFooterExample,
  TableRtl,
  tableExampleViews,
} from './examples'
import * as Table from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const view = (html: Html) => (): Html => html

const tableWithParts = (): Html =>
  Table.Table<never>({
    className: 'text-xs text-sm custom-table',
    children: [
      Table.TableCaption<never>({
        className: 'mt-2 mt-6',
        children: ['Caption'],
      }),
      Table.TableHeader<never>({
        children: [
          Table.TableRow<never>({
            state: 'selected',
            children: [
              Table.TableHead<never>({
                className: 'text-left text-right w-[120px]',
                children: ['Head'],
              }),
            ],
          }),
        ],
      }),
      Table.TableBody<never>({
        children: [
          Table.TableRow<never>({
            children: [
              Table.TableCell<never>({
                className: 'p-1 p-4 font-medium',
                children: ['Cell'],
              }),
            ],
          }),
        ],
      }),
      Table.TableFooter<never>({
        children: [
          Table.TableRow<never>({
            children: [Table.TableCell<never>({ children: ['Footer'] })],
          }),
        ],
      }),
    ],
  })

describe('shadcn/table class helpers', () => {
  test('exports Effect Schema literals for row state', () => {
    expect(S.decodeUnknownSync(Table.TableRowState)('selected')).toBe(
      'selected',
    )
    expect(Table.tableRowStateValues).toStrictEqual(['selected'])
  })

  test('returns exact base-nova classes for every slot', () => {
    expect(Table.tableContainerClassName()).toBe(
      Table.tableContainerBaseClassName,
    )
    expect(Table.tableClassName()).toBe(Table.tableBaseClassName)
    expect(Table.tableHeaderClassName()).toBe(Table.tableHeaderBaseClassName)
    expect(Table.tableBodyClassName()).toBe(Table.tableBodyBaseClassName)
    expect(Table.tableFooterClassName()).toBe(Table.tableFooterBaseClassName)
    expect(Table.tableRowClassName()).toBe(Table.tableRowBaseClassName)
    expect(Table.tableHeadClassName()).toBe(Table.tableHeadBaseClassName)
    expect(Table.tableCellClassName()).toBe(Table.tableCellBaseClassName)
    expect(Table.tableCaptionClassName()).toBe(Table.tableCaptionBaseClassName)
  })

  test('canonicalizes custom classes through local cn', () => {
    const tableClassName = Table.tableClassName({
      className: 'text-xs text-sm custom-table',
    })
    const headClassName = Table.tableHeadClassName({
      className: 'text-left text-right w-[120px]',
    })
    const cellClassName = Table.tableCellClassName({
      className: 'p-1 p-4 font-medium',
    })

    expect(tableClassName).toContain('text-sm')
    expect(tableClassName).toContain('custom-table')
    expect(tableClassName).not.toContain('text-xs')
    expect(headClassName).toContain('text-right')
    expect(headClassName).not.toContain('text-left')
    expect(cellClassName).toContain('p-4')
    expect(cellClassName).not.toContain('p-1')
  })
})

describe('shadcn/table view', () => {
  test('renders semantic table structure, slots, and row state attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(tableWithParts()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="table-container"]'),
        ).toHaveAttr('class', Table.tableContainerClassName()),
        Scene.expect(Scene.selector('[data-slot="table"]')).toHaveAttr(
          'class',
          Table.tableClassName({ className: 'text-xs text-sm custom-table' }),
        ),
        Scene.expect(Scene.selector('caption')).toHaveAttr(
          'data-slot',
          'table-caption',
        ),
        Scene.expect(Scene.selector('thead')).toHaveAttr(
          'data-slot',
          'table-header',
        ),
        Scene.expect(Scene.selector('tbody')).toHaveAttr(
          'data-slot',
          'table-body',
        ),
        Scene.expect(Scene.selector('tfoot')).toHaveAttr(
          'data-slot',
          'table-footer',
        ),
        Scene.expect(Scene.selector('[data-state="selected"]')).toHaveAttr(
          'data-slot',
          'table-row',
        ),
        Scene.expect(Scene.selector('th')).toHaveText('Head'),
        Scene.expect(Scene.selector('td')).toHaveText('Cell'),
      )
    }).not.toThrow()
  })

  test('passes table dir and arbitrary part attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: view(
            Table.Table<never>({
              dir: 'rtl',
              attributes: [html<never>().Id('table-root')],
              containerAttributes: [html<never>().Id('table-container')],
              children: [
                Table.TableBody<never>({
                  children: [
                    Table.TableRow<never>({
                      children: [
                        Table.TableCell<never>({
                          attributes: [html<never>().Attribute('colspan', '2')],
                          children: ['Cell'],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="table-container"]'),
        ).toHaveAttr('id', 'table-container'),
        Scene.expect(Scene.selector('[data-slot="table"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="table"]')).toHaveAttr(
          'id',
          'table-root',
        ),
        Scene.expect(Scene.selector('[data-slot="table-cell"]')).toHaveAttr(
          'colspan',
          '2',
        ),
      )
    }).not.toThrow()
  })

  test('renders each dossier example with expected table surface', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => TableDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="table-caption"]')).toHaveText(
          'A list of your recent invoices.',
        ),
        Scene.expect(Scene.selector('[data-slot="table-footer"]')).toHaveText(
          'Total$2,500.00',
        ),
      )
      Scene.scene(
        { update, view: () => TableFooterExample() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="table-body"]')).toHaveText(
          'INV001PaidCredit Card$250.00INV002PendingPayPal$150.00INV003UnpaidBank Transfer$350.00',
        ),
      )
      Scene.scene(
        { update, view: () => TableActions() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="button"]')).toHaveAttr(
          'class',
          Button.buttonVariants({
            variant: 'ghost',
            size: 'icon',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).toHaveAttr('hidden', 'true'),
      )
      Scene.scene(
        { update, view: () => TableRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="table"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(Scene.selector('[data-slot="table-caption"]')).toHaveText(
          'قائمة بفواتيرك الأخيرة.',
        ),
      )
    }).not.toThrow()
  })

  test('keeps exported examples aligned with the manifest ids', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/table/item.json?raw')
    const manifest: {
      readonly examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    } = JSON.parse(manifestModule.default)

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      tableExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      tableExampleViews.map(example => example.title),
    )
  })
})

describe('shadcn/table installable source', () => {
  test('keeps data-table and origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@tanstack/react-table',
      '@base-ui',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/',
      '@/lib/utils',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/table/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/table/index.ts',
      'src/registry/shadcn/table/examples.ts',
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
