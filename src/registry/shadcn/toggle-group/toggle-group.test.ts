/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  ToggleGroupDemo,
  ToggleGroupDisabled,
  ToggleGroupFontWeightSelector,
  ToggleGroupOutline,
  ToggleGroupRtl,
  ToggleGroupSizes,
  ToggleGroupSpacing,
  ToggleGroupVertical,
} from './examples'
import * as ToggleGroup from './index'
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

const viewToggleGroup =
  (
    config: Omit<ViewConfig<Message>, 'items' | 'value'> &
      Readonly<{
        items?: ReadonlyArray<ToggleGroup.ToggleGroupItemDescriptor>
        value?: ReadonlyArray<string>
      }>,
  ) =>
  (_model: Model): Html => {
    const {
      items = [
        { id: 'align-left', value: 'left', label: 'Left' },
        { id: 'align-center', value: 'center', label: 'Center' },
        { id: 'align-right', value: 'right', label: 'Right' },
      ],
      value = ['center'],
      ...toggleGroupConfig
    } = config

    return ToggleGroup.view<Message>({
      value,
      items,
      ...toggleGroupConfig,
    })
  }

describe('shadcn/toggle-group class helpers', () => {
  test('exports Effect Schema literals for spacing', () => {
    expect(S.decodeUnknownSync(ToggleGroup.ToggleGroupSpacing)(0)).toBe(0)
    expect(ToggleGroup.toggleGroupSpacingValues).toContain(2)
  })

  test('uses the exact origin root and item class strings', () => {
    expect(ToggleGroup.toggleGroupBaseClassName).toContain(
      'group/toggle-group flex w-fit flex-row items-center',
    )
    expect(ToggleGroup.toggleGroupBaseClassName).toContain(
      'data-vertical:flex-col',
    )
    expect(ToggleGroup.toggleGroupItemBaseClassName).toContain(
      'shrink-0 group-data-[spacing=0]/toggle-group:rounded-none',
    )
  })

  test('preserves custom classes through local cn canonicalization', () => {
    expect(
      ToggleGroup.toggleGroupClassName({
        className: 'custom-group w-fit w-full',
      }),
    ).toContain('custom-group')
    expect(
      ToggleGroup.toggleGroupItemClassName({
        className: 'custom-item h-4 h-5',
      }),
    ).toContain('custom-item')
    expect(
      ToggleGroup.toggleGroupItemClassName({
        className: 'custom-item h-4 h-5',
      }),
    ).toContain('h-5')
  })
})

describe('shadcn/toggle-group view', () => {
  test('adds shadcn root and item slots', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggleGroup({
            spacing: 0,
            variant: 'outline',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-slot',
          'toggle-group',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr('data-spacing', '0'),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'class',
          ToggleGroup.toggleGroupClassName(),
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'data-slot',
          'toggle-group-item',
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'data-variant',
          'outline',
        ),
      )
    }).not.toThrow()
  })

  test('passes Base UI pressed, disabled, and orientation attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewToggleGroup({
            orientation: 'vertical',
            items: [
              { id: 'align-left', value: 'left', label: 'Left' },
              {
                id: 'align-center',
                value: 'center',
                label: 'Center',
                isDisabled: true,
              },
            ],
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-pressed',
          'true',
        ),
        Scene.expect(Scene.role('button', { name: 'Center' })).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('examples render the shadcn Toggle Group demos without origin runtime dependencies', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => ToggleGroupDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group', { name: 'Text alignment' })).toExist(),
        Scene.expect(Scene.selector('#align-center')).toHaveAttr(
          'aria-pressed',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => ToggleGroupDisabled() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('#format-strikethrough')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => ToggleGroupFontWeightSelector() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group', { name: 'Font weight' })).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleGroupOutline() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-spacing', '0'),
      )
      Scene.scene(
        { update, view: () => ToggleGroupRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleGroupSizes() },
        Scene.with(initialModel),
        Scene.expect(
          Scene.role('group', { name: 'Large alignment' }),
        ).toExist(),
      )
      Scene.scene(
        { update, view: () => ToggleGroupSpacing() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('data-spacing', '4'),
      )
      Scene.scene(
        { update, view: () => ToggleGroupVertical() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/toggle-group installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/toggle',
      '@base-ui/react/toggle-group',
      '@base-ui-components/react/toggle',
      '@base-ui-components/react/toggle-group',
      'class-variance-authority',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/field',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/toggle-group/item.json?raw'),
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
      'src/registry/shadcn/toggle-group/index.ts',
      'src/registry/shadcn/toggle-group/examples.ts',
    ])
    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSourceText.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
