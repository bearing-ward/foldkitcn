/// <reference types="vite/client" />

import { Schema as S } from 'effect'
import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { LabelDemo, LabelRtl } from './examples'
import {
  LabelOptions,
  labelBaseClassName,
  labelClassName,
  view as Label,
} from './index'
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

const viewLabel =
  (
    config: Omit<ViewConfig<Message>, 'toView'> &
      Readonly<{ children?: ReadonlyArray<Html | string> }>,
  ) =>
  (_model: Model): Html => {
    const h = html<Message>()
    const { children = ['Email'], ...labelConfig } = config

    return h.div(
      [],
      [
        Label<Message>({
          ...labelConfig,
          toView: attributes => h.label([...attributes.label], children),
        }),
        h.input([h.Id('email')]),
      ],
    )
  }

describe('shadcn/label class helpers', () => {
  test('exports the exact base-nova class string', () => {
    expect(labelClassName()).toBe(labelBaseClassName)
    expect(labelClassName()).toBe(
      'flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
    )
  })

  test('preserves custom className through local cn canonicalization', () => {
    const className = labelClassName({
      className: 'custom-label gap-3 gap-4',
    })

    expect(className).toContain('custom-label')
    expect(className).toContain('gap-4')
    expect(className).not.toContain('gap-3')
  })

  test('exports Effect Schema-derived options', () => {
    expect(
      S.decodeUnknownSync(LabelOptions)({
        id: 'email-label',
        htmlFor: 'email',
        dir: 'rtl',
      }),
    ).toStrictEqual({
      id: 'email-label',
      htmlFor: 'email',
      dir: 'rtl',
    })
  })
})

describe('shadcn/label view', () => {
  test('renders native label attributes and labels a control by htmlFor', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewLabel({
            id: 'email-label',
            htmlFor: 'email',
            ariaDescribedBy: 'email-help',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveAttr(
          'for',
          'email',
        ),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveAttr(
          'id',
          'email-label',
        ),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveAttr(
          'aria-describedby',
          'email-help',
        ),
        Scene.expect(Scene.selector('#email')).toHaveAttr('id', 'email'),
      )
    }).not.toThrow()
  })

  test('supports the native for alias and dir attributes', () => {
    expect(() => {
      Scene.scene(
        {
          update,
          view: viewLabel({
            for: 'email',
            dir: 'rtl',
          }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveAttr(
          'for',
          'email',
        ),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveAttr(
          'dir',
          'rtl',
        ),
      )
    }).not.toThrow()
  })

  test('supports nested-control accessible names', () => {
    expect(() => {
      const h = html<Message>()

      Scene.scene(
        {
          update,
          view: () =>
            Label<Message>({
              toView: attributes =>
                h.label(
                  [...attributes.label],
                  ['Notifications', h.input([h.Type('checkbox')])],
                ),
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.label('Notifications')).toHaveAttr(
          'type',
          'checkbox',
        ),
      )
    }).not.toThrow()
  })

  test('lets callers add arbitrary Foldkit attributes in toView', () => {
    expect(() => {
      const h = html<Message>()

      Scene.scene(
        {
          update,
          view: () =>
            Label<Message>({
              htmlFor: 'email',
              toView: attributes =>
                h.label(
                  [
                    ...attributes.label,
                    h.Attribute('data-disabled', 'true'),
                    h.Attribute('data-testid', 'label'),
                  ],
                  ['Email'],
                ),
            }),
        },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-testid="label"]')).toHaveAttr(
          'data-disabled',
          'true',
        ),
      )
    }).not.toThrow()
  })

  test('examples render checkbox composition and local RTL data', () => {
    expect(() => {
      Scene.scene(
        { update, view: () => LabelDemo() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[data-slot="label"]')).toHaveText(
          'Accept terms and conditions',
        ),
        Scene.expect(Scene.role('checkbox')).toHaveAttr(
          'data-slot',
          'checkbox',
        ),
      )
      Scene.scene(
        { update, view: () => LabelRtl() },
        Scene.with(initialModel),
        Scene.expect(Scene.selector('[dir="rtl"]')).toExist(),
      )
    }).not.toThrow()
  })
})

describe('shadcn/label installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react/label',
      '@radix-ui/react-label',
      'react',
      'react-dom',
      '@/components/language-selector',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/label/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/label/index.ts',
      'src/registry/shadcn/label/examples.ts',
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
