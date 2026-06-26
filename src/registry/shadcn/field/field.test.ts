/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import {
  FieldCheckbox,
  FieldInput,
  FieldResponsive,
  FieldRtl,
  FieldTextarea,
} from './examples'
import * as Field from './index'

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
const fieldError = Field.FieldError

describe('shadcn/field class helpers', () => {
  test('replace CVA with exact pure orientation class maps', () => {
    expect(Field.fieldBaseClassName).toContain('group/field flex w-full gap-2')
    expect(Field.fieldOrientationClassNames.vertical).toContain('flex-col')
    expect(Field.fieldOrientationClassNames.horizontal).toContain(
      'has-[>[data-slot=field-content]]:items-start',
    )
    expect(Field.fieldOrientationClassNames.responsive).toContain(
      '@md/field-group:flex-row',
    )
    expect(
      Field.fieldClassName({
        orientation: 'horizontal',
        className: 'custom-field',
      }),
    ).toContain('custom-field')
  })
})

describe('shadcn/field view', () => {
  test('Field composes the local Base UI Field root attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: view(
            Field.Field<never>({
              id: 'billing',
              orientation: 'horizontal',
              validation: Field.ValidFieldValidation({ value: 'ok' }),
              children: ['Billing'],
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('group')).toHaveAttr('id', 'billing'),
        Scene.expect(Scene.role('group')).toHaveAttr('data-slot', 'field'),
        Scene.expect(Scene.role('group')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('group')).toHaveAttr('data-valid'),
      )
    }).not.toThrow()
  })

  test('FieldError renders children, errors, and empty state like shadcn', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: view(
            fieldError({
              errors: ['First error', 'Second error'],
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('alert')).toHaveAttr(
          'data-slot',
          'field-error',
        ),
        Scene.expect(Scene.selector('li')).toHaveText('First error'),
      )
      Scene.scene(
        {
          update,
          view: view(
            fieldError({
              children: ['Explicit error'],
            }),
          ),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.role('alert')).toHaveText('Explicit error'),
      )
    }).not.toThrow()
  })

  test('dependency-complete examples render expected shadcn slots', () => {
    expect(() => {
      Scene.scene(
        { update, view: view(FieldInput()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="field-set"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="field-label"]')).toHaveText(
          'Username',
        ),
      )
      Scene.scene(
        { update, view: view(FieldTextarea()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="textarea"]')).toExist(),
      )
      Scene.scene(
        { update, view: view(FieldCheckbox()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="checkbox"]')).toExist(),
        Scene.expect(Scene.selector('[data-slot="field-separator"]')).toExist(),
      )
      Scene.scene(
        { update, view: view(FieldResponsive()) },
        Scene.with(initialModel),
        Scene.expect(
          Scene.selector('[data-orientation="responsive"]'),
        ).toExist(),
      )
      Scene.scene(
        { update, view: view(FieldRtl()) },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/field installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui-components/react/field',
      '@base-ui/react/field',
      '@radix-ui/react-label',
      'class-variance-authority',
      'react',
      'react-dom',
      '@/components/language-selector',
      'shadcn/select',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/field/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/field/index.ts',
      'src/registry/shadcn/field/examples.ts',
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
