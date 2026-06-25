/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  CheckboxBasic,
  CheckboxDemo,
  CheckboxDisabled,
  CheckboxGroup,
  CheckboxInTable,
  CheckboxInvalid,
  CheckboxRtl,
} from './examples'
import * as Checkbox from './index'
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

const viewCheckbox =
  (
    config: Omit<ViewConfig<Message>, 'checkedState'> & {
      checkedState?: Checkbox.CheckboxCheckedState
    },
  ) =>
  (_model: Model): Html =>
    Checkbox.view<Message>({
      checkedState: config.checkedState ?? 'unchecked',
      ...config,
    })

describe('shadcn/checkbox class helpers', () => {
  test('use the exact origin base class strings', () => {
    expect(Checkbox.checkboxBaseClassName).toContain(
      'peer relative flex size-4',
    )
    expect(Checkbox.checkboxBaseClassName).toContain('data-checked:bg-primary')
    expect(Checkbox.checkboxBaseClassName).toContain(
      'aria-invalid:aria-checked:border-primary',
    )
    expect(Checkbox.checkboxIndicatorBaseClassName).toContain(
      '[&>svg]:size-3.5',
    )
  })

  test('preserve custom classes through local cn canonicalization', () => {
    expect(
      Checkbox.checkboxClassName({
        className: 'custom-checkbox size-3 size-5',
      }),
    ).toContain('custom-checkbox')
    expect(
      Checkbox.checkboxClassName({
        className: 'custom-checkbox size-3 size-5',
      }),
    ).toContain('size-5')
    expect(
      Checkbox.checkboxIndicatorClassName({
        className: 'custom-indicator text-red-500',
      }),
    ).toContain('custom-indicator')
  })
})

describe('shadcn/checkbox view', () => {
  test('adds the shadcn root and indicator slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewCheckbox({ checkedState: 'checked' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'data-slot',
          'checkbox',
        ),
        Scene.expect(
          Scene.selector('[data-slot="checkbox-indicator"]'),
        ).toHaveAttr('class', Checkbox.checkboxIndicatorClassName()),
      )
    }).not.toThrow()
  })

  test('passes checked, disabled, invalid, and indeterminate attributes through Base UI Checkbox', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewCheckbox({
            checkedState: 'indeterminate',
            isDisabled: true,
            isInvalid: true,
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('aria-invalid', 'true'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-indeterminate'),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('data-disabled'),
      )
    }).not.toThrow()
  })

  test('examples render local Field, Label, and Table shells without registry dependencies', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => CheckboxDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'data-slot',
          'checkbox',
        ),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveText(
          'Accept terms and conditions',
        ),
      )
      Scene.scene(
        { update, view: () => CheckboxDisabled() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field"]')).toHaveAttr(
          'data-disabled',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-disabled',
          'true',
        ),
      )
      Scene.scene(
        { update, view: () => CheckboxInvalid() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field"]')).toHaveAttr(
          'data-invalid',
          'true',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr('aria-invalid', 'true'),
      )
      Scene.scene(
        { update, view: () => CheckboxBasic() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field-label"]')).toHaveText(
          'Accept terms and conditions',
        ),
      )
      Scene.scene(
        { update, view: () => CheckboxGroup() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field-set"]')).toExist(),
      )
      Scene.scene(
        { update, view: () => CheckboxInTable() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="table"]')).toExist(),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'aria-checked',
          'mixed',
        ),
      )
      Scene.scene(
        { update, view: () => CheckboxRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/checkbox installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/checkbox',
      '@base-ui-components/react/checkbox',
      'lucide-react',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/field',
      'shadcn/label',
      'shadcn/table',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/checkbox/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/checkbox/index.ts',
      'src/registry/shadcn/checkbox/examples.ts',
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
