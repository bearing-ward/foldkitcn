/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  ButtonGroupDemo,
  ButtonGroupDropdown,
  ButtonGroupInput,
  ButtonGroupOrientation,
  ButtonGroupPopover,
  ButtonGroupRtl,
  ButtonGroupSelect,
  ButtonGroupSeparatorDemo,
  ButtonGroupSize,
  ButtonGroupSplit,
} from './examples'
import * as ButtonGroup from './index'
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

const viewButtonGroup =
  (config: ViewConfig<Message>) =>
  (_model: Model): Html =>
    ButtonGroup.view<Message>(config)

describe('shadcn/button-group class helpers', () => {
  test('exports Effect Schema literals for orientation', () => {
    expect(
      S.decodeUnknownSync(ButtonGroup.ButtonGroupOrientation)('horizontal'),
    ).toBe('horizontal')
    expect(ButtonGroup.buttonGroupOrientationValues).toStrictEqual([
      'horizontal',
      'vertical',
    ])
  })

  test('uses origin root class composition for horizontal and vertical groups', () => {
    expect(ButtonGroup.buttonGroupClassName()).toContain(
      'flex w-fit items-stretch',
    )
    expect(ButtonGroup.buttonGroupClassName()).toContain(
      '*:data-slot:rounded-r-none',
    )
    expect(
      ButtonGroup.buttonGroupClassName({ orientation: 'vertical' }),
    ).toContain('flex-col *:data-slot:rounded-b-none')
  })

  test('uses logical RTL class composition when requested', () => {
    expect(ButtonGroup.buttonGroupClassName({ dir: 'rtl' })).toContain(
      'rounded-e-lg',
    )
    expect(ButtonGroup.buttonGroupClassName({ dir: 'rtl' })).toContain(
      'border-s-0',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      ButtonGroup.buttonGroupClassName({
        className: 'custom-group w-fit w-full',
      }),
    ).toContain('custom-group')
    expect(
      ButtonGroup.buttonGroupTextClassName({
        className: 'custom-text px-1 px-2',
      }),
    ).toContain('custom-text')
    expect(
      ButtonGroup.buttonGroupSeparatorClassName({
        className: 'custom-separator bg-border bg-input',
      }),
    ).toContain('custom-separator')
  })
})

describe('shadcn/button-group view', () => {
  test('adds root slot, group role, and optional orientation attribute', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewButtonGroup({
            orientation: 'vertical',
            ariaLabel: 'Actions',
            children: ['One'],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group', { name: 'Actions' })).toHaveAttr(
          'data-slot',
          'button-group',
        ),
        Scene.expect(Scene.role('group', { name: 'Actions' })).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
      )
    }).not.toThrow()
  })

  test('adds text slot attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () =>
            ButtonGroup.ButtonGroupText<Message>({
              children: ['Edited 2m ago'],
            }),
        },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-slot="button-group-text"]'),
        ).toHaveAttr('class', ButtonGroup.buttonGroupTextClassName()),
        Scene.expect(
          Scene.selector('[data-slot="button-group-text"]'),
        ).toHaveText('Edited 2m ago'),
      )
    }).not.toThrow()
  })

  test('composes local separator semantics under the button-group separator slot', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: () => ButtonGroup.ButtonGroupSeparator<Message>(),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-slot',
          'button-group-separator',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'class',
          ButtonGroup.buttonGroupSeparatorClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('examples render implemented shadcn Button Group demos', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ButtonGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Archive' })).toExist(),
        Scene.expect(Scene.role('button', { name: 'More Options' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupDropdown() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Follow' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupInput() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('textbox')).toHaveAttr(
          'placeholder',
          'Search...',
        ),
      )
      Scene.scene(
        { update, view: () => ButtonGroupOrientation() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('group', { name: 'Media controls' }),
        ).toHaveAttr('data-orientation', 'vertical'),
        Scene.expect(
          Scene.role('group', { name: 'Media controls' }),
        ).toHaveAttr(
          'class',
          ButtonGroup.buttonGroupClassName({
            orientation: 'vertical',
            className: 'h-fit',
          }),
        ),
      )
      Scene.scene(
        { update, view: () => ButtonGroupPopover() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Copilot' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupSelect() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: '$' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupSeparatorDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-slot',
          'button-group-separator',
        ),
      )
      Scene.scene(
        { update, view: () => ButtonGroupSize() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Large' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ButtonGroupSplit() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('button', { name: 'Button' })).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/button-group installable source', () => {
  test('keeps forbidden origin runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/merge-props',
      '@base-ui/react/use-render',
      '@tabler/icons-react',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      '@/styles/base-nova',
      'repos/',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/button-group/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    const installableSourceText = [
      indexModule.default,
      examplesModule.default,
    ].join('\n')

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/button-group/index.ts',
      'src/registry/shadcn/button-group/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
