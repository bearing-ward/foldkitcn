/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Tabs from './index'
import type { ViewConfig } from './index'

// MODEL

type Model = Record<string, never>

const initialModel: Model = {}

// MESSAGE

type Message = never

// UPDATE

type UpdateReturn = readonly [Model, ReadonlyArray<Command.Command<Message>>]

const update = (model: Model, _message: Message): UpdateReturn => [model, []]

// VIEW

const viewTabs =
  (
    config: Omit<ViewConfig<Message>, 'tabs' | 'toView'> &
      Readonly<{ tabs?: ReadonlyArray<Tabs.TabsTabDescriptor> }>,
  ) =>
  (_model: Model): Html =>
    Tabs.view<Message>({
      value: 'overview',
      tabs: [
        { id: 'overview-tab', value: 'overview', label: 'Overview' },
        { id: 'analytics-tab', value: 'analytics', label: 'Analytics' },
      ],
      panels: [
        { id: 'overview-panel', value: 'overview', label: 'Overview panel' },
        { id: 'analytics-panel', value: 'analytics', label: 'Analytics panel' },
      ],
      ...config,
    })

describe('shadcn/tabs class helpers', () => {
  test('use the exact origin root, list, and trigger class strings', () => {
    expect(Tabs.tabsBaseClassName).toBe(
      'group/tabs flex gap-2 data-horizontal:flex-col',
    )
    expect(Tabs.tabsListBaseClassName).toContain(
      'group/tabs-list inline-flex w-fit items-center justify-center',
    )
    expect(Tabs.tabsTriggerBaseClassName).toContain(
      'relative inline-flex h-[calc(100%-1px)] flex-1',
    )
    expect(Tabs.tabsTriggerBaseClassName).toContain(
      'group-data-[variant=line]/tabs-list:data-active:after:opacity-100',
    )
  })

  test('use the exact origin variant and content class strings', () => {
    expect(Tabs.tabsListDefaultVariantClassName).toBe('bg-muted')
    expect(Tabs.tabsListLineVariantClassName).toBe('gap-1 bg-transparent')
    expect(Tabs.tabsContentBaseClassName).toBe('flex-1 text-sm outline-none')
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      Tabs.tabsClassName({
        className: 'custom-tabs gap-4',
      }),
    ).toContain('custom-tabs')
    expect(
      Tabs.tabsListClassName({
        className: 'custom-list bg-card',
        variant: 'line',
      }),
    ).toContain('custom-list')
    expect(
      Tabs.tabsTriggerClassName({
        className: 'custom-trigger px-4',
      }),
    ).toContain('custom-trigger')
    expect(
      Tabs.tabsContentClassName({
        className: 'custom-content',
      }),
    ).toContain('custom-content')
  })
})

describe('shadcn/tabs view', () => {
  test('adds shadcn root, list, trigger, and content slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewTabs({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="tabs"]')).toHaveAttr(
          'class',
          Tabs.tabsClassName(),
        ),
        Scene.expect(Scene.role('tablist')).toHaveAttr(
          'data-slot',
          'tabs-list',
        ),
        Scene.expect(Scene.role('tab', { name: 'Overview' })).toHaveAttr(
          'data-slot',
          'tabs-trigger',
        ),
        Scene.expect(Scene.selector('[data-slot="tabs-content"]')).toHaveAttr(
          'class',
          Tabs.tabsContentClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI orientation, active, and disabled attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewTabs({
            orientation: 'vertical',
            tabs: [
              { id: 'overview-tab', value: 'overview', label: 'Overview' },
              {
                id: 'analytics-tab',
                value: 'analytics',
                label: 'Analytics',
                isDisabled: true,
              },
            ],
            listVariant: 'line',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="tabs"]')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('tablist')).toHaveAttr('data-variant', 'line'),
        Scene.expect(Scene.role('tab', { name: 'Overview' })).toHaveAttr(
          'data-active',
        ),
        Scene.expect(Scene.role('tab', { name: 'Analytics' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/tabs installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/tabs',
      '@base-ui-components/react/tabs',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/card',
    ]
    const [manifestModule, indexModule] = await Promise.all([
      import('../../../../registry-src/shadcn/tabs/item.json?raw'),
      import('./index.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/tabs/index.ts',
      'src/registry/shadcn/tabs/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        indexModule.default.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
