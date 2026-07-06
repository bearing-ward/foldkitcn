/// <reference types="vite/client" />

import { Scene } from 'foldkit'
import type { Command } from 'foldkit'
import type { Html } from 'foldkit/html'
import { html } from 'foldkit/html'
import { describe, expect, test } from 'vitest'

import { baseClassName, separatorClassName, view as Separator } from './index'
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

const viewSeparator =
  (config: Omit<ViewConfig<Message>, 'toView'>) =>
  (_model: Model): Html => {
    const h = html<Message>()

    return Separator<Message>({
      ...config,
      toView: attributes => h.div([...attributes.separator], []),
    })
  }

describe('shadcn/separator class helper', () => {
  test('uses the exact origin base class string', () => {
    expect(baseClassName).toBe(
      'shrink-0 bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch',
    )
  })

  test('includes base tokens by default', () => {
    expect(separatorClassName()).toContain('shrink-0')
    expect(separatorClassName()).toContain('bg-border')
    expect(separatorClassName()).toContain('data-[orientation=horizontal]:h-px')
  })

  test('preserves custom classes through local cn canonicalization', () => {
    const className = separatorClassName({
      className: 'my-separator px-2 px-4',
    })

    expect(className).toContain('my-separator')
    expect(className).toContain('px-4')
    expect(className).not.toContain('px-2')
  })
})

describe('shadcn/separator view', () => {
  test('adds the shadcn data slot', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-slot',
          'separator',
        ),
      )
    }).not.toThrow()
  })

  test('passes through default horizontal orientation attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({}) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'horizontal',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-orientation',
          'horizontal',
        ),
      )
    }).not.toThrow()
  })

  test('passes through vertical orientation attributes', () => {
    expect(() => {
      Scene.scene(
        { update, view: viewSeparator({ orientation: 'vertical' }) },
        Scene.with(initialModel),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'aria-orientation',
          'vertical',
        ),
        Scene.expect(Scene.role('separator')).toHaveAttr(
          'data-orientation',
          'vertical',
        ),
      )
    }).not.toThrow()
  })
})

describe('shadcn/separator installable source', () => {
  test('keeps origin-only runtime specifiers out of installable files', async () => {
    const forbiddenRuntimeSpecifiers = [
      '@base-ui/react',
      '@base-ui-components/react',
      'react',
      'react-dom',
      '@/components/language-selector',
    ]
    const [manifestModule, indexModule, examplesModule] = await Promise.all([
      import('../../../../registry-src/shadcn/separator/item.json?raw'),
      import('./index.ts?raw'),
      import('./examples.ts?raw'),
    ])
    const manifest: { readonly installableSourcePaths: ReadonlyArray<string> } =
      JSON.parse(manifestModule.default)
    expect(manifest.installableSourcePaths).toStrictEqual([
      'src/registry/shadcn/separator/index.ts',
      'src/registry/shadcn/separator/examples.ts',
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
