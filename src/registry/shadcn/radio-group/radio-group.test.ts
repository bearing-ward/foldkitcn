/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import * as RadioGroup from './index'
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

const viewRadioGroup =
  (config: Omit<ViewConfig<Message>, 'items'>) =>
  (_model: Model): Html =>
    RadioGroup.view<Message>({
      value: 'comfortable',
      items: [
        { id: 'density-default', value: 'default' },
        { id: 'density-comfortable', value: 'comfortable' },
        { id: 'density-compact', value: 'compact' },
      ],
      ...config,
    })

describe('shadcn/radio-group class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(RadioGroup.radioGroupBaseClassName).toBe('grid w-full gap-2')
    expect(RadioGroup.radioGroupItemBaseClassName).toContain(
      'group/radio-group-item peer relative flex aspect-square size-4',
    )
    expect(RadioGroup.radioGroupItemBaseClassName).toContain(
      'data-checked:bg-primary',
    )
    expect(RadioGroup.radioGroupIndicatorBaseClassName).toBe(
      'flex size-4 items-center justify-center',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      RadioGroup.radioGroupClassName({
        className: 'custom-group gap-1 gap-4',
      }),
    ).toContain('custom-group')
    expect(
      RadioGroup.radioGroupClassName({
        className: 'custom-group gap-1 gap-4',
      }),
    ).toContain('gap-4')
    expect(
      RadioGroup.radioGroupItemClassName({
        className: 'custom-item size-3 size-5',
      }),
    ).toContain('custom-item')
    expect(
      RadioGroup.radioGroupIndicatorClassName({
        className: 'custom-indicator',
      }),
    ).toContain('custom-indicator')
  })
})

describe('shadcn/radio-group view', () => {
  test('adds the shadcn group, item, and indicator slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewRadioGroup({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'data-slot',
          'radio-group',
        ),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'class',
          RadioGroup.radioGroupClassName(),
        ),
        Scene.expect(
          Scene.selector('[data-slot="radio-group-item"]'),
        ).toHaveAttr('class', RadioGroup.radioGroupItemClassName()),
        Scene.expect(
          Scene.selector('[data-slot="radio-group-indicator"]'),
        ).toHaveAttr('class', RadioGroup.radioGroupIndicatorClassName()),
      )
    }).not.toThrow()
  })

  test('passes Base UI checked, disabled, and invalid attributes through', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewRadioGroup({
            isDisabled: true,
            isInvalid: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('radiogroup')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(
          Scene.selector('[data-slot="radio-group-item"]'),
        ).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="radio-group-item"]'),
        ).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(
          Scene.selector('[data-slot="radio-group-item"]'),
        ).toHaveAttr('data-disabled'),
      )
    }).not.toThrow()
  })
})

describe('shadcn/radio-group installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/radio',
      '@base-ui/react/radio-group',
      '@base-ui-components/react/radio',
      '@base-ui-components/react/radio-group',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/field',
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/radio-group/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)

    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/radio-group/index.ts',
      'src/registry/shadcn/radio-group/examples.ts',
    ])
    const installableSource = `${indexModule.default}\n${examplesModule.default}`

    expect(
      forbiddenRuntimeSpecifiers.filter(specifier =>
        installableSource.includes(specifier),
      ),
    ).toStrictEqual([])
  })
})
