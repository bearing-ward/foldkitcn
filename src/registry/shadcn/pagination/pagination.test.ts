/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  PaginationDemo,
  PaginationIconsOnly,
  PaginationRtl,
  PaginationSimple,
  paginationExampleViews,
} from './examples'
import * as Pagination from './index'

// MODEL

type Model = Readonly<{
  linkState: 'idle' | 'clicked'
}>

const initialModel: Model = { linkState: 'idle' }

// MESSAGE

type Message = 'clicked-page'

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, message: Message): UpdateReturn =>
  message === 'clicked-page'
    ? [evo(model, { linkState: () => 'clicked' }), []]
    : [model, []]

// VIEW

const view =
  (target: Html) =>
  (_model: Model): Html =>
    target

const viewClickablePagination = (model: Model): Html => {
  const h = html<Message>()

  return h.div(
    [],
    [
      Pagination.Pagination<Message>({
        children: [
          Pagination.PaginationContent<Message>({
            children: [
              Pagination.PaginationItem<Message>({
                children: [
                  Pagination.PaginationLink<Message>({
                    href: '#page-1',
                    onClick: 'clicked-page',
                    children: ['1'],
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      h.p([h.DataAttribute('testid', 'link-state')], [model.linkState]),
    ],
  )
}

const paginationWithParts = (): Html =>
  Pagination.Pagination<never>({
    className: 'custom-nav',
    ariaLabel: 'Results pages',
    children: [
      Pagination.PaginationContent<never>({
        className: 'custom-list gap-2 gap-4',
        children: [
          Pagination.PaginationItem<never>({
            className: 'custom-item',
            children: [
              Pagination.PaginationPrevious<never>({
                href: '#previous',
                isDisabled: true,
              }),
            ],
          }),
          Pagination.PaginationItem<never>({
            children: [
              Pagination.PaginationLink<never>({
                href: '#page-1',
                className: 'custom-link',
                children: ['1'],
              }),
            ],
          }),
          Pagination.PaginationItem<never>({
            children: [
              Pagination.PaginationLink<never>({
                href: '#page-2',
                isActive: true,
                children: ['2'],
              }),
            ],
          }),
          Pagination.PaginationItem<never>({
            children: [Pagination.PaginationEllipsis<never>()],
          }),
          Pagination.PaginationItem<never>({
            children: [Pagination.PaginationNext<never>({ href: '#next' })],
          }),
        ],
      }),
    ],
  })

describe('shadcn/pagination class helpers', () => {
  test('exports Effect Schema style option metadata', () => {
    expect(S.decodeUnknownSync(Pagination.PaginationDirection)('rtl')).toBe(
      'rtl',
    )
    expect(
      S.decodeUnknownSync(Pagination.PaginationLinkStyleOptions)({
        href: '#page-2',
        isActive: true,
      }).isActive,
    ).toBeTruthy()
  })

  test('uses exact origin class strings for pagination slots', () => {
    expect(Pagination.paginationClassName()).toBe(
      Pagination.paginationBaseClassName,
    )
    expect(Pagination.paginationContentClassName()).toBe(
      'flex items-center gap-0.5',
    )
    expect(Pagination.paginationEllipsisClassName()).toContain('size-8')
    expect(Pagination.paginationPreviousClassName()).toBe('pl-1.5!')
    expect(Pagination.paginationNextClassName()).toBe('pr-1.5!')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    const contentClassName = Pagination.paginationContentClassName({
      className: 'custom-list gap-2 gap-4',
    })

    expect(contentClassName).toContain('custom-list')
    expect(contentClassName).toContain('gap-4')
    expect(contentClassName).not.toContain('gap-2')
    expect(contentClassName).not.toContain('gap-0.5')
  })
})

describe('shadcn/pagination view', () => {
  test('renders navigation, list, item, link, current page, previous/next, ellipsis, and disabled semantics', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(paginationWithParts()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('navigation', { name: 'Results pages' }),
        ).toHaveAttr('data-slot', 'pagination'),
        Scene.expect(
          Scene.role('navigation', { name: 'Results pages' }),
        ).toHaveAttr(
          'class',
          Pagination.paginationClassName({
            className: 'custom-nav',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="pagination-content"]'),
        ).toHaveAttr(
          'class',
          Pagination.paginationContentClassName({
            className: 'custom-list gap-2 gap-4',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="pagination-item"]'),
        ).toHaveAttr(
          'class',
          Pagination.paginationItemClassName({ className: 'custom-item' }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][href="#page-1"]'),
        ).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][href="#page-2"]'),
        ).toHaveAttr('aria-current', 'page'),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][href="#page-2"]'),
        ).toHaveAttr('data-active', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][href="#previous"]'),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][href="#previous"]'),
        ).toHaveAttr('data-disabled', ''),
        Scene.expect(
          Scene.selector('[data-slot="pagination-ellipsis"]'),
        ).toHaveAttr('aria-hidden', 'true'),
        Scene.expect(Scene.selector('[data-icon="inline-start"]')).toExist(),
        Scene.expect(Scene.selector('[data-icon="inline-end"]')).toExist(),
      )
    }).not.toThrow()
  })

  test('link clicks participate in Foldkit message flow', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewClickablePagination },
        Scene.with(initialModel),
        Scene.click(Scene.selector('[data-slot="pagination-link"]')),
        Scene.expect(Scene.selector('[data-testid="link-state"]')).toHaveText(
          'clicked',
        ),
      )
    }).not.toThrow()
  })

  test('examples render the documented pagination structures', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(PaginationDemo()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('navigation', { name: 'pagination' }),
        ).toHaveText('Previous123More pagesNext'),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][aria-current="page"]'),
        ).toHaveText('2'),
      )
      Scene.scene(
        { update, view: view(PaginationIconsOnly()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field"]')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.selector('[data-slot="select-trigger"]')).toHaveAttr(
          'id',
          'select-rows-per-page',
        ),
        Scene.expect(Scene.selector('[data-slot="pagination"]')).toHaveAttr(
          'class',
          Pagination.paginationClassName({ className: 'mx-0 w-auto' }),
        ),
      )
      Scene.scene(
        { update, view: view(PaginationRtl()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="pagination"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
        Scene.expect(
          Scene.selector('[data-slot="pagination-link"][aria-current="page"]'),
        ).toHaveText('٢'),
      )
      Scene.scene(
        { update, view: view(PaginationSimple()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('navigation', { name: 'pagination' }),
        ).toHaveText('12345'),
      )
    }).not.toThrow()
  })

  test('keeps manifest examples aligned with exported examples', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/pagination/item.json?raw')
    const manifest: {
      readonly examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    } = JSON.parse(manifestModule.default)

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      paginationExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      paginationExampleViews.map(example => example.title),
    )
  })
})

describe('shadcn/pagination installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui',
      '@radix-ui',
      'class-variance-authority',
      'lucide-react',
      'next/link',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/',
      '@/lib/utils',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/pagination/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/pagination/index.ts',
      'src/registry/shadcn/pagination/examples.ts',
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
