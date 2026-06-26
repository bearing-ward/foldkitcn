/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as Collapsible from './index'
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

const viewCollapsible =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html =>
    Collapsible.view<Message>({
      panel: {
        id: 'details-panel',
        label: 'Details content',
        keepMounted: true,
      },
      ...config,
    })

describe('shadcn/collapsible class helpers', () => {
  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      Collapsible.collapsibleClassName({
        className: 'custom-collapsible flex gap-2',
      }),
    ).toContain('custom-collapsible')
    expect(
      Collapsible.collapsibleTriggerClassName({
        className: 'custom-trigger size-8',
      }),
    ).toContain('custom-trigger')
    expect(
      Collapsible.collapsibleContentClassName({
        className: 'custom-content flex flex-col',
      }),
    ).toContain('custom-content')
  })
})

describe('shadcn/collapsible view', () => {
  test('adds shadcn root, trigger, and content slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            open: true,
            className: 'flex w-[350px] flex-col gap-2',
            triggerClassName: 'size-8',
            contentClassName: 'flex flex-col gap-2',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="collapsible"]')).toHaveAttr(
          'class',
          'flex w-[350px] flex-col gap-2',
        ),
        Scene.expect(Scene.role('button', { name: 'Hide details' })).toHaveAttr(
          'data-slot',
          'collapsible-trigger',
        ),
        Scene.expect(
          Scene.selector('[data-slot="collapsible-content"]'),
        ).toHaveAttr('class', 'flex flex-col gap-2'),
      )
    }).not.toThrow()
  })

  test('passes Base UI open, closed, disabled, and hidden attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCollapsible({
            open: false,
            isDisabled: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="collapsible"]')).toHaveAttr(
          'data-closed',
        ),
        Scene.expect(Scene.role('button', { name: 'Show details' })).toHaveAttr(
          'aria-expanded',
          'false',
        ),
        Scene.expect(Scene.role('button', { name: 'Show details' })).toHaveAttr(
          'data-disabled',
        ),
        Scene.expect(
          Scene.selector('[data-slot="collapsible-content"]'),
        ).toHaveAttr('hidden'),
        Scene.expect(
          Scene.selector('[data-slot="collapsible-content"]'),
        ).toHaveAttr('data-closed'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/collapsible installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/collapsible',
      '@base-ui-components/react/collapsible',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/registry/icons/__lucide__',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/collapsible/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/collapsible/index.ts',
      'src/registry/shadcn/collapsible/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(
        specifier =>
          indexModule.default.includes(specifier) ||
          examplesModule.default.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
