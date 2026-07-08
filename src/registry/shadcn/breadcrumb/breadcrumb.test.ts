/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { evo } from 'foldkit/struct'
import { describe, expect, test } from 'vitest'

import {
  BreadcrumbBasic,
  BreadcrumbDemo,
  BreadcrumbDropdown,
  BreadcrumbEllipsisDemo,
  BreadcrumbLinkDemo,
  BreadcrumbRtl,
  BreadcrumbSeparatorDemo,
  breadcrumbExampleViews,
} from './examples'
import * as Breadcrumb from './index'

// MODEL

type Model = Readonly<{
  linkState: 'idle' | 'clicked'
}>

const initialModel: Model = { linkState: 'idle' }

// MESSAGE

type Message = 'clicked-link'

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, message: Message): UpdateReturn =>
  message === 'clicked-link'
    ? [evo(model, { linkState: () => 'clicked' }), []]
    : [model, []]

// VIEW

const view =
  (target: Html) =>
  (_model: Model): Html =>
    target

const viewClickableBreadcrumb = (model: Model): Html => {
  const h = html<Message>()

  return h.div(
    [],
    [
      Breadcrumb.Breadcrumb<Message>({
        children: [
          Breadcrumb.BreadcrumbList<Message>({
            children: [
              Breadcrumb.BreadcrumbItem<Message>({
                children: [
                  Breadcrumb.BreadcrumbLink<Message>({
                    href: '#home',
                    attributes: [h.OnClick('clicked-link')],
                    children: ['Home'],
                  }),
                ],
              }),
              Breadcrumb.BreadcrumbSeparator<Message>(),
              Breadcrumb.BreadcrumbItem<Message>({
                children: [
                  Breadcrumb.BreadcrumbPage<Message>({
                    children: ['Current'],
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

const breadcrumbWithParts = (): Html =>
  Breadcrumb.Breadcrumb<never>({
    className: 'custom-nav',
    ariaLabel: 'Project path',
    children: [
      Breadcrumb.BreadcrumbList<never>({
        className: 'custom-list gap-2 gap-4',
        children: [
          Breadcrumb.BreadcrumbItem<never>({
            className: 'custom-item',
            children: [
              Breadcrumb.BreadcrumbLink<never>({
                href: '#home',
                className: 'custom-link',
                children: ['Home'],
              }),
            ],
          }),
          Breadcrumb.BreadcrumbSeparator<never>({
            children: [Breadcrumb.chevronRightIcon<never>()],
          }),
          Breadcrumb.BreadcrumbItem<never>({
            children: [
              Breadcrumb.BreadcrumbEllipsis<never>(),
              Breadcrumb.BreadcrumbPage<never>({
                className: 'custom-page',
                children: ['Breadcrumb'],
              }),
            ],
          }),
        ],
      }),
    ],
  })

describe('shadcn/breadcrumb class helpers', () => {
  test('exports Effect Schema style option metadata', () => {
    expect(S.decodeUnknownSync(Breadcrumb.BreadcrumbDirection)('rtl')).toBe(
      'rtl',
    )
    expect(
      S.decodeUnknownSync(Breadcrumb.BreadcrumbLinkStyleOptions)({
        href: '#home',
      }).href,
    ).toBe('#home')
  })

  test('uses exact origin class strings for breadcrumb text slots', () => {
    expect(Breadcrumb.breadcrumbClassName()).toBe('')
    expect(Breadcrumb.breadcrumbListClassName()).toBe(
      Breadcrumb.breadcrumbListBaseClassName,
    )
    expect(Breadcrumb.breadcrumbItemClassName()).toBe(
      'inline-flex items-center gap-1',
    )
    expect(Breadcrumb.breadcrumbLinkClassName()).toBe(
      'transition-colors hover:text-foreground',
    )
    expect(Breadcrumb.breadcrumbPageClassName()).toBe(
      'font-normal text-foreground',
    )
  })

  test('uses exact origin class strings for breadcrumb icon slots', () => {
    expect(Breadcrumb.breadcrumbSeparatorClassName()).toBe('[&>svg]:size-3.5')
    expect(Breadcrumb.breadcrumbEllipsisClassName()).toContain('size-5')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    const listClassName = Breadcrumb.breadcrumbListClassName({
      className: 'custom-list gap-2 gap-4',
    })

    expect(listClassName).toContain('custom-list')
    expect(listClassName).toContain('gap-4')
    expect(listClassName).not.toContain('gap-2')
    expect(listClassName).not.toContain('gap-1.5')
  })
})

describe('shadcn/breadcrumb view', () => {
  test('renders navigation, ordered list, item, link, page, separator, and ellipsis semantics', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(breadcrumbWithParts()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('navigation', { name: 'Project path' }),
        ).toHaveAttr('data-slot', 'breadcrumb'),
        Scene.expect(
          Scene.role('navigation', { name: 'Project path' }),
        ).toHaveAttr('class', 'custom-nav'),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-list"]'),
        ).toHaveAttr(
          'class',
          Breadcrumb.breadcrumbListClassName({
            className: 'custom-list gap-2 gap-4',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-list"]'),
        ).toHaveText('HomeMoreBreadcrumb'),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-item"]'),
        ).toHaveAttr(
          'class',
          Breadcrumb.breadcrumbItemClassName({
            className: 'custom-item',
          }),
        ),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-item"]'),
        ).toHaveText('Home'),
        Scene.expect(Scene.role('link', { name: 'Home' })).toHaveAttr(
          'data-slot',
          'breadcrumb-link',
        ),
        Scene.expect(Scene.role('link', { name: 'Home' })).toHaveAttr(
          'href',
          '#home',
        ),
        Scene.expect(Scene.role('link', { name: 'Breadcrumb' })).toHaveAttr(
          'data-slot',
          'breadcrumb-page',
        ),
        Scene.expect(Scene.role('link', { name: 'Breadcrumb' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('link', { name: 'Breadcrumb' })).toHaveAttr(
          'aria-current',
          'page',
        ),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-separator"]'),
        ).toHaveAttr('role', 'presentation'),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-ellipsis"]'),
        ).toHaveAttr('aria-hidden', 'true'),
      )
    }).not.toThrow()
  })

  test('link attributes participate in Foldkit message flow', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewClickableBreadcrumb },
        Scene.with(initialModel),
        Scene.click(Scene.role('link', { name: 'Home' })),
        Scene.expect(Scene.selector('[data-testid="link-state"]')).toHaveText(
          'clicked',
        ),
      )
    }).not.toThrow()
  })

  test('examples render the documented breadcrumb structures', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(BreadcrumbBasic()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('navigation', { name: 'breadcrumb' }),
        ).toHaveAttr('data-slot', 'breadcrumb'),
        Scene.expect(
          Scene.role('navigation', { name: 'breadcrumb' }),
        ).toHaveText('HomeComponentsBreadcrumb'),
      )
      Scene.scene(
        { update, view: view(BreadcrumbDemo()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-ellipsis"]'),
        ).toExist(),
        Scene.expect(
          Scene.selector('[data-slot="dropdown-menu-content"]'),
        ).not.toExist(),
      )
      Scene.scene(
        { update, view: view(BreadcrumbDropdown()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-icon="inline-end"]')).toExist(),
      )
      Scene.scene(
        { update, view: view(BreadcrumbEllipsisDemo()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-ellipsis"]'),
        ).toExist(),
      )
      Scene.scene(
        { update, view: view(BreadcrumbLinkDemo()) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('link', { name: 'Home' })).toHaveAttr(
          'href',
          '#link-component',
        ),
      )
      Scene.scene(
        { update, view: view(BreadcrumbRtl()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="breadcrumb"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
      Scene.scene(
        { update, view: view(BreadcrumbSeparatorDemo()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="breadcrumb-separator"] svg'),
        ).toHaveAttr('class', 'lucide lucide-dot'),
      )
    }).not.toThrow()
  })

  test('keeps manifest examples aligned with exported examples', async () => {
    const manifestModule =
      await import('../../../../registry-src/shadcn/breadcrumb/item.json?raw')
    const manifest: {
      readonly examples: ReadonlyArray<Readonly<{ id: string; title: string }>>
    } = JSON.parse(manifestModule.default)

    expect(manifest.examples.map(example => example.id)).toStrictEqual(
      breadcrumbExampleViews.map(example => example.id),
    )
    expect(manifest.examples.map(example => example.title)).toStrictEqual(
      breadcrumbExampleViews.map(example => example.title),
    )
  })
})

describe('shadcn/breadcrumb installable source', () => {
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
      import('../../../../registry-src/shadcn/breadcrumb/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/breadcrumb/index.ts',
      'src/registry/shadcn/breadcrumb/examples.ts',
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
