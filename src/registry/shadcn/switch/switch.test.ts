/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  SwitchDemo,
  SwitchDisabled,
  SwitchInvalid,
  SwitchSizes,
} from './examples'
import * as Switch from './index'
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

const viewSwitch =
  (config: Omit<ViewConfig<Message>, 'isChecked'> & { isChecked?: boolean }) =>
  (_model: Model): Html =>
    Switch.view<Message>({
      isChecked: config.isChecked ?? false,
      ...config,
    })

describe('shadcn/switch class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(Switch.switchBaseClassName).toContain('peer group/switch')
    expect(Switch.switchBaseClassName).toContain(
      'data-[size=default]:h-[18.4px]',
    )
    expect(Switch.switchBaseClassName).toContain('data-checked:bg-primary')
    expect(Switch.switchThumbBaseClassName).toContain(
      'group-data-[size=default]/switch:size-4',
    )
    expect(Switch.switchRtlThumbBaseClassName).toContain(
      'rtl:group-data-[size=default]/switch:data-checked:-translate-x-[calc(100%-2px)]',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      Switch.switchClassName({ className: 'custom-switch h-4 h-5' }),
    ).toContain('custom-switch')
    expect(
      Switch.switchClassName({ className: 'custom-switch h-4 h-5' }),
    ).toContain('h-5')
    expect(
      Switch.switchThumbClassName({ className: 'custom-thumb size-3 size-5' }),
    ).toContain('custom-thumb')
    expect(
      Switch.switchThumbClassName({ className: 'custom-thumb size-3 size-5' }),
    ).toContain('size-5')
  })
})

describe('shadcn/switch view', () => {
  test('adds the shadcn root and thumb slots with size data', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSwitch({ size: 'sm' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-slot', 'switch'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-size', 'sm'),
        Scene.expect(Scene.selector('[data-slot="switch-thumb"]')).toHaveAttr(
          'class',
          Switch.switchThumbClassName(),
        ),
      )
    }).not.toThrow()
  })

  test('passes checked, disabled, and invalid attributes through Base UI Switch', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewSwitch({
            isChecked: true,
            isDisabled: true,
            isInvalid: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-checked', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-disabled', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-checked'),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-disabled'),
      )
    }).not.toThrow()
  })

  test('examples render local Field and Label shells without registry dependencies', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => SwitchDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('switch')).toHaveAttr('data-slot', 'switch'),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveText(
          'Airplane Mode',
        ),
      )
      Scene.scene(
        { update, view: () => SwitchDisabled() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field"]')).toHaveAttr(
          'data-disabled',
          'true',
        ),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-disabled', 'true'),
      )
      Scene.scene(
        { update, view: () => SwitchInvalid() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field"]')).toHaveAttr(
          'data-invalid',
          'true',
        ),
        Scene.expect(Scene.role('switch')).toHaveAttr('aria-invalid', 'true'),
      )
      Scene.scene(
        { update, view: () => SwitchSizes() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-size="sm"]')).toHaveAttr(
          'data-slot',
          'switch',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/switch installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/switch',
      '@base-ui-components/react/switch',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/field',
      'shadcn/label',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/switch/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/switch/index.ts',
      'src/registry/shadcn/switch/examples.ts',
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
